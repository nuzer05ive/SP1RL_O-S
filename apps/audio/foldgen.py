import numpy as np, wave, struct
SR, AMP, F, BEAT, REFLECTS = 44100, 0.6, 434.367, 0.20, 12

def pulse():
    t = np.linspace(0, BEAT, int(SR*BEAT), False)
    return AMP * np.sin(2 * np.pi * F * t)

def build():
    p = pulse(); z = np.zeros_like(p)
    seed = np.concatenate([p,p,p,z])
    block = np.concatenate([seed, np.zeros(int(SR*0.91)), seed[::-1]])
    fold = block.copy()
    for _ in range(REFLECTS):
        fold = np.pad(fold,(0,len(block)),'constant'); fold[-len(block):] += block
    mid = len(fold)//2 - len(block)//2
    fold[mid:mid+len(block)] += block*0.8
    fold /= np.max(np.abs(fold))
    return fold

def save(wavname, arr):
    with wave.open(wavname,"w") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(x*32767)) for x in arr))

if __name__=="__main__":
    save("music/fold_loop.wav", build())
