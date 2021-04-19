import React from "react";

export interface ICRDT {
  onInsert: (value: string, index: number) => undefined;
}

const defaultValue: ICRDT = {
  onInsert: () => undefined,
};

export const CRDTContext = React.createContext(defaultValue);

const CRDTController: ICRDT = {
  onInsert: (value: string, index: number) => {
    // const char = generateChar();
    console.log("DEBUG:", "+input");
    return undefined;
  },
};

const CRDT: React.FC = ({ children }) => {
  return (
    <CRDTContext.Provider value={CRDTController}>
      {children}
    </CRDTContext.Provider>
  );
};

export default CRDT;
