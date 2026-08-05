import React from "react";
import "../css/Honmeblog.css";
import { useNavigate } from "react-router-dom";
import SafeHTML from "../components/SafeHTML";
import { useBlogs } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "./states/LoadingState";
import EmptyState from "./states/EmptyState";
import ErrorState from "./states/ErrorState";
import SectionHeader from "../components/SectionHeader";

const stripHtml = (value = "") => value.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();

const HomeBlog = () => {
  const navigate = useNavigate();
  const { data: blogs = [], isLoading, error } = useBlogs();
  const latestBlogs = [...blogs]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  return (
    <section className="homeblog section-bg-alt py-5 my-2">
      <div className="container mx-auto">
        <SectionHeader
          badge="NEWS & INSIGHTS"
          title="Latest"
          highlight="Blogs & Updates"
        />

        <div className="row g-4 mt-1 justify-content-center">
          {isLoading && <LoadingState label="Loading latest blogs..." />}
          {error && <ErrorState message={error.message} />}
          {!isLoading &&
            !error &&
            latestBlogs.length > 0 &&
            latestBlogs.map((item) => {
              const formattedDate = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Aksharaa News";

              return (
                <div className="col-lg-4 col-md-6 col-sm-12 d-flex" key={item._id}>
                  <div className="homeblog-card w-100">
                    <div className="homeblog-img-wrapper">
                      <img
                        src={getFileUrl(item.image)}
                        alt={item.title || "Blog post"}
                        loading="lazy"
                      />
                      <span className="homeblog-date-badge">{formattedDate}</span>
                    </div>

                    <div className="homeblog-body">
                      <div>
                        <h4 className="homeblog-title">{item.title || "Untitled Blog"}</h4>
                        <div className="homeblog-desc">
                          <SafeHTML htmlString={item.excerpt || `${stripHtml(item.description).slice(0, 130)}...`} />
                        </div>
                      </div>

                      <div className="homeblog-footer">
                        <button
                          className="homeblog-link"
                          onClick={() => navigate(`/blog/${item._id}`)}
                        >
                          <span>Read More</span>
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          {!isLoading && !error && latestBlogs.length === 0 && (
            <EmptyState message="No blogs available at the moment." />
          )}
        </div>

        {!isLoading && !error && blogs.length > 3 && (
          <div className="homeblog-all-row">
            <button
              type="button"
              className="homeblog-all-btn"
              onClick={() => navigate("/blog")}
            >
              Show All Blogs
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeBlog;
