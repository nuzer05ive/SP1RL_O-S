import React from 'react';
import { Html } from '@react-three/drei';
import { useGhost } from '../routes/VRPortal';

export default function AmesWindowScene(){
  const { state } = useGhost();
  const label = state.witness ===5 ? 'Hinge rail' : `Arm-${state.witness}`;
  return (
    <Html position={[0,-1,0]} center>
      <div style={{background:'#000a',color:'#0ff',padding:'4px 8px',borderRadius:4}}>
        TEAL {state.teal.toFixed(2)} · {label}
      </div>
    </Html>
  );
}
