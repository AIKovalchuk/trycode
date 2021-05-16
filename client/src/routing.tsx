import React from "react";
import { Route, Switch } from "react-router-dom";
import Main from "./page/editor/editor";
import CRDT from "./provider/crdt/crdt";
import Network from "./provider/network/network";

const Routing: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <Network>
          <CRDT>
            <Main />
          </CRDT>
        </Network>
      </Route>
    </Switch>
  );
};

export default Routing;
