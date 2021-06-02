import { Server, Socket } from "socket.io";
import http from "http";
import SessionService from "../services/Session";
import { getRoomUsers, userJoin } from "../services/User";

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
        console.log("New connection");
        // take param
        const id = socket.handshake.query.id as string | null;
        console.log("ID", id);
        if (id === null) {
            return;
        }
        const session = await SessionService.getSessionById(id);
        console.log("session", session);
        if (!session) {
            console.log("ERROR: session not exit", SessionService.getAll());
            return;
        }

        let username = socket.handshake.query.username as string | null;
        if (!username || username === "") {
            username = "Аноним " + getRoomUsers(id).length + 1;
        }
        const user = userJoin(socket.id, username, id);
        socket.to(id).emit("user-join", user);

        socket.join(id);
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
