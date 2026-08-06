import React from "react";

const ErrorState = ({ message = "Unable to load content at the moment.", onRetry }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 px-3 text-center my-3 rounded-4 bg-light border">
    <div
      className="d-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger mb-3"
      style={{ width: "54px", height: "54px", fontSize: "1.5rem" }}
    >
      <i className="fas fa-exclamation-triangle"></i>
    </div>
    <h6 className="fw-bold text-dark mb-1">Content Loading Notice</h6>
    <p className="text-muted small mb-3" style={{ maxWidth: "400px" }}>
      {message}
    </p>
    <button
      className="btn btn-sm btn-success rounded-pill px-4 py-1.5 shadow-sm d-inline-flex align-items-center gap-2"
      onClick={() => onRetry ? onRetry() : window.location.reload()}
    >
      <i className="fas fa-sync-alt"></i> Refresh Data
    </button>
  </div>
);

export default ErrorState;
