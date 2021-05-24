import React from "react";
import { Link, useHistory } from "react-router-dom";

import { createSession } from "../../service/Session";

const Main: React.FC = () => {
  const history = useHistory();

  const handleCreateDoc = async () => {
    const session = await createSession();
    if (session) {
      history.push("/session/" + session.id);
    }
  };

  return (
    <div>
      Main Page
      {/* <Button onClick={handleCreateDoc}>Create New Doc</Button> */}
      <Link to="/createSession">Create Session</Link>
    </div>
  );
};

export default Main;
