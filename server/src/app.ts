import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

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
// interface Users {
//     [key: string]: string
// }

interface User {
    nickname: string | null;
}
interface Session {
    id: string;
    users: number[];
    text: string;
}

const users: User[] = [];
const sessions: Session[] = [];

app.post("/api/session/create", (req, res) => {
    const id = uuidv4();
    const session: Session = {
        id,
        users: [],
        text: "",
    };
    sessions.push(session);
    res.send({ id });
});

io.on("connect", (socket: Socket) => {
    console.log("New connection");

    socket.on("join-room", ({ username, session }) => {
        console.log("join-room", username, session);
        socket.join(session);
        socket.to(session).emit(`${username} has been joined on session`);
        const text = sessions.find((s) => s.id === session)?.text || "";
        socket.emit("new-message", text);
    });

    socket.on("send-message", ({ username, session, message }) => {
        console.log(
            `New message in room ${session} from ${username}: ${message}`
        );
        const idSession = sessions.findIndex((val) => val.id === session);
        sessions[idSession].text += message;
        io.to(session).emit("new-message", message);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected");
    });
});

server.listen(PORT, () =>
    console.log(`Server has been started on port ${PORT}`)
);
