import React from "react";
import { Link } from "react-router-dom";
import School2 from "../assets/School2.jpg";
import SectionHeader from "../components/SectionHeader";
import SEO from "../components/SEO";
import "../css/admissionPolicy.css";

const Admissionpolicy = () => {
  const priorityCriteria = [
    {
      icon: "fas fa-user-graduate",
      title: "Aksharaa Kindergarten Graduates",
    },
    {
      icon: "fas fa-users",
      title: "Siblings of Existing Students",
    },
    {
      icon: "fas fa-clock",
      title: "Students on Official Waiting List",
    },
    {
      icon: "fas fa-home",
      title: "Local Community & Foreign Returnees",
    },
  ];

  return (
    <>
      <SEO
        title="Admission Policy | Aksharaa School Kathmandu"
        description="Official admission policy, priority criteria, and guidelines for prospective students joining Aksharaa School."
      />

      {/* Full Width Hero Banner with Background Image & Overlay */}
      <div className="page-hero-banner">
        <img
          src={School2}
          alt="Admission Policy Banner"
          loading="eager"
        />
        <div className="page-hero-overlay">
          <span className="badge bg-success bg-opacity-75 text-white px-3 py-2 rounded-pill mb-2 font-monospace small">
            OFFICIAL POLICY & RULES
          </span>
          <h1 className="page-hero-title">Admission Policy</h1>

          {/* Glassmorphic Breadcrumbs Overlay */}
          <div className="page-hero-breadcrumbs">
            <Link to="/">Home</Link>
            <span className="sep"><i className="fas fa-chevron-right"></i></span>
            <span>Admission</span>
            <span className="sep"><i className="fas fa-chevron-right"></i></span>
            <span className="active-crumb">Admission Policy</span>
          </div>
        </div>
      </div>

      <section className="admission-policy-wrapper py-5">
        <div className="container mx-auto">
          {/* Section Header */}
          <SectionHeader
            badge="ADMISSION GUIDELINES"
            title="Admission Rules &"
            highlight="Policy"
          />

          {/* Policy Hero Philosophy Card */}
          <div className="policy-hero-card my-4">
            <h3>
              <i className="fas fa-balance-scale text-warning me-2"></i> Inclusive & Fair Admission Philosophy
            </h3>
            <p>
              Aksharaa School does not discriminate against students on the basis of nationality, ethnicity, race, caste, color, religion, cognitive ability, or physical disabilities. Our admission process is transparent, structured, and fair—considering parent-student learning attitudes, family background, and gender balance to nurture a diverse educational community.
            </p>
          </div>

          {/* Priority Categories */}
          <div className="my-5">
            <h4 className="fw-bold text-dark mb-4 text-center">
              <i className="fas fa-layer-group text-success me-2"></i> Admission Priority Categories
            </h4>

            <div className="row g-4">
              {priorityCriteria.map((item, index) => (
                <div className="col-lg-3 col-md-6 col-sm-12" key={index}>
                  <div className="priority-criteria-box">
                    <div className="priority-icon-badge">
                      <i className={item.icon}></i>
                    </div>
                    <h5 className="priority-criteria-text">{item.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="row g-4 my-4">
            <div className="col-lg-6 col-md-12">
              <div className="policy-feature-card">
                <h4>
                  <i className="fas fa-file-contract text-danger"></i> Documentation & Character Verification
                </h4>
                <p>
                  Priorities are extended to children of Nepalese citizens, foreign returnees, and international students. Transfer students must produce all required academic credentials, transfer certificates, and a document verifying good moral conduct during admission. Incomplete documentation will not be entertained.
                </p>
              </div>
            </div>

            <div className="col-lg-6 col-md-12">
              <div className="policy-feature-card">
                <h4>
                  <i className="fas fa-edit text-primary"></i> Assessment & Merit-Based Selection
                </h4>
                <p>
                  Each student seeking admission must participate in a written examination and an oral interview. Admission is granted based on the merit list, co-curricular involvement, and overall candidate performance. The school management reserves the final right of admission.
                </p>
              </div>
            </div>
          </div>

          {/* Apply Online CTA Banner */}
          <div className="policy-apply-cta">
            <div>
              <h4 className="fw-bold mb-1">Ready to Join Aksharaa School?</h4>
              <p className="mb-0 text-white-50">
                Submit your online application form early to secure your seat.
              </p>
            </div>
            <Link to="/apply-online" className="policy-cta-btn">
              <span>Apply Online Now</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Admissionpolicy;
