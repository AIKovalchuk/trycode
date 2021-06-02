import { v4 as uuidv4 } from "uuid";
import Session, { ISession } from "../models/SessionModel";

const sessionsCollection: ISession[] = [];

const createSession = async (title: string, type: string) => {
    const id = uuidv4();
    const session = new Session({
        _id: id,
        title,
        type,
        content: [[]],
    });
    sessionsCollection.push(session);
    return session;
};

const getSessionById = async (id: string) => {
    const session1 = sessionsCollection.find((s) => s._id === id);
    let session2 = null;
    if (!session1) {
        session2 = await Session.findById(id);
    }
    return session1 ? session1 : session2;
};

export default { createSession, getSessionById };
