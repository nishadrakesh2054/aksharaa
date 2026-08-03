import React from "react";
import "./SectionHeader.css";

const SectionHeader = ({
  badge,
  title,
  highlight,
  center = true,
  className = "",
  light = false,
}) => {
  return (
    <div
      className={`section-header-container ${center ? "text-center" : "text-start"} ${className}`}
    >
      {badge && (
        <div className="section-badge-wrapper mb-2">
          <span className="section-badge-pill">{badge}</span>
        </div>
      )}

      <h2 className={`section-title-heading ${light ? "text-white" : "text-dark"}`}>
        {title}{" "}
        {highlight && <span className="section-title-gradient">{highlight}</span>}
      </h2>

      <div className={`section-divider-line ${center ? "mx-auto" : ""}`}>
        <span className="divider-center-dot"></span>
      </div>
    </div>
  );
};

export default SectionHeader;
