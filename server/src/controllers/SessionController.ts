import { Request, Response } from "express";
import Session from "../services/Session";

const createSession = async (req: Request, res: Response) => {
    try {
        const { title, type } = req.body;
        const session = await Session.createSession(title, type);
        res.send({ uuid: session.uuid });
    } catch (error) {
        res.status(500);
    }
};

export { createSession };
