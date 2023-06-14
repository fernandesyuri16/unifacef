import './styles/global.css'
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Comentario from './components/Comentario';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/comment" element={<Comentario/>} />
      </Routes>
  </Router>
  );
}

export default App
