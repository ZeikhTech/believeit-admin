import React, { useState, useEffect } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Header from "../../components/Headers/Header";
import { basePath } from "../../configs";
import { handleErrors } from "../../helpers/error";
import { toast } from "react-toastify";
import ToastBody from "../../components/Popups/ToastBody";

import http from "../../services/http";

import AffirmationForm from "./AffirmationForm";

const api_endpoint = "/affirmations/";

const ModifyAffirmation = ({ match, history }) => {
  const { identifier } = match.params;

  const [categories, setCategories] = useState([]);
  const [affirmation, setAffirmation] = useState({
    affirmation: "",
    category: {
      _id: "",
      name: "",
      isFree: "",
    },
    _id: "",
  });

  useEffect(() => {
    if (identifier !== "add" && identifier !== affirmation._id)
      loadAffirmation(identifier);
  }, [identifier]);

  const loadAffirmation = async (id) => {
    try {
      const res = await http.get({ url: api_endpoint + identifier });
      setAffirmation(res.data);
    } catch (err) {
      switch (err.response.status) {
        case 404:
          handleErrors("Category not found!");
          history.replace(basePath + "affirmations/");
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
        setAffirmation(res.data);
      } else {
        const res = await http.put({
          url: api_endpoint + identifier,
          body,
        });
        setAffirmation(res.data);
      }

      toast.success(
        <ToastBody
          title="Success"
          message={
            identifier === "add"
              ? "Affirmation Created Successfully."
              : "Affirmation Updated Successfully."
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
          handleErrors("This Affirmation is deleted");
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
                {identifier === "add" ? "Add Affirmation" : "Edit Affirmation"}
              </h2>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">
            <AffirmationForm
              categories={categories}
              onSubmit={submitHandler}
              initialValues={{
                affirmation: affirmation.affirmation,
                category: affirmation.category._id,
              }}
            />
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default ModifyAffirmation;
