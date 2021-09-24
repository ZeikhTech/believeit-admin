import React, { useState, useEffect } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Header from "../../components/Headers/Header";
import { basePath } from "../../configs";
import { handleErrors } from "../../helpers/error";

import http from "../../services/http";
import { toast } from "react-toastify";
import ToastBody from "../../components/Popups/ToastBody";

import QouteForm from "./QouteForm";

const api_endpoint = "/qoutations/";

const ModifyQouteCategory = ({ match, history }) => {
  const { identifier } = match.params;

  const [categories, setCategories] = useState([]);
  const [qoutation, setQoutation] = useState({
    qoutation: "",
    category: {
      _id: "",
      name: "",
      isFree: "",
    },
    _id: "",
  });

  useEffect(() => {
    if (identifier !== "add" && identifier !== qoutation._id)
      loadQoute(identifier);
  }, [identifier]);

  const loadQoute = async (id) => {
    try {
      const res = await http.get({ url: api_endpoint + identifier });
      setQoutation(res.data);
    } catch (err) {
      switch (err.response.status) {
        case 404:
          handleErrors("Category not found!");
          history.replace(basePath + "/qoutations/");
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
        setQoutation(res.data);
      } else {
        const res = await http.put({
          url: api_endpoint + identifier,
          body,
        });
        setQoutation(res.data);
      }
      toast.success(
        <ToastBody
          title="Success"
          message={
            identifier === "add"
              ? "Quotation Created Successfully."
              : "Quotation Updated Successfully."
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
          handleErrors("This category is deleted");
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
                {identifier === "add" ? "Add Quotation" : "Edit Quotation"}
              </h2>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">
            <QouteForm
              categories={categories}
              onSubmit={submitHandler}
              initialValues={{
                qoutation: qoutation.qoutation,
                category: qoutation.category._id,
              }}
            />
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default ModifyQouteCategory;
