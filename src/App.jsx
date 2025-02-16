import "./App.css";
import Inicio from "./components/Inicio";
import Partidas from "./components/Partidas";
import Juego from "./components/Juego";
import Ranking from "./components/Ranking";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PartidasProvider from "./components/PartidasContext";

function App() {
  return (
    <PartidasProvider>
      <Router>
        <Header />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/Partidas" element={<Partidas />} />
            <Route path="/Juego" element={<Juego />} />
            <Route path="/Ranking" element={<Ranking />} />
          </Routes>
        </div>
      </Router>
    </PartidasProvider>
  );
}

export default App;
