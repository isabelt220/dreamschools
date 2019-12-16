import React from "react";
import { Route, Redirect, BrowserRouter } from "react-router-dom";

const PrivateRoute = ({ component: Component, isAuthed, ...rest }) => {
  return (
    <BrowserRouter>
      <Route
        {...rest}
        render={props =>
          isAuthed === true ? <Component {...props} /> : <Redirect to='/login' />
        }
      />
    </BrowserRouter>
  );
};
export default PrivateRoute;
