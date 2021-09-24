import React from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Header from "../components/Headers/Header";

export default (props) => {
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Card className="shadow">
          <CardHeader>
            <div className="clearfix">
              <h2 className="mb-0 float-left">Dashboard</h2>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">
            <h1>Content Here</h1>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};
