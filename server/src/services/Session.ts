import { v4 as uuidv4 } from "uuid";
import Session, { ISession } from "../models/SessionModel";

const sessionsCollection: ISession[] = [];

const createSession = async (title: string, lang: string) => {
    const id = uuidv4();
    const session = new Session({
        uuid: id,
        title,
        lang,
        content: [[]],
    });
    sessionsCollection.push(session);
    return session;
};

const getSessionById = async (id: string) => {
    const session1 = sessionsCollection.find((s) => s.uuid === id);
    let session2 = null;
    if (!session1) {
        session2 = await Session.findOne({ uuid: id });
    }
    return session1 ? session1 : session2;
};

const getAll = () => {
    return sessionsCollection;
};

export default { createSession, getSessionById, getAll };
