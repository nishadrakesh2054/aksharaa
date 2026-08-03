import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SafeHtml from "./safeHtml";
import {toast} from "react-hot-toast"
import getImageUrl from "../utils/imageUrl";

export default function GetActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState();


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSelectedPost() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/activity/${id}`
        );
        if (response.data.success) {
          setPost(response.data.activity);
        } else {
          console.error("Failed to fetch data:", response.data.message);
          toast.error(response.data.message);
          
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        console.error(error);
        navigate("/get-activities")
      } finally {
        setLoading(false);
      }
    }
    getSelectedPost();
  }, [id, navigate]);

  return (
    <>
      <div className="pagebox">
        <div className="container">
          <section className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="mt-5 p-4 border rounded shadow-lg w-75 bg-white">
              {!loading && post ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">{post.title}</h2>
                    <div>
                      <Link
                        to={"./edit"}
                        className="btn btn-warning btn-sm mx-2"
                      >
                        Edit
                      </Link>
                      <Link
                        to={"./reupload"}
                        className="btn btn-secondary btn-sm"
                      >
                        Reupload Image
                      </Link>
                    </div>
                  </div>
                  <img
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    className="img-fluid rounded mb-4 w-75 "
                  />
                  <div>
                    <strong>Category: </strong>
                    <span>{post.category?.title?  post.category.title : "Please specify category for this activity"}</span>
                  </div>
                  <div className="mb-4">
                    <strong>Date: </strong>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="mb-2 border">
                    <strong> Description:</strong>
                    <SafeHtml htmlString={post.description} />
                  </div>
                  <Link to="/get-activities" className="btn btn-primary">
                    Back to Activities
                  </Link>
                </>
              ) : (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-3">Loading activity details...</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
