import React, { useState, useEffect } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Button } from "reactstrap";
import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";
import { handleErrors } from "../../helpers/error";

import http from "../../services/http";

const AffirmationCategoryForm = ({ initialValues, onSubmit }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await http.get({ url: "/affirmation_categories/" });
      setCategories(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={
        initialValues || { name: "", color: "#000000", parent: "" }
      }
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().min(1).required(),
        parent: Yup.string().min(24).required(),
        isFree: Yup.boolean().required(),
      })}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, submitForm, errors }) => {
        console.log("Errors => ", errors);
        return (
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Input label="Name" name="name" placeholder="Name" />
              </div>

              <div className="col-6">
                <MySelect
                  label="Parent Affirmation Category"
                  name="parent"
                  placeholder="Choose a Category"
                  options={categories.map((cat) => ({
                    label: cat.name,
                    value: cat._id,
                  }))}
                />
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

export default AffirmationCategoryForm;
