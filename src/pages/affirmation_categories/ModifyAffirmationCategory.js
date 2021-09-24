import React, { useState, useEffect } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Header from "../../components/Headers/Header";
import { basePath } from "../../configs";
import { handleErrors } from "../../helpers/error";
import { toast } from "react-toastify";
import ToastBody from "../../components/Popups/ToastBody";
import http from "../../services/http";

import AffirmationCategoryForm from "./AffirmationCategoryForm";

const api_endpoint = "/affirmation_categories/";

const ModifyAffirmationCategory = ({ match, history }) => {
  const [category, setCategory] = useState({
    name: "",
    isFree: true,
    _id: "",
  });
  const { identifier } = match.params;

  useEffect(() => {
    if (identifier !== "add" && identifier !== category._id)
      loadCategory(identifier);
  }, [identifier]);

  const loadCategory = async (id) => {
    try {
      const res = await http.get({ url: api_endpoint + identifier });
      setCategory(res.data);
    } catch (err) {
      switch (err.response.status) {
        case 404:
          handleErrors("Category not found!");
          history.replace(basePath + "/affirmation_categories/");
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
        setCategory(res.data);
      } else {
        const res = await http.put({
          url: api_endpoint + identifier,
          body,
        });
        setCategory(res.data);
      }
      toast.success(
        <ToastBody
          title="Success"
          message={
            identifier === "add"
              ? "Affirmation Category Created Successfully."
              : "Affirmation Category Updated Successfully."
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
                {identifier === "add"
                  ? "Add Affirmation Category"
                  : category.name}
              </h2>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">
            <AffirmationCategoryForm
              onSubmit={submitHandler}
              initialValues={{
                name: category.name,
                isFree: category.isFree,
                parent: category.parent === null ? "" : category.parent,
              }}
              categoryId={category._id}
            />
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default ModifyAffirmationCategory;
