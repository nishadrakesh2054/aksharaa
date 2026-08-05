import React, { useState } from "react";
import "../css/Download.css";
import { useDownloads, useNotices } from "../api/hooks/usePublicContent";
import { firstImage, getFileUrl } from "../api/media";
import LoadingState from "../components/states/LoadingState";
import EmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";
import SectionHeader from "../components/SectionHeader";

const Download = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: pdfs = [], isLoading, error } = useDownloads();
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

  const filteredPdfs = pdfs.filter((pdf) =>
    (pdf.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="download-section-wrapper py-5">
      <div className="container mx-auto">
        <SectionHeader
          badge="OFFICIAL DOCUMENTS & NOTICES"
          title="Resources &"
          highlight="Downloads"
        />


        <div className="download-notice-records mb-5">
          <h5 className="download-subtitle">Notice Records</h5>
          <div className="download-notice-box">
            {noticesLoading && <LoadingState label="Loading notice records..." />}
            {noticesError && <ErrorState message={noticesError.message} />}
            {!noticesLoading && !noticesError && notices.length > 0 && (
              <img
                src={firstImage(notices[0].images)}
                alt="Notice record"
                loading="lazy"
              />
            )}
            {!noticesLoading && !noticesError && notices.length === 0 && (
              <EmptyState message="No notice records found." />
            )}
          </div>
        </div>

        {/* Search Filter Box */}
        <div className="row justify-content-center mt-3 mb-4">
          <div className="col-lg-6 col-md-8 col-12">
            <div className="download-search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search notices, forms, or documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <i
                  className="fas fa-times ms-auto text-secondary cursor-pointer"
                  onClick={() => setSearchTerm("")}
                  style={{ cursor: "pointer" }}
                  title="Clear search"
                ></i>
              )}
            </div>
          </div>
        </div>

        {/* Document 2-Column Grid */}
        {isLoading && <LoadingState label="Loading downloads..." />}
        {error && <ErrorState message={error.message} />}
        {!isLoading && !error && filteredPdfs.length === 0 && (
          <EmptyState message="No downloadable documents found." />
        )}

        <div className="row g-3">
          {filteredPdfs.map((pdf) => (
            <div key={pdf._id} className="col-lg-6 col-md-6 col-12 d-flex">
              <div className="download-item-card w-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="file-icon-minimal">
                    <i className="fas fa-file-pdf"></i>
                  </div>

                  <div className="file-meta-content flex-grow-1 min-w-0">
                    <h5 className="file-meta-title" title={pdf.title}>
                      {pdf.title}
                    </h5>
                    <span className="file-meta-date">
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
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default Download;
