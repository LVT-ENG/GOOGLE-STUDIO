import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Demo from './pages/Demo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/demo" element={<Demo />} />
    </Routes>
  );
}

export default App;
