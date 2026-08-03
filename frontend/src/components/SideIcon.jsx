import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/sideicon.css";

const SideIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={widgetRef}
      className={`floating-widget-wrapper ${isOpen ? "open" : ""}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Invisible hover bridge covering the spiral menu radius */}
      <div className="hover-bridge"></div>

      {/* Spiral items menu */}
      <div className="spiral-container">
        {/* Item 1: Phone / Call (90 deg - straight up) */}
        <div className="spiral-item item-1">
          <a
            href="tel:+977014993031"
            className="spiral-btn call-btn"
            aria-label="Call Us"
          >
            <i className="fa-solid fa-phone"></i>
            <span className="spiral-label">Call Us</span>
          </a>
        </div>

        {/* Item 2: WhatsApp (120 deg - top-left arc) */}
        <div className="spiral-item item-2">
          <a
            href="https://wa.me/9779845892346"
            target="_blank"
            rel="noopener noreferrer"
            className="spiral-btn whatsapp-btn"
            aria-label="WhatsApp"
          >
            <i className="fa-brands fa-whatsapp"></i>
            <span className="spiral-label">WhatsApp</span>
          </a>
        </div>

        {/* Item 3: Email (150 deg - left-top arc) */}
        <div className="spiral-item item-3">
          <a
            href="mailto:info@aksharaaschool.edu.np?subject=Inquiry"
            className="spiral-btn email-btn"
            aria-label="Email Us"
          >
            <i className="fa-regular fa-envelope"></i>
            <span className="spiral-label">Email Us</span>
          </a>
        </div>

        {/* Item 4: Enquiry Form (180 deg - straight left) */}
        <div className="spiral-item item-4">
          <Link
            to="/getinquiry"
            className="spiral-btn inquiry-btn"
            aria-label="Get Enquiry"
          >
            <i className="fa-solid fa-clipboard-question"></i>
            <span className="spiral-label">Get Enquiry</span>
          </Link>
        </div>
      </div>

      {/* Main Floating Trigger Button */}
      <button
        className="main-widget-trigger"
        onClick={toggleOpen}
        aria-label="Quick Connect Options"
      >
        <div className="trigger-icon-wrapper">
          <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-headset"} main-icon`}></i>
        </div>
        <span className="pulse-ring ring-1"></span>
        <span className="pulse-ring ring-2"></span>
      </button>
    </div>
  );
};

export default SideIcon;
