import axios from "axios";
import { Char } from "../provider/crdt/interface";

export interface Session {
  uuid: string;
}

export interface SessionFull extends Session {
  title: string;
  lang: string;
  content: Char[][];
}

export const createSession = async (title: string, lang: string) => {
  try {
    const id = await axios
      .post<Session>("http://localhost:8080/api/session", { title, lang })
      .then((res) => res.data);
    return id;
  } catch (error) {
    console.log(error);
  }
};

export const getSession = async (id: string) => {
  try {
    const session = await axios
      .get<SessionFull>(`http://localhost:8080/api/session/${id}`)
      .then((res) => res.data);
    return session;
  } catch (error) {
    console.log(error);
  }
};
