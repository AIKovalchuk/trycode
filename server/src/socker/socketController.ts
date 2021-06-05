import { Server, Socket } from "socket.io";
import http from "http";
import SessionService from "../services/Session";
import { getRoomUsers, userJoin, userLeave } from "../services/User";
import CRDT from "../services/CRDT";

interface SocketParams {
    id: string;
    username: string | undefined;
}

const SocketApp = (server: http.Server) => {
    const io = new Server(server, {
        transports: ["websocket"],
        cors: {
            origin: "*",
        },
    });

    console.log("Socket up");

    io.on("connection", async (socket: Socket) => {
        console.log("NEW CONNECTION", socket.id);
        // take param
        const id = socket.handshake.query.id as string | null;
        if (id === null) {
            return;
        }
        const session = await SessionService.getSessionById(id);
        if (!session) {
            console.log("ERROR: session not exit");
            return;
        }

        let username = socket.handshake.query.username as string | null;
        if (!username || username === "") {
            console.log("username", username, socket.id);
            username = socket.id;
        }
        const user = userJoin(socket.id, username, id);
        console.log("USER", user);
        socket.join(id);
        io.in(id).emit("user-join", user);
        // socket.emit("user-join", user);

        socket.on("insert-char", async (char) => {
            socket.to(id).emit("remote-insert", char);
            session.content = CRDT.handleInsert(char, session.content);
        });

        socket.on("delete-char", async (char) => {
            socket.to(id).emit("remote-delete", char);
            session.content = CRDT.handleDelete(char, session.content);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected", socket.id);
            userLeave(socket.id);
            socket.to(id).emit("user-leave", user);
            const clients = io.sockets.adapter.rooms.get(id);
            if (!clients?.size) {
                console.log("No more in room", id);
                session.save();
            }
        });
    });
};

export default SocketApp;
