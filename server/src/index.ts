import server from "./server";
import { connection$, disconnection$ } from "./utilites/connection";

const PORT = process.env.PORT || 3080;

server.listen(PORT, () =>
    console.log(`Server has been started on port ${PORT}`)
);

connection$.subscribe(({ client }) => {
    console.log("connected: ", client.id);
});

disconnection$.subscribe((client) => {
    console.log("disconected: ", client.id);
});
