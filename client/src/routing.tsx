import React from "react";
import { Route, Switch } from "react-router-dom";
import Main from "./page/main/main";
import CRDT from "./provider/crdt/crdt";

const Routing: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <CRDT>
          <Main />
        </CRDT>
      </Route>
    </Switch>
  );
};

export default Routing;
