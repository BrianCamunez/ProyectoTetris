import "./App.css";
import Inicio from "./components/Inicio";
import Partidas from "./components/Partidas";
import Juego from "./components/Juego";
import Ranking from "./components/Ranking";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/Partidas" element={<Partidas />} />
        <Route path="/Juego" element={<Juego />} />
        <Route path="/Ranking" element={<Ranking/>}/>
      </Routes>
    </Router>
  );
}

export default App;
