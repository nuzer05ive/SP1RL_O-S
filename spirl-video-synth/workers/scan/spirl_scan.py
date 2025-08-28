import cv2, json, numpy as np
from scipy.optimize import least_squares
import os, sys

def phi_smooth(prev, curr, alpha=0.618):
    return alpha*prev + (1-alpha)*curr

def track(video_path, max_pts=400, step=2):
    cap = cv2.VideoCapture(video_path)
    ok, frame = cap.read(); assert ok, "cannot read video"
    H, W = frame.shape[:2]
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    g0 = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    pts = cv2.goodFeaturesToTrack(g0, max_pts, 0.01, 8)
    lk = dict(winSize=(21,21), maxLevel=3,
              criteria=(cv2.TERM_CRITERIA_EPS|cv2.TERM_CRITERIA_COUNT, 30, 0.03))
    tracks=[[] for _ in range(len(pts))]
    prev=g0; pprev=pts; f=0; canny_prev=np.zeros_like(g0)
    bands=[]
    while True:
        ok, frame = cap.read()
        if not ok: break
        if f % step != 0: f+=1; continue
        g = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        pnext, st, _ = cv2.calcOpticalFlowPyrLK(prev, g, pprev, None, **lk)
        if pnext is None: break
        # φ-jostle edge map
        edges = cv2.Canny(g, 60, 160)
        dt = cv2.absdiff(edges, canny_prev)
        theta = 0.04
        edges_phi = phi_smooth(edges.astype(np.float32), dt.astype(np.float32), 0.618) + theta*dt
        canny_prev = edges.copy()
        # estimate dominant band angle
        gx = cv2.Sobel(g, cv2.CV_32F,1,0,3); gy = cv2.Sobel(g, cv2.CV_32F,0,1,3)
        ang = np.arctan2(gy, gx); bands.append(np.median(ang))
        # save tracks
        k=0
        for i,(n,o) in enumerate(zip(pnext, pprev)):
            if st[i]==1:
                tracks[k].append((f, float(n[0][0]), float(n[0][1])))
                k+=1
        prev, pprev = g, pnext; f+=1
    cap.release()
    tracks = [t for t in tracks if len(t)>30]
    return tracks, fps, (W,H), [float(np.median(bands))] if bands else [0.0]

def cyl_fit(tr):
    t = np.array([r[0] for r in tr], float); t = (t - t[0])/30.0
    xs = np.array([r[1] for r in tr], float)
    ys = np.array([r[2] for r in tr], float)
    A = (ys.max()-ys.min())/2.0 + 1e-3
    x0, y0 = xs.mean(), ys.min()
    omega = 2*np.pi/(t[-1]-t[0]+1e-3)
    p0 = np.array([A, omega, 0.2, x0, y0, 0.03, 1.2])
    def model(p):
        A,w,phi0,x0,y0,th,nu = p
        phi = w*t + phi0 + th*np.sin(nu*t)
        x = x0 + A*(phi - np.sin(phi))
        y = y0 + A*(1 - np.cos(phi))
        return np.hstack([x-xs, y-ys])
    bnds = ([-np.inf,0,-np.pi,-np.inf,-np.inf,-0.2,0.2], [np.inf,10,np.pi,np.inf,np.inf,0.2,4.0])
    res = least_squares(model, p0, bounds=bnds, max_nfev=3000)
    err = float(np.linalg.norm(model(res.x))/len(t))
    A,w,phi0,x0,y0,th,nu = res.x
    return dict(A=float(A), omega=float(w), phi0=float(phi0), x0=float(x0), y0=float(y0),
                theta_prime=float(th), nu=float(nu), err=err)

def apex(params, t0=0, t1=5.0, step=0.02):
    def xy(p,t):
        A,w,phi0,x0,y0,th,nu = p
        phi = w*t + phi0 + th*np.sin(nu*t)
        x = x0 + A*(phi - np.sin(phi))
        y = y0 + A*(1 - np.cos(phi))
        return x,y
    P = [np.array([p['A'],p['omega'],p['phi0'],p['x0'],p['y0'],p['theta_prime'],p['nu']], float) for p in params]
    out=[]
    for k in np.arange(t0,t1,step):
        pts=[]
        for p in P[:3]:
            x,y = xy(p,k); pts.append((x,y))
        d12 = np.hypot(pts[0][0]-pts[1][0], pts[0][1]-pts[1][1])
        d23 = np.hypot(pts[1][0]-pts[2][0], pts[1][1]-pts[2][1])
        d31 = np.hypot(pts[2][0]-pts[0][0], pts[2][1]-pts[0][1])
        if d12<4 and d23<4 and d31<4:
            if not out or abs(k-out[-1])>0.2: out.append(float(k))
    return out

def main(video):
    tracks,fps,(W,H),ang = track(video)
    tracks = sorted(tracks, key=len, reverse=True)[:12]
    fits = [cyl_fit(tr) for tr in tracks]
    fits = sorted(fits, key=lambda r: r["err"])[:6]
    if len(ang)==1:
        a = ang[0]; alphas=[a, (a+2*np.pi/3)%(2*np.pi), (a+4*np.pi/3)%(2*np.pi)]
    else: alphas=ang[:3]
    cad = {"in":0.541,"out":0.459,"gap":0.082,"half_gap":0.041}
    apexes = apex(fits, 0, len(tracks[0])/fps)
    scan = {
        "meta": {"fps": fps, "width": W, "height": H, "video": os.path.basename(video)},
        "cadence": cad,
        "alphas": alphas,
        "rails": fits,
        "apex_times": apexes
    }
    out = os.path.join(os.path.dirname(video) or ".", "scan.json")
    with open(out,"w") as f: json.dump(scan, f, indent=2)
    print("wrote", out)

if __name__=="__main__":
    main(sys.argv[1] if len(sys.argv)>1 else "fixtures/sample.mp4")
