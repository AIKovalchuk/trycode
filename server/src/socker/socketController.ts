import { Server, Socket } from "socket.io";
import http from "http";
// import Session from "./sessionManager";
import Session from "../services/Session";

const SocketApp = (server: http.Server) => {
    const io = new Server(server, {
        transports: ["websocket"],
        cors: {
            origin: "*",
        },
    });

    console.log("Socket up");

    const standartNamespace = io.of("/");

    io.on("connection", async (socket: Socket) => {
        console.log("New connection");
        // take param
        const id = socket.handshake.query.id as string;
        console.log(id);
        const session = await Session.getSessionById(id);
        console.log(session);
        socket.join(id);
        // const session = new Session({ io: standartNamespace, socket, roomId: id });
        socket.on("insert-char", async (char) => {
            console.log("insert-char", id, char);
            socket.to(id).emit("remote-insert", char);
        });

        socket.on("delete-char", async (char) => {
            console.log("delete-char", id, char);
            socket.to(id).emit("remote-delete", char);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected");
            const clients = io.sockets.adapter.rooms.get(id);
            if (!clients?.size) {
                console.log("No more in room", id);
            }
        });
    });
};

export default SocketApp;
