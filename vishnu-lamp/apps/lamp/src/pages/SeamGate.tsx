import React, { useState } from 'react';
import { thetaPrime } from '@vishnu/core';
import { hinge } from '../ui/popFold';

export default function SeamGate() {
  const [open, setOpen] = useState(false);
  const theta = thetaPrime(1, 1);
  const fold = hinge(open ? Math.PI / 4 : 0);
  return (
    <div>
      <h1>
        Seam-Gate <span data-testid="theta">{theta.toFixed(3)}</span>
      </h1>
      <div
        className="lift"
        style={{
          transform: `rotateX(${fold.hinge ?? 0}rad)`,
          transition: 'transform 0.3s',
          width: '100px',
          height: '100px',
          background: '#ddd',
        }}
        onClick={() => setOpen((o) => !o)}
      >
        Lift
      </div>
    </div>
  );
}
