import React from "react";
import { io, Socket } from "socket.io-client";

export interface SocketProps {
  title: string;
  language: string;
}
export interface NetworkController {
  socket: Socket | undefined;
}

export const NetworkContext = React.createContext<NetworkController>({
  socket: undefined,
});

// export const socket = (title: string, language: string) => React.useMemo<Socket | undefined>(() => io("http://localhost:8080", {transports:["websocket"], query:{title, language}}),[title, language]);
interface Props {
  id: string;
}

const Network: React.FC<Props> = ({ id, children }) => {
  const socket = io("http://localhost:8080", {
    transports: ["websocket"],
    query: { id },
  });
  // const socket = React.useRef<Socket>();

  // React.useEffect(() => {
  //   socket.current = io("http://localhost:8080", {
  //     transports: ["websocket"],
  //     query: { id },
  //   });

  //   return () => {
  //     socket.current?.disconnect();
  //   };
  // }, [socket.current]);

  return (
    <NetworkContext.Provider
      value={{
        socket: socket,
      }}
    >
      {socket ? children : "Loading..."}
    </NetworkContext.Provider>
  );
};

export default Network;
