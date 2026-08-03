import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import SectionHeader from "./SectionHeader";
import { usePartners } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "./states/LoadingState";
import EmptyState from "./states/EmptyState";
import ErrorState from "./states/ErrorState";
import "../css/BrandSection.css";

const responsive = {
  0: { items: 2 },
  568: { items: 3 },
  768: { items: 4 },
  1024: { items: 5 },
  1200: { items: 5 },
};

const Brand = () => {
  const { data: partners = [], isLoading, error } = usePartners();

  const items = partners.map((partner, index) => (
    <div className="partner-slide-item" key={partner._id || index}>
      <a
        href={partner.link || "#"}
        target={partner.link ? "_blank" : undefined}
        rel={partner.link ? "noopener noreferrer" : undefined}
        className="partner-logo-tile"
        title={partner.title || `Educational Partner ${index + 1}`}
      >
        <img
          src={getFileUrl(partner.logo)}
          alt={partner.title || `Partner ${index + 1}`}
          className="partner-logo-img"
          loading="lazy"
        />
      </a>
    </div>
  ));

  return (
    <section className="brand-section section-bg-alt py-5 mb-0">

      <div className="container mx-auto">
        <SectionHeader
          badge="GLOBAL COLLABORATIONS"
          title="Our Educational"
          highlight="Partners"
        />

        <div className="mt-4">
          {isLoading && <LoadingState label="Loading partners..." />}
          {error && <ErrorState message={error.message} />}
          {!isLoading && !error && partners.length === 0 && (
            <EmptyState message="No educational partners found." />
          )}
          {!isLoading && !error && partners.length > 0 && (
            <AliceCarousel
              mouseTracking
              items={items}
              autoPlay={true}
              infinite={true}
              responsive={responsive}
              controlsStrategy="alternate"
              animationDuration={2000}
              disableButtonsControls={true}
              disableDotsControls={true}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Brand;
