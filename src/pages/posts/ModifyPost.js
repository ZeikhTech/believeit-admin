import React, { useState, useEffect } from "react";
import { Button, Container, Card, CardHeader, CardBody } from "reactstrap";
import Header from "../../components/Headers/Header";
import { basePath } from "../../configs";
import { handleErrors } from "../../helpers/error";

import http from "../../services/http";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";
import { toast } from "react-toastify";
import ToastBody from "../../components/Popups/ToastBody";

import RichEditor from "../../components/Inputs/RichEditor";

import ImagePicker from "../../components/Popups/ImagePicker";

const api_endpoint = "/posts/";

const ModifyPost = ({ match, history }) => {
  const [post, setPost] = useState({
    title: "",
    type: "youtube_video",
    youtubeVideo: "",
    image: "",
    description: "",
    link: "",
    _id: "",
  });

  const [postImage, setPostImage] = useState(null);

  const { identifier } = match.params;

  useEffect(() => {
    if (identifier !== "add" && identifier !== post._id) loadPost(identifier);
  }, [identifier]);

  const loadPost = async (id) => {
    try {
      const res = await http.get({ url: api_endpoint + identifier });
      setPost(res.data);
    } catch (err) {
      switch (err.response.status) {
        case 404:
          handleErrors("Post not found!");
          history.replace(basePath + "/posts/");
          break;
        default:
          handleErrors("Something went wrong!");
      }
    }
  };

  const submitHandler = async (body, { setSubmitting, setErrors }) => {
    try {
      let imageRes;

      if (body.type === "blog" && postImage !== null) {
        const imageBody = new FormData();
        imageBody.append("image", postImage);
        imageRes = await http.post({
          url: "/media/image",
          body: imageBody,
        });

        body.image = imageRes.data._id;
      }

      if (identifier === "add") {
        const res = await http.post({ url: api_endpoint, body });
        setPost(res.data);
      } else {
        const res = await http.put({
          url: api_endpoint + identifier,
          body,
        });
        setPost(res.data);
      }
      setPostImage(null);

      toast.success(
        <ToastBody
          title="Success"
          message={
            identifier === "add"
              ? "Post Created Successfully."
              : "Post Updated Successfully."
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
          handleErrors("This post is deleted");
          break;
        default:
          handleErrors("Something went wrong!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderPostForm = () => {
    return (
      <Formik
        initialValues={{
          title: post.title,
          type: post.type,
          link: post.link,
          youtubeVideo: post.youtubeVideo,
          description: post.description,
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string().trim().min(1).required(),

          type: Yup.string().trim().required(),

          youtubeVideo: Yup.string().when("type", {
            is: "youtube_video",
            then: Yup.string().required(),
          }),

          link: Yup.string().when("type", {
            is: "blog",
            then: Yup.string().required(),
          }),
        })}
        onSubmit={submitHandler}
        enableReinitialize
      >
        {({ values, isSubmitting, submitForm }) => {
          const postType = values.type;
          return (
            <Form>
              <div className="row">
                {postType === "blog" && (
                  <div className="col-12">
                    <ImagePicker
                      imagePreview={post.image.thumbnailUrl}
                      onChange={(image) => {
                        setPostImage(image[0]);
                      }}
                    />
                  </div>
                )}
                <div className="col-12">
                  <Input
                    label="Post Title"
                    name="title"
                    placeholder="Post Title..."
                  />
                </div>

                <div className="col-12">
                  <MySelect
                    name="type"
                    label="Post Type"
                    options={[
                      { label: "Youtube Video", value: "youtube_video" },
                      { label: "Blog", value: "blog" },
                    ]}
                  />
                </div>
                {postType === "youtube_video" && (
                  <div className="col-12">
                    <Input
                      label="Youtube Video Id"
                      name="youtubeVideo"
                      placeholder="youtube video id"
                    />
                  </div>
                )}

                {postType === "blog" && (
                  <>
                    <div className="col-12">
                      <Input
                        label="Description"
                        name="description"
                        placeholder="description..."
                      />
                    </div>

                    {/* <div className="col-12">
                      <RichEditor
                        label="Content"
                        name="htmlContent"
                        className="w-100"
                      />
                    </div> */}
                    <div className="col-12">
                      <Input label="Link" name="link" placeholder="Link" />
                    </div>
                  </>
                )}

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
  return (
    <>
      <Header />
      <Container className="mt--7">
        <Card className="shadow">
          <CardHeader>
            <div className="clearfix">
              <h2 className="mb-0 float-left">
                {identifier === "add" ? "Add Post" : post.title}
              </h2>
            </div>
          </CardHeader>
          <CardBody className="bg-secondary">{renderPostForm()}</CardBody>
        </Card>
      </Container>
    </>
  );
};

export default ModifyPost;
