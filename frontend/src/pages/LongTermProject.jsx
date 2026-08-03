import React from "react";
import { Link, useParams } from "react-router-dom";
import { useProject } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import SafeHTML from "../components/SafeHTML";
import SEO from "../components/SEO";

const LongTermProject = () => {
  const { id } = useParams();
  const projectQuery = useProject(id);
  const project = projectQuery.data;

  if (projectQuery.isLoading) return <LoadingState label="Loading project..." />;
  if (projectQuery.error) return <ErrorState message={projectQuery.error.message} />;
  if (!project) return <div className="container py-5 text-center text-muted">Project not found.</div>;

  const images = Array.isArray(project.images)
    ? project.images
    : project.image
    ? [project.image]
    : [];

  const mainImage = images[0];

  return (
    <section className="py-5 bg-light min-vh-100">
      <SEO
        title={`${project.title} | Long Term Projects`}
        description={project.title}
      />
      <div className="container mx-auto">
        <div className="mb-4">
          <Link to="/newsactivity" className="btn btn-outline-success btn-sm rounded-pill px-3 shadow-sm">
            <i className="fas fa-arrow-left me-2"></i> Back to Highlights & Projects
          </Link>
        </div>

        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 border">
          {/* Header Title */}
          <div className="mb-4">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold text-uppercase mb-2 d-inline-block">
              <i className="fas fa-project-diagram me-1"></i> Long Term Project
            </span>
            <h2 className="fw-bold text-dark mb-3">{project.title}</h2>
            <div style={{ width: "60px", height: "4px", background: "#196642", borderRadius: "2px" }}></div>
          </div>

          {/* Featured Hero Image */}
          {mainImage && (
            <div className="rounded-4 overflow-hidden mb-4 shadow-sm" style={{ maxHeight: "420px" }}>
              <img
                src={getFileUrl(mainImage)}
                alt={project.title}
                className="w-100 h-100 object-fit-cover"
                style={{ objectFit: "cover", maxHeight: "420px" }}
              />
            </div>
          )}

          {/* Description Content with SafeHTML */}
          <div className="project-detail-body mb-5 text-dark" style={{ fontSize: "1.02rem", lineHeight: "1.7" }}>
            <SafeHTML htmlString={project.description} />
          </div>

          {/* Video Section if available */}
          {project.video && (
            <div className="mb-5">
              <h4 className="fw-bold text-dark mb-3">
                <i className="fas fa-video text-danger me-2"></i> Project Demonstration Video
              </h4>
              <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm">
                <iframe
                  src={
                    project.video.includes("watch?v=")
                      ? project.video.replace("watch?v=", "embed/")
                      : project.video
                  }
                  title={project.title}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Additional Photos Gallery */}
          {images.length > 1 && (
            <div>
              <h4 className="fw-bold text-dark mb-3">
                <i className="fas fa-images text-success me-2"></i> Project Gallery ({images.length} Photos)
              </h4>
              <div className="row g-3">
                {images.map((img, idx) => (
                  <div key={idx} className="col-lg-3 col-md-4 col-6">
                    <div className="rounded-3 overflow-hidden border shadow-sm" style={{ height: "180px" }}>
                      <img
                        src={getFileUrl(img)}
                        alt={`${project.title} photo ${idx + 1}`}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LongTermProject;

