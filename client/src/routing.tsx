import React from "react";
import { Route, Switch } from "react-router-dom";
import Main from "./page/main/main";

const Routing: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <Main />
      </Route>
    </Switch>
  );
};

export default Routing;
