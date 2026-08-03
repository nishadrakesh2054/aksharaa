import React from 'react';
import { Link } from 'react-router-dom'; 

const Error = () => {
  return (
    <div className="error-page d-flex flex-column align-items-center justify-content-center text-center      " style={{ height: '90vh', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ fontSize: '6rem', color: '#ff6b6b' }}>404</h1>
      <h2 style={{ fontSize: '2.5rem', margin: '20px 0', color: '#343a40' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.25rem', color: '#6c757d' }}>
        Oops! The page you are looking for doesn't exist.
      </p>
      <Link to="/" className="mb-btn mt-4">
        Go Back Home
      </Link>
    </div>
  );
};

export default Error;
