import React from "react";
import { io, Socket } from "socket.io-client";
export interface NetworkController {
  socket: Socket | undefined;
}

export const NetworkContext = React.createContext<NetworkController>({
  socket: undefined,
});

export const socket = io("http://localhost:8080");

const Network: React.FC = ({ children }) => {
  // const socket = React.useRef<Socket>();

  // React.useEffect(() => {
  //   socket.current = io("http://localhost:8080");

  //   return () => {
  //     socket.current?.disconnect();
  //   };
  // }, []);

  return (
    <NetworkContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export default Network;
