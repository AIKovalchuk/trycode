import React from "react";

export interface NetworkController {
  send: () => void;
}

const NetworkContext = React.createContext<NetworkController>({
  send: () => undefined,
});

const Network: React.FC = ({ children }) => {
  return (
    <NetworkContext.Provider
      value={{
        send: () => undefined,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export default Network;
