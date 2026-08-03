import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const GetCreativeWeek = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/creative/getallcreativeweek"
        );
        console.log('response creativeweek', response)

        if (response.data.success) {
          setData(response.data.notices);
          console.log("Get all notices", response.data.notices);
        } else {
          console.error("Failed to fetch data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleView = (id) => {
    console.log("View item:", id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/creative/deletecreativeweek/${id}`
      );
      console.log("delete photos:", response);

      if (response.data.success) {
        toast.success(response.data.message);

        setData(data.filter((item) => item._id !== id));
      } else {
        console.error("Failed to delete item:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <>
      <div className="pagebox">
        <section className="section min-vh-100 d-flex flex-column align-items-center justify-content-start py-4">
          <h3 className="d-flex justify-content-center pt-5">
            <span className="d-none d-lg-block border-bottom border-danger text-success border-2 fw-semibold">
              All Creative Of Week
            </span>
          </h3>

          <div className="container mx-auto">
            <div className="table-responsive ">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark border border-danger">
                  <tr>
                    <th className="text-center">Images</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="border border-info">
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        <img
                          src={`http://localhost:5000/${item.images.replace(
                            /\\/g,
                            "/"
                          )}`}
                          alt={item.title}
                          width="100"
                          className="img-fluid rounded"
                        />
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-info btn-md text-white mx-1"
                          onClick={() => handleView(item._id)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        <button
                          className="btn btn-danger btn-md  mx-1"
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

export default GetCreativeWeek;


