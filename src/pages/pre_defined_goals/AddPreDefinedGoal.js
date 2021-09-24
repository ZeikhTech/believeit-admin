import React, { useState, useEffect } from "react";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import Header from "../../components/Headers/Header";
import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { basePath } from "../../configs";
import { handleErrors } from "../../helpers/error";
import { toast } from "react-toastify";
import ToastBody from "../../components/Popups/ToastBody";
import http from "../../services/http";

const api_endpoint = "/pre_defined_goals/";

const AddPreDefinedGoal = ({ match, history }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await http.get({ url: "/goal_categories/" });
      setCategories(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (body, { setSubmitting, setErrors }) => {
    try {
      const res = await http.post({ url: api_endpoint, body });

      toast.success(
        <ToastBody title="Success" message="Pre defined Goal Created." />
      );
      history.replace(basePath + "/pre_defined_goals/" + res.data._id);
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

  const renderForm = () => {
    return (
      <Formik
        initialValues={{ title: "", goalCategory: "" }}
        validationSchema={Yup.object().shape({
          title: Yup.string().trim().min(1).required(),
          goalCategory: Yup.string().trim().min(24).required(),
        })}
        enableReinitialize
        onSubmit={submitHandler}
      >
        {({ isSubmitting, submitForm }) => {
          return (
            <Form>
              <div className="row">
                <div className="col-12">
                  <Input name="title" placeholder="Title" label="Title" />
                </div>

                <div className="col-12">
                  <MySelect
                    label="Goal Category"
                    name="goalCategory"
                    placeholder="Choose a Category"
                    options={categories.map((cat) => ({
                      label: cat.name,
                      value: cat._id,
                    }))}
                  />
                </div>

                <div className="col-12 text-center">
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    onClick={submitForm}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  };
  return (
    <>
      <Header />
      <Container className="mt--7">
        <Card className="shadow">
          <CardHeader>
            <div className="clearfix">
              <h2 className="mb-0 float-left">Add Pre Defined Goal</h2>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">{renderForm()}</CardBody>
        </Card>
      </Container>
    </>
  );
};

export default AddPreDefinedGoal;
