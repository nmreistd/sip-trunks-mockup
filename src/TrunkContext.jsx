import { createContext, useContext, useState } from 'react';
import { SEED_TRUNKS } from './data';

const TrunkContext = createContext(null);

export function TrunkProvider({ children }) {
  const [trunks, setTrunks] = useState(SEED_TRUNKS);

  function addTrunk(trunk) {
    setTrunks((prev) => [...prev, { ...trunk, id: `trunk-${Date.now()}`, status: 'pending' }]);
  }

  function deleteTrunk(id) {
    setTrunks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <TrunkContext.Provider value={{ trunks, addTrunk, deleteTrunk }}>
      {children}
    </TrunkContext.Provider>
  );
}

export function useTrunks() {
  return useContext(TrunkContext);
}
