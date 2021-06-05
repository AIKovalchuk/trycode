import axios from "axios";

export interface User {
  id: string;
  username: string;
  room: string;
}

interface Ans {
  users: User[];
}

export const getAllUsersByRoom = async (id: string) => {
  try {
    const users = await axios
      .get<Ans>(`http://localhost:8080/api/room/${id}/users`)
      .then((res) => res.data);
    return users.users;
  } catch (error) {
    console.log(error);
  }
};
