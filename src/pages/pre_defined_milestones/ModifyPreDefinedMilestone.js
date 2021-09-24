import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  ButtonGroup,
  Label,
  Button,
} from "reactstrap";
import Header from "../../components/Headers/Header";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import Input from "../../components/Inputs/Input";
import SearchSelect from "../../components/Inputs/SearchSelect";

import { basePath } from "../../configs";
import { toast } from "react-toastify";
import ToastBody from "../../components/Popups/ToastBody";

import { handleErrors } from "../../helpers/error";

import http from "../../services/http";
const api_endpoint = "/pre_defined_milestones/";

const ModifyPreDefinedMilestone = ({ match, history }) => {
  const { identifier, preDefinedGoal } = match.params;

  const [milestone, setMilestone] = useState({
    title: "",
    preDefinedGoal,
    frequency: 1,
    repeatingDays: [],
    timeOfDay: [],
  });

  useEffect(() => {
    if (identifier !== "add" && identifier !== milestone._id) loadMilestone();
  }, [identifier]);

  const loadMilestone = async () => {
    try {
      const res = await http.get({ url: api_endpoint + identifier });
      setMilestone(res.data);
    } catch (err) {
      switch (err.response.status) {
        case 404:
          handleErrors("Pre Defined Milestone not found!");
          //   history.replace(basePath + "/goal_categories/");
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
        setMilestone(res.data);
      } else {
        const res = await http.put({
          url: api_endpoint + identifier,
          body,
        });
        setMilestone(res.data);
      }
      toast.success(
        <ToastBody
          title="Success"
          message={
            identifier === "add"
              ? "Pre Defined Milestone Created Successfully."
              : "Pre Defined Milestone Updated Successfully."
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

  const renderForm = () => {
    const weekDays = [
      { value: "monday", label: "Monday" },
      { value: "tuesday", label: "Tuesday" },
      { value: "wednesday", label: "Wednesday" },
      { value: "thursday", label: "Thursday" },
      { value: "friday", label: "Friday" },
      { value: "saturday", label: "Saturday" },
      { value: "sunday", label: "Sunday" },
    ];

    const timesOfDay = ["morning","evening","noon","night"].map((i) => ({ label: i, value: i }));

    return (
      <Formik
        initialValues={milestone}
        validationSchema={Yup.object().shape({
          title: Yup.string().trim().min(1).required(),
          preDefinedGoal: Yup.string().trim().min(24).required(),
          frequency: Yup.number().min(1).required(),
          repeatingDays: Yup.array().of(Yup.string().required()).required(),
          timeOfDay: Yup.array().of(Yup.string().required()).required(),
        })}
        enableReinitialize
        onSubmit={submitHandler}
      >
        {({
          isSubmitting,
          submitForm,
          setFieldValue,
          values,
          touched,
          errors,
        }) => {
          const repeatingDaysValue = weekDays.filter((weekDay) => {
            return values["repeatingDays"].includes(weekDay.value);
          });

          const timesOfDayValue = timesOfDay.filter((time) => {
            return values["timeOfDay"].includes(time.value);
          });
          return (
            <Form>
              <div className="row">
                <div className="col-12">
                  <Input name="title" placeholder="Title" label="Title" />
                </div>

                <div className="col-md-6">
                  <Input
                    name="frequency"
                    placeholder="Frequency"
                    label="Frequency"
                    type="number"
                    min={1}
                  />
                </div>
                <div className="col-md-6">
                  <SearchSelect
                    label="Time of Day"
                    isMulti
                    options={timesOfDay}
                    value={timesOfDayValue}
                    onChange={(values = []) => {
                      if (values === null) values = [];
                      console.log("change", values);
                      setFieldValue(
                        "timeOfDay",
                        values.map((v) => v.value)
                      );
                    }}
                    error={touched["timeOfDay"] && errors["timeOfDay"]}
                  />
                </div>

                <div className="col-md-6">
                  <SearchSelect
                    label="Repeating Days"
                    isMulti
                    options={weekDays}
                    value={repeatingDaysValue}
                    onChange={(values = []) => {
                      if (values === null) values = [];
                      console.log("change", values);
                      setFieldValue(
                        "repeatingDays",
                        values.map((v) => v.value)
                      );
                    }}
                    error={touched["repeatingDays"] && errors["repeatingDays"]}
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
              <h2 className="mb-0 float-left">
                {identifier === "add"
                  ? "Add Pre Defined Milestone"
                  : milestone.title}
              </h2>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">{renderForm()}</CardBody>
        </Card>
      </Container>
    </>
  );
};

export default ModifyPreDefinedMilestone;
