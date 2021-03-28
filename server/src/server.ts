import express from "express";
import http from "http";
import cors from "cors";

const app = express();

app.use(cors());

const server = new http.Server(app);

export default server;
