import React from "react";
import "../css/infrastucture.css";
import { Link } from "react-router-dom";
import { useInfrastructure } from "../api/hooks/usePublicContent";
import { firstImage, getFileUrl } from "../api/media";
import infrastructureData from "../Data/InfraData";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import SectionHeader from "../components/SectionHeader";
import SEO from "../components/SEO";

const stripHtml = (value = "") => value.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();

const Infrastructure = () => {
  const { data: apiInfrastructure = [], isLoading, error } = useInfrastructure();

  // Use dynamic API data if available, or static fallback data
  const displayInfra = apiInfrastructure.length > 0 ? apiInfrastructure : infrastructureData;

  return (
    <>
      <SEO
        title="Infrastructure & Facilities | Aksharaa School Kathmandu"
        description="Explore Aksharaa School's modern earthquake-resistant infrastructure, laboratories, cafeteria, library, play area, and outdoor learning spaces."
      />

      <section className="infra-section-wrapper py-5">
        <div className="container mx-auto">
          {/* Section Header */}
          <SectionHeader
            badge="STATE-OF-THE-ART FACILITIES"
            title="Our"
            highlight="Infrastructure"
          />

          {/* Intro Description Card (Static Text Justified) */}
          <div className="infra-intro-card my-4">
            <p className="mb-3">
              At Aksharaa School, we believe that a well-designed infrastructure is vital for nurturing young minds and supporting their educational journey. Our school, strategically situated in a serene and lush environment, combines modern facilities with a supportive atmosphere to create an optimal learning environment for our students. Each aspect of our infrastructure is thoughtfully crafted to enhance students' academic performance, physical health, and overall well-being, ensuring that they have access to the best resources for their development.
            </p>
            <p className="mb-0">
              Our infrastructure is not just about providing physical spaces; it's about creating an environment where students can explore, learn, and grow holistically. From advanced technological resources to nurturing care facilities, Aksharaa School stands out in its commitment to offering a well-rounded educational experience.
            </p>
          </div>

          {/* Facility Cards Grid */}
          <div className="row g-4 mt-2 align-items-stretch">
            {isLoading && displayInfra.length === 0 && <LoadingState label="Loading infrastructure..." />}
            {error && displayInfra.length === 0 && <ErrorState message={error.message} />}

            {displayInfra.map((item, index) => {
              const itemId = item._id || item.id;
              const title = item.title || "Infrastructure Facility";
              const rawImage = firstImage(item.images);
              const imageUrl = typeof rawImage === "string" && (rawImage.startsWith("http") || rawImage.startsWith("/assets") || rawImage.startsWith("/src"))
                ? rawImage
                : getFileUrl(rawImage);

              const descriptionSnippet = item.description
                ? stripHtml(item.description).slice(0, 110) + "..."
                : "";

              return (
                <div key={itemId || index} className="col-lg-6 col-md-12 d-flex">
                  <Link to={`/infrastructure/${itemId}`} className="infra-facility-card w-100">
                    <div className="infra-card-body">
                      <div className="d-flex flex-column justify-content-between flex-fill me-3">
                        <div>
                          <div className="infra-card-icon-badge">
                            <i className={item.iconClass || "fas fa-school"}></i>
                          </div>
                          <h4 className="infra-card-title">{title}</h4>
                          {descriptionSnippet && (
                            <p className="infra-card-desc mb-0">{descriptionSnippet}</p>
                          )}
                        </div>

                        <div className="mt-3">
                          <span className="infra-card-link">
                            <span>Explore Facility</span>
                            <i className="fas fa-arrow-right"></i>
                          </span>
                        </div>
                      </div>

                      <div className="infra-card-img-wrapper">
                        <img
                          src={imageUrl}
                          alt={title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/fallbackimage.avif";
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Infrastructure;
