import { Request, Response } from "express";
import Session from "../services/Session";

const createSession = async (req: Request, res: Response) => {
    try {
        const session = await Session.createSession();
        res.send({ id: session.id });
    } catch (error) {
        res.status(500);
    }
};

export { createSession };
