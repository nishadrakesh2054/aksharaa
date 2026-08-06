import React, { useState, useEffect } from "react";
import "../css/infrastucture.css";
import { useParams, Link } from "react-router-dom";
import { useInfrastructureItem } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import infrastructureData from "../Data/InfraData";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import SectionHeader from "../components/SectionHeader";
import SEO from "../components/SEO";

const InfraDetails = () => {
  const { id } = useParams();
  const { data: apiInfraItem, isLoading, error } = useInfrastructureItem(id);
  const [activeImageModal, setActiveImageModal] = useState(null);

  // Fallback to local static infrastructure dataset if API item is not found
  const staticItem = infrastructureData.find(
    (item) => String(item.id) === String(id) || String(item._id) === String(id)
  );
  const infraItem = apiInfraItem || staticItem;

  // Close lightbox modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveImageModal(null);
      }
    };
    if (activeImageModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageModal]);

  if (isLoading && !infraItem) return <LoadingState label="Loading facility details..." />;
  if (error && !infraItem) return <ErrorState message={error.message} />;

  if (!infraItem) {
    return (
      <div className="container my-5 text-center py-5">
        <div className="empty-infra-box p-5 border rounded-4 bg-light shadow-sm mx-auto" style={{ maxWidth: "550px" }}>
          <i className="fas fa-building text-secondary mb-3 display-4"></i>
          <h3 className="fw-bold text-dark">Facility Not Found</h3>
          <p className="text-secondary mb-4">
            Sorry, we couldn't find the infrastructure facility you are looking for.
          </p>
          <Link to="/infrastructure" className="btn btn-primary-custom px-4 py-2">
            <i className="fas fa-arrow-left me-2"></i> Back to Infrastructure
          </Link>
        </div>
      </div>
    );
  }

  const facilityImages = infraItem.images || [];

  return (
    <>
      <SEO
        title={`${infraItem.title} | Aksharaa School Infrastructure`}
        description={infraItem.description ? infraItem.description.substring(0, 160) : "Explore Aksharaa School modern facilities and infrastructure."}
      />

      <section className="infra-details-wrapper py-5">
        <div className="container mx-auto">
          {/* Top Breadcrumb & Back Navigation */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <div className="infra-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator"><i className="fas fa-chevron-right"></i></span>
              <Link to="/infrastructure" className="breadcrumb-link">Infrastructure</Link>
              <span className="breadcrumb-separator"><i className="fas fa-chevron-right"></i></span>
              <span className="breadcrumb-current">{infraItem.title}</span>
            </div>

            <Link to="/infrastructure" className="infra-back-btn">
              <i className="fas fa-arrow-left me-2"></i>
              <span>Back to Infrastructure</span>
            </Link>
          </div>

          {/* Section Header */}
          <SectionHeader
            badge="AKSHARAA FACILITIES"
            title="Infrastructure"
            highlight={infraItem.title}
          />

          {/* Detailed Overview Showcase Box */}
          <div className="infra-detail-card my-4">
            <div className="infra-card-header-bar">
              <div className="d-flex align-items-center gap-3">
                <div className="infra-detail-icon-badge">
                  <i className={infraItem.iconClass || "fas fa-building"}></i>
                </div>
                <div>
                  <h2 className="infra-detail-title">{infraItem.title}</h2>
                  <span className="infra-detail-subtitle">World-class Learning Facility</span>
                </div>
              </div>
            </div>

            <div className="infra-card-body-content">
              <p className="infra-detail-description">
                {infraItem.description}
              </p>

              {/* Highlights Feature Badges */}
              <div className="infra-highlights-wrapper mt-4">
                <span className="highlight-pill">
                  <i className="fas fa-check-circle text-success me-2"></i> Modern Infrastructure
                </span>
                <span className="highlight-pill">
                  <i className="fas fa-shield-alt text-primary me-2"></i> Safe & Hygienic
                </span>
                <span className="highlight-pill">
                  <i className="fas fa-user-graduate text-warning me-2"></i> Student-Centered
                </span>
                <span className="highlight-pill">
                  <i className="fas fa-sparkles text-danger me-2"></i> Experiential Learning
                </span>
              </div>
            </div>
          </div>

          {/* Image Gallery Showcase Section */}
          <div className="infra-gallery-section mt-5">
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                  <i className="fas fa-images text-danger"></i> Facility Photo Gallery
                </h3>
                <span className="text-secondary small">Click any photo to view full screen preview</span>
              </div>
              <span className="count-pill">{facilityImages.length} Photos</span>
            </div>

            <div className="row g-4">
              {facilityImages.map((image, index) => {
                const imgUrl = getFileUrl(image);
                return (
                  <div key={index} className="col-lg-4 col-md-6 col-12">
                    <div
                      className="infra-gallery-card"
                      onClick={() =>
                        setActiveImageModal({
                          src: imgUrl,
                          title: `${infraItem.title} - Photo ${index + 1}`,
                          caption: infraItem.title,
                        })
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setActiveImageModal({
                            src: imgUrl,
                            title: `${infraItem.title} - Photo ${index + 1}`,
                            caption: infraItem.title,
                          });
                        }
                      }}
                    >
                      <div className="infra-gallery-img-container">
                        <img
                          src={imgUrl}
                          alt={`${infraItem.title} ${index + 1}`}
                          className="infra-gallery-img"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/fallbackimage.avif";
                          }}
                        />
                        <div className="infra-gallery-overlay">
                          <div className="overlay-content">
                            <i className="fas fa-search-plus overlay-icon"></i>
                            <span className="overlay-text">Click for full view</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {facilityImages.length === 0 && (
                <div className="col-12 text-center py-5">
                  <div className="p-4 border rounded-3 bg-light text-secondary">
                    <i className="fas fa-image fa-2x mb-2 d-block"></i>
                    No photos available for this facility yet.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Full-Screen Modal Preview */}
      {activeImageModal && (
        <div
          className="infra-modal-overlay"
          onClick={() => setActiveImageModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="infra-modal-title"
        >
          <div
            className="infra-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="infra-modal-header">
              <h5 id="infra-modal-title" className="infra-modal-title">
                {activeImageModal.title}
              </h5>
              <button
                type="button"
                className="infra-modal-close"
                onClick={() => setActiveImageModal(null)}
                title="Close modal"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="infra-modal-body">
              <img
                src={activeImageModal.src}
                alt={activeImageModal.title}
                className="infra-modal-img"
                onError={(e) => {
                  e.currentTarget.src = "/fallbackimage.avif";
                }}
              />
            </div>

            <div className="infra-modal-footer">
              <a
                href={activeImageModal.src}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-secondary"
              >
                <i className="fas fa-external-link-alt me-1"></i> Open Original
              </a>
              <button
                type="button"
                className="btn btn-sm btn-primary-custom"
                onClick={() => setActiveImageModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfraDetails;
