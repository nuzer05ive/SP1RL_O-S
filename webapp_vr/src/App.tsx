import React, { useState } from 'react';
import Home from './routes/Home';
import VRPortal from './routes/VRPortal';

export default function App() {
  const [route, setRoute] = useState<'home' | 'vr'>('home');
  return route === 'home' ? (
    <Home enterPortal={() => setRoute('vr')} />
  ) : (
    <VRPortal goHome={() => setRoute('home')} />
  );
}
