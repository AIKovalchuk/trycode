import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { io, Socket } from "socket.io-client";

interface MatchParams {
  id: string;
}

const Session = () => {
  const [text, setText] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const id = useRouteMatch<MatchParams>("/session/:id");
  const socket = React.useRef<Socket>();

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

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    socket.current?.emit("send-message", {
      username: "Anonymous",
      session: id?.params.id,
      message,
    });
  };

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }
  return (
    <div>
      <h1>It is session</h1>
      <div>Text: {text}</div>
      <form onSubmit={sendMessage}>
        <textarea
          value={message}
          onChange={handleChange}
          placeholder="type here"
        />
        <input type="submit" className="btn" value="q" />
      </form>
      <button>Start</button>
      <Link to="/">Back</Link>
    </div>
  );
};

export default Session;
