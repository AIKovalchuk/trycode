import React from "react";
import { Route, Switch } from "react-router-dom";
import EditorPage from "./page/editor/editorPage";
import Main from "./page/main/main";
import Login from "./page/login/login";
import { Page } from "./page/page";
import Signup from "./page/signup/signup";
import CreateSession from "./page/createSession/createSession";

const Routing: React.FC = () => {
  return (
    <Switch>
      <Page>
        <Route component={Login} path="/login" />
        <Route component={Signup} path="/signup" />
        <Route component={CreateSession} path="/createSession" />
        <Route component={EditorPage} path="/session/:id" />
        <Route exact component={Main} path="/" />
      </Page>
    </Switch>
  );
};

export default Routing;
