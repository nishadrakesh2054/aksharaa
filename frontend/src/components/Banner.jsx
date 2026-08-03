import React, { useEffect } from "react";
import "../css/banner.css";
import { useHeroSlides } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "./states/LoadingState";
import ErrorState from "./states/ErrorState";

const Banner = () => {
  const { data: heroSlides = [], isLoading, error } = useHeroSlides();

  useEffect(() => {
    if (typeof window !== "undefined" && heroSlides.length > 0) {
      const carouselEl = document.getElementById("carousel");
      if (carouselEl && window.bootstrap?.Carousel) {
        const carouselInstance = window.bootstrap.Carousel.getOrCreateInstance(carouselEl, {
          interval: 3500,
          ride: "carousel",
          touch: true,
          pause: false,
        });
        carouselInstance.cycle();
      }
    }
  }, [heroSlides]);

  return (
    <>
      <section className="home">
        <div
          id="carousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="3500"
          data-bs-touch="true"
          data-bs-pause="false"
        >
          {/* Main Hero Slides */}
          <div className="carousel-inner">
            {isLoading && <LoadingState label="Loading banner..." />}
            {error && <ErrorState message={error.message} />}
            {!isLoading && !error && heroSlides.length > 0 ? (
              heroSlides.map((item, index) => (
                <div
                  key={item._id}
                  className={`carousel-item im ${index === 0 ? "active" : ""}`}
                  style={{
                    backgroundImage: `url(${getFileUrl(item.images)})`,
                  }}
                ></div>
              ))
            ) : (
              <div
                className="carousel-item active"
                style={{
                  backgroundImage: `url('/statichome.jpg')`,
                }}
              ></div>
            )}
          </div>

          {/* Navigation Arrows */}
          <a
            className="carousel-control-prev"
            href="#carousel"
            role="button"
            data-bs-slide="prev"
          >
            <img src="/left-arrow.svg" alt="Prev" />
          </a>
          <a
            className="carousel-control-next"
            href="#carousel"
            role="button"
            data-bs-slide="next"
          >
            <img src="/right-arrow.svg" alt="Next" />
          </a>

          {/* Clean Pagination Indicators (Desktop Only >= 992px) */}
          <div className="carousel-controls d-none d-lg-block">
            <ol className="carousel-indicators">
              {!isLoading && !error && heroSlides.length > 0
                ? heroSlides.map((item, index) => (
                    <li
                      key={item._id}
                      data-bs-target="#carousel"
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                    />
                  ))
                : null}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
