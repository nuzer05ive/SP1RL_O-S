try:  # optional dependencies
    import numpy as np  # type: ignore
    if not hasattr(np, "mgrid"):
        raise ImportError
except Exception:  # pragma: no cover
    np = None
from collections import deque

try:  # optional dependency
    import cv2  # type: ignore
except Exception:  # pragma: no cover
    cv2 = None

def micro_cycloid_bank(sz=17, nphi=12):
    if np is None:  # lightweight fallback for tests
        return [ [ [0.0]*sz for _ in range(sz) ] for _ in range(nphi) ]
    ks=[]; r=(sz-1)//2; Y,X=np.mgrid[-r:r+1,-r:r+1]
    R=np.sqrt(X*X+Y*Y)+1e-6; base=np.clip((r-R)/r,0,1)
    for k in range(nphi):
        phi=2*np.pi*k/nphi; tx,ty=np.cos(phi),np.sin(phi)
        K=base*(tx*X+ty*Y); K=K/np.linalg.norm(K) if np.linalg.norm(K)>1e-6 else K
        ks.append(K.astype(np.float32))
    return ks

def cycloid_corr(gray, bank):
    if cv2 is None:
        raise RuntimeError("cv2 required for cycloid_corr")
    g=gray.astype(np.float32)/255.0; acc=np.zeros_like(g)
    for K in bank: acc=np.maximum(acc, cv2.filter2D(g,-1,K))
    acc=cv2.GaussianBlur(acc,(0,0),1.0)
    mn,mx=acc.min(),acc.max()
    return (acc-mn)/(mx-mn+1e-6)

def von_neumann_pairs(bits2):
    a=bits2[...,0]; b=bits2[...,1]
    rej=(a==b).astype(np.float32)
    acc=(a!=b).astype(np.float32)
    return acc, rej

def mcpp_blush(gray_seq, alpha=0.618, th_low=0.35, th_high=0.55):
    if cv2 is None:
        raise RuntimeError("cv2 required for mcpp_blush")
    H,W=gray_seq[0].shape[:2]
    bank=micro_cycloid_bank()
    steam=np.zeros((H,W),np.float32)
    proto=None; masks=[]
    q_edges=deque(maxlen=8)
    for frame_idx,gray in enumerate(gray_seq):
        blur=cv2.GaussianBlur(gray,(5,5),0)
        thr=cv2.adaptiveThreshold(blur,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,31,2)
        bits=(thr>127).astype(np.uint8)
        pairs=np.stack([bits[:,:-1],bits[:,1:]],axis=-1)
        _,rej=von_neumann_pairs(pairs)
        rej=cv2.copyMakeBorder(rej,0,0,0,1,cv2.BORDER_REPLICATE)

        corr=cycloid_corr(gray, bank)
        edges=cv2.Canny(gray,60,160).astype(np.float32)/255.0
        q_edges.append(edges)
        var=np.var(np.stack(q_edges,axis=0),axis=0) if len(q_edges)==q_edges.maxlen else np.zeros_like(edges)

        Z=rej+var; Z=(Z-Z.min())/(Z.max()-Z.min()+1e-6)
        blush=0.5*Z+0.5*corr

        steam=alpha*steam+(1-alpha)*blush
        lo=(steam>th_low).astype(np.uint8); hi=(steam>th_high).astype(np.uint8)
        lbl,n=cv2.connectedComponents(hi)
        proto=np.zeros_like(lo)
        for i in range(1,n+1):
            m=(lbl==i).astype(np.uint8)
            grown=cv2.dilate(m,np.ones((5,5),np.uint8),1)
            proto=np.maximum(proto, (grown & lo).astype(np.uint8))

        masks.append(proto)
    return steam, masks
