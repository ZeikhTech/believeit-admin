import React from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Button } from "reactstrap";
import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";

const QouteCategoryForm = ({ initialValues, onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues || { name: "", color: "#000000" }}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().min(1).required(),
        isFree: Yup.boolean().required(),
      })}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, submitForm }) => {
        return (
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Input label="Name" name="name" placeholder="Name" />
              </div>

              <div className="col-md-6">
                <MySelect
                  name="isFree"
                  label="Free"
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
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

export default QouteCategoryForm;
