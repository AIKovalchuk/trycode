import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import SessionRouter from "./routes/session";
import Session from "./services/Session";

const app = express();
const server = new http.Server(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
const PORT = 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api", SessionRouter);

io.on("connect", (socket: Socket) => {
    console.log("New connection");

    socket.on("insert-char", async (char) => {
        try {
            console.log("insert-char", char);
            socket.broadcast.emit("remote-insert", char);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("delete-char", async (char) => {
        try {
            console.log("remote-delete", char);
            socket.broadcast.emit("remote-delete", char);
        } catch (error) {
            console.log(error);
        }
    });

    // socket.on("join-room", async ({ username, sessionId }) => {
    //     try {
    //         const session = await Session.getSessionById(sessionId);

    //         if (!session) {
    //             return;
    //         }

    //         console.log("join-room", username, session.id);
    //         socket.join(session.id);
    //         socket
    //             .to(session.id)
    //             .emit(`${username} has been joined on session`);
    //         const text = session.text;
    //         socket.emit("new-message", text);
    //     } catch (error) {}
    // });

    // socket.on("send-message", async ({ username, sessionId, message }) => {
    //     console.log(
    //         `New message in room ${sessionId} from ${username}: ${message}`
    //     );
    //     Session.addTextToSession(sessionId, message);
    //     socket.to(sessionId).emit("new-message", message);
    // });

    socket.on("disconnect", () => {
        console.log("Disconnected");
    });
});

server.listen(PORT, () =>
    console.log(`Server has been started on port ${PORT}`)
);
