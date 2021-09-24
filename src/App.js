import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ToastContainer } from "react-toastify";

import storage from "./services/storage";
import http from "./services/http";

import { Provider } from "react-redux";
import store from "./store/store";

import "react-toastify/dist/ReactToastify.css";
import "./assets/vendor/nucleo/css/nucleo.css";
import "./assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/main.scss";

import AuthGuard from "./guards/AuthGuard";
import { basePath } from "./configs";
import Login from "./pages/Login";
import Admin from "./templates/Admin";

const hist = createBrowserHistory();

const App = (props) => {
  useEffect(() => {
    const token = storage.get("adminAuthToken");
    http.setCommonHeaders("x-auth-token", token);
  }, []);

  return (
    <Provider store={store}>
      <ToastContainer hideProgressBar={true} closeButton={false} />
      <Router history={hist} basename={basePath}>
        <Switch>
          <Route
            path={`${basePath}/signin`}
            exact
            component={(props) => <Login {...props} />}
          />

          <AuthGuard path={`${basePath}`} component={Admin} />
          <Redirect to={`${basePath}/users`} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
