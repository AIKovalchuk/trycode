import React from "react";
import { Route, Switch } from "react-router-dom";
import Main from "./page/editor/editor";
import Login from "./page/login/login";
import { Page } from "./page/page";
import Signup from "./page/signup/signup";
import CRDT from "./provider/crdt/crdt";
import Network from "./provider/network/network";

const Routing: React.FC = () => {
  return (
    <Switch>
      <Page>
        <Route component={Login} path="/login" />
        <Route component={Signup} path="/signup" />
        <Route exact path="/">
          <CRDT>
            <Main />
          </CRDT>
        </Route>
      </Page>
    </Switch>
  );
};

export default Routing;
