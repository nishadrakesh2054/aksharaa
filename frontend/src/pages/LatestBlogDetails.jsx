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
    .slice(0, 4);

  if (detailQuery.isLoading || categoryQuery.isLoading) {
    return (
      <div className="news-details-wrapper py-5 text-center d-flex align-items-center justify-content-center">
        <LoadingState label="Loading news details..." />
      </div>
    );
  }

  if (detailQuery.error || categoryQuery.error) {
    return (
      <div className="news-details-wrapper py-5 text-center">
        <div className="container py-4">
          <ErrorState message={detailQuery.error?.message || categoryQuery.error?.message} />
          <button className="news-back-btn mt-3" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="news-details-wrapper py-5 text-center">
        <div className="container py-4">
          <h3>Content Not Found</h3>
          <p className="text-secondary">The requested article could not be found.</p>
          <button className="news-back-btn mt-2" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> Back to News & Activities
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
    <div className="news-details-wrapper py-4 py-md-5">
      <SEO
        title={blog?.seoTitle || blog?.title}
        description={cleanDescription}
        image={blog?.image ? getFileUrl(blog.image) : undefined}
        type="article"
        schema={articleSchema}
      />
      <div className="container mx-auto">
        {/* Navigation Breadcrumb / Back Button */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <button className="news-back-btn" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> Back to List
          </button>
          <span className="badge rounded-pill news-badge px-3 py-2 text-uppercase">
            {categoryName}
          </span>
        </div>

        <div className="row g-4">
          {/* Main Article Content */}
          <div className="col-lg-8 col-md-12">
            <div className="news-article-card p-4 p-md-5">
              {/* Header Title */}
              <h1 className="news-title mb-3">{blog?.title}</h1>
              {blog?.excerpt && (
                <p className="news-excerpt mb-3">{blog.excerpt}</p>
              )}

              {/* Meta Info Bar */}
              <div className="d-flex flex-wrap align-items-center gap-3 pb-3 mb-4 border-bottom">
                <span className="news-meta-item">
                  <i className="far fa-calendar-alt text-danger me-1"></i>
                  Published: {publishDate}
                </span>
                <span className="news-meta-item">
                  <i className="fas fa-graduation-cap text-danger me-1"></i>
                  {blog?.author || "Aksharaa School"}
                </span>
                {!news && blog?.readTime && (
                  <span className="news-meta-item">
                    <i className="far fa-clock text-danger me-1"></i>
                    {blog.readTime}
                  </span>
                )}
                {news && blog?.eventDate && (
                  <span className="news-meta-item">
                    <i className="far fa-calendar-check text-danger me-1"></i>
                    Event: {new Date(blog.eventDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              {news && blog?.location && (
                <div className="news-fact-row mb-4">
                  <span><i className="fas fa-map-marker-alt"></i>{blog.location}</span>
                </div>
              )}

              {/* Featured Cover Image */}
              {blog?.image && (
                <div className="mb-4">
                  <img
                    src={getFileUrl(blog.image)}
                    alt={blog?.title}
                    className="news-featured-img img-fluid"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Main Content Body */}
              <div className="news-content-box mt-3">
                <SafeHTML htmlString={blog?.description} />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-lg-4 col-md-12">
            <div className="position-sticky" style={{ top: "90px" }}>
              {/* Categories Card */}
              <div className="news-sidebar-card p-4 mb-4">
                <h4 className="sidebar-title mb-3">Categories</h4>
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
                      className={`category-item d-flex align-items-center justify-content-between ${
                        cat._id === categoryId ? "active-cat" : ""
                      }`}
                    >
                      <span className="d-flex align-items-center gap-2">
                        <i className="fas fa-chevron-right"></i>
                        {cat.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Posts Card */}
              <div className="news-sidebar-card p-4">
                <h4 className="sidebar-title mb-3">Related Posts</h4>
                {relatedPosts.length < 1 ? (
                  <p className="text-muted small m-0 py-2">No related posts in this category.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {relatedPosts.map((post) => (
                      <Link
                        key={post._id}
                        to={
                          news
                            ? `/newsactivity/${post._id}`
                            : `/blog/${post._id}`
                        }
                        className="text-decoration-none"
                      >
                        <div className="related-post-card d-flex align-items-center gap-3">
                          {post.image && (
                            <img
                              src={getFileUrl(post.image)}
                              alt={post.title}
                              className="related-post-thumb"
                              loading="lazy"
                            />
                          )}
                          <div className="flex-grow-1 overflow-hidden">
                            <h6 className="related-post-title mb-1">{post.title}</h6>
                            <span className="related-post-date">
                              <i className="far fa-calendar-alt me-1 text-danger"></i>
                              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                            </span>
                          </div>
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
