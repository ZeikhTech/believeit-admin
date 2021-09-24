import React, { useState, useEffect } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Header from "../../components/Headers/Header";
import Loader from "../../components/Loader";
import { handleErrors } from "../../helpers/error";
import * as $ from "jquery/dist/jquery";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import { Link } from "react-router-dom";
import http from "../../services/http";
import moment from "moment";
import { basePath } from "../../configs";

$.DataTable = require("datatables.net-bs4");

const api_endpoint = "/qoutations/";
const Qoutes = (props) => {
  const [loading, setLoading] = useState(true);
  const [qoutations, setQoutations] = useState([]);
  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    try {
      setLoading(true);
      const res = await http.get({ url: api_endpoint });

      setQoutations(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    } finally {
      setLoading(false);

      $("#qoutations_table").DataTable({
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

  const deleteQoute = async (qoute) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete "${qoute.qoutation}"?`
    );
    if (!confirmation) return;

    try {
      await http.delete({ url: api_endpoint + qoute._id });
      const newCategories = qoutations.filter((c) => c._id !== qoute._id);
      setQoutations(newCategories);
    } catch (err) {
      handleErrors("Failed to delete Quotation.");
    }
  };

  const renderCategories = () => {
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table className="table" id="qoutations_table">
          <thead>
            <tr>
              <th>Quotation</th>
              <th>Category</th>
              <th>Date</th>
              <th>actions</th>
            </tr>
          </thead>

          <tbody>
            {qoutations.map((qoute, index) => {
              return (
                <tr key={qoute._id}>
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
                      {qoute.qoutation}
                    </div>
                  </td>
                  <td>{qoute.category && qoute.category.name}</td>
                  <td>{moment(qoute.createdAt).format("MM/DD/YYYY")}</td>
                  <td>
                    <Link
                      className="btn btn-primary btn-sm"
                      to={basePath + "/qoutations/" + qoute._id}
                    >
                      <i className="fa fa-pencil-alt"></i>
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteQoute(qoute)}
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
              <h2 className="mb-0 float-left">Quotation</h2>
              <Link
                to={basePath + "/qoutations/add"}
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

export default Qoutes;
