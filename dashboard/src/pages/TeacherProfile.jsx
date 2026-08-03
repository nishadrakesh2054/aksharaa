import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TeacherProfile = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setErrors({ ...errors, image: "Please, choose an image!" });
      return;
    }
    if (!title) {
      setErrors({ ...errors, title: "Title is required" });
      return;
    }
    if (!position) {
      setErrors({ ...errors, position: "Position is required" });
      return;
    }

    const formData = new FormData();
    formData.append("profileimage", image);
    formData.append("title", title);
    formData.append("position", position);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/createprofile`,
        formData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setImage(null);
        setImagePreview(null);
        fileInputRef.current.value = null;
        setTitle("");
        setPosition("");
      } else {
        console.error("Form submission failed:", response.statusText);
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      console.error(error);
    }
  };

  return (
    <>
      <div className="box">
        <div className="container">
          <section className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                  <h3 className="d-flex justify-content-center py-4 ">
                    <span className="d-none d-lg-block border-bottom border-danger border-2">
                      Teacher Profile Upload
                    </span>
                  </h3>
                  <div className="card mb-3">
                    <div className="card-body py-4">
                      <form
                        className="row g-3 needs-validation"
                        noValidate
                        method="post"
                        onSubmit={handleSubmit}
                      >
                        <div className="col-12">
                          <label htmlFor="title" className="form-label">
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            className={`form-control ${
                              errors.title ? "is-invalid" : ""
                            }`}
                            id="title"
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

                        <div className="col-12">
                          <label htmlFor="position" className="form-label">
                            Position
                          </label>
                          <input
                            type="text"
                            name="position"
                            className={`form-control ${
                              errors.position ? "is-invalid" : ""
                            }`}
                            id="position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            required
                          />
                          {errors.position && (
                            <div className="invalid-feedback">
                              {errors.position}
                            </div>
                          )}
                        </div>

                        <div className="col-12">
                          <label htmlFor="profileimage" className="form-label">
                            Image
                          </label>
                          <input
                            type="file"
                            name="image"
                            className={`form-control ${
                              errors.image ? "is-invalid" : ""
                            }`}
                            id="profileimage"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            ref={fileInputRef}
                          />
                          {errors.image && (
                            <div className="invalid-feedback">
                              {errors.image}
                            </div>
                          )}
                        </div>

                        {imagePreview && (
                          <div className="col-12">
                            <img
                              src={imagePreview}
                              alt="Selected"
                              className="img-fluid"
                            />
                          </div>
                        )}

                        <div className="col-12">
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                          >
                            Upload Teacher Profile
                          </button>
                        </div>
                      </form>
                    </div>
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

export default TeacherProfile;
