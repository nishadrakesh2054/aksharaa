import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useTestimonials } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "./states/LoadingState";
import EmptyState from "./states/EmptyState";
import ErrorState from "./states/ErrorState";
import SectionHeader from "./SectionHeader";
import "../css/testimonial.css";

const Testimonial = () => {
  const { data: testimonials = [], isLoading, error } = useTestimonials();

  // AliceCarousel responsive settings
  const responsive = {
    0: { items: 1 },
    768: { items: 2 },
    1200: { items: 2 },
  };

  // Generate equal height carousel items dynamically
  const items = testimonials.map((testimonial) => {
    const parentParts = (testimonial.parentname || "").split(",");
    const parentName = parentParts[0] || testimonial.parentname || "Aksharaa Parent";
    const parentRole = parentParts[1] || "Proud Parent";

    return (
      <div className="testimonial-item-slide" key={testimonial._id}>
        <div className="testimonial-card-box">
          <i className="fas fa-quote-right testimonial-quote-icon"></i>

          <div className="testimonial-body-content">
            <h4 className="testimonial-card-title">{testimonial.title || "Exceptional Schooling Experience"}</h4>
            <p className="testimonial-card-feedback">{testimonial.feedback}</p>
          </div>

          <div className="testimonial-footer-info">
            <div className="testimonial-user-profile">
              <img
                src={getFileUrl(testimonial.image)}
                alt={parentName}
                className="testimonial-avatar-img"
                loading="lazy"
              />
              <div>
                <h5 className="testimonial-user-name">{parentName}</h5>
                <span className="testimonial-user-role">{parentRole}</span>
                {/* Rating stars below profile info on mobile */}
                <div className="testimonial-rating-stars d-flex d-md-none mt-1">
                  {Array(testimonial.rating || 5)
                    .fill(0)
                    .map((_, idx) => (
                      <i className="fas fa-star" key={idx}></i>
                    ))}
                </div>
              </div>
            </div>

            {/* Rating stars on far right for desktop */}
            <div className="testimonial-rating-stars d-none d-md-flex">
              {Array(testimonial.rating || 5)
                .fill(0)
                .map((_, idx) => (
                  <i className="fas fa-star" key={idx}></i>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  });


  return (
    <section className="testimonial-carousel-wrapper section-bg-white py-5 my-3">
      <div className="container mx-auto">
        <SectionHeader
          badge="PARENT FEEDBACK"
          title="What Parents"
          highlight="Say About Us"
        />

        <div className="mt-4">
          {isLoading && <LoadingState label="Loading parent testimonials..." />}
          {error && <ErrorState message={error.message} />}
          {!isLoading && !error && testimonials.length === 0 && (
            <EmptyState message="No parent testimonials found." />
          )}
          {!isLoading && !error && testimonials.length > 0 && (
            <AliceCarousel
              mouseTracking
              items={items}
              autoPlay={true}
              infinite={true}
              responsive={responsive}
              controlsStrategy="alternate"
              animationDuration={1500}
              disableButtonsControls={false}
              disableDotsControls={true}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
