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

$.DataTable = require("datatables.net-bs4");

const api_endpoint = "/prayers/";
const Prayers = (props) => {
  const [loading, setLoading] = useState(true);
  const [prayers, setPrayers] = useState([]);
  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = async () => {
    try {
      setLoading(true);
      const res = await http.get({ url: api_endpoint });
      setPrayers(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    } finally {
      setLoading(false);

      $("#prayers_table").DataTable({
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

  const deletePrayer = async (prayer) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete "${prayer.name}"?`
    );
    if (!confirmation) return;

    try {
      await http.delete({ url: api_endpoint + prayer._id });
      const newCategories = prayers.filter((c) => c._id !== prayer._id);
      setPrayers(newCategories);
    } catch (err) {
      handleErrors("Failed to delete Prayer");
    }
  };

  const renderCategories = () => {
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table className="table" id="prayers_table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Prayer</th>
              <th>actions</th>
            </tr>
          </thead>

          <tbody>
            {prayers.map((prayer, index) => {
              return (
                <tr key={prayer._id}>
                  <td>{prayer.name}</td>
                  <td>{prayer.prayer}</td>
                  <td>
                    <Link
                      className="btn btn-primary btn-sm"
                      to={basePath + "/prayers/" + prayer._id}
                    >
                      <i className="fa fa-pencil-alt"></i>
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deletePrayer(prayer)}
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
              <h2 className="mb-0 float-left">Prayers</h2>
              <Link
                to={basePath + "/prayers/add"}
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

export default Prayers;
