import { v4 as uuidv4 } from "uuid";

interface Session {
    id: string;
    owner?: string;
    text: string;
}

const sessionsCollection: Session[] = [];

const createSession = async (title: string, language: string) => {
    const id = uuidv4();
    const session: Session = {
        id,
        text: "",
    };
    sessionsCollection.push(session);
    return session;
};

const getSessionById = async (id: string) => {
    const session = sessionsCollection.find((s) => s.id === id);
    return session;
};

export default { createSession, getSessionById };
