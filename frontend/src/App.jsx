import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Locacao from './pages/Locacao';
import Reserva from './pages/Reserva';
import Disponiveis from './pages/Disponiveis';
import './app.css'; // Estilo do menu

function App() {
  return (
    <BrowserRouter>
      <header className="menu">
        <Link to="/">Clientes</Link>
        <Link to="/locacao">Locações</Link>
        <Link to="/reserva">Reservas</Link>
        <Link to="/disponiveis">Disponíveis</Link>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/locacao" element={<Locacao />} />
        <Route path="/reserva" element={<Reserva />} />
        <Route path="/disponiveis" element={<Disponiveis />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
