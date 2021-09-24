import React from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { ChromePicker } from "react-color";

import { Button } from "reactstrap";
import Input from "../../components/Inputs/Input";

const GoalCategoryForm = ({ initialValues, onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues || { name: "", color: "#000000" }}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().min(1).required(),
        color: Yup.string()
          .trim()
          .min(4)
          .max(7)
          .matches(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "color code is invalid!")
          .required(),
      })}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        isSubmitting,
        submitForm,
      }) => {
        return (
          <Form>
            <div className="row">
              <div className="col-lg-8 col-md-6 col-sm-12">
                <Input name="name" placeholder="Name" />
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12 mb-sm-4">
                <ChromePicker
                  color={values.color}
                  onChange={(color) => {
                    setFieldValue("color", color.hex);
                  }}
                />
                {touched["color"] && errors["color"] && (
                  <div className="alert alert-danger">{errors["color"]}</div>
                )}
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

export default GoalCategoryForm;
