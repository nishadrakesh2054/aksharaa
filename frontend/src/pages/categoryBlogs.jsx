import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  useActivities,
  useActivityCategories,
  useBlogCategories,
  useBlogs,
} from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import SafeHTML from "../components/SafeHTML";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import EmptyState from "../components/states/EmptyState";
import SEO from "../components/SEO";
import "../css/blogsList.css";

const stripHtml = (value = "") => value.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();

const CategoryBlogs = ({ news }) => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const activityQuery = useActivities({ categoryId }, { enabled: Boolean(news) });
  const blogQuery = useBlogs({ categoryId }, { enabled: !news });
  const activityCatQuery = useActivityCategories({ enabled: Boolean(news) });
  const blogCatQuery = useBlogCategories({ enabled: !news });

  const query = news ? activityQuery : blogQuery;
  const catQuery = news ? activityCatQuery : blogCatQuery;
  const blogs = query.data || [];
  const categories = catQuery.data || [];

  const currentCategory = categories.find((cat) => cat._id === categoryId) || blogs[0]?.category;
  const categoryName = currentCategory?.title || (news ? "News & Activity" : "Blog Category");

  if (query.isLoading || catQuery.isLoading) {
    return (
      <div className="blogs-list-page py-5 text-center d-flex align-items-center justify-content-center">
        <LoadingState label="Loading category articles..." />
      </div>
    );
  }

  if (query.error || catQuery.error) {
    return (
      <div className="blogs-list-page py-5">
        <div className="container">
          <ErrorState message={query.error?.message || catQuery.error?.message} />
          <button className="minimal-back-btn mt-3" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left me-2"></i> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${categoryName} | Aksharaa School ${news ? "News & Activities" : "Blogs"}`}
        description={`Explore all articles and updates under ${categoryName} at Aksharaa School.`}
      />

      <section className="blogs-list-page py-4 py-md-5">
        <div className="container mx-auto">
          {/* All In One Line Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              <button
                className="minimal-back-btn p-2 px-3"
                onClick={() => navigate(-1)}
                title="Go back"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <h3 className="m-0 fw-bold text-dark">{categoryName}</h3>
              <span className="minimal-category-badge d-none d-sm-inline-block">
                {news ? "Activity" : "Blog"}
              </span>
            </div>
            <span className="count-pill">{blogs.length} Articles</span>
          </div>

          {/* Articles Grid */}
          {blogs.length === 0 ? (
            <EmptyState message={`No articles found for "${categoryName}".`} />
          ) : (
            <div className="row g-4">
              {blogs.map((blog) => {
                const linkPath = news ? `/newsactivity/${blog._id}` : `/blog/${blog._id}`;
                const formattedDate = blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A";

                const excerptText =
                  blog.excerpt || `${stripHtml(blog.description).slice(0, 140)}...`;

                return (
                  <div key={blog._id} className="col-lg-4 col-md-6 col-12 d-flex">
                    <Link to={linkPath} className="blogs-list-card w-100">
                      <div className="blogs-list-image">
                        <img
                          src={getFileUrl(blog.image)}
                          alt={blog.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/fallbackimage.avif";
                          }}
                        />
                        <span>{categoryName}</span>
                      </div>

                      <div className="blogs-list-body">
                        <h2>{blog.title}</h2>
                        <div className="blogs-list-excerpt">
                          <SafeHTML htmlString={excerptText} />
                        </div>

                        <div className="blogs-list-meta">
                          <span>
                            <i className="far fa-calendar-alt me-1 text-danger"></i>
                            {formattedDate}
                          </span>
                        </div>

                        <div className="blogs-list-read">
                          <span>Read Full Story</span>
                          <i className="fas fa-arrow-right"></i>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CategoryBlogs;
