import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useMun } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import EmptyState from "../components/states/EmptyState";
import SectionHeader from "../components/SectionHeader";
import "../css/munPage.css";

const responsive = {
  0: { items: 1 },
  568: { items: 2 },
  1024: { items: 3 },
};

const AksharaMUN = () => {
  const { data: mun, isLoading, error } = useMun();

  if (isLoading) return <LoadingState label="Loading MUN details..." />;
  if (error) return <ErrorState message={error.message} />;
  if (!mun) return <EmptyState message="No MUN data found." />;

  const sliderImages = mun.sliderImages?.length ? mun.sliderImages : ["/fallbackimage.avif"];
  const gridImages = mun.gridImages || [];

  const items = sliderImages.map((img, index) => (
    <div className="px-2" key={`${img}-${index}`}>
      <div className="mun-slider-card">
        <img
          src={getFileUrl(img)}
          alt={`${mun.title || "Aksharaa MUN"} ${index + 1}`}
          loading="lazy"
        />
      </div>
    </div>
  ));

  return (
    <section className="mun-section-wrapper py-5">
      <div className="container mx-auto">
        {/* Section Header */}
        <SectionHeader
          badge="GLOBAL DIPLOMACY & LEADERSHIP"
          title={mun.title || "AKSHARAA MODEL UNITED NATIONS"}
          highlight={mun.subtitle || "(AMUN)"}
        />

        {/* Image Slider */}
        <div className="my-4">
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

        {/* About & Why AMUN Feature Cards */}
        <div className="row g-4 my-4">
          <div className="col-lg-6 col-md-12 d-flex">
            <div className="mun-feature-box w-100">
              <div className="mun-feature-icon">
                <i className="fas fa-globe-americas"></i>
              </div>
              <h3>{mun.aboutTitle || "About AMUN"}</h3>
              <p>{mun.aboutText || "Aksharaa Model United Nations (AMUN) provides a platform for young diplomats to engage in rigorous debate, global research, and international policy analysis."}</p>
            </div>
          </div>

          <div className="col-lg-6 col-md-12 d-flex">
            <div className="mun-feature-box w-100">
              <div className="mun-feature-icon" style={{ background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)" }}>
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>{mun.whyTitle || "WHY AMUN?"}</h3>
              <p>{mun.whyText || "AMUN empowers students to develop critical thinking, public speaking, negotiation, and consensus-building skills while addressing pressingly relevant global crises."}</p>
            </div>
          </div>
        </div>

        {/* Goals & Photo Grid Section */}
        <div className="row g-4 mt-2 align-items-stretch">
          {/* Left: Our Goals */}
          <div className="col-lg-6 col-md-12 d-flex">
            <div className="mun-goals-box w-100">
              <h3 className="fw-bold text-dark mb-4">
                <i className="fas fa-bullseye text-danger me-2"></i> Our Goals
              </h3>

              {mun.goalsList?.length ? (
                <div className="d-flex flex-column gap-3">
                  {mun.goalsList.map((goal, index) => (
                    <div className="mun-goal-item" key={`${goal}-${index}`}>
                      <i className="fas fa-check-circle"></i>
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No goals found." />
              )}
            </div>
          </div>

          {/* Right: Photo Gallery Grid */}
          <div className="col-lg-6 col-md-12 d-flex">
            <div className="w-100">
              <div className="row g-3">
                {(gridImages.length ? gridImages : ["/fallbackimage.avif"]).slice(0, 4).map((image, index) => (
                  <div className="col-6" key={`${image}-${index}`}>
                    <img
                      src={getFileUrl(image)}
                      alt={`MUN activity ${index + 1}`}
                      className="mun-photo-grid-img"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AksharaMUN;
