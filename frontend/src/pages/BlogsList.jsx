import React from "react";
import { Link } from "react-router-dom";
import SafeHTML from "../components/SafeHTML";
import { getFileUrl } from "../api/media";
import { useBlogs } from "../api/hooks/usePublicContent";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import EmptyState from "../components/states/EmptyState";
import SEO from "../components/SEO";
import SectionHeader from "../components/SectionHeader";
import "../css/blogsList.css";

const stripHtml = (value = "") => value.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();

const BlogsList = () => {
  const { data: blogs = [], isLoading, error } = useBlogs();
  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  return (
    <main className="blogs-list-page">
      <SEO
        title="Blogs | Aksharaa School"
        description="Read all Aksharaa School blog articles, education updates, school stories, and learning insights."
      />
      <div className="container mx-auto">
        <SectionHeader
          badge="AKSHARAA BLOGS"
          title="All"
          highlight="Blogs"
        />

        {isLoading && (
          <div className="blogs-list-state">
            <LoadingState label="Loading blogs..." />
          </div>
        )}

        {error && (
          <div className="blogs-list-state">
            <ErrorState message={error.message} />
          </div>
        )}

        {!isLoading && !error && sortedBlogs.length > 0 && (
          <div className="blogs-list-grid">
            {sortedBlogs.map((blog) => {
              const formattedDate = blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Aksharaa Blog";
              const excerpt = blog.excerpt || stripHtml(blog.description).slice(0, 150);

              return (
                <Link to={`/blog/${blog._id}`} className="blogs-list-card" key={blog._id}>
                  <div className="blogs-list-image">
                    <img
                      src={getFileUrl(blog.image)}
                      alt={blog.title || "Blog post"}
                      loading="lazy"
                    />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="blogs-list-body">
                    <h2>{blog.title || "Untitled Blog"}</h2>
                    <div className="blogs-list-excerpt">
                      <SafeHTML htmlString={blog.excerpt ? excerpt : excerpt ? `${excerpt}...` : ""} />
                    </div>
                    <div className="blogs-list-meta">
                      <span>{blog.author || "Aksharaa School"}</span>
                      {blog.readTime ? <span>{blog.readTime}</span> : null}
                    </div>
                    <div className="blogs-list-read">
                      <span>Read More</span>
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!isLoading && !error && sortedBlogs.length === 0 && (
          <div className="blogs-list-state">
            <EmptyState message="No blogs available at the moment." />
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogsList;
