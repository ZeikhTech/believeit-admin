import React, { useState, useEffect } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Header from "../../components/Headers/Header";
import Loader from "../../components/Loader";
import { handleErrors } from "../../helpers/error";
import * as $ from "jquery/dist/jquery";

import { Link } from "react-router-dom";
import http from "../../services/http";
import { basePath } from "../../configs";

$.DataTable = require("datatables.net-bs4");

const api_endpoint = "/pre_defined_goals/";
const PreDefinedGoals = (props) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const res = await http.get({ url: api_endpoint });
      setGoals(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (goal) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete "${goal.title}"?`
    );
    if (!confirmation) return;

    try {
      await http.delete({ url: api_endpoint + goal._id });
      const newGoals = goals.filter((c) => c._id !== goal._id);
      setGoals(newGoals);
    } catch (err) {
      handleErrors("Failed to delete Goal");
    }
  };
  const renderGoals = () => {
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table className="table" id="pre_defined_goals_table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>actions</th>
            </tr>
          </thead>

          <tbody>
            {goals.map((goal, index) => {
              return (
                <tr key={goal._id}>
                  <td>{goal.title}</td>
                  <td>
                    <div
                      className="badge badge-sm badge-primary text-white"
                      style={{
                        backgroundColor: goal.isActive ? "#2dce89" : "#f5365c",
                      }}
                    >
                      {goal.isActive ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td>
                    <Link
                      className="btn btn-primary btn-sm"
                      to={basePath + "/pre_defined_goals/" + goal._id}
                    >
                      <i className="fa fa-pencil-alt"></i>
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteGoal(goal)}
                    >
                      <i className="fa fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const showLoader = () => {
    return (
      <div className="d-flex justify-content-center my-5">
        <Loader />
      </div>
    );
  };
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Card className="shadow">
          <CardHeader>
            <div className="clearfix">
              <h2 className="mb-0 float-left">Pre Defined Goals</h2>
              <Link
                to={basePath + "/pre_defined_goals/add"}
                className="btn btn-success btn-sm float-right"
                color="success"
                size="sm"
              >
                <i className="fa fa-pencil-alt"></i> Add
              </Link>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">
            {loading ? showLoader() : renderGoals()}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default PreDefinedGoals;
