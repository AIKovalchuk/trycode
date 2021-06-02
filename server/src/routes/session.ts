import { Router } from "express";
import { createSession, getSession } from "../controllers/SessionController";

const SessionRouter = Router();

SessionRouter.post("/session", createSession);

SessionRouter.get("/session/:id", getSession);

export default SessionRouter;
