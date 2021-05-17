import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./page/login/login";
import Main from "./page/main/main";
import { Page } from "./page/page";
import Signup from "./page/signup/signup";
import CRDT from "./provider/crdt/crdt";

const Routing: React.FC = () => {
  return (
    <Page>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/">
          <CRDT>
            <Main />
          </CRDT>
        </Route>
      </Switch>
    </Page>
  );
};

export default Routing;
