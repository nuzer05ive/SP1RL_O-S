import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeSplash from './pages/HomeSplash';
import LiveHUD from './pages/LiveHUD';
import Docs from './pages/Docs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeSplash />} />
        <Route path="/hud" element={<LiveHUD />} />
        <Route path="/docs" element={<Docs />} />
        <Route
          path="/play/kaleidoscope"
          element={<iframe src="/apps/canvas/phi43/dist/index.html" style={{width:'100%',height:'100vh',border:0}} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
