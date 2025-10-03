import '../styles/globals.css';
import React from 'react';
import ServiceWorkerRegister from '../components/ServiceWorkerRegister';

export const metadata = {
  title: 'SP1RL Portal',
  description: 'Compose φ recipes, encode to PMB, and run offline shells.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
