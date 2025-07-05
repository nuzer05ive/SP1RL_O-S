import React from 'react';
import { SuprfOverlay } from '../assets';

// Placeholder for interactive lattice viewer
export default function PetalLatticeViewer({ episode, lens }) {
  return (
    <div className="petal-lattice-viewer">
      <img src={SuprfOverlay} alt="overlay" className="overlay" />
      <p>Episode {episode}</p>
      <p>Lens: {lens}</p>
    </div>
  );
}
