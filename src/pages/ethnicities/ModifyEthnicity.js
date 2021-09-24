import React, { useState, useEffect } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Header from "../../components/Headers/Header";
import { basePath } from "../../configs";
import { handleErrors } from "../../helpers/error";
import { toast } from "react-toastify";
import ToastBody from "../../components/Popups/ToastBody";

import http from "../../services/http";

import EthnicityForm from "./EthnicityForm";

const api_endpoint = "/ethnicities/";

const ModifyEthnicity = ({ match, history }) => {
  const [ethnicity, setEthnicity] = useState({
    name: "",
    _id: "",
  });
  const { identifier } = match.params;

  useEffect(() => {
    if (identifier !== "add" && identifier !== ethnicity._id)
      loadEthnicity(identifier);
  }, [identifier]);

  const loadEthnicity = async (id) => {
    try {
      const res = await http.get({ url: api_endpoint + identifier });
      setEthnicity(res.data);
    } catch (err) {
      switch (err.response.status) {
        case 404:
          handleErrors("Category not found!");
          history.replace(basePath + "/ethnicities/");
          break;
        default:
          handleErrors("Something went wrong!");
      }
    }
  };

  const submitHandler = async (body, { setSubmitting, setErrors }) => {
    try {
      if (identifier === "add") {
        const res = await http.post({ url: api_endpoint, body });
        setEthnicity(res.data);
      } else {
        const res = await http.put({
          url: api_endpoint + identifier,
          body,
        });
        setEthnicity(res.data);
      }
      toast.success(
        <ToastBody
          title="Success"
          message={
            identifier === "add"
              ? "Religion Created Successfully."
              : "Religion Updated Successfully."
          }
        />
      );
      history.goBack();
    } catch (err) {
      switch (err.response.status) {
        case 400:
          setErrors(err.response.data.error);
          break;
        case 404:
          handleErrors("This religion is deleted");
          break;
        default:
          handleErrors("Something went wrong!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7">
        <Card className="shadow">
          <CardHeader>
            <div className="clearfix">
              <h2 className="mb-0 float-left">
                {identifier === "add" ? "Add Religion" : ethnicity.name}
              </h2>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">
            <EthnicityForm
              onSubmit={submitHandler}
              initialValues={{ name: ethnicity.name }}
            />
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default ModifyEthnicity;
