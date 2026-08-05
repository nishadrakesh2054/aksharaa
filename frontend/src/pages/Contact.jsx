import React, { useRef, useState } from "react";
import { useContactMutation } from "../api/hooks/useForms";
import SectionHeader from "../components/SectionHeader";
import SEO from "../components/SEO";
import "../css/contactSection.css";

const Contact = ({ showSEO = true }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef();

  const [res, setRes] = useState(null);
  const contactMutation = useContactMutation();

  async function submitContactForm(e) {
    e.preventDefault();
    setRes(null);
    try {
      const response = await contactMutation.mutateAsync({ name, email, phone, message });
      setRes(response);
      if (response?.success) {
        if (formRef.current) formRef.current.reset();
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setRes({
        success: false,
        message: err?.response?.data?.message || err?.message || "Failed to send message. Please try again.",
      });
    }
  }

  return (
    <section className="contact-section-wrapper section-bg-alt py-5 my-2">
      {showSEO ? (
        <SEO
          title="Contact Us | Location, Phone & Inquiry"
          description="Get in touch with Aksharaa School in Kandaghari, Kageshwori 9, Kathmandu. Call +977-01-4993031 or email info@aksharaaschool.edu.np."
          keywords="Contact Aksharaa School, Aksharaa Location, Aksharaa Phone Number, Aksharaa Address Kathmandu"
        />
      ) : null}
      <div className="container mx-auto">
        <SectionHeader
          badge="GET IN TOUCH"
          title="Contact"
          highlight="Us"
        />

        {/* Equal Width/Height Top Info Cards */}
        <div className="row g-3 mb-4 justify-content-center">
          <div className="col-lg-4 col-md-4 col-12 d-flex">
            <div className="contact-info-card w-100">
              <div className="contact-icon-box">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <span className="contact-info-label">Email Us</span>
                <p className="contact-info-text">info@aksharaaschool.edu.np</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-4 col-12 d-flex">
            <div className="contact-info-card w-100">
              <div className="contact-icon-box">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div>
                <span className="contact-info-label">Call Us</span>
                <p className="contact-info-text">+977-01-4993031/32/33</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-4 col-12 d-flex">
            <div className="contact-info-card w-100">
              <div className="contact-icon-box">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <span className="contact-info-label">Location</span>
                <p className="contact-info-text">Kandaghari, Kageshwori 9, Kathmandu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Equal Width & Height Form and Map Grid */}
        <div className="row g-4 align-items-stretch">
          {/* Left Column: Form Card */}
          <div className="col-lg-6 col-md-12 d-flex">
            <div className="contact-form-card w-100">
              <h3 className="contact-form-title">Send Us a Message</h3>

              <form onSubmit={submitContactForm} ref={formRef} className="d-flex flex-column justify-content-between h-100">
                <div>
                  <div className="form-group mb-3">
                    <label htmlFor="name" className="contact-form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control contact-input-field"
                      id="name"
                      placeholder="Enter your full name"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="email" className="contact-form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control contact-input-field"
                      id="email"
                      placeholder="Enter your email address"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="number" className="contact-form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control contact-input-field"
                      id="number"
                      placeholder="Enter your phone number"
                      onChange={(e) => setPhone(e.target.value)}
                      value={phone}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="message" className="contact-form-label">
                      Message
                    </label>
                    <textarea
                      className="form-control contact-input-field"
                      id="message"
                      rows="4"
                      style={{ resize: "none" }}
                      placeholder="How can we help you?"
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      required
                    ></textarea>
                  </div>
                </div>

                <div>
                  {res && (
                    <div
                      className={`p-3 mb-3 rounded-3 shadow-sm d-flex align-items-center gap-3 border ${
                        res.success
                          ? "bg-success text-white border-success"
                          : "bg-danger text-white border-danger"
                      }`}
                      style={{ transition: "all 0.3s ease" }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                        style={{
                          width: "36px",
                          height: "36px",
                          background: "rgba(255, 255, 255, 0.25)",
                          fontSize: "1.1rem",
                        }}
                      >
                        <i className={res.success ? "fas fa-check" : "fas fa-times"}></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1 text-white" style={{ fontSize: "0.95rem" }}>
                          {res.success ? "Message Sent Successfully!" : "Submission Failed"}
                        </h6>
                        <p className="mb-0 text-white" style={{ fontSize: "0.85rem", opacity: 0.95 }}>
                          {res.message || (res.success ? "Thank you for contacting us. We will respond to your message shortly." : "Please check your details and try again.")}
                        </p>
                      </div>
                    </div>
                  )}


                  <button
                    type="submit"
                    className="contact-submit-btn mt-2"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Submitting..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Equal Height Map */}
          <div className="col-lg-6 col-md-12 d-flex">
            <div className="contact-map-wrapper w-100">
              <iframe
                title="Aksharaa School Location"
                src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d56528.98843456104!2d85.29982577525458!3d27.684485455816603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x39eb1a3058f08937%3A0x5e58e8a5ed6fa73b!2sM9X9%2B5C5%20Aksharaa%20School%2C%20Kageshwori%20Manohara%2044600!3m2!1d27.6973403!2d85.3670331!5e0!3m2!1sen!2snp!4v1715844547576!5m2!1sen!2snp"
                className="contact-map-iframe"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
