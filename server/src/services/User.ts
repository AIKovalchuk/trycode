export interface User {
    id: string;
    username: string;
    room: string;
}

const users: User[] = [];

export const userJoin = (id: string, username: string | null, room: string) => {
    const user = { id, username: "qwe", room };

    users.push(user);

    return user;
};

export const getCurrentUser = (id: string): User | undefined => {
    return users.find((user) => user.id === id);
};

export const userLeave = (id: string) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

export const getRoomUsers = (room: string): User[] => {
    return users.filter((user) => user.room === room);
};
