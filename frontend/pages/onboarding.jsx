import React, { useEffect, useState } from 'react';
import NodeLens from '../components/NodeLens';
import PetalLatticeViewer from '../components/PetalLatticeViewer';
import { HeroPilot } from '../assets';

export default function OnboardingPage() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/onboarding')
      .then(res => res.json())
      .then(setData);
  }, []);
  const current = data[0] || {};
  return (
    <div className="onboarding-page">
      <img src={HeroPilot} alt="hero" className="hero" />
      <NodeLens currentNode={current.node} />
      <PetalLatticeViewer episode={current.episode} lens={current.node} />
    </div>
  );
}
