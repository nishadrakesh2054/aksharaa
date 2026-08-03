import React, { useState } from "react";
import { Link } from "react-router-dom";
import footerLogo from "../assets/Aksharaa School Logo_white.png";
import { useSubscribeMutation } from "../api/hooks/useForms";
import "../css/footerSection.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState({ message: "", success: null });
  const subscribeMutation = useSubscribeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFeedback({
        message: "Please enter a valid email address.",
        success: false,
      });
      return;
    }

    try {
      const response = await subscribeMutation.mutateAsync({ email });

      if (response.success) {
        setFeedback({ message: "Thank you for subscribing!", success: true });
        setEmail("");
      } else {
        setFeedback({
          message: response.message || "Subscription failed.",
          success: false,
        });
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setFeedback({
        message: "Subscription failed. Please try again later.",
        success: false,
      });
    }
  };

  return (
    <footer className="footer">
      <div className="container py-5">
        <div className="row g-4">
          {/* Column 1: Logo & Contact Info */}
          <div className="col-lg-4 col-md-6 col-12">
            <div className="footer-logo-wrapper mb-3">
              <Link to="/">
                <img
                  src={footerLogo}
                  loading="lazy"
                  alt="Aksharaa School Logo"
                  className="img-fluid"
                />
              </Link>
            </div>
            <p className="footer-tag mb-4">
              Aksharaa School provides value-based education infused with academic excellence, leadership skills, and emotional intelligence.
            </p>

            <div className="address-wrapper">
              <div className="d-flex align-items-center mb-2">
                <span className="footer-icon-badge me-3">
                  <i className="fa fa-location-arrow"></i>
                </span>
                <span className="footer-tag">Kandaghari, Kageshwori Manohara 9, Kathmandu</span>
              </div>

              <div className="d-flex align-items-center mb-2">
                <span className="footer-icon-badge me-3">
                  <i className="fa fa-phone"></i>
                </span>
                <Link to="tel:+977014993031" className="footer-tag text-decoration-none">
                  +977-01-4993031 / 32 / 33
                </Link>
              </div>

              <div className="d-flex align-items-center mb-3">
                <span className="footer-icon-badge me-3">
                  <i className="fa fa-envelope"></i>
                </span>
                <Link to="mailto:info@aksharaaschool.edu.np" className="footer-tag text-decoration-none">
                  info@aksharaaschool.edu.np
                </Link>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="d-flex align-items-center gap-2 mt-4">
              <a
                href="https://www.facebook.com/AksharaaSchool/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-pill"
                title="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.youtube.com/@aksharaaschool6713"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-pill"
                title="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href="https://www.instagram.com/aksharaa_school_/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-pill"
                title="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="col-lg-2 col-md-6 col-12 ms-lg-auto">
            <h4 className="footer-widget-title">Quick Links</h4>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="footer-tag text-decoration-none">
                  <i className="fa fa-angle-right me-2 text-success"></i>About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about/lrpa" className="footer-tag text-decoration-none">
                  <i className="fa fa-angle-right me-2 text-success"></i>Philosophy
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/academics" className="footer-tag text-decoration-none">
                  <i className="fa fa-angle-right me-2 text-success"></i>Academics
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/admission/procedure" className="footer-tag text-decoration-none">
                  <i className="fa fa-angle-right me-2 text-success"></i>Admission
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/apply-online" className="footer-tag text-decoration-none">
                  <i className="fa fa-angle-right me-2 text-success"></i>Apply Online
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="footer-tag text-decoration-none">
                  <i className="fa fa-angle-right me-2 text-success"></i>Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="col-lg-3 col-md-6 col-12">
            <h4 className="footer-widget-title">Newsletter</h4>
            <p className="footer-tag mb-3">
              Subscribe to stay updated on Aksharaa School's latest news, events, and notices.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <div className="input-group">
                  <span className="input-group-text bg-white border-0 text-success">
                    <i className="fa fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-0 py-2"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="footer-subscribe-btn mt-2"
              >
                <span>{subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}</span>
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
            {feedback.message && (
              <div
                className={`footer-newsletter-alert ${
                  feedback.success ? "footer-newsletter-alert-success" : "footer-newsletter-alert-error"
                }`}
              >
                <i className={feedback.success ? "fas fa-check-circle" : "fas fa-exclamation-triangle"}></i>
                <span>{feedback.message}</span>
              </div>
            )}

          </div>

          {/* Column 4: Sister Organization */}
          <div className="col-lg-3 col-md-6 col-12">
            <h4 className="footer-widget-title">Sister Organization</h4>
            <div className="sister-org-card">
              <img
                src="/sisremove.png"
                alt="Sister Organization"
                className="img-fluid"
                loading="lazy"
              />
              <h6>Jawalakhel, Lalitpur, Nepal</h6>
              <small className="text-secondary">01-5426371</small>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar text-center">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-0">
            © {new Date().getFullYear()} Aksharaa School. All Rights Reserved.
          </p>
          <div className="mt-2 mt-md-0">
            <Link to="/about" className="me-3">Privacy Policy</Link>
            <Link to="/contact">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
