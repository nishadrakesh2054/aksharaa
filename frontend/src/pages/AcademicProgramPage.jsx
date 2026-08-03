import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useAcademic } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import EmptyState from "../components/states/EmptyState";
import SectionHeader from "../components/SectionHeader";
import "../css/academicPage.css";

const responsive = {
  0: { items: 1 },
  768: { items: 2 },
  1024: { items: 2 },
};

const AcademicProgramPage = ({ category }) => {
  const { data: academic, isLoading, error } = useAcademic(category);

  if (isLoading) return <LoadingState label="Loading academic program..." />;
  if (error) return <ErrorState message={error.message} />;
  if (!academic) return <EmptyState message="No academic program found." />;

  const sliderImages = academic.sliderImages?.length
    ? academic.sliderImages
    : ["/fallbackimage.avif"];
  const gridImages = academic.gridImages || [];

  const items = sliderImages.map((image, index) => (
    <div className="px-1" key={`${image}-${index}`}>
      <div className="academic-slider-card">
        <img
          src={getFileUrl(image)}
          alt={`${academic.title || "Academic program"} ${index + 1}`}
          loading="lazy"
        />
      </div>
    </div>
  ));

  return (
    <section className="academic-section-wrapper py-0 pb-5">
      {/* Full Width Top Hero Banner Slider */}
      <div className="container-fluid px-0 mb-5">
        <AliceCarousel
          mouseTracking
          items={items}
          autoPlay={true}
          infinite={true}
          responsive={responsive}
          controlsStrategy="alternate"
          animationDuration={3000}
          disableButtonsControls={true}
          disableDotsControls={true}
        />
      </div>

      <div className="container mx-auto">
        {/* Section Header */}
        <SectionHeader
          badge="ACADEMIC EXCELLENCE"
          title={academic.title || "Academic Program"}
          highlight={academic.gradeRange || ""}
        />

        {/* Content Section */}
        <div className="row g-4 my-4 align-items-stretch">
          {/* Left Column: Overview Description & Side Image */}
          <div className="col-lg-6 col-12 d-flex flex-column">
            <div className="academic-desc-card">
              <h4 className="fw-bold text-dark mb-3">
                <i className="fas fa-graduation-cap text-success me-2"></i> Program Overview
              </h4>
              <p>{academic.description || "No description found."}</p>
            </div>

            {academic.sideImage && (
              <div className="mt-auto">
                <img
                  src={getFileUrl(academic.sideImage)}
                  alt={academic.title || "Academic program"}
                  className="academic-side-img"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Right Column: Learning Centers, Co-Curricular & Approach */}
          <div className="col-lg-6 col-12">
            {/* Learning Centers */}
            <div className="academic-feature-box">
              <h4 className="academic-feature-title">
                <i className="fas fa-shapes text-success"></i>
                <span>{academic.learningCentersTitle || "Learning Centers"}</span>
              </h4>

              {academic.learningCenters?.length ? (
                <div className="academic-compact-grid">
                  {academic.learningCenters.map((item, index) => (
                    <span className="academic-pill-tag" key={`${item}-${index}`}>
                      <i className="fas fa-check-circle text-success"></i>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyState message="No learning center data found." />
              )}
            </div>

            {/* Extra / Co-Curricular Activities */}
            <div className="academic-feature-box">
              <h4 className="academic-feature-title">
                <i className="fas fa-star text-danger"></i>
                <span>{academic.extraActivitiesTitle || "Co-Curricular Activities"}</span>
              </h4>

              {academic.extraActivities?.length ? (
                <div className="academic-compact-grid">
                  {academic.extraActivities.map((item, index) => (
                    <span className="academic-pill-tag" key={`${item}-${index}`}>
                      <i className="fas fa-star text-danger"></i>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyState message="No activities data found." />
              )}
            </div>

            {/* Aksharaa Approach */}
            <div className="academic-feature-box">
              <h4 className="academic-feature-title">
                <i className="fas fa-award text-primary"></i>
                <span>{academic.approachTitle || "Aksharaa Approach"}</span>
              </h4>

              {academic.approachItems?.length ? (
                <div className="academic-compact-grid">
                  {academic.approachItems.map((item, index) => (
                    <span className="academic-pill-tag" key={`${item}-${index}`}>
                      <i className="fas fa-check-circle text-primary"></i>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyState message="No approach data found." />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid Section */}
      {gridImages.length > 0 && (
        <div className="academic-gallery-section mt-5">
          <div className="container mx-auto">
            <h4 className="fw-bold text-center text-dark mb-4">
              <i className="fas fa-camera text-success me-2"></i> Academic Life Gallery
            </h4>
            <div className="row g-3">
              {gridImages.slice(0, 8).map((image, index) => (
                <div className="col-lg-3 col-md-4 col-6" key={`${image}-${index}`}>
                  <img
                    src={getFileUrl(image)}
                    alt={`${academic.title || "Academic"} ${index + 1}`}
                    className="academic-gallery-img"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AcademicProgramPage;
