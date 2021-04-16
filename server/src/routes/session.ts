import { Router } from "express";
import { createSession } from "../controllers/SessionController";

const SessionRouter = Router();

SessionRouter.get("/session", createSession);

export default SessionRouter;
