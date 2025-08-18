import React, { useState } from 'react';
import Home from './routes/Home';
import VRPortal, { GhostProvider, useGhost } from './routes/VRPortal';
import GhostHUD from './components/GhostHUD';

function HUDOverlay(){
  const { state } = useGhost();
  return <GhostHUD {...state} />;
}

export default function App() {
  const [route, setRoute] = useState<'home' | 'vr'>('home');
  return route === 'home' ? (
    <Home enterPortal={() => setRoute('vr')} />
  ) : (
    <GhostProvider>
      <HUDOverlay />
      <VRPortal goHome={() => setRoute('home')} />
    </GhostProvider>
  );
}
