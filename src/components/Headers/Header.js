import React from "react";
import { Container } from "reactstrap";

export default (props) => {
  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>{props.children}</Container>
    </div>
  );
};
