import React, { useState } from "react";
import { useEnquiryMutation } from "../api/hooks/useForms";

const initialFormState = {
  studentName: "",
  studentNameNepali: "",
  nationality: "Nepali",
  studentGender: "male",
  birthPlace: "",
  dobNepali: "",
  dobEnglish: "",
  residentialAddress: "",
  resCity: "",
  resLandmark: "",
  resProvince: "",
  permanentAddress: "",
  permCity: "",
  permLandmark: "",
  permProvince: "",

  // Father Particulars
  fatherName: "",
  fatherNameNepali: "",
  fatherPhone: "",
  fatherEmail: "",
  fatherOccupation: "",

  // Mother Particulars
  motherName: "",
  motherNameNepali: "",
  motherPhone: "",
  motherEmail: "",
  motherOccupation: "",

  // Guardian Particulars
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  guardianOccupation: "",

  // Academic Info
  previousSchool: "",
  previousGrade: "",
  previousGPA: "",
  studentGrade: "Grade 1",
  transportation: "false",
  knowAboutUs: "Websites",

  // Terms
  termsAccepted: false,
};

const OnlineForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [files, setFiles] = useState({
    studentPhoto: null,
    birthCertificate: null,
    fatherPhoto: null,
    motherPhoto: null,
    guardianPhoto: null,
    previousMarksheet: null,
    transferCertificate: null,
    citizenshipDoc: null,
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const enquiryMutation = useEnquiryMutation();

  const handleInputChange = (e) => {
    const { name, id, value, type, checked } = e.target;
    const key = name || id;
    setFormData((prev) => ({
      ...prev,
      [key]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, id, files: selectedFiles } = e.target;
    const key = name || id;
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({
        ...prev,
        [key]: selectedFiles[0],
      }));
    }
  };

  const handleRemoveFile = (e, fieldKey) => {
    e.preventDefault();
    e.stopPropagation();
    setFiles((prev) => ({
      ...prev,
      [fieldKey]: null,
    }));
  };

  const renderFileBox = (label, fieldKey, accept = "image/*") => {
    const file = files[fieldKey];
    return (
      <div className="file-input-wrapper mb-3 d-flex align-items-center justify-content-between border p-3 rounded bg-light shadow-sm">
        {/* Left Side: Field Label and Choose File Button */}
        <div className="d-flex flex-column gap-1 me-2 overflow-hidden">
          <span className="fw-bold text-dark small mb-1">{label}</span>
          <label
            htmlFor={fieldKey}
            className="btn btn-sm btn-outline-success px-3"
            style={{ width: "fit-content", cursor: "pointer" }}
          >
            <i className="fas fa-upload me-1"></i> Choose File
          </label>
          <input
            className="d-none"
            type="file"
            id={fieldKey}
            name={fieldKey}
            accept={accept}
            onChange={handleFileChange}
          />
          {file ? (
            <small className="text-success fw-semibold text-truncate d-block" style={{ maxWidth: "200px" }}>
              <i className="fas fa-check-circle me-1"></i> {file.name}
            </small>
          ) : (
            <small className="text-muted d-block">No file chosen</small>
          )}
        </div>

        {/* Right Side: Selected Photo Preview Box with Fully Visible Red Cross Icon */}
        <div
          className="file-preview rounded border shadow-sm flex-shrink-0 position-relative"
          style={{ width: "110px", height: "100px", background: "#ffffff", overflow: "visible" }}
        >
          {file && (
            <i
              className="fas fa-times-circle position-absolute text-danger"
              style={{
                top: "-8px",
                right: "-8px",
                fontSize: "20px",
                background: "#ffffff",
                borderRadius: "50%",
                zIndex: 30,
                cursor: "pointer",
              }}
              title="Remove photo"
              onClick={(e) => handleRemoveFile(e, fieldKey)}
            ></i>
          )}

          <label
            htmlFor={fieldKey}
            className="m-0 text-center w-100 h-100 d-flex flex-column align-items-center justify-content-center p-1 rounded overflow-hidden"
            style={{ cursor: "pointer" }}
          >
            {file ? (
              file.type && file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Selected Photo Preview"
                  className="img-fluid h-100 w-100 rounded"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="text-success small fw-bold text-center">
                  <i className="fas fa-file-pdf fa-2x text-danger d-block mb-1"></i>
                  PDF Document
                </div>
              )
            ) : (
              <span className="text-secondary small text-muted">Preview</span>
            )}
          </label>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!formData.termsAccepted) {
      setStatusMsg({
        type: "danger",
        text: "Please check the checkbox to confirm eligibility before submitting.",
      });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("studentName", formData.studentName);
      data.append("studentNameNepali", formData.studentNameNepali);
      data.append("nationality", formData.nationality);
      data.append("studentGender", formData.studentGender);
      data.append("dob", formData.dobEnglish || formData.dobNepali);
      data.append("studentGrade", formData.studentGrade);

      const resAddr = formData.residentialAddress
        ? `${formData.residentialAddress}, ${formData.resCity} (${formData.resProvince})`
        : formData.resCity || "Kathmandu";
      data.append("studentAddress", resAddr);

      const pName = formData.fatherName || formData.motherName || formData.guardianName || "Parent";
      const pEmail = formData.fatherEmail || formData.motherEmail || formData.guardianEmail || "info@aksharaaschool.edu.np";
      const pPhone = formData.fatherPhone || formData.motherPhone || formData.guardianPhone || "0000000000";

      data.append("parentName", pName);
      data.append("parentEmail", pEmail);
      data.append("phone", pPhone);

      data.append("fatherName", formData.fatherName);
      data.append("fatherPhone", formData.fatherPhone);
      data.append("motherName", formData.motherName);
      data.append("motherPhone", formData.motherPhone);
      data.append("guardianName", formData.guardianName);
      data.append("occupation", formData.fatherOccupation || formData.motherOccupation || "N/A");
      data.append("parentAddress", formData.permanentAddress || resAddr);

      data.append("previousSchool", formData.previousSchool);
      data.append("previousGrade", formData.previousGrade);
      data.append("previousGPA", formData.previousGPA);
      data.append("transportation", formData.transportation);
      data.append("source", "Online Admission Application");

      // Attach Files
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          data.append(key, files[key]);
        }
      });

      const response = await enquiryMutation.mutateAsync(data);

      if (response?.success) {
        setStatusMsg({
          type: "success",
          text: "Your application has been submitted successfully!",
        });
        setFormData(initialFormState);
        setFiles({
          studentPhoto: null,
          birthCertificate: null,
          fatherPhoto: null,
          motherPhoto: null,
          guardianPhoto: null,
          previousMarksheet: null,
          transferCertificate: null,
          citizenshipDoc: null,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStatusMsg({
          type: "danger",
          text: response?.message || "Failed to submit application.",
        });
      }
    } catch (err) {
      console.error("Online form error:", err);
      setStatusMsg({
        type: "danger",
        text: err?.response?.data?.message || err?.message || "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-wrapper py-4 py-md-5">
      <div className="container mx-auto px-2 px-sm-3">
        <div className="inq-form inq-form-card shadow-sm rounded-4 bg-white border">
          <div className="row mb-4">
            <div className="d-flex justify-content-center align-content-center flex-wrap gap-3">
          <img src="/akasharalogo.png" alt="logo" className="img-fluid" />
          <div className="mb-md-0 p-0 d-flex flex-column inquiry-text">
            <span>
              <i className="fas fa-location me-1 text-success"></i>Kageshwori Manohara - 9, Kathmandu, Nepal
            </span>
            <span>
              <i className="fas fa-phone me-1 text-success"></i>01-4993031/32/33
            </span>
            <span>
              <i className="fas fa-message me-1 text-success"></i>info@aksharaaschool.edu.np
            </span>
            <span>
              <i className="fas fa-globe me-1 text-success"></i>www.aksharaaschool.edu.np
            </span>
          </div>
        </div>
      </div>

      {/* Loading Backdrop Overlay when uploading files & submitting form */}
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            transition: "all 0.3s ease",
          }}
        >
          <div
            className="bg-white p-4 rounded-4 shadow-lg text-center"
            style={{ maxWidth: "420px", width: "90%" }}
          >
            <div
              className="spinner-border text-success mb-3"
              style={{ width: "3.5rem", height: "3.5rem", borderWidth: "4px" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="fw-bold text-dark mb-2">Submitting Application</h5>
            <p className="text-muted small mb-0">
              Uploading documents and submitting admission form. Please wait a moment...
            </p>
          </div>
        </div>
      )}

      {statusMsg && (
        <div
          className={`p-3 my-3 rounded-3 shadow-sm d-flex align-items-center gap-3 border ${
            statusMsg.type === "success"
              ? "bg-success text-white border-success"
              : "bg-danger text-white border-danger"
          }`}
          style={{ transition: "all 0.3s ease" }}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
              width: "42px",
              height: "42px",
              background: "rgba(255, 255, 255, 0.25)",
              fontSize: "1.25rem",
            }}
          >
            <i
              className={
                statusMsg.type === "success"
                  ? "fas fa-check-circle"
                  : "fas fa-exclamation-triangle"
              }
            ></i>
          </div>
          <div className="flex-grow-1">
            <h6 className="fw-bold mb-1 text-white" style={{ fontSize: "1rem" }}>
              {statusMsg.type === "success"
                ? "Application Submitted Successfully!"
                : "Submission Error"}
            </h6>
            <p className="mb-0 text-white" style={{ fontSize: "0.88rem", opacity: 0.95 }}>
              {statusMsg.text}
            </p>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setStatusMsg(null)}
          ></button>
        </div>
      )}

      <form className="px-0 border-0" onSubmit={handleSubmit}>
        {/* Student Details */}
        <div className="mb-1">
          <h6 className="form-head position-relative mt-4 text-white">
            Student Details : <span className="paralleogram"></span>
          </h6>

          <div className="row">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-user me-1 text-success"></i> Name
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="studentName"
                  id="studentName"
                  placeholder="Student Name"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-language me-1 text-success"></i> Name in Nepali
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="studentNameNepali"
                  placeholder="Student Name"
                  value={formData.studentNameNepali}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-flag me-1 text-success"></i> Nationality
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="nationality"
                  placeholder="Student Nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group d-flex align-items-center gap-3">
                <span className="input-group-text">
                  <i className="fas fa-venus-mars me-1 text-success"></i> Gender
                </span>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="studentGender"
                    id="genderMale"
                    value="male"
                    checked={formData.studentGender === "male"}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="genderMale">
                    <i className="fas fa-male me-1" /> Male
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="studentGender"
                    id="genderFemale"
                    value="female"
                    checked={formData.studentGender === "female"}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="genderFemale">
                    <i className="fas fa-female me-1" /> Female
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-map-marker-alt me-1 text-success"></i> Birth Place
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="birthPlace"
                  placeholder="Birth Place"
                  value={formData.birthPlace}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-calendar-alt me-1 text-success"></i> Date of Birth
                </span>
                <input
                  type="date"
                  className="form-control text-decoration-none rounded-0 ms-2"
                  name="dobNepali"
                  placeholder="in Nepali"
                  value={formData.dobNepali}
                  onChange={handleInputChange}
                />
                <input
                  type="date"
                  className="form-control text-decoration-none rounded-0 ms-2"
                  name="dobEnglish"
                  placeholder="in English"
                  value={formData.dobEnglish}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Temporary address */}
          <div className="row mt-4">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-home me-1 text-success"></i> Residencial Address
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="residentialAddress"
                  placeholder="Residencial Address"
                  value={formData.residentialAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-city me-1 text-success"></i> Town/City
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="resCity"
                  placeholder="Town/City"
                  value={formData.resCity}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-building me-1 text-success"></i> Landmark
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="resLandmark"
                  placeholder="Landmark"
                  value={formData.resLandmark}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-map me-1 text-success"></i> Province
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="resProvince"
                  placeholder="Province"
                  value={formData.resProvince}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Permanent address */}
          <div className="row mt-4">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-home me-1 text-success"></i> Parmanent Address
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="permanentAddress"
                  placeholder="Parmanent Address"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-city me-1 text-success"></i> Town/City
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="permCity"
                  placeholder="Town/City"
                  value={formData.permCity}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-building me-1 text-success"></i> Landmark
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="permLandmark"
                  placeholder="Landmark"
                  value={formData.permLandmark}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-map me-1 text-success"></i> Province
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="permProvince"
                  placeholder="Province"
                  value={formData.permProvince}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Parent Details */}
        <div className="mb-3">
          <h6 className="form-head position-relative mt-4 text-white">
            PARTICULARS OF PARENTS/GUARDIAN <span className="paralleogram"></span>
          </h6>

          {/* Father details */}
          <h6 className="form-head position-relative mt-4 text-white">
            Father Details : <span className="paralleogram"></span>
          </h6>
          <div className="row">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-user-tie me-1 text-success"></i> Name
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="fatherName"
                  placeholder="Father's Name"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-phone me-1 text-success"></i> Mobile Phone
                </span>
                <input
                  type="tel"
                  className="form-control text-decoration-none rounded-0"
                  name="fatherPhone"
                  placeholder="Father's Phone Number"
                  value={formData.fatherPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-envelope me-1 text-success"></i> Email
                </span>
                <input
                  type="email"
                  className="form-control text-decoration-none rounded-0"
                  name="fatherEmail"
                  placeholder="Father's Email"
                  value={formData.fatherEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-briefcase me-1 text-success"></i> Occupation
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="fatherOccupation"
                  placeholder="Father's Occupation"
                  value={formData.fatherOccupation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Mother details */}
          <h6 className="form-head position-relative mt-4 text-white">
            Mother Details : <span className="paralleogram"></span>
          </h6>
          <div className="row">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-female me-1 text-success"></i> Name
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="motherName"
                  placeholder="Mother's Name"
                  value={formData.motherName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-phone me-1 text-success"></i> Mobile Phone
                </span>
                <input
                  type="tel"
                  className="form-control text-decoration-none rounded-0"
                  name="motherPhone"
                  placeholder="Mother's Phone Number"
                  value={formData.motherPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-envelope me-1 text-success"></i> Email
                </span>
                <input
                  type="email"
                  className="form-control text-decoration-none rounded-0"
                  name="motherEmail"
                  placeholder="Mother's Email"
                  value={formData.motherEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-briefcase me-1 text-success"></i> Occupation
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="motherOccupation"
                  placeholder="Mother's Occupation"
                  value={formData.motherOccupation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grade selection */}
        <div className="mb-3">
          <h6 className="form-head position-relative mt-4 text-white">
            Academic Information : <span className="paralleogram"></span>
          </h6>
          <div className="row">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-graduation-cap me-1 text-success"></i> Grade Applying For
                </span>
                <select
                  className="form-select rounded-0"
                  name="studentGrade"
                  value={formData.studentGrade}
                  onChange={handleInputChange}
                  required
                >
                  <option value="DayCare">DayCare</option>
                  <option value="Pre-ECD">Pre-ECD</option>
                  <option value="ECD-1">ECD-1</option>
                  <option value="ECD-2">ECD-2</option>
                  <option value="ECD-3">ECD-3</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                </select>
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-school me-1 text-success"></i> Previous School
                </span>
                <input
                  type="text"
                  className="form-control text-decoration-none rounded-0"
                  name="previousSchool"
                  placeholder="Previous School Name"
                  value={formData.previousSchool}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Document Uploads (Label & Upload on Left, Image Preview Box on Right with Clean Red Cross) */}
        <div className="mb-4">
          <h6 className="form-head position-relative mt-4 text-white">
            Document Uploads : <span className="paralleogram"></span>
          </h6>

          <div className="row">
            <div className="col-md-6">
              {renderFileBox("Student Photo", "studentPhoto")}
            </div>
            <div className="col-md-6">
              {renderFileBox("Birth Certificate", "birthCertificate", "image/*,.pdf")}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              {renderFileBox("Parent's Citizenship Photocopy", "citizenshipDoc", "image/*,.pdf")}
            </div>
            <div className="col-md-6">
              {renderFileBox("Previous Marksheet", "previousMarksheet", "image/*,.pdf")}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              {renderFileBox("Father's Photo", "fatherPhoto")}
            </div>
            <div className="col-md-6">
              {renderFileBox("Mother's Photo", "motherPhoto")}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              {renderFileBox("Guardian's Photo", "guardianPhoto")}
            </div>
          </div>
        </div>

        {/* Checkbox confirmation */}
        <div className="py-4">
          <input
            type="checkbox"
            name="termsAccepted"
            id="termsCheck"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
          />
          <span className="ps-2 text-success">
            {" "}
            By checking the checkbox you have confirmed the eligibility
            criteria to apply and you are ready for further application
            process.
          </span>
        </div>

        {/* Submit Button */}
        <div className="pb-4">
          <button
            type="submit"
            className="button-21 px-5 d-inline-flex align-items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-1" />
                <span>Apply Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
  );
};

export default OnlineForm;
