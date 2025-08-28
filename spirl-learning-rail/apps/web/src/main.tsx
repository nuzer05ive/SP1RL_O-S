import React from 'react';
import { createRoot } from 'react-dom/client';
import { PadawanPlanner } from './components/PadawanPlanner';

const root = createRoot(document.getElementById('root')!);
root.render(<PadawanPlanner />);
