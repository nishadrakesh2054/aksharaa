import React from "react";
import "../css/infrastucture.css";
import { useParams, Link } from "react-router-dom";
import { useInfrastructureItem } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";

const InfraDetails = () => {
  const { id } = useParams();
  const { data: infraItem, isLoading, error } = useInfrastructureItem(id);

  if (isLoading) return <LoadingState label="Loading infrastructure details..." />;
  if (error) return <ErrorState message={error.message} />;
  if (!infraItem) {
    return (
      <div className="container my-3 text-center">
        <h2>Infrastructure Not Found</h2>
        <p>Sorry, we couldn't find the infrastructure you're looking for.</p>
        <Link to="/infrastructure" className="btn btn-primary">
          Back to Infrastructure
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        {/* Title and Description Section */}
        <div className="col-lg-8 text-center">
          <h1 className="infra-details-title">{infraItem.title}</h1>
          <p className=" textcenter">{infraItem.description}</p>
        </div>
      </div>  

      {/* Image Gallery Section */}
      <div className="row my-4">
        {(infraItem.images || []).map((image, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-4">
            <img
              src={getFileUrl(image)}
              alt={`${infraItem.title} ${index + 1}`}
              className="img-fluid rounded infra-img"
              loading="lazy"
            />
          </div>
        ))}
        {(!infraItem.images || infraItem.images.length === 0) && (
          <div className="col-12 text-center">No photos found.</div>
        )}
      </div>

      {/* Back Button */}
      <div className="text-center">
        <Link to="/infrastructure">
          <button className="px-4 py-1 btn-outline-none bg-danger text-white border-0">
            Back to Infrastructure
          </button>
        </Link>
      </div>
    </div>
  );
};

export default InfraDetails;
