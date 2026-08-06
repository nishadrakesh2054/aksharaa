import React, { useState, useEffect } from "react";
import "../css/Download.css";
import { useDownloads, useNotices } from "../api/hooks/usePublicContent";
import { firstImage, getFileUrl } from "../api/media";
import LoadingState from "../components/states/LoadingState";
import EmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";
import SectionHeader from "../components/SectionHeader";

const Download = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeNoticeModal, setActiveNoticeModal] = useState(null);

  const { data: pdfs = [], isLoading: pdfsLoading, error: pdfsError } = useDownloads();
  const {
    data: notices = [],
    isLoading: noticesLoading,
    error: noticesError,
  } = useNotices();

  const handleDownload = (filePath) => {
    if (filePath) {
      window.open(getFileUrl(filePath, ""), "_blank");
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveNoticeModal(null);
      }
    };
    if (activeNoticeModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeNoticeModal]);

  const filteredPdfs = pdfs.filter((pdf) =>
    (pdf.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotices = notices.filter((notice) =>
    (notice.title || notice.name || "Notice Record")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <section className="download-section-wrapper py-5">
      <div className="container mx-auto">
        <SectionHeader
          badge="OFFICIAL DOCUMENTS & NOTICES"
          title="Resources &"
          highlight="Downloads"
        />

        {/* Search Filter Box */}
        <div className="row justify-content-center mt-3 mb-4">
          <div className="col-lg-7 col-md-9 col-12">
            <div className="download-search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search notices, results, forms, or documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <i
                  className="fas fa-times ms-auto cursor-pointer"
                  onClick={() => setSearchTerm("")}
                  style={{ cursor: "pointer" }}
                  title="Clear search"
                ></i>
              )}
            </div>
          </div>
        </div>

        {/* 6-Column Layout for PDFs and Notices */}
        <div className="row g-4 align-items-start">
          {/* Left Column (6 Cols): Result & Document PDFs */}
          <div className="col-lg-6 col-12">
            <div className="column-wrapper-card">
              <div className="column-card-header">
                <div className="d-flex align-items-center gap-2">
                  <div className="column-icon-badge pdf-badge">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                  <div>
                    <h4 className="column-title">Result & Document PDFs</h4>
                    <span className="column-subtitle">Official downloadable files & forms</span>
                  </div>
                </div>
                <span className="count-pill">{filteredPdfs.length} Files</span>
              </div>

              <div className="column-card-body">
                {pdfsLoading && <LoadingState label="Loading downloadable PDFs..." />}
                {pdfsError && <ErrorState message={pdfsError.message} />}
                {!pdfsLoading && !pdfsError && filteredPdfs.length === 0 && (
                  <EmptyState message="No downloadable PDF documents found." />
                )}

                {!pdfsLoading && !pdfsError && filteredPdfs.length > 0 && (
                  <div className="download-list-container">
                    {filteredPdfs.map((pdf) => (
                      <div key={pdf._id} className="download-item-card">
                        <div className="d-flex align-items-center gap-3">
                          <div className="file-icon-minimal">
                            <i className="fas fa-file-pdf"></i>
                          </div>

                          <div className="file-meta-content flex-grow-1 min-w-0">
                            <h5 className="file-meta-title" title={pdf.title}>
                              {pdf.title}
                            </h5>
                            <span className="file-meta-date">
                              <i className="far fa-calendar-alt me-1"></i>
                              Published:{" "}
                              {new Date(pdf.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          <button
                            className="download-icon-minimal flex-shrink-0"
                            onClick={() => handleDownload(pdf.filePath)}
                            title="Download PDF"
                          >
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (6 Cols): Notice & Result Image Records */}
          <div className="col-lg-6 col-12">
            <div className="column-wrapper-card">
              <div className="column-card-header">
                <div className="d-flex align-items-center gap-2">
                  <div className="column-icon-badge notice-badge">
                    <i className="fas fa-bullhorn"></i>
                  </div>
                  <div>
                    <h4 className="column-title">Notice & Result Records</h4>
                    <span className="column-subtitle">Click item or icon to view full picture</span>
                  </div>
                </div>
                <span className="count-pill notice-pill">{filteredNotices.length} Notices</span>
              </div>

              <div className="column-card-body">
                {noticesLoading && <LoadingState label="Loading notice records..." />}
                {noticesError && <ErrorState message={noticesError.message} />}
                {!noticesLoading && !noticesError && filteredNotices.length === 0 && (
                  <EmptyState message="No notice records found." />
                )}

                {!noticesLoading && !noticesError && filteredNotices.length > 0 && (
                  <div className="notice-list-container">
                    {filteredNotices.map((notice, idx) => {
                      const imgUrl = firstImage(notice.images);
                      const title = notice.title || notice.name || `Notice Record #${idx + 1}`;
                      const formattedDate = notice.createdAt
                        ? new Date(notice.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A";

                      return (
                        <div
                          key={notice._id || idx}
                          className="notice-item-card"
                          onClick={() =>
                            setActiveNoticeModal({
                              imageSrc: imgUrl,
                              title,
                              date: formattedDate,
                            })
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setActiveNoticeModal({
                                imageSrc: imgUrl,
                                title,
                                date: formattedDate,
                              });
                            }
                          }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            {/* Small Image Icon Shape */}
                            <div className="notice-thumb-icon flex-shrink-0">
                              {imgUrl ? (
                                <img
                                  src={imgUrl}
                                  alt={title}
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.src = "/fallbackimage.avif";
                                  }}
                                />
                              ) : (
                                <i className="fas fa-image fallback-icon"></i>
                              )}
                              <div className="notice-thumb-overlay">
                                <i className="fas fa-search-plus"></i>
                              </div>
                            </div>

                            <div className="file-meta-content flex-grow-1 min-w-0">
                              <h5 className="file-meta-title" title={title}>
                                {title}
                              </h5>
                              <span className="file-meta-date">
                                <i className="far fa-calendar-alt me-1"></i>
                                Published: {formattedDate}
                              </span>
                            </div>

                            <div className="notice-view-action flex-shrink-0" title="Click to view full picture">
                              <i className="fas fa-expand"></i>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full Image Preview Modal */}
        {activeNoticeModal && (
          <div
            className="notice-modal-overlay"
            onClick={() => setActiveNoticeModal(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-modal-title"
          >
            <div
              className="notice-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="notice-modal-header">
                <div>
                  <h5 id="notice-modal-title" className="notice-modal-title">
                    {activeNoticeModal.title}
                  </h5>
                  <span className="notice-modal-date">
                    <i className="far fa-calendar-alt me-1"></i>
                    Published: {activeNoticeModal.date}
                  </span>
                </div>
                <button
                  type="button"
                  className="notice-modal-close"
                  onClick={() => setActiveNoticeModal(null)}
                  title="Close preview"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="notice-modal-body">
                <img
                  src={activeNoticeModal.imageSrc}
                  alt={activeNoticeModal.title}
                  className="notice-modal-img"
                  onError={(e) => {
                    e.currentTarget.src = "/fallbackimage.avif";
                  }}
                />
              </div>

              <div className="notice-modal-footer">
                <a
                  href={activeNoticeModal.imageSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary-custom"
                >
                  <i className="fas fa-external-link-alt me-2"></i> Open Full Image
                </a>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setActiveNoticeModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Download;
