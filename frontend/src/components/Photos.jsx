import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useGalleries } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "./states/LoadingState";
import EmptyState from "./states/EmptyState";
import ErrorState from "./states/ErrorState";
import SectionHeader from "./SectionHeader";
import "../css/galleryPage.css";

const Photos = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: galleries = [], isLoading, error } = useGalleries();
  const itemsPerPage = 9; // 9 cards = 3x3 grid
  const navigate = useNavigate();

  if (isLoading) return <LoadingState label="Loading galleries..." />;
  if (error) return <ErrorState message={error.message} />;
  if (!galleries.length) return <EmptyState message="No galleries found." />;

  const pageCount = Math.ceil(galleries.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentGalleries = galleries.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  return (
    <section className="gallery-section-wrapper py-5">
      <div className="container mx-auto">
        <SectionHeader
          badge="CAMPUS MOMENTS & ALBUMS"
          title="Photo"
          highlight="Galleries"
        />

        <div className="row g-4 mt-2">
          {currentGalleries.map((gallery, id) => {
            const photoCount = gallery.images?.length || 0;
            const coverImage = getFileUrl(gallery.images?.[0]);

            return (
              <div
                className="col-lg-4 col-md-6 col-sm-12 d-flex"
                key={gallery._id || id}
                onClick={() => navigate(`/gallery/${gallery._id}`)}
              >
                <div className="gallery-album-card w-100">
                  <div className="album-img-wrapper">
                    <img
                      src={coverImage}
                      alt={gallery.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="album-card-body">
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                      <h5 className="album-card-title mb-0">{gallery.title}</h5>
                      <span className="album-inline-badge flex-shrink-0">
                        <i className="fas fa-camera"></i> {photoCount} Photos
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top">
                      <span className="album-view-link">
                        <span>View Album</span>
                        <i className="fas fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={"Prev"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        )}
      </div>
    </section>
  );
};

export default Photos;
