import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "../provider/auth/Auth";

interface Props extends RouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.FC<any>;
}

export const PrivateRoute: React.FC<Props> = ({ Component, ...rest }) => {
  const { currentUser } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
