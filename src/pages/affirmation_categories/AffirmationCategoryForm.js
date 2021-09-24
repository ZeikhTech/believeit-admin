import React, { useState, useEffect } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Button } from "reactstrap";
import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";
import http from "../../services/http";

const AffirmationCategoryForm = ({
  initialValues,
  onSubmit,
  categoryId = "",
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await http.get({ url: "/affirmation_categories/" });
      setCategories(res.data);
    } catch (err) {}
  };
  return (
    <Formik
      initialValues={
        initialValues || { name: "", color: "#000000", parent: "" }
      }
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().min(1).required(),
        isFree: Yup.boolean().required(),
        parent: Yup.string().optional(),
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

              <div className="col-12">
                <MySelect
                  label="Parent Category"
                  name="parent"
                  placeholder="Parent Category"
                  options={categories
                    .filter((c) => c._id !== categoryId)
                    .map((cat) => ({
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

export default AffirmationCategoryForm;
