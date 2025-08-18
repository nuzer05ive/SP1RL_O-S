import React, { useEffect } from 'react';
import { useGhost } from '../routes/VRPortal';

export default function KaleidoScene(){
  const { state } = useGhost();
  useEffect(()=>{
    // placeholder: would boost brightness when lockHard and use angle for drift
  }, [state.lockHard, state.angle]);
  return null; // shader-driven kaleidoscope placeholder
}
