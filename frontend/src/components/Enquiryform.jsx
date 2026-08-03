import React from "react";

const Enquiryform = () => {
  return (
    <>
      <div className="container mx-auto mt-2 inq-form p-4">
       <h4 className="text-center bg-success text-white py-2  ">
          Enquiry Form
        </h4>
        <div className="row ">
        {/* <h4 className="text-center bg-success text-white py-2  ">
          Enquiry Form
        </h4> */}
          <div className="d-flex justify-content-center align-content-center flex-wrap gap-3">
            <img src="/akasharalogo.png" alt="logo"  className="img-fluid"/>
            <div className="mb-md-0 p-0 d-flex flex-column inquiry-text">
              <span><i className="fas fa-location me-1 text-success "></i>Kageshwori Manohara - 9, Kathmandu, Nepal</span>
              <span><i className="fas fa-phone me-1 text-success "></i>01-4993031/32/33 </span>
              <span><i className="fas fa-message me-1 text-success "></i>info@aksharaaschool.edu.np </span>
              <span><i className="fas fa-globe me-1 text-success "></i>www.aksharaaschool.edu.np</span>
            </div>
          </div>
        </div>

        <form className="px-4 ">
          {/* Student Details */}
          <div className="mb-1">
            <h6 className="form-head position-relative mt-4">
              Student Details : <span className="paralleogram"></span>
            </h6>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="input-group">
                  <span className="input-group-text ">
                    <i className="fas fa-user " />
                  </span>
                  <input
                    type="text"
                    className="form-control text-decoration-none rounded-end-2"
                    id="studentName"
                    placeholder="Student Name"
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-calendar-alt" />
                  </span>
                  <input
                    type="number"
                    className="form-control rounded-end-2"
                    id="studentAge"
                    placeholder="Student Age"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-venus-mars" />
                  </span>
                  <select className="form-select rounded-end-2" id="studentGender">
                    <option selected disabled>
                      Select Gender
                    </option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-graduation-cap" />
                  </span>
                  <select className="form-select rounded-end-2" id="studentGrade">
                    <option selected disabled>
                      Select Grade
                    </option>
                    <option>DayCare</option>
                    <option>Pre-ECD</option>
                    <option>ECD-1</option>
                    <option>ECD-2</option>
                    <option>ECD-3</option>
                    <option>Grade 1</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-home" />
                </span>
                <input
                  type="text"
                  className="form-control rounded-end-2"
                  id="studentAddress"
                  placeholder="Student Address"
                />
              </div>
            </div>
          </div>
          {/* Parent Details */}
          <div className="mb-3">
            <h6 className="form-head position-relative mt-4">
              Student Details : <span className="paralleogram"></span>
            </h6>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-user" />
                  </span>
                  <input
                    type="text"
                    className="form-control rounded-end-2"
                    id="parentName"
                    placeholder="Parent Name"
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-envelope" />
                  </span>
                  <input
                    type="email"
                    className="form-control rounded-end-2"
                    id="parentEmail"
                    placeholder="Parent Email"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-phone" />
                  </span>
                  <input
                    type="text"
                    className="form-control rounded-end-2"
                    id="parentPhone"
                    placeholder="Parent Phone"
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-briefcase" />
                  </span>
                  <input
                    type="text"
                    className="form-control rounded-end-2"
                    id="parentOccupation"
                    placeholder="Parent Occupation"
                  />
                </div>
              </div>
            </div>
            <div className="mb-1">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-home" />
                </span>
                <input
                  type="text"
                  className="form-control rounded-end-2"
                  id="parentAddress"
                  placeholder="Parent Address"
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="row">
              <div className="col-md-6 ">
                <div className="input-group d-flex align-items-center gap-3">
                  <span className="input-group-text ">
                    <i className="fas fa-bus p-1" />
                    Transportation
                  </span>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="transportationOptions"
                      id="transportationYes"
                      value="yes"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="transportationYes"
                    >
                      <i className="fas fa-bus" /> Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="transportationOptions"
                      id="transportationNo"
                      value="no"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="transportationNo"
                    >
                      <i className="fas fa-times-circle" /> No
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text text-wrap">
                    How do you come to know about us?
                  </span>
                  <select className="form-select rounded-end-2" id="studentGender">
                    <option selected disabled>
                      Websites
                    </option>
                    <option>Social Media </option>
                    <option>Websites</option>
                    <option>Facebook</option>
                    <option>Friends or Suggest</option>
                    <option>Self</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Transportation */}

          {/* Submit Button */}
          <button type="submit" className=" border-0 px-5 py-1 rounded-pill  text-white  submit-btn button-21">
            <i className="fas fa-paper-plane" /> Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Enquiryform;
