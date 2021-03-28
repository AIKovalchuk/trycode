import { fromEvent, of } from "rxjs";
import { map, mergeMap, switchMap } from "rxjs/operators";
import { Server, Socket } from "socket.io";
import server from "../server";

export const io$ = of(
    new Server(server, {
        cors: {
            origin: "*",
        },
    })
);

export const connection$ = io$.pipe(
    switchMap((io) =>
        fromEvent<Socket>(io, "connection").pipe(
            map((client) => ({ io, client }))
        )
    )
);

export const disconnection$ = connection$.pipe(
    mergeMap(({ client }) =>
        fromEvent(client, "disconnect").pipe(map(() => client))
    )
);
