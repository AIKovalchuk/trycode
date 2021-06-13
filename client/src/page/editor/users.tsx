import React from 'react';
import { useAuth } from '../../provider/auth/Auth';
import { NetworkContext } from '../../provider/network/network';

export const Users = () => {
    const { socket } = React.useContext(NetworkContext);
    const [users, setUsers] = React.useState<any[]>([]);
    const { currentUser } = useAuth();

    const handleJoin = (user: any) => {
        console.log('handleJoin 1', user);
        setUsers([...users, user]);
        console.log('handleJoin 2', users);
    };

    const handleLeave = (user: any) => {
        console.log('handleLeave', user);
        setUsers(users.filter((user$: any) => user$.username !== user.username));
        console.log('handleLeave 2', users);
    };

    React.useEffect(() => {
        socket?.on('user-join', handleJoin);

        socket?.on('user-leave', handleLeave);
    }, [socket]);

    return (
        <div className="users">
            <div className="title">Пользователи</div>
            {<div className="user current">{`${currentUser?.email || 'Аноним'} (Вы)`}</div>}
            {users.map((user: any) => (
                <div key={user.id} className="user">
                    {user.username}
                </div>
            ))}
        </div>
    );
};
