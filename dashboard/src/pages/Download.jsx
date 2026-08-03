import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Downloads = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState(null); // To display the PDF name
  const [title, setTitle] = useState(""); // New state for title
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // To manage submit state
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfFileName(file.name); // Set the PDF file name for display
      setErrors((prev) => ({ ...prev, pdfFile: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        pdfFile: "Please select a valid PDF file!",
      }));
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      setErrors((prev) => ({ ...prev, pdfFile: "Please, choose a PDF file!" }));
      return;
    }
    if (!title) {
      setErrors((prev) => ({ ...prev, title: "Please enter a title!" }));
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", pdfFile);
    formData.append("title", title);

    try {
      setIsSubmitting(true); // Disable submit button
      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/uploadpdf`,
        formData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "PDF uploaded successfully!");
        setPdfFile(null);
        setPdfFileName(null);
        setTitle(""); // Clear title input
        fileInputRef.current.value = null;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      console.error(error);
    } finally {
      setIsSubmitting(false); // Re-enable submit button
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
                      PDF Upload
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
                        {/* Title Input */}
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

                        {/* PDF File Input */}
                        <div className="col-12">
                          <label htmlFor="pdfFile" className="form-label">
                            PDF File
                          </label>
                          <input
                            type="file"
                            name="pdfFile"
                            className={`form-control ${
                              errors.pdfFile ? "is-invalid" : ""
                            }`}
                            id="pdfFile"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            required
                            ref={fileInputRef}
                          />
                          {errors.pdfFile && (
                            <div className="invalid-feedback">
                              {errors.pdfFile}
                            </div>
                          )}
                        </div>

                        {/* Display PDF File Name */}
                        {pdfFileName && (
                          <div className="col-12">
                            <p className="text-muted">
                              Selected File: {pdfFileName}
                            </p>
                          </div>
                        )}

                        {/* Submit Button */}
                        <div className="col-12">
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                            disabled={isSubmitting} // Disable while submitting
                          >
                            {isSubmitting ? "Uploading..." : "Upload PDF"}
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

export default Downloads;
