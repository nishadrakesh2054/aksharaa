import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import getImageUrl from "../utils/imageUrl";
import { listFromResponse } from "../utils/apiResponse";

const GetBlogs = () => {
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/blog/`
        );
        console.log("blogs", response.data);
        if (response.data.success) {
          setData(listFromResponse(response.data, ["blogs"]));
        } else {
          console.error("Failed to fetch data:", response.data.message);
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleView = (id) => {
    console.log("View item:", id);
  };
  console.log("data", data);

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/blog/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setData((prev) => prev.filter((blog) => blog._id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      console.error(error);
    }
  };

  return (
    <>
    <div className="pagebox">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <h3 className="d-flex justify-content-center py-4">
          <span className="d-none d-lg-block border-bottom border-danger border-2">
            All Latest Blogs
          </span>
        </h3>
        <div className="container">
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center">Image</th>
                  <th className="text-center">Title</th>
                  <th className="text-center">Category</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        width="100"
                        className="img-fluid rounded"
                      />
                    </td>
                    <td className="">
                      <p>{item.title}</p>
                    </td>
                    <td className="text-center">
                      <span>{item.category && item.category.title ? item.category.title : "Please specify category for this blog."}</span>
                    </td>
                    <td className="text-center">
                      <span>
                        {(() => {
                          const date = new Date(item.createdAt);
                          const options = {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          };
                          const formattedDate = date
                            .toLocaleDateString("en-US", options)
                            .split(", ");

                          return `${formattedDate[1]} ${formattedDate[0]}, ${formattedDate[2]}`;
                        })()}
                      </span>
                    </td>
                    <td className="  gap-2">
                      <button
                        className="btn btn-info btn-sm m-1"
                        onClick={() => handleView(item.id)}
                      >
                        <Link to={`./${item._id}`}>
                          <i className="bi bi-eye"></i>
                        </Link>
                      </button>
                      <button
                        className="btn btn-danger btn-sm m-1"
                        onClick={() => handleDelete(item._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default GetBlogs;
