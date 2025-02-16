import { createContext, useState } from "react";

export const PartidasContext = createContext(); 

const PartidasProvider = ({ children }) => {
  const [partidas, setPartidas] = useState([]);

  const registraPartida = (nuevaPartida) => {
    setPartidas((prev) => [...prev, nuevaPartida]);
  };

  return (
    <PartidasContext.Provider value={{ partidas, registraPartida }}>
      {children}
    </PartidasContext.Provider>
  );
};

export default PartidasProvider;
