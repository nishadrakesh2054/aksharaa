import React, { useState } from "react";
import { useEnquiryMutation } from "../api/hooks/useForms";

const Enquiryform = () => {
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const enquiryMutation = useEnquiryMutation();

  const [formData, setFormData] = useState({
    studentName: "",
    studentAge: "",
    studentGender: "",
    studentGrade: "",
    studentAddress: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    parentOccupation: "",
    parentAddress: "",
    transportation: "false",
    knowAboutUs: "Websites",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRes(null);
    setLoading(true);
    try {
      const payload = {
        ...formData,
        phone: formData.parentPhone,
        occupation: formData.parentOccupation,
        source: "Admission Procedure Inquiry",
      };
      const response = await enquiryMutation.mutateAsync(payload);
      setRes(response);
      if (response?.success) {
        setFormData({
          studentName: "",
          studentAge: "",
          studentGender: "",
          studentGrade: "",
          studentAddress: "",
          parentName: "",
          parentEmail: "",
          parentPhone: "",
          parentOccupation: "",
          parentAddress: "",
          transportation: "false",
          knowAboutUs: "Websites",
        });
      }
    } catch (err) {
      setRes({
        success: false,
        message: err.response?.data?.message || err.message || "Failed to submit inquiry",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100 p-0">
      <div className="row mb-3">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <img src="/akasharalogo.png" alt="logo" className="img-fluid" style={{ maxHeight: "60px" }} />
          <div className="p-0 d-flex flex-column inquiry-text small">
            <span><i className="fas fa-location me-1 text-success"></i>Kageshwori Manohara - 9, Kathmandu, Nepal</span>
            <span><i className="fas fa-phone me-1 text-success"></i>01-4993031/32/33</span>
            <span><i className="fas fa-envelope me-1 text-success"></i>info@aksharaaschool.edu.np</span>
          </div>
        </div>
      </div>

      <form className="px-0" onSubmit={handleSubmit}>
        {/* Student Details */}
        <div className="mb-3">
          <h6 className="form-head position-relative mt-3 mb-3 fw-bold text-white">
            Student Details : <span className="paralleogram"></span>
          </h6>
          <div className="row g-2">
            <div className="col-md-6 col-12">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-user"></i></span>
                <input
                  type="text"
                  className="form-control"
                  id="studentName"
                  placeholder="Student Name *"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-calendar-alt"></i></span>
                <input
                  type="number"
                  className="form-control"
                  id="studentAge"
                  placeholder="Student Age"
                  value={formData.studentAge}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-venus-mars"></i></span>
                <select
                  className="form-select"
                  id="studentGender"
                  value={formData.studentGender}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-graduation-cap"></i></span>
                <select
                  className="form-select"
                  id="studentGrade"
                  value={formData.studentGrade}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Grade</option>
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
            <div className="col-12">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-home"></i></span>
                <input
                  type="text"
                  className="form-control"
                  id="studentAddress"
                  placeholder="Residential Address"
                  value={formData.studentAddress}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Parent Particulars */}
        <div className="mb-3">
          <h6 className="form-head position-relative mt-3 mb-3 fw-bold text-white">
            Parent Particulars : <span className="paralleogram"></span>
          </h6>
          <div className="row g-2">
            <div className="col-md-6 col-12">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-user-tie"></i></span>
                <input
                  type="text"
                  className="form-control"
                  id="parentName"
                  placeholder="Parent Name *"
                  value={formData.parentName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                <input
                  type="email"
                  className="form-control"
                  id="parentEmail"
                  placeholder="Parent Email *"
                  value={formData.parentEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-phone"></i></span>
                <input
                  type="tel"
                  className="form-control"
                  id="parentPhone"
                  placeholder="Parent Phone *"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-briefcase"></i></span>
                <input
                  type="text"
                  className="form-control"
                  id="parentOccupation"
                  placeholder="Parent Occupation"
                  value={formData.parentOccupation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transportation & Source */}
        <div className="mb-3">
          <div className="row g-2 align-items-center">
            <div className="col-md-6 col-12">
              <div className="d-flex align-items-center gap-3 border p-2 rounded bg-light">
                <span className="small fw-semibold text-secondary">Transportation Required?</span>
                <div className="d-flex gap-3">
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="transportation"
                      id="transYes"
                      value="true"
                      checked={formData.transportation === "true"}
                      onChange={handleRadioChange}
                    />
                    <label className="form-check-label small" htmlFor="transYes">Yes</label>
                  </div>
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="transportation"
                      id="transNo"
                      value="false"
                      checked={formData.transportation === "false"}
                      onChange={handleRadioChange}
                    />
                    <label className="form-check-label small" htmlFor="transNo">No</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="input-group">
                <span className="input-group-text small">How did you hear about us?</span>
                <select
                  className="form-select"
                  id="knowAboutUs"
                  value={formData.knowAboutUs}
                  onChange={handleChange}
                >
                  <option value="Websites">Websites</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Friends or Suggest">Friends / Referral</option>
                  <option value="Self">Self</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {res && (
          <div
            className={`p-3 mb-3 rounded-3 shadow-sm d-flex align-items-center gap-3 border ${
              res.success ? "bg-success text-white" : "bg-danger text-white"
            }`}
          >
            <i className={res.success ? "fas fa-check-circle" : "fas fa-exclamation-triangle"}></i>
            <span className="small">{res.message || (res.success ? "Inquiry submitted successfully!" : "Failed to submit inquiry.")}</span>
          </div>
        )}

        <button
          type="submit"
          className="button-21 px-5 py-2"
          disabled={loading}
        >
          <i className="fas fa-paper-plane me-1"></i>
          {loading ? "Submitting..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
};

export default Enquiryform;
