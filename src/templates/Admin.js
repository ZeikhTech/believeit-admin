import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "../components/Navbars/AdminNavbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { authenticatedRoutes } from "../routes";
import { basePath } from "../configs";

class Admin extends React.Component {
  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          logo={{
            innerLink: "/admin/index",
            imgSrc: "",
            imgAlt: "...",
          }}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar {...this.props} brandText="Believe It" />
          <Suspense fallback={<div>loading...</div>}>
            <Switch>
              {authenticatedRoutes.map((route) => {
                const { path, component: Component, exact = true } = route;
                return (
                  <Route
                    path={basePath + path}
                    key={path}
                    exact={true}
                    component={Component}
                  />
                );
              })}
            </Switch>
          </Suspense>
          <Container fluid>
            <footer className="footer"></footer>
          </Container>
        </div>
      </>
    );
  }
}

export default Admin;
