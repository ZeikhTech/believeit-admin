import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
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

const api_endpoint = "/pre_defined_goals/";

const EditPreDefinedGoal = ({ match, history }) => {
  const [categories, setCategories] = useState([]);
  const [goal, setGoal] = useState({
    _id: "",
    title: "",
    goalCategory: "",
    isActive: false,
  });
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  const { identifier } = match.params;

  useEffect(() => {
    loadGoal();
    loadCategories();
    loadMilestones();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await http.get({ url: "/goal_categories/" });
      setCategories(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const loadGoal = async () => {
    try {
      setLoading(true);
      const res = await http.get({ url: api_endpoint + identifier });
      setGoal(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const loadMilestones = async () => {
    try {
      const res = await http.get({
        url: "/pre_defined_milestones/goal_milestones/" + identifier,
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
        url: "/pre_defined_milestones/change_status/" + id,
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
        url: "/pre_defined_milestones/rearrange/",
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
      await http.delete({ url: "/pre_defined_milestones/" + milestone._id });
      const newMilestones = milestones.filter((m) => m._id !== milestone._id);
      setMilestones(newMilestones);
    } catch (err) {
      console.log(err);
      handleErrors("Failed to delete Milestone.");
    }
  };

  const submitHandler = async (body, { setSubmitting, setErrors }) => {
    try {
      const res = await http.put({ url: api_endpoint + goal._id, body });
      setGoal(res.data);
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

  const renderGoalForm = () => {
    return (
      <Formik
        initialValues={goal}
        validationSchema={Yup.object().shape({
          title: Yup.string().trim().min(1).required(),
          goalCategory: Yup.string().trim().min(24).required(),
        })}
        enableReinitialize
        onSubmit={submitHandler}
      >
        {({ isSubmitting, submitForm }) => {
          return (
            <Form>
              <div className="row">
                <div className="col-12">
                  <Input name="title" placeholder="Title" label="Title" />
                </div>

                <div className="col-md-6">
                  <MySelect
                    label="Goal Category"
                    name="goalCategory"
                    placeholder="Choose a Category"
                    options={categories.map((cat) => ({
                      label: cat.name,
                      value: cat._id,
                    }))}
                  />
                </div>

                <div className="col-md-6">
                  <FormikToggle name="isActive" label="Status" />
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

  const renderMilestones = () => {
    if (milestones.length === 0)
      return (
        <div className="text-center m-3">
          <p className="text-ligth">No milestones available</p>
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
                    <Link
                      to={basePath + "/pre_defined_sub_milestones/" + item._id}
                    >
                      <span className="text-dark">{item.title}</span>
                    </Link>

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

                        history.push(
                          basePath +
                            `/pre_defined_milestones/${goal._id}/${item._id}`
                        );
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
              <h2 className="mb-0 float-left">Edit Pre Defined Goal</h2>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">
            {renderGoalForm()}
            <div className="clearfix mt-3">
              <h1 className="float-left">Milestones</h1>

              <Link
                className="btn btn-success btn-sm float-right mt-2"
                size="sm"
                to={basePath + `/pre_defined_milestones/${goal._id}/add`}
              >
                <i className="fa fa-pencil-alt"></i> Add
              </Link>
            </div>
            {renderMilestones()}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default EditPreDefinedGoal;
