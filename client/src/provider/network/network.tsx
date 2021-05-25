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

interface Props {
  id: string;
}

const Network: React.FC<Props> = ({ id, children }) => {
  const socket = React.useRef<Socket>();
  const [wsState, updateWsState] = React.useState(false);

  React.useEffect(() => {
    socket.current = io("http://localhost:8080", {
      transports: ["websocket"],
      query: { id },
    });
    updateWsState(true);

    return () => {
      socket.current?.disconnect();
      updateWsState(false);
    };
  }, [id]);

  return (
    <NetworkContext.Provider
      value={{
        socket: socket.current,
      }}
    >
      {socket ? children : "Loading..."}
    </NetworkContext.Provider>
  );
};

export default Network;
