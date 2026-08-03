import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import "ckeditor5/ckeditor5.css";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  Table,
  Undo,
} from "ckeditor5";
import { BeatLoader, ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";

const Blog = ({ edit, reupload }) => {
  const [blogToEdit, setBlogToEdit] = useState();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    async function getSelectedPost() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/blog/${id}`
        );
        if (response.data.success) {
          setBlogToEdit(response.data.blog);
        } else {
          console.error("Failed to fetch data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setLoading(false);
      }
    }
    if (edit) {
      getSelectedPost();
    }
  }, [id, edit]);

  useEffect(() => {
    if (blogToEdit) {
      setTitle(blogToEdit.title || "");
      setDescription(blogToEdit.description || "");
      setSelectedCategory(blogToEdit.category && blogToEdit.category._id || "");
      setImagePreview(
        `${import.meta.env.VITE_SERVERAPI}/${blogToEdit.image.replace(
          /\\/g,
          "/"
        )}`
      );
    }
  }, [blogToEdit]);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [newCategory, setNewCategory] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const editorRef = useRef();

  const [addCategory, setAddCategory] = useState(false);

  useEffect(() => {
    async function getCategories() {
      if (reupload) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/category`
        );
        if (response.data.success) {
          const cats = response.data.data || response.data.categories;
          setCategories(cats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getCategories();
  }, [reupload]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!edit || reupload) {
      if (!image) newErrors.image = "Please, choose an image!";
    }
    if (!reupload) {
      if (!title) newErrors.title = "Please, enter the activity title!";
      if (!description)
        newErrors.description = "Please, enter the description!";

      if (!selectedCategory) newErrors.category = "Please, select a category!";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("Blogimage", image);
    formData.append("description", description);
    formData.append("category", selectedCategory);

    console.log(title, image, description, selectedCategory);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/blog/createblog`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setTitle("");
        setImage(null);
        setImagePreview("");
        setDescription("");
        setSelectedCategory("");
        setErrors({});
        editorRef.current.setData("");
        navigate(`/get-blogs/${response.data.savedBlog._id}`);
      } else {
        toast.error(response.data.error);
        console.log(response, "res with error");
      }
    } catch (error) {
      // console.error("Error submitting form:", error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const addCategoryHandler = async (e) => {
    e?.preventDefault();
    setLoading(true);
    console.log(newCategory);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/category`,
        { title: newCategory },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.success) {
        setCategories(response.data.categories);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }
      console.error(err);
    } finally {
      setLoading(false);
      setAddCategory(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/blog/${id}`,
        {
          title,
          description,
          selectedCategory,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/get-blogs/${id}`);
      } else {
        toast.error(response.data.message);
        console.log(response, "res with error");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReupload = async (e) => {
    e.preventDefault();
    console.log("uploading");
    setSubmitting(true);

    if (!validateForm()) {
      console.log("validation failed");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();

    formData.append("activityImage", image);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/blog/${id}/reupload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/get-blogs/${id}`);
      } else {
        toast.error(response.data.message);
        console.log(response, "res with error");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="box">
        <div className="container">
        <section className="min-vh-100 w-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="row justify-content-center  mx-5">
              <div
                className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center w-100"
                style={{
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "default",
                }}
              >
                <div
                  className="d-flex justify-content-center py-4"
                  style={{
                    pointerEvents: loading ? "none" : "all",
                  }}
                >
                  <h3>
                    <span className="d-none d-lg-block  border-bottom">
                      {edit ? "Edit" : reupload ? "Reupload Image" : "Latest"}{" "}
                      Blog Form
                    </span>
                  </h3>
                </div>
                <div
                  className="card mb-3 w-100"
                  style={{
                    pointerEvents: loading ? "none" : "all",
                  }}
                >
                  <div className="card-body py-4">
                    <form
                      className="row g-3 needs-validation w-100"
                      noValidate
                      onSubmit={
                        reupload
                          ? handleReupload
                          : edit
                          ? handleEdit
                          : handleSubmit
                      }
                    >
                      {!reupload && (
                        <div className="col-12">
                          <label htmlFor="blogtitle" className="form-label">
                            Blog Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            className={`form-control ${
                              errors.title ? "is-invalid" : ""
                            }`}
                            id="blogtitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                          {errors.title && (
                            <div className="invalid-feedback">
                              {errors.title}
                            </div>
                          )}
                        </div>
                      )}

                      {!edit && (
                        <>
                          <div className="col-12">
                            <label htmlFor="blogimage" className="form-label">
                              Image
                            </label>
                            <input
                              type="file"
                              name="image"
                              className={`form-control ${
                                errors.image ? "is-invalid" : ""
                              }`}
                              id="blogimage"
                              accept="image/*"
                              onChange={handleImageChange}
                              required
                            />
                            {errors.image && (
                              <div className="invalid-feedback">
                                {errors.image}
                              </div>
                            )}
                          </div>

                          {imagePreview && (
                            <div className="col-12 d-flex justify-content-center align-items-center flex-column w-25 h-25">
                              <img
                                src={imagePreview}
                                alt="Selected"
                                className="img-fluid w-100 h-100 border border-danger"
                              />
                              <button
                                className="bg-danger text-white p-2 mt-3"
                                onClick={() => {
                                  setImage(null);
                                  setImagePreview(null);
                                }}
                              >
                                cancel
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      {!reupload && (
                        <>
                          <div className="col-12">
                            <label
                              htmlFor="blogDescription"
                              className="form-label"
                            >
                              Description
                            </label>
                            <CKEditor
                              editor={ClassicEditor}
                              id="blogDescription"
                              config={{
                                toolbar: [
                                  "undo",
                                  "redo",
                                  "|",
                                  "heading",
                                  "|",
                                  "bold",
                                  "italic",
                                  "|",
                                  "link",
                                  "insertTable",
                                  "mediaEmbed",
                                  "|",
                                  "bulletedList",
                                  "numberedList",
                                  "indent",
                                  "outdent",
                                ],
                                plugins: [
                                  Bold,
                                  Essentials,
                                  Heading,
                                  Indent,
                                  IndentBlock,
                                  Italic,
                                  Link,
                                  List,
                                  MediaEmbed,
                                  Paragraph,
                                  Table,
                                  Undo,
                                ],
                              }}
                              data={description}
                              onReady={(editor) => {
                                editorRef.current = editor;
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                setDescription(data);
                              }}
                            />
                            {errors.description && (
                              <div className="invalid-feedback">
                                {errors.description}
                              </div>
                            )}
                          </div>

                          <div className="col-12">
                            <label
                              htmlFor="blogcategory"
                              className="form-label"
                            >
                              Category
                            </label>
                            {loading ? (
                              <div className="d-flex">
                                Please wait{" "}
                                <BeatLoader color="black" size={20} />
                              </div>
                            ) : addCategory ? (
                              <>
                                <input
                                  type="text"
                                  placeholder="Category Name"
                                  className={`form-control ${
                                    errors.image ? "is-invalid" : ""
                                  }`}
                                  value={newCategory}
                                  onChange={(e) =>
                                    setNewCategory(e.target.value)
                                  }
                                />
                                <button
                                  className={`btn btn-primary w-100 my-2 ${
                                    loading ? "wait" : ""
                                  }`}
                                  onClick={addCategoryHandler}
                                  disabled={loading}
                                >
                                  {loading ? "Adding" : "Add"}
                                </button>
                                <button
                                  className="btn btn-secondary w-100 my-2"
                                  onClick={() => setAddCategory(false)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <select
                                name="category"
                                className={`form-select ${
                                  errors.category ? "is-invalid" : ""
                                }`}
                                id="blogcategory"
                                value={selectedCategory}
                                onChange={(e) => {
                                  if (e.target.value === "add-new") {
                                    setAddCategory(true);
                                  } else {
                                    setSelectedCategory(e.target.value);
                                  }
                                }}
                                required
                              >
                                <option value="">Choose...</option>
                                {!loading && categories && categories.length ? (
                                  categories.map((x, i) => (
                                    <option value={x._id} key={i}>
                                      {x.title}
                                    </option>
                                  ))
                                ) : (
                                  <option value="" disabled>
                                    No categories
                                  </option>
                                )}
                                <option value="add-new">+ Add Category</option>
                              </select>
                            )}
                            {errors.category && (
                              <div className="invalid-feedback">
                                {errors.category}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      <div className="col-12">
                        <button
                          className={`btn btn-primary w-100`}
                          type="submit"
                          disabled={submitting}
                          style={{
                            cursor: submitting ? "wait" : "pointer",
                            position: "relative",
                          }}
                        >
                          {submitting ? (
                            <span className="d-flex justify-content-center align-items-center">
                              Please Wait{" "}
                              <ClipLoader
                                className="mx-4 "
                                color="white"
                                size={20}
                              />
                            </span>
                          ) : (
                            <span>
                              {" "}
                              {edit
                                ? "Submit Edit"
                                : reupload
                                ? "Reupload"
                                : "Create Blog"}
                            </span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Blog;
