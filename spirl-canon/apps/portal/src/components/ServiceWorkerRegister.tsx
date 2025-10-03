'use client';

import React from 'react';

export default function ServiceWorkerRegister() {
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => {
          // noop - registration failures are non-fatal
        });
    }
  }, []);
  return null;
}
