import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./page/login/login";
import Main from "./page/main/main";
import { Page } from "./page/page";
import Signup from "./page/signup/signup";
import CRDT from "./provider/crdt/crdt";

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
