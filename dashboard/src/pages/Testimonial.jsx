import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const Testimonial = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [parentname, setParentname] = useState("");
  const [feedback, setFeedback] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null); // Add ref for file input

  const token = localStorage.getItem("token");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title) newErrors.title = "Please, enter the blog title!";
    if (!image) newErrors.image = "Please, choose an image!";
    if (!parentname) newErrors.parentname = "Please, enter the parent name!";
    if (!feedback) newErrors.feedback = "Please, enter the feedback!";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("parentname", parentname);
    formData.append("feedback", feedback);

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVERAPI
        }/api/v1/testimonial/createtestimonial`,
        formData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTitle("");
        setImage(null);
        setParentname("");
        setFeedback("");
        setImagePreview(null);
        setErrors({});
        fileInputRef.current.value = ""; // Reset the file input
      } else {
        toast.error(response.data.error);
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
    <div className="box">
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <h3 className="d-flex justify-content-center py-4">
                <span className="d-none d-lg-block border-bottom border-danger border-2">
                  Testimonial
                </span>
              </h3>
              <div className="card mb-3">
                <div className="card-body py-4">
                  <form
                    className="row g-3 needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    <div className="col-12">
                      <label htmlFor="maintitle" className="form-label">
                        Main Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        className={`form-control ${
                          errors.title ? "is-invalid" : ""
                        }`}
                        id="maintitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                      {errors.title && (
                        <div className="invalid-feedback">{errors.title}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label htmlFor="parentname" className="form-label">
                        Parent Name
                      </label>
                      <input
                        type="text"
                        name="parentname"
                        className={`form-control ${
                          errors.parentname ? "is-invalid" : ""
                        }`}
                        id="parentname"
                        value={parentname}
                        onChange={(e) => setParentname(e.target.value)}
                        required
                      />
                      {errors.parentname && (
                        <div className="invalid-feedback">
                          {errors.parentname}
                        </div>
                      )}
                    </div>

                    <div className="col-12">
                      <label htmlFor="testimonialimage" className="form-label">
                        Image
                      </label>
                      <input
                        type="file"
                        name="image"
                        className={`form-control ${
                          errors.image ? "is-invalid" : ""
                        }`}
                        id="testimonialimage"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        ref={fileInputRef} // Attach ref to file input
                      />
                      {errors.image && (
                        <div className="invalid-feedback">{errors.image}</div>
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
                      <label htmlFor="parentfeedback" className="form-label">
                        Feedback
                      </label>
                      <textarea
                        name="feedback"
                        className={`form-control ${
                          errors.feedback ? "is-invalid" : ""
                        }`}
                        id="parentfeedback"
                        rows="4"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                      ></textarea>
                      {errors.feedback && (
                        <div className="invalid-feedback">
                          {errors.feedback}
                        </div>
                      )}
                    </div>

                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit">
                        Post Testimonial
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
  );
};

export default Testimonial;
