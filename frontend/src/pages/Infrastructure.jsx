import React from "react";
import "../css/infrastucture.css";
import { Link } from "react-router-dom";
import { useInfrastructure } from "../api/hooks/usePublicContent";
import { firstImage } from "../api/media";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import EmptyState from "../components/states/EmptyState";
import SectionHeader from "../components/SectionHeader";

const Infrastructure = () => {
  const { data: infrastructure = [], isLoading, error } = useInfrastructure();

  return (
    <section className="infra-section-wrapper py-5">
      <div className="container mx-auto">
        {/* Section Header */}
        <SectionHeader
          badge="STATE-OF-THE-ART FACILITIES"
          title="Our"
          highlight="Infrastructure"
        />

        {/* Intro Description Card (100% text preserved) */}
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
          {isLoading && <LoadingState label="Loading infrastructure..." />}
          {error && <ErrorState message={error.message} />}
          {!isLoading && !error && infrastructure.length === 0 && (
            <EmptyState message="No infrastructure data found." />
          )}

          {!isLoading &&
            !error &&
            infrastructure.map((item, index) => (
              <div key={item._id || index} className="col-lg-6 col-md-12 d-flex">
                <Link to={`/infrastructure/${item._id}`} className="infra-facility-card w-100">
                  <div className="infra-card-body">
                    <div className="d-flex flex-column justify-content-between flex-fill me-2">
                      <div>
                        <div className="infra-card-icon-badge">
                          <i className={item.iconClass || "fas fa-school"}></i>
                        </div>
                        <h4 className="infra-card-title">{item.title || "Infrastructure"}</h4>
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
                        src={firstImage(item.images)}
                        alt={item.title || "Infrastructure"}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Infrastructure;
