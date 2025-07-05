import { useEffect } from 'react';

export default function useSpiralHotkeys(toggleHUD, nextNode, prevNode) {
  useEffect(() => {
    function handler(e) {
      if (e.key === 'h') toggleHUD();
      if (e.key === 'ArrowRight') nextNode && nextNode();
      if (e.key === 'ArrowLeft') prevNode && prevNode();
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleHUD, nextNode, prevNode]);
}
