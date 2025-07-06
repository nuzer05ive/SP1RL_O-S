import React, { useEffect, useState } from 'react';

export default function NodeLens({ currentNode = 0 }) {
  const [node, setNode] = useState(currentNode);
  const [showHUD, setShowHUD] = useState(true);

  useEffect(() => setNode(currentNode), [currentNode]);

  useEffect(() => {
    function handler(e) {
      if (!e.altKey || !e.metaKey) return;
      if (e.key === 'ArrowRight') setNode(n => (n + 1) % 89);
      else if (e.key === 'ArrowLeft') setNode(n => (n + 88) % 89);
      else if (e.key.toLowerCase() === 'h') setShowHUD(h => !h);
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const angle = node % 89;
  return (
    <div className="node-lens">
      <span className="logo">
        SP1RL_O
        <span className="dash" style={{ display: 'inline-block', transform: `rotate(${angle}deg)` }}>-</span>
        S
      </span>
      {showHUD && <div className="hud">HUD</div>}
    </div>
  );
}
