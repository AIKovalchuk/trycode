import { v4 as uuidv4 } from "uuid";

interface Session {
    id: string;
    text: string;
}

const sessions: Session[] = [];

const createSession = async () => {
    const id = uuidv4();
    const session: Session = {
        id,
        text: "",
    };
    sessions.push(session);
    return session;
};

const getSessionById = async (id: string) => {
    const session = sessions.find((s) => s.id === id);
    return session;
};

const addTextToSession = async (id: string, text: string) => {
    const ind = sessions.findIndex((s) => s.id === id);
    if (ind !== -1) {
        sessions[ind].text += text;
    }
};

export default { createSession, getSessionById, addTextToSession };
