import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Download from "yet-another-react-lightbox/plugins/download";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Share from "yet-another-react-lightbox/plugins/share";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { Thumbnails } from "yet-another-react-lightbox/plugins";
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Loader from "../components/Loader";
import { useGallery } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import SectionHeader from "../components/SectionHeader";
import "../css/galleryPage.css";

const Gallery = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const { data: gallery, isLoading, error } = useGallery(id);

  if (isLoading) return <Loader />;
  if (error) return <div className="container py-5 text-center text-danger">Error: {error.message}</div>;
  if (!gallery) return <div className="container py-5 text-center text-muted">No gallery found.</div>;

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const galleryImages = gallery.images || [];
  const pageCount = Math.ceil(galleryImages.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentImages = galleryImages.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  return (
    <section className="gallery-section-wrapper py-5">
      <div className="container mx-auto">
        <div className="mb-3">
          <Link to="/gallery" className="back-to-galleries-btn">
            <i className="fas fa-arrow-left"></i> All Photo Galleries
          </Link>
        </div>

        <SectionHeader
          badge={`ALBUM • ${galleryImages.length} PHOTOS`}
          title={gallery.title}
          highlight=""
        />

        <div className="row g-4 mt-2">
          {currentImages.map((image, index) => (
            <div
              key={index}
              className="col-lg-3 col-md-4 col-sm-6"
              onClick={() => handleOpen(index + offset)}
            >
              <div className="photo-grid-card">
                <img
                  src={getFileUrl(image)}
                  alt={`${gallery.title} image ${index + 1}`}
                  loading="lazy"
                />
                <div className="photo-grid-overlay">
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Lightbox
          open={open}
          slides={galleryImages.map((img) => ({
            src: getFileUrl(img),
          }))}
          currentIndex={currentIndex}
          close={() => setOpen(false)}
          plugins={[Zoom, Download, Share, Counter, Thumbnails]}
          counter={{ container: { style: { top: "unset", bottom: 0 } } }}
          zoom={{
            maxZoom: 5,
            zoomInLabel: "Zoom In",
            zoomOutLabel: "Zoom Out",
          }}
        />

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

export default Gallery;
