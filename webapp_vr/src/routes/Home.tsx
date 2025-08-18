import React from 'react';

type Props = { enterPortal: () => void };

export default function Home({ enterPortal }: Props) {
  return (
    <div>
      <h1>SP1RL Idea-Mapper (VR)</h1>
      <button onClick={enterPortal}>Enter Portal</button>
      <button>New Seed</button>
      <button>Import/Export</button>
      <button>Golden Treasury</button>
      <footer>
        &Delta;&theta; = 0.000437 rad | &phi;-jostle on fire ! | TEAL &ge; 0.72 locks
      </footer>
    </div>
  );
}
