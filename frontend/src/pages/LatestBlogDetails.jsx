import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SafeHTML from "../components/SafeHTML";
import { getFileUrl } from "../api/media";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import SEO from "../components/SEO";
import "../css/latestBlogDetails.css";
import {
  useActivities,
  useActivity,
  useActivityCategories,
  useBlog,
  useBlogCategories,
  useBlogs,
} from "../api/hooks/usePublicContent";

const LatestBlogDetails = ({ news }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const activityQuery = useActivity(id, { enabled: Boolean(news) });
  const blogQuery = useBlog(id, { enabled: !news });
  const activityCategoryQuery = useActivityCategories({ enabled: Boolean(news) });
  const blogCategoryQuery = useBlogCategories({ enabled: !news });

  const detailQuery = news ? activityQuery : blogQuery;
  const categoryQuery = news ? activityCategoryQuery : blogCategoryQuery;
  const blog = detailQuery.data;
  const categoryId = blog?.category?._id || "";

  const relatedActivitiesQuery = useActivities({ categoryId }, { enabled: Boolean(news && categoryId) });
  const relatedBlogsQuery = useBlogs({ categoryId }, { enabled: Boolean(!news && categoryId) });
  const relatedQuery = news ? relatedActivitiesQuery : relatedBlogsQuery;

  const categories = categoryQuery.data || [];
  const relatedPosts = (relatedQuery.data || [])
    .filter((relatedBlog) => relatedBlog._id !== blog?._id)
    .slice(0, 5);

  if (detailQuery.isLoading || categoryQuery.isLoading) {
    return (
      <div className="minimal-news-wrapper py-5 text-center d-flex align-items-center justify-content-center">
        <LoadingState label="Loading article..." />
      </div>
    );
  }

  if (detailQuery.error || categoryQuery.error) {
    return (
      <div className="minimal-news-wrapper py-5 text-center">
        <div className="container py-4">
          <ErrorState message={detailQuery.error?.message || categoryQuery.error?.message} />
          <button className="minimal-back-btn mt-3" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left me-2"></i> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="minimal-news-wrapper py-5 text-center">
        <div className="container py-4">
          <h3 className="fw-bold text-dark">Article Not Found</h3>
          <p className="text-secondary">The requested article could not be found.</p>
          <button className="minimal-back-btn mt-2" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left me-2"></i> Back to List
          </button>
        </div>
      </div>
    );
  }

  const publishDate = blog?.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const categoryName = blog?.category?.title || (news ? "News & Activity" : "Blog Article");

  const cleanDescription = blog?.seoDescription || blog?.excerpt || (blog?.description
    ? blog.description.replace(/<[^>]+>/g, " ").trim().slice(0, 160)
    : "Read the latest news, events, activities, and educational updates from Aksharaa School Kathmandu."
  );

  const articleSchema = blog
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: blog.seoTitle || blog.title,
        description: cleanDescription,
        image: blog.image ? [getFileUrl(blog.image)] : [],
        datePublished: blog.createdAt,
        dateModified: blog.updatedAt || blog.createdAt,
        author: {
          "@type": "Organization",
          name: blog.author || "Aksharaa School",
        },
        publisher: {
          "@type": "Organization",
          name: "Aksharaa School",
          logo: {
            "@type": "ImageObject",
            url: "https://www.aksharaaschool.edu.np/akasharalogo.png",
          },
        },
      }
    : null;

  return (
    <div className="minimal-news-wrapper py-4 py-md-5">
      <SEO
        title={blog?.seoTitle || blog?.title}
        description={cleanDescription}
        image={blog?.image ? getFileUrl(blog.image) : undefined}
        type="article"
        schema={articleSchema}
      />

      <div className="container mx-auto">
        <div className="row g-4">
          {/* Main Content: 9 Columns */}
          <div className="col-lg-9 col-md-12">
            {/* Top Navigation & Category Pill */}
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <button className="minimal-back-btn" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left me-2"></i>
                <span>Back to {news ? "News & Activities" : "Blogs"}</span>
              </button>
              <span className="minimal-category-badge">{categoryName}</span>
            </div>

            {/* Minimalist Article Card */}
            <article className="minimal-article-card p-4 p-md-5">
              {/* Header Title */}
              <h1 className="minimal-news-title mb-3">{blog?.title}</h1>

              {/* Subtitle / Excerpt */}
              {blog?.excerpt && (
                <p className="minimal-news-excerpt mb-3">{blog.excerpt}</p>
              )}

              {/* Meta Details Bar */}
              <div className="minimal-meta-bar mb-4">
                <span className="meta-item">
                  <i className="far fa-calendar-alt me-1 text-danger"></i> {publishDate}
                </span>
                <span className="meta-dot">•</span>
                <span className="meta-item">
                  <i className="fas fa-graduation-cap me-1 text-danger"></i> {blog?.author || "Aksharaa School"}
                </span>
                {news && blog?.location && (
                  <>
                    <span className="meta-dot">•</span>
                    <span className="meta-item">
                      <i className="fas fa-map-marker-alt me-1 text-danger"></i> {blog.location}
                    </span>
                  </>
                )}
                {news && blog?.eventDate && (
                  <>
                    <span className="meta-dot">•</span>
                    <span className="meta-item">
                      <i className="far fa-calendar-check me-1 text-danger"></i> Event: {new Date(blog.eventDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </>
                )}
              </div>

              {/* Featured Cover Image */}
              {blog?.image && (
                <div className="minimal-image-wrapper mb-4">
                  <img
                    src={getFileUrl(blog.image)}
                    alt={blog?.title}
                    className="minimal-featured-img img-fluid"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Main HTML Article Content */}
              <div className="minimal-content-body">
                <SafeHTML htmlString={blog?.description} />
              </div>
            </article>
          </div>

          {/* Right Sidebar: 3 Columns */}
          <div className="col-lg-3 col-md-12">
            <div className="position-sticky" style={{ top: "90px" }}>
              {/* Simple Categories List */}
              {categories.length > 0 && (
                <div className="minimal-sidebar-card p-3 mb-4">
                  <h6 className="sidebar-subtitle mb-3">
                    <i className="fas fa-tags me-2 text-danger"></i> Categories
                  </h6>
                  <div className="d-flex flex-column gap-1">
                    {categories.map((cat) => (
                      <div
                        key={cat._id}
                        onClick={() =>
                          navigate(
                            news
                              ? `/newsactivitycategory/${cat._id}`
                              : `/category/${cat._id}`
                          )
                        }
                        className={`sidebar-cat-item ${
                          cat._id === categoryId ? "active-sidebar-cat" : ""
                        }`}
                        role="button"
                      >
                        <span>{cat.title}</span>
                        <i className="fas fa-chevron-right icon-sm"></i>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Simple Related Posts List */}
              <div className="minimal-sidebar-card p-3">
                <h6 className="sidebar-subtitle mb-3">
                  <i className="fas fa-bookmark me-2 text-danger"></i> Related {news ? "Activities" : "Posts"}
                </h6>
                {relatedPosts.length < 1 ? (
                  <p className="text-muted small m-0 py-1">No related items found.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {relatedPosts.map((post) => (
                      <Link
                        key={post._id}
                        to={news ? `/newsactivity/${post._id}` : `/blog/${post._id}`}
                        className="sidebar-related-item d-flex align-items-center gap-2 text-decoration-none"
                      >
                        {post.image && (
                          <img
                            src={getFileUrl(post.image)}
                            alt={post.title}
                            className="sidebar-related-thumb flex-shrink-0"
                            loading="lazy"
                          />
                        )}
                        <div className="overflow-hidden min-w-0 flex-grow-1">
                          <h6 className="sidebar-related-title mb-1" title={post.title}>
                            {post.title}
                          </h6>
                          <span className="sidebar-related-date">
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : ""}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestBlogDetails;
