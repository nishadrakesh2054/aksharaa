import React, { useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "../css/Creative.css";
import SafeHTML from "../components/SafeHTML";
import { useCreativePosts, useNotices } from "../api/hooks/usePublicContent";
import { firstImage } from "../api/media";
import LoadingState from "./states/LoadingState";
import EmptyState from "./states/EmptyState";
import ErrorState from "./states/ErrorState";
import SectionHeader from "./SectionHeader";

const CreativeWeek = () => {
  const {
    data: creativesOfWeek = [],
    isLoading: creativesLoading,
    error: creativesError,
  } = useCreativePosts();
  const {
    data: notices = [],
    isLoading: noticesLoading,
    error: noticesError,
  } = useNotices();

  const carouselRef = useRef(null);

  const responsive = {
    0: { items: 1 },
    568: { items: 1 },
    1024: { items: 1 },
  };

  let items;

  if (creativesOfWeek && creativesOfWeek.length) {
    items = creativesOfWeek.map((creative, index) => {
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${
          window.location.href
        }&quote=${encodeURIComponent(creative.title)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
          creative.title + " " + window.location.href
        )}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${
          window.location.href
        }&title=${encodeURIComponent(creative.title)}`,
        twitter: `https://twitter.com/intent/tweet?url=${
          window.location.href
        }&text=${encodeURIComponent(creative.title)}`,
      };

      return (
        <div key={index} className="creative-item">
          <div className="img-container">
            <img
              src={firstImage(creative.images)}
              alt={creative.title}
              loading="lazy"
            />
          </div>
          <div className="mt-3">
            <h5 className="fw-bold text-dark mb-1">{creative.title}</h5>
            <div className="creative-text">
              <SafeHTML htmlString={(creative.description || "").slice(0, 100)} />
            </div>

            <div className="btn_wraps">
              <span className="share">Share</span>
              <div className="share-icon">
                <a
                  href={shareUrls.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook-f creative_i" />
                </a>
                <a
                  href={shareUrls.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-whatsapp creative_i" />
                </a>
                <a
                  href={shareUrls.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-linkedin creative_i" />
                </a>
                <a
                  href={shareUrls.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-twitter creative_i" />
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <section className="creative-section-wrapper section-bg-white py-5 my-2">
      <div className="container mx-auto">
        <div className="row g-4 align-items-stretch">
          {/* Left Side: Creatives Of This Week */}
          <div className="col-lg-6 col-md-12 d-flex">
            <div className="creative-card-box w-100">
              <div>
                <SectionHeader
                  badge="STUDENT SPOTLIGHT"
                  title="Creatives Of"
                  highlight="This Week"
                />

                <div className="creative-content-body mt-3">
                  <AliceCarousel
                    ref={carouselRef}
                    mouseTracking
                    items={items || []}
                    autoPlay={false}
                    infinite={true}
                    autoPlayDirection="rtl"
                    responsive={responsive}
                    controlsStrategy="alternate"
                    animationDuration={1000}
                    disableDotsControls={true}
                    disableButtonsControls={true}
                  />
                  {creativesLoading && <LoadingState label="Loading creatives..." />}
                  {creativesError && <ErrorState message={creativesError.message} />}
                  {!creativesLoading && !creativesError && !items?.length && (
                    <EmptyState message="No creative posts found." />
                  )}
                </div>
              </div>

              {/* Carousel Next/Prev Controls */}
              <div className="creative-footer-controls">
                <button
                  className="custom-prev-btn"
                  onClick={() => carouselRef.current?.slidePrev()}
                >
                  <i className="fa fa-arrow-left me-1"></i> Prev
                </button>
                <button
                  className="custom-next-btn"
                  onClick={() => carouselRef.current?.slideNext()}
                >
                  Next <i className="fa fa-arrow-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Important Notices */}
          <div className="col-lg-6 col-md-12 d-flex">
            <div className="creative-card-box w-100">
              <div>
                <SectionHeader
                  badge="ANNOUNCEMENTS"
                  title="Important"
                  highlight="Notices"
                />

                <div className="notice-image-wrapper mt-3">
                  {noticesLoading && <LoadingState label="Loading notice..." />}
                  {noticesError && <ErrorState message={noticesError.message} />}
                  {!noticesLoading && !noticesError && notices.length > 0 && (
                    <img
                      src={firstImage(notices[0].images)}
                      alt="Important Notice"
                      loading="lazy"
                    />
                  )}
                  {!noticesLoading && !noticesError && notices.length === 0 && (
                    <EmptyState message="No important notice found." />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreativeWeek;
