import React from 'react';

// Placeholder for interactive lattice viewer
export default function PetalLatticeViewer({ episode, lens }) {
  return (
    <div className="petal-lattice-viewer">
      <p>Episode {episode}</p>
      <p>Lens: {lens}</p>
    </div>
  );
}
