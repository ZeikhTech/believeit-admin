import React from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Button } from "reactstrap";
import Input from "../../components/Inputs/Input";

const EthnicityForm = ({ initialValues, onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues || { name: "", color: "#000000" }}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().min(1).required(),
      })}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, submitForm }) => {
        return (
          <Form>
            <div className="row">
              <div className="col-12">
                <Input name="name" placeholder="Name" />
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

export default EthnicityForm;
