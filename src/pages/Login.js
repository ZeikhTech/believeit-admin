import React from "react";
import { Button, Card, CardBody, Form, Row, Col, Container } from "reactstrap";

import { HashLoader } from "react-spinners";
import logoImg from "../assets/img/logo.png";
import IconInput from "./../components/Inputs/IconInput";

import { connect } from "react-redux";

import { Formik } from "formik";
import * as Yup from "yup";

import { signinUser } from "../store/api/auth";

class Login extends React.Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    document.body.classList.add("bg-default");
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-default");
  }

  loginHandler = (body, { setSubmitting }) => {
    this.props.signinUser({
      body,
      onSuccess: (res) => {
        this.props.history.replace("/users");
      },
      onEnd: () => setSubmitting(false),
    });
  };

  showForm = () => {
    return (
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email().min(1).required(),
          password: Yup.string().min(1).required(),
        })}
        onSubmit={this.loginHandler}
      >
        {({ isSubmitting, submitForm }) => {
          return (
            <form>
              <IconInput
                icon="ni ni-email-83"
                placeholder="Email"
                name="email"
                type="text"
                autoFocus={true}
              />
              <IconInput
                name="password"
                icon="ni ni-lock-circle-open"
                placeholder="Password"
                type="password"
              />

              <div className="d-flex justify-content-center mt-4">
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  onClick={submitForm}
                >
                  Sign in
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    );
  };

  showLoader = () => {
    return (
      <div className="d-flex justify-content-center my-5">
        <HashLoader width={25} height={25} color="#5e72e4" />
      </div>
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <div className="main-content">
        <div className="header bg-gradient-info py-7 py-lg-8">
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Col lg="5" md="7">
              <Card className="bg-secondary shadow border-0">
                <CardBody className="px-lg-5 py-lg-5">
                  <div className="d-flex justify-content-center mb-4">
                    <img src={logoImg} style={{ height: 100 }} alt="Logo" />
                  </div>
                  {loading ? this.showLoader() : this.showForm()}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  signinUser: (params) => dispatch(signinUser(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
