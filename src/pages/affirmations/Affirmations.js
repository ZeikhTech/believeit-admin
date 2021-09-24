import React, { useState, useEffect } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Header from "../../components/Headers/Header";
import Loader from "../../components/Loader";
import { handleErrors } from "../../helpers/error";
import * as $ from "jquery/dist/jquery";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import { Link } from "react-router-dom";
import http from "../../services/http";
import { basePath } from "../../configs";
import moment from "moment";

$.DataTable = require("datatables.net-bs4");

const api_endpoint = "/affirmations/";
const Affirmations = (props) => {
  const [loading, setLoading] = useState(true);
  const [affirmations, setAffirmations] = useState([]);
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await http.get({ url: api_endpoint });
      setAffirmations(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    } finally {
      setLoading(false);

      $("#affirmatinos_table").DataTable({
        language: {
          paginate: {
            next: '<span class="pagination-fa"><i class="fa fa-chevron-right" ></i></span>',
            previous:
              '<span class="pagination-fa"><i class="fa fa-chevron-left" ></i></span>',
          },
        },
      });
    }
  };

  const deleteAffirmation = async (affirmation) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete "${affirmation.affirmation}"?`
    );
    if (!confirmation) return;

    try {
      await http.delete({ url: api_endpoint + affirmation._id });
      const newCategories = affirmations.filter(
        (c) => c._id !== affirmation._id
      );
      setAffirmations(newCategories);
    } catch (err) {
      handleErrors("Failed to delete Affirmation");
    }
  };

  const renderCategories = () => {
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table className="table" id="affirmatinos_table">
          <thead>
            <tr>
              <th>affirmation</th>
              <th>Category</th>
              <th>Date</th>
              <th>actions</th>
            </tr>
          </thead>

          <tbody>
            {affirmations.map((affirmation, index) => {
              return (
                <tr key={affirmation._id}>
                  <td>
                    <div
                      style={{
                        maxWidth: "450px",
                        maxHeight: "200px",
                        whiteSpace: "initial",
                        overflowY: "hidden",
                        wordWrap: "break-word",
                      }}
                    >
                      {affirmation.affirmation}
                    </div>
                  </td>
                  <td>{affirmation.category && affirmation.category.name}</td>

                  <td>{moment(affirmation.createdAt).format("MM/DD/YYYY")}</td>
                  <td>
                    <Link
                      className="btn btn-primary btn-sm"
                      to={basePath + "/affirmations/" + affirmation._id}
                    >
                      <i className="fa fa-pencil-alt"></i>
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteAffirmation(affirmation)}
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
              <h2 className="mb-0 float-left">Affirmations</h2>
              <Link
                to={basePath + "/affirmations/add"}
                className="btn btn-success btn-sm float-right"
                color="success"
                size="sm"
              >
                <i className="fa fa-pencil-alt"></i> Add
              </Link>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">
            {loading ? showLoader() : renderCategories()}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Affirmations;
