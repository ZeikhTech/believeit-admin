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

const api_endpoint = "/posts/";
const Posts = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await http.get({ url: api_endpoint });
      setPosts(res.data);
    } catch (err) {
      handleErrors("Something went wrong!");
    } finally {
      setLoading(false);
      $("#posts_table").DataTable({
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

  const deletePost = async (post) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete "${post.title}"?`
    );
    if (!confirmation) return;

    try {
      await http.delete({ url: api_endpoint + post._id });
      const newPosts = posts.filter((c) => c._id !== post._id);
      setPosts(newPosts);
    } catch (err) {
      handleErrors("Failed to delete Post");
    }
  };

  const renderPosts = () => {
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table className="table" id="posts_table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Date</th>
              <th>actions</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post, index) => {
              return (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>
                    {post.type === "youtube_video" ? "Youtube Video" : "Blog"}
                  </td>
                  <td>{moment(post.createdAt).format("MM/DD/YYYY")}</td>
                  <td>
                    <Link
                      className="btn btn-primary btn-sm"
                      to={basePath + "/posts/" + post._id}
                    >
                      <i className="fa fa-pencil-alt"></i>
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deletePost(post)}
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
              <h2 className="mb-0 float-left">Posts</h2>
              <Link
                to={basePath + "/posts/add"}
                className="btn btn-success btn-sm float-right"
                color="success"
                size="sm"
              >
                <i className="fa fa-pencil-alt"></i> Add
              </Link>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">
            {loading ? showLoader() : renderPosts()}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Posts;
