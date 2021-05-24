import { Namespace, Socket, Server } from "socket.io";

export interface SessionArgs {
    io: Namespace;
    socket: Socket;
    roomId: string;
    action: SessionActionType;
}

export type SessionActionType = "CREATE" | "JOIN";

export enum SessionAction {
    CREATE = "CREATE",
    JOIN = "JOIN",
}

export default class Session {
    private io: Namespace;
    private socket: Socket;
    private roomId: string;
    private action: SessionActionType;
    private store: any;

    constructor(options: SessionArgs) {
        this.io = options.io;
        this.roomId = options.roomId;
        this.socket = options.socket;
        this.action = options.action;
    }

    async init(username: string) {
        await this.socket.join(this.roomId);
        this.store = this.io.adapter.rooms.get(this.roomId);

        this.store.clients = [{ id: this.socket.id, username }];

        this.socket.emit("session:created", { roomId: this.roomId });
        return true;
    }
}
