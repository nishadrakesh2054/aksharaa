import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container text-center py-5 my-5">
          <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "500px", borderRadius: "12px" }}>
            <div className="mb-3 text-danger">
              <i className="fa-solid fa-triangle-exclamation fa-3x mb-2"></i>
              <h4 className="fw-bold">Something went wrong</h4>
            </div>
            <p className="text-muted">
              {this.state.error?.message || "An unexpected error occurred while loading this page."}
            </p>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button
                className="btn btn-primary px-4 rounded-pill"
                onClick={this.handleRetry}
              >
                Reload Page
              </button>
              <a href="/" className="btn btn-outline-secondary px-4 rounded-pill">
                Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
