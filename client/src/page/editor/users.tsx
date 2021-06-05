import React from "react";
import { useAuth } from "../../provider/auth/Auth";
import { NetworkContext } from "../../provider/network/network";
import { SessionFull } from "../../service/Session";
import { User, getAllUsersByRoom } from "../../service/Users";

interface Props {
  session: SessionFull;
}

export const Users: React.FC<Props> = ({ session }) => {
  const { socket } = React.useContext(NetworkContext);
  const [users, setUsers] = React.useState<User[]>([]);
  const { currentUser } = useAuth();

  const handleJoin = (user: User) => {
    console.log("handleJoin 1", user, users);
    setUsers([...users, user]);
    console.log("handleJoin 2", users);
  };

  const handleLeave = (user: User) => {
    console.log("handleLeave", user, users);
    setUsers(users.filter((user$: User) => user$.username !== user.username));
    console.log("handleLeave 2", users);
  };

  const fetchUsers = async () => {
    const users$ = await getAllUsersByRoom(session.uuid);
    if (users$) {
      setUsers(users$);
    }
  };

  React.useEffect(() => {
    socket?.on("user-join", handleJoin);

    socket?.on("user-leave", handleLeave);
  }, [socket]);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users">
      <div className="title">Пользователи</div>
      {users.map((user: User) => (
        <div key={user.id} className="user">
          {user.username} {user.id === socket?.id ? "(Вы)" : null}
        </div>
      ))}
    </div>
  );
};
