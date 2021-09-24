import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";
import { basePath } from "../../configs";
import { connect } from "react-redux";
import { signoutUser } from "../../store/api/auth";
class Sidebar extends React.Component {
  //
  state = {
    collapseOpen: false,
    navItems: [
      {
        icon: "ni ni-single-02 text-danger",
        name: "Goal Categories",
        link: "/goal_categories",
      },

      {
        icon: "ni ni-single-02 text-danger",
        name: "Pre Defined Goals",
        link: "/pre_defined_goals",
      },
      // { type: "heading", heading: "Qoutations" },
      {
        icon: "ni ni-single-02 text-danger",
        name: "Quote Categories",
        link: "/qoute_categories",
      },
      {
        icon: "ni ni-single-02 text-danger",
        name: "Famous Quotations",
        link: "/qoutations",
      },

      {
        icon: "ni ni-single-02 text-danger",
        name: "Affirmation Categories",
        link: "/affirmation_categories",
      },

      // {
      //   icon: "ni ni-single-02 text-danger",
      //   name: "Affirmation Sub Categories",
      //   link: "/affirmation_sub_categories",
      // },

      {
        icon: "ni ni-single-02 text-danger",
        name: "Affirmations",
        link: "/affirmations",
      },

      {
        icon: "ni ni-single-02 text-danger",
        name: "Religions",
        link: "/ethnicities",
      },
      {
        icon: "ni ni-single-02 text-danger",
        name: "Posts",
        link: "/posts",
      },

      {
        icon: "ni ni-single-02 text-danger",
        name: "Prayers",
        link: "/prayers",
      },
    ],
  };

  activeRoute = (routeName) => {
    return this.props.location.pathname.indexOf(basePath + routeName) > -1
      ? "active"
      : "";
  };

  toggleCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  };

  closeCollapse = () => {
    this.setState({
      collapseOpen: false,
    });
  };

  createNavItem = () => {
    const { navItems } = this.state;
    return navItems.map((item, key) => {
      if (item.type === "heading") {
        return (
          <h4 className="ml-4" key={item.heading}>
            {item.heading}
          </h4>
        );
      }
      const active = this.activeRoute(item.link);
      return (
        <NavItem key={key}>
          <Link
            to={basePath + item.link}
            // onClick={this.closeCollapse}
            className={"nav-link " + active}
          >
            <i className={item.icon} />
            {item.name}
          </Link>
        </NavItem>
      );
    });
  };

  render() {
    const { logo } = this.props;
    const { user } = this.props;
    return (
      <Navbar
        className="navbar-vertical fixed-left navbar-light bg-white"
        expand="md"
        id="sidenav-main"
      >
        <Container fluid>
          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={this.toggleCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>
          {/* Brand */}

          <NavbarBrand className="pt-0">
            <img
              className="navbar-brand-img"
              src={require("../../assets/img/logo.png")}
            />
          </NavbarBrand>

          {/* User */}
          <Nav className="align-items-center d-md-none">
            <UncontrolledDropdown nav>
              <DropdownToggle nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={user.image && user.image.thumbnailUrl}
                    />
                  </span>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.signoutUser();
                  }}
                >
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {/* Collapse */}
          <Collapse navbar isOpen={this.state.collapseOpen}>
            {/* Collapse header */}
            <div className="navbar-collapse-header d-md-none">
              <Row>
                {logo ? (
                  <Col className="collapse-brand" xs="6">
                    {logo.innerLink ? (
                      <Link to={logo.innerLink}>
                        <img src={require("../../assets/img/logo.png")} />
                      </Link>
                    ) : (
                      <a href={logo.outterLink}>
                        <img src={require("../../assets/img/logo.png")} />
                      </a>
                    )}
                  </Col>
                ) : null}
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={this.toggleCollapse}
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            {/* Navigation */}
            <Nav navbar>{this.createNavItem()}</Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  signoutUser: () => dispatch(signoutUser()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
