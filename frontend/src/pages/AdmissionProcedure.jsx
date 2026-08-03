import React from "react";
import { Link } from "react-router-dom";
import Enquiryform from "../components/Enquiryform";
import BreadImg from "../../src/assets/middle/GP4A8126.jpg";
import roadmap from "/roadmap.png";
import SectionHeader from "../components/SectionHeader";
import "../css/admissionPolicy.css";
import "../css/admissionProcedure.css";

const AdmissionProcedure = () => {
  const steps = [
    "Parents of prospective students are given a guided tour of the school campus.",
    "Parents file an application for admission in person or online via the website.",
    "Applications are evaluated, and parents are notified of test and interview dates.",
    "Students complete the written and oral test while the Admission Team interacts with parents.",
    "Acceptance is based on academic aptitude, socio-emotional development, and parent-school alignment.",
    "Within 3 days of testing/interview, parents receive confirmation via phone call.",
    "Within 7 days of confirmation, parents complete the registration process.",
  ];

  return (
    <>
      {/* Full Image Display */}
      <div className="w-100 mb-3">
        <img
          src={BreadImg}
          alt="Admission Procedure Banner"
          className="img-fluid w-100 h-auto"
        />
      </div>

      <section className="admission-proc-wrapper py-5">
        <div className="container mx-auto">
          {/* Section Header */}
          <SectionHeader
            badge="STEP-BY-STEP ADMISSION PROCESS"
            title="Admission"
            highlight="Procedure"
          />

          <div className="row g-4 mt-2 align-items-stretch">
            {/* Left Column: Numbered Steps Timeline */}
            <div className="col-lg-5 col-md-12 d-flex">
              <div className="procedure-steps-card w-100">
                <h4 className="fw-bold text-dark mb-4">
                  <i className="fas fa-list-ol text-success me-2"></i> Step-by-Step Guide
                </h4>

                <div className="d-flex flex-column">
                  {steps.map((stepText, index) => (
                    <div className="procedure-step-item" key={index}>
                      <span className="step-number-badge">{index + 1}</span>
                      <p className="step-text-content">{stepText}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Admission Enquiry Form */}
            <div className="col-lg-7 col-md-12 d-flex">
              <div className="procedure-form-card w-100">
                <h4 className="fw-bold text-dark mb-3">
                  <i className="fas fa-paper-plane text-danger me-2"></i> Admission Enquiry Form
                </h4>
                <p className="text-secondary small mb-4">
                  Fill out the form below and our admissions team will contact you shortly.
                </p>
                <Enquiryform />
              </div>
            </div>
          </div>

          {/* Admission Roadmap Section */}
          <div className="roadmap-card-box">
            <h4 className="fw-bold text-dark mb-3">
              <i className="fas fa-map-signs text-primary me-2"></i> Admission Roadmap & Flow
            </h4>
            <figure className="mb-0">
              <img src={roadmap} alt="Admission Roadmap" className="img-fluid" loading="lazy" />
            </figure>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdmissionProcedure;
