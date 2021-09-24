import React, { useState, useEffect } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Button } from "reactstrap";

import Input from "../../components/Inputs/Input";
import SearchSelect from "../../components/Inputs/SearchSelect";

const prayerDaysOptions = [
  { label: "Anytime", value: "anytime" },
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
];
const PrayerForm = ({ initialValues, onSubmit }) => {
  return (
    <Formik
      initialValues={
        initialValues || {
          name: "",
          prayer: "",
          translation: "",
          prayerDays: [],
          type: "text_prayer",
        }
      }
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().min(3).required(),
        prayer: Yup.string().required(),
        translation: Yup.string().optional(),
        prayerDays: Yup.array().of(Yup.string().required()).required(),
      })}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({
        values,
        touched,
        errors,
        setFieldValue,
        isSubmitting,
        submitForm,
      }) => {
        return (
          <Form>
            <div className="row">
              <div className="col-12">
                <Input
                  label="Name"
                  name="name"
                  placeholder="Name of the prayer."
                />
              </div>

              <div className="col-12">
                <Input
                  label="Prayer"
                  name="prayer"
                  placeholder="prayer"
                  type="textarea"
                />
              </div>
              <div className="col-12">
                <Input
                  label="Translation"
                  name="translation"
                  placeholder="transltaion"
                  type="textarea"
                />
              </div>

              <div className="col-12">
                <SearchSelect
                  label="Repeating Days"
                  isMulti
                  options={prayerDaysOptions}
                  value={values.prayerDays.map((v) => {
                    return prayerDaysOptions.find((p) => p.value === v);
                  })}
                  onChange={(values = []) => {
                    if (values === null) values = [];

                    setFieldValue(
                      "prayerDays",
                      values.map((v) => v.value)
                    );
                  }}
                  error={touched["prayerDays"] && errors["prayerDays"]}
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

export default PrayerForm;
