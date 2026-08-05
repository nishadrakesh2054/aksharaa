import React from "react";
import { Link, useParams } from "react-router-dom";
import { useProject } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import SafeHTML from "../components/SafeHTML";
import SEO from "../components/SEO";
import "../css/longTermProjectDetails.css";

const stripHtml = (value = "") => value.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();

const getYouTubeEmbedUrl = (url = "") => {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
  } catch {
    return url.includes("watch?v=") ? url.replace("watch?v=", "embed/") : url;
  }

  return url.includes("watch?v=") ? url.replace("watch?v=", "embed/") : url;
};

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
  const summary = stripHtml(project.description).slice(0, 160);
  const publishedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const videoUrl = getYouTubeEmbedUrl(project.video);

  return (
    <section className="ltp-detail-page">
      <SEO
        title={`${project.title} | Long Term Projects`}
        description={summary || project.title}
      />
      <div className="container mx-auto">
        <div className="ltp-back-row">
          <Link to="/newsactivity" className="ltp-back-link">
            <i className="fas fa-arrow-left"></i>
            <span>Back to Highlights & Projects</span>
          </Link>
        </div>

        <article className="ltp-detail-shell">
          <div className="ltp-hero-grid">
            <div className="ltp-hero-copy">
              <span className="ltp-eyebrow">
                <i className="fas fa-project-diagram"></i>
                Long Term Project
              </span>
              <h1>{project.title}</h1>
              {summary ? <p>{summary}</p> : null}

              <div className="ltp-meta-grid">
                {publishedDate ? (
                  <div className="ltp-meta-item">
                    <span>Published</span>
                    <strong>{publishedDate}</strong>
                  </div>
                ) : null}
                <div className="ltp-meta-item">
                  <span>Photos</span>
                  <strong>{images.length || "0"}</strong>
                </div>
                <div className="ltp-meta-item">
                  <span>Media</span>
                  <strong>{project.video ? "Video available" : "Photo story"}</strong>
                </div>
              </div>
            </div>

            <div className="ltp-hero-media">
              {mainImage ? (
                <img
                  src={getFileUrl(mainImage)}
                  alt={project.title}
                  className="ltp-main-image"
                />
              ) : (
                <div className="ltp-image-placeholder">
                  <i className="fas fa-image"></i>
                </div>
              )}
            </div>
          </div>

          <div className="ltp-content-grid">
            <div className="ltp-rich-section">
              <div className="ltp-section-heading">
                <span></span>
                <h2>Project Story</h2>
              </div>
              <div className="ltp-rich-content">
                <SafeHTML htmlString={project.description} />
              </div>
            </div>

            <aside className="ltp-side-panel">
              <h3>At a glance</h3>
              <div className="ltp-side-list">
                <div>
                  <i className="fas fa-seedling"></i>
                  <span>Experiential learning project</span>
                </div>
                <div>
                  <i className="fas fa-images"></i>
                  <span>{images.length ? `${images.length} project photo${images.length > 1 ? "s" : ""}` : "Photo gallery coming soon"}</span>
                </div>
                <div>
                  <i className="fas fa-video"></i>
                  <span>{project.video ? "Includes project video" : "Video not added yet"}</span>
                </div>
              </div>
            </aside>
          </div>

          {videoUrl && (
            <section className="ltp-media-section">
              <div className="ltp-section-heading">
                <span></span>
                <h2>Project Video</h2>
              </div>
              <div className="ltp-video-frame">
                <iframe
                  src={videoUrl}
                  title={project.title}
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          )}

          {images.length > 1 && (
            <section className="ltp-media-section">
              <div className="ltp-section-heading">
                <span></span>
                <h2>Project Gallery</h2>
              </div>
              <div className="ltp-gallery-grid">
                {images.map((img, idx) => (
                  <div key={idx} className="ltp-gallery-item">
                    <img
                      src={getFileUrl(img)}
                      alt={`${project.title} photo ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </section>
  );
};

export default LongTermProject;
