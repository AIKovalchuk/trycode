import { Request, Response } from "express";
import Session from "../services/Session";

const createSession = async (req: Request, res: Response) => {
    try {
        const { title, lang } = req.body;
        const session = await Session.createSession(title, lang);
        res.send({ uuid: session.uuid });
    } catch (error) {
        res.status(500);
    }
};

const getSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const session = await Session.getSessionById(id);
        res.send(session);
    } catch (error) {
        res.status(500);
    }
};

export { createSession, getSession };
