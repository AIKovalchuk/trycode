import React from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const Main: React.FC = () => {
  const history = useHistory();
  const [session, setSession] = React.useState("");

  const createSession = (e: React.FormEvent) => {
    e.preventDefault();
    const id = uuidv4();
    axios
      .post("http://localhost:8080/api/session/create", { id })
      .then((res) => history.push("/session/" + res.data.id));
  };

  const onConnect = (e: React.FormEvent) => {
    e.preventDefault();
    history.push("/session/" + session);
  };

  return (
    <div>
      <h1>Welcome to TryCode</h1>
      <h5>Click on button for start</h5>
      <button onClick={createSession}>Create session</button>
      <button onClick={onConnect}>Connect to: </button>{" "}
      <input value={session} onChange={(e) => setSession(e.target.value)} />
    </div>
  );
};

export default Main;
