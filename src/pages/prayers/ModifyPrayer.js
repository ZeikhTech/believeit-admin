import React, { useState, useEffect } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Header from "../../components/Headers/Header";
import { basePath } from "../../configs";
import { handleErrors } from "../../helpers/error";
import { toast } from "react-toastify";
import ToastBody from "../../components/Popups/ToastBody";

import http from "../../services/http";

import PrayerForm from "./PrayerForm";

const api_endpoint = "/prayers/";

const ModifyPrayer = ({ match, history }) => {
  const { identifier } = match.params;

  const [prayer, setPrayer] = useState({
    name: "",
    prayer: "",
    translation: "",
    prayerDays: ["anytime"],
    type: "text_prayer",
    _id: "",
  });

  useEffect(() => {
    if (identifier !== "add" && identifier !== prayer._id)
      loadPrayer(identifier);
  }, [identifier]);

  const loadPrayer = async (id) => {
    try {
      const res = await http.get({ url: api_endpoint + identifier });
      setPrayer(res.data);
    } catch (err) {
      switch (err.response.status) {
        case 404:
          handleErrors("Category not found!");
          history.replace(basePath + "/prayers/");
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
        setPrayer(res.data);
      } else {
        const res = await http.put({
          url: api_endpoint + identifier,
          body,
        });
        setPrayer(res.data);
      }

      toast.success(
        <ToastBody
          title="Success"
          message={
            identifier === "add"
              ? "Prayer Created Successfully."
              : "Prayer Updated Successfully."
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
          handleErrors("This Prayer is deleted");
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
                {identifier === "add" ? "Add Prayer" : "Edit Prayer"}
              </h2>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">
            <PrayerForm
              onSubmit={submitHandler}
              initialValues={{
                name: prayer.name,
                prayer: prayer.prayer,
                translation: prayer.translation,
                prayerDays: prayer.prayerDays,
                type: prayer.type,
              }}
            />
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default ModifyPrayer;
