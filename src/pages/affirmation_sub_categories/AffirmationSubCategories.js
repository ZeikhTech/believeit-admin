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

const api_endpoint = "/affirmation_sub_categories/";
const AffirmationCategories = (props) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // $("#affirmation_categories_table").DataTable({
    //   language: {
    //     paginate: {
    //       next:
    //         '<span class="pagination-fa"><i class="fa fa-chevron-right" ></i></span>',
    //       previous:
    //         '<span class="pagination-fa"><i class="fa fa-chevron-left" ></i></span>',
    //     },
    //   },
    // });
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await http.get({ url: api_endpoint });
      setCategories(res.data);
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
      const newCategories = categories.filter((c) => c._id !== category._id);
      setCategories(newCategories);
    } catch (err) {
      handleErrors("Failed to delete Affirmation Category");
    }
  };
  const renderCategories = () => {
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table className="table" id="affirmation_categories_table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Parent</th>
              <th>Free</th>
              <th>actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat, index) => {
              return (
                <tr key={cat._id}>
                  <td>{cat.name}</td>
                  <td>{cat.parent ? cat.parent.name : ""}</td>
                  <td>{cat.isFree ? "Yes" : "No"}</td>
                  <td>
                    <Link
                      className="btn btn-primary btn-sm"
                      to={basePath + "/affirmation_sub_categories/" + cat._id}
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
              <h2 className="mb-0 float-left">Affirmation Categories</h2>
              <Link
                to={basePath + "/affirmation_sub_categories/add"}
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

export default AffirmationCategories;
