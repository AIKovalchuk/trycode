import React from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Main: React.FC = () => {
  const history = useHistory();

  const createSession = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .get("http://localhost:8080/api/session")
      .then((res) => history.push("/session/" + res.data.id));
  };

  return (
    <div>
      <h1>Welcome to TryCode</h1>
      <button onClick={createSession}>Create session</button>
    </div>
  );
};

export default Main;
