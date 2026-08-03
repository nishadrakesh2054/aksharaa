import React from "react";

const ErrorState = ({ message = "Unable to load data.", onRetry }) => (
  <div className="text-center py-4 my-2">
    <p className="text-danger fw-semibold mb-2">{message}</p>
    {onRetry && (
      <button
        className="btn btn-sm btn-outline-primary rounded-pill px-3"
        onClick={onRetry}
      >
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
