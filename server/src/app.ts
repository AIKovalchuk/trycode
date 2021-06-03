import express from "express";
import http from "http";
import cors from "cors";
import SessionRouter from "./routes/session";
import SocketApp from "./socker/socketController";
import mongoose from "mongoose";

const app = express();
const server = new http.Server(app);
SocketApp(server);
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", SessionRouter);

app.get("/", (req, res) => res.send("Hello, world"));

const start = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/trycode", {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
        });

        server.listen(PORT, () =>
            console.log(`Server has been started on port ${PORT}`)
        );
    } catch (error) {
        console.log("SERVER ERROR START", error);
    }
};

start();
