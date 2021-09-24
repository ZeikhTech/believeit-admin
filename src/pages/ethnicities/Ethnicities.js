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

const api_endpoint = "/ethnicities/";
const Ethnicities = (props) => {
  const [ethnicities, setEthnicities] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // $("#ethnicities_table").DataTable({
    //   language: {
    //     paginate: {
    //       next:
    //         '<span class="pagination-fa"><i class="fa fa-chevron-right" ></i></span>',
    //       previous:
    //         '<span class="pagination-fa"><i class="fa fa-chevron-left" ></i></span>',
    //     },
    //   },
    // });
    loadEthnicities();
  }, []);

  const loadEthnicities = async () => {
    try {
      setLoading(true);
      const res = await http.get({ url: api_endpoint });
      setEthnicities(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (category) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );
    if (!confirmation) return;

    try {
      await http.delete({ url: api_endpoint + category._id });
      const newCategories = ethnicities.filter((c) => c._id !== category._id);
      setEthnicities(newCategories);
    } catch (err) {
      handleErrors("Failed to delete Ethnicity");
    }
  };
  const renderCategories = () => {
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table className="table" id="ethnicities_table">
          <thead>
            <tr>
              <th>Name</th>

              <th>actions</th>
            </tr>
          </thead>

          <tbody>
            {ethnicities.map((cat, index) => {
              return (
                <tr key={cat._id}>
                  <td>{cat.name}</td>

                  <td>
                    <Link
                      className="btn btn-primary btn-sm"
                      to={basePath + "/ethnicities/" + cat._id}
                    >
                      <i className="fa fa-pencil-alt"></i>
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteCategory(cat)}
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
              <h2 className="mb-0 float-left">Religions</h2>
              <Link
                to={basePath + "/ethnicities/add"}
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

export default Ethnicities;
