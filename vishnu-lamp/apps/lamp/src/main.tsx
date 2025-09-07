import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SeamGate from './pages/SeamGate';
import Wash from './pages/Wash';
import Witness from './pages/Witness';
import Bloom from './pages/Bloom';
import Workshop from './pages/Workshop';
import Theater from './pages/Theater';
import Ledger from './pages/Ledger';
import Portholes from './pages/Portholes';
import './styles.css';

const App = () => (
  <BrowserRouter>
    <nav>
      <Link to="/">Seam</Link>
    </nav>
    <Routes>
      <Route path="/" element={<SeamGate />} />
      <Route path="/wash" element={<Wash />} />
      <Route path="/witness" element={<Witness />} />
      <Route path="/bloom" element={<Bloom />} />
      <Route path="/workshop" element={<Workshop />} />
      <Route path="/theater" element={<Theater />} />
      <Route path="/ledger" element={<Ledger />} />
      <Route path="/portholes" element={<Portholes />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
