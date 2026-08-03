import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Galleries = () => {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  // Handle change for title
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setErrors({ ...errors, title: "" });
  };

  // Handle change for images
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to an array
    if (selectedFiles.length) {
      setImages(selectedFiles);

      // Generate preview URLs for all selected images
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
      setErrors({ ...errors, images: "" });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title) {
      setErrors({ ...errors, title: "Please enter a title!" });
      return;
    }

    if (!images.length) {
      setErrors({ ...errors, images: "Please select at least one image!" });
      return;
    }

    const formData = new FormData();
    formData.append("title", title); // Append title
    images.forEach((image) => formData.append("galleries", image)); // Append multiple images

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/creategallery`,
        formData,
        {
          headers: { Authorization: token },
        }
      );
      console.log("response received", response);

      if (response.data.success) {
        toast.success(response.data.message);
        setTitle(""); // Reset title
        setImages([]);
        setImagePreviews([]);
        fileInputRef.current.value = null; // Reset the file input
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
                  <h3 className="d-flex justify-content-center py-4">
                    <span className="d-none d-lg-block border-bottom border-danger border-2">
                      Galleries Event Upload
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
                        {/* Title input */}
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
                            onChange={handleTitleChange}
                            required
                          />
                          {errors.title && (
                            <div className="invalid-feedback">
                              {errors.title}
                            </div>
                          )}
                        </div>

                        {/* Image input */}
                        <div className="col-12">
                          <label htmlFor="galleries" className="form-label">
                            Images
                          </label>
                          <input
                            type="file"
                            name="images"
                            className={`form-control ${
                              errors.images ? "is-invalid" : ""
                            }`}
                            id="galleries"
                            accept="image/*"
                            multiple // Allow multiple image selection
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            required
                          />
                          {errors.images && (
                            <div className="invalid-feedback">
                              {errors.images}
                            </div>
                          )}
                        </div>

                        {/* Preview of selected images */}
                        {imagePreviews.length > 0 && (
                          <div className="col-12">
                            <div className="row">
                              {imagePreviews.map((preview, index) => (
                                <div className="col-4 mb-3" key={index}>
                                  <img
                                    src={preview}
                                    alt={`Selected ${index}`}
                                    className="img-fluid border"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Submit button */}
                        <div className="col-12">
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                          >
                            Upload Images
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

export default Galleries;
