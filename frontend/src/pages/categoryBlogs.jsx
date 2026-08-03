import React from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useActivities, useBlogs } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import SafeHTML from "../components/SafeHTML";


const CategoryBlogs = ({news}) => {
  const { categoryId } = useParams();
  const activityQuery = useActivities({ categoryId }, { enabled: Boolean(news) });
  const blogQuery = useBlogs({ categoryId }, { enabled: !news });
  const query = news ? activityQuery : blogQuery;
  const blogs = query.data || [];

  if (query.isLoading) return <div><Loader/></div>;
  if (query.error) return <div>{query.error.message}</div>;

  return (
    <>
  <div className="container mt-4">
      <h3 className="py-4 text-primary">Blogs For Category :</h3>
      <div className="row">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <Link to={news ? `/newsactivity/${blog._id}` : `/blog/${blog._id}`}
              key={blog._id}
              className="col-md-4 mb-4"
              // onClick={() => navigate()}
            >
              <div className="card h-100 shadow-sm rounded-0 ">
                <img
                  src={getFileUrl(blog.image)}
                  alt={blog.title}
                  className="card-img-top "
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary">{blog.title}</h5>
                  <p className="card-text">
                    <SafeHTML htmlString={`${(blog.description || "").slice(0, 150)}...`} />
                  </p>
                  
                  <div className=" text-muted">
                    <small>
                      Published on:{" "}
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A"}
                    </small>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div>No blogs found for this category.</div>
        )}
      </div>
    </div>
    </>
  
  );
};

export default CategoryBlogs;
