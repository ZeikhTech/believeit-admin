import React, { useState, useEffect } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Button } from "reactstrap";

import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";

import { handleErrors } from "../../helpers/error";

import http from "../../services/http";

const QouteForm = ({ initialValues, onSubmit }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await http.get({ url: "/qoute_categories/" });
      setCategories(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Formik
      initialValues={initialValues || { qoutation: "", category: "" }}
      validationSchema={Yup.object().shape({
        qoutation: Yup.string().trim().min(1).required(),
        category: Yup.string().min(24).required(),
      })}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, isSubmitting, submitForm }) => {
        return (
          <Form>
            <div className="row">
              <div className="col-12">
                <Input
                  label="Quotation"
                  name="qoutation"
                  type="textarea"
                  placeholder="write a quotation."
                />
              </div>

              <div className="col-12">
                <MySelect
                  label="Category"
                  name="category"
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

export default QouteForm;
