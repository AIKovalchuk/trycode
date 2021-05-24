import axios from "axios";

export interface Session {
  id: string;
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
