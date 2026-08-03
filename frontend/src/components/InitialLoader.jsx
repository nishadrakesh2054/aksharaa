import React from "react";
import "../css/initialLoader.css";

const InitialLoader = ({ loading }) => {
  return (
    <div className={`initial-loader-overlay ${!loading ? "fade-out" : ""}`}>
      <div className="loader-content text-center">
        {/* Pulsing Logo with Rounded Spinner Ring */}
        <div className="logo-pulse-wrapper">
          <img
            src="/akasharalogo.png"
            alt="Aksharaa School Logo"
            className="loader-logo"
          />
          <div className="loader-spinner-ring"></div>
        </div>
      </div>
    </div>
  );
};

export default InitialLoader;
