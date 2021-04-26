import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { fromEvent } from "rxjs";
import { filter, map } from "rxjs/operators";
import { io, Socket } from "socket.io-client";
import Edditor from "../../components/Edditor";
import CRDT from "../../provider/CRDT";
import "./session.scss";
interface MatchParams {
  id: string;
}

const Session = () => {
  const [text, setText] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const id = useRouteMatch<MatchParams>("/session/:id");
  const socket = React.useRef<Socket>();
  const workbench = React.useRef();
  const obser = React.useRef();

  React.useEffect(() => {
    socket.current = io("http://localhost:8080");
    console.log(id);

    socket.current.emit("join-room", {
      username: "qwe",
      session: id?.params.id,
    });

    socket.current.on("new-message", (data: any) => {
      console.log("data", data);
      setText((prev) => prev + data);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [id?.params.id]);

  // React.useEffect(() => {
  //   const obs = fromEvent<KeyboardEvent>(document, "keydown")
  //     .pipe(
  //       map((e) => (e.key === "Enter" ? "\n" : e.key)),
  //       filter((e) => e.length === 1),
  //       map((e) => {
  //         sendMessage(e);
  //         return e;
  //       }),
  //       map((e) => setText((t) => t + e))
  //     )
  //     .subscribe();

  //   return () => obs.unsubscribe();
  // }, []);

  const sendMessage = (e: string) => {
    // e.preventDefault();
    // setMessage("");

    socket.current?.emit("send-message", {
      username: "Anonymous",
      session: id?.params.id,
      message: e,
    });
  };

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }
  return (
    <div>
      <h1>It is session</h1>
      <CRDT>
        <Edditor />
      </CRDT>
      <Link to="/">Back</Link>
    </div>
  );
};

export default Session;
