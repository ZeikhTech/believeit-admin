import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Header from "../../components/Headers/Header";
import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";
import FormikToggle from "../../components/Inputs/FormikToggle";
import Toggle from "../../components/Inputs/Toggle";
import { Link } from "react-router-dom";

import SortableList from "../../components/sortable/SortableList";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { basePath } from "../../configs";
import { handleErrors } from "../../helpers/error";
import http from "../../services/http";

const api_endpoint = "/pre_defined_sub_milestones/";

const PreDefinedSubMilestones = ({ match, history }) => {
  const { identifier } = match.params;
  const [parentMilestone, setParentMilestone] = useState({
    title: "",
  });
  const [milestones, setMilestones] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    _id: "",
    title: "",
    preDefinedMilestone: identifier,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParentMileStone();
    loadSubMilestones();
  }, []);

  const loadParentMileStone = async () => {
    try {
      const res = await http.get({
        url: "/pre_defined_milestones/" + identifier,
      });
      setParentMilestone(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    }
  };

  const loadSubMilestones = async () => {
    try {
      const res = await http.get({
        url: api_endpoint + "sub_milestones/" + identifier,
      });
      setMilestones(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    }
  };

  const changeMilestoneStatus = async (id, isActive) => {
    try {
      setMilestones(
        milestones.map((m) => {
          if (m._id === id) {
            m.isActive = isActive;
          }
          return m;
        })
      );

      const res = await http.put({
        url: api_endpoint + "change_status/" + id,
        body: { isActive },
      });
    } catch (err) {
      handleErrors("Something went wrong!");
      setMilestones(
        milestones.map((m) => {
          if (m._id === id) {
            m.isActive = !isActive;
          }
          return m;
        })
      );
    }
  };

  const rearrangeMilestones = async (orderIds) => {
    try {
      const res = await http.put({
        url: api_endpoint + "rearrange/",
        body: { orderIds },
      });
    } catch (err) {
      handleErrors("Something went wrong!");
    }
  };

  const deleteMilestone = async (milestone) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete "${milestone.title}"?`
    );
    if (!confirmation) return;

    try {
      await http.delete({
        url: api_endpoint + milestone._id,
      });
      const newMilestones = milestones.filter((m) => m._id !== milestone._id);
      setMilestones(newMilestones);
    } catch (err) {
      console.log(err);
      handleErrors("Failed to delete Milestone.");
    }
  };

  const submitHandler = async (body, { setSubmitting, setErrors }) => {
    try {
      if (formValues._id !== "") {
        const res = await http.put({
          url: api_endpoint + formValues._id,
          body,
        });

        setMilestones(
          milestones.map((m) => {
            if (m._id === formValues._id) return res.data;
            return m;
          })
        );
      } else {
        const res = await http.post({
          url: api_endpoint,
          body,
        });

        setMilestones([res.data, ...milestones]);
      }
      setShowForm(false);
    } catch (err) {
      switch (err.response.status) {
        case 400:
          setErrors(err.response.data.error);
          break;
        case 404:
          handleErrors("Goal is already deleted");
          break;
        default:
          handleErrors("Something went wrong!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFormModal = () => setShowForm(!showForm);
  const renderForm = () => {
    return (
      <Modal isOpen={showForm} toggle={toggleFormModal}>
        <Formik
          initialValues={{
            title: formValues.title,
            preDefinedMilestone: formValues.preDefinedMilestone,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().trim().min(1).required(),
            preDefinedMilestone: Yup.string().trim().min(24).max(24).required(),
          })}
          onSubmit={submitHandler}
          enableReinitialize
        >
          {({ isSubmitting, submitForm }) => {
            return (
              <Form>
                <ModalHeader toggle={toggleFormModal}>
                  Create a Sub Milestone
                </ModalHeader>
                <ModalBody className="bg-secondary pb-">
                  <Input
                    name="title"
                    label="Title"
                    placeholder="title"
                    className="shadow"
                    type="textarea"
                  />
                </ModalBody>
                <ModalFooter className="pt-0 bg-secondary">
                  <Button color="danger" onClick={toggleFormModal}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={submitForm}
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    );
  };
  const renderMilestones = () => {
    if (milestones.length === 0)
      return (
        <div className="text-center m-3">
          <p className="text-ligth">No sub milestones available</p>
        </div>
      );
    return (
      <>
        <ListGroup>
          <SortableList
            data={milestones}
            keyExtractor={(item) => {
              return item._id;
            }}
            onListSort={(list) => {
              setMilestones(list);
              rearrangeMilestones(list.map((m) => m._id));
            }}
            renderItem={(item, index) => {
              return (
                <ListGroupItem className="rounded mb-1">
                  <div className="clearfix">
                    <span>{item.title}</span>

                    <Button
                      color="danger"
                      size="sm"
                      className="float-right"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteMilestone(item);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      className="float-right mr-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        setFormValues({
                          _id: item._id,
                          title: item.title,
                          preDefinedMilestone: item.preDefinedMilestone,
                        });
                        setShowForm(true);
                      }}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </Button>
                    <div className="float-right mt-1">
                      <Toggle
                        checked={item.isActive}
                        onChange={(isActive) => {
                          changeMilestoneStatus(item._id, isActive);
                        }}
                      />
                    </div>
                  </div>
                </ListGroupItem>
              );
            }}
          />
        </ListGroup>
      </>
    );
  };

  return (
    <>
      <Header />
      <Container className="mt--7">
        <Card className="shadow">
          <CardHeader>
            <div className="clearfix">
              <h2 className="mb-0 float-left">{parentMilestone.title}</h2>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">
            <div className="clearfix">
              <h1 className="float-left">Milestones</h1>

              <Button
                className="btn btn-success btn-sm float-right mt-2"
                size="sm"
                onClick={() => {
                  setFormValues({
                    _id: "",
                    title: "",
                    preDefinedMilestone: identifier,
                  });
                  setShowForm(true);
                }}
              >
                <i className="fa fa-pencil-alt"></i> Add
              </Button>
            </div>
            {renderForm()}
            {renderMilestones()}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default PreDefinedSubMilestones;
