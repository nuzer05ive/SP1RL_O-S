import React, { createContext, useContext, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ThreeConeScene from '../scenes/ThreeConeScene';
import KaleidoScene from '../scenes/KaleidoScene';
import AmesWindowScene from '../scenes/AmesWindowScene';
import { SP1RLGhost, GhostState, Tick, DTH } from '../ghost/GhostCore';
import GhostConsole from '../console/GhostConsole';

interface GhostCtx { state: GhostState; fire: () => void; }
const GhostContext = createContext<GhostCtx>({ state:{ zcm:{care:0,courage:0,trust:0}, teal:0, witness:5, angle:0, epoch:0, primeHit:false, lockHard:false }, fire: () => {} });
export const useGhost = () => useContext(GhostContext);

export function GhostProvider({children}:{children:React.ReactNode}){
  const ghostRef = useRef(new SP1RLGhost({ cones:{z_b:0, z_o:1}, scales:{s_b:1e-3, s_o:10, p:1/3}, lock:.72 }));
  const [state, setState] = useState<GhostState>(ghostRef.current.state);
  const mRef = useRef(0);
  const epochRef = useRef(0);
  const fire = () => {
    mRef.current += 1;
    const st = ghostRef.current.fire({ m:mRef.current, epoch:epochRef.current, dt:DTH });
    setState({ ...st });
  };
  return <GhostContext.Provider value={{state, fire}}>{children}</GhostContext.Provider>;
}

interface Props { goHome: () => void; }

export default function VRPortal({ goHome }: Props) {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <button style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }} onClick={goHome}>
        Home
      </button>
      <Canvas>
        <ambientLight />
        <ThreeConeScene />
        <KaleidoScene />
        <AmesWindowScene />
      </Canvas>
      <GhostConsole />
    </div>
  );
}
