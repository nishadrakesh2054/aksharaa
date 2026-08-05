import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { listFromResponse } from "../utils/apiResponse";

const ActivityCategory = () => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/activityCategory`
      );

      setCategories(listFromResponse(response.data, ["categories"]));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity category?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/activityCategory/${id}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setCategories(listFromResponse(response.data, ["categories"]));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setEditTitle(category.title || "");
  };

  const handleUpdate = async (id) => {
    if (!editTitle.trim()) {
      toast.error("Category title is required.");
      return;
    }

    try {
      setUpdating(true);
      const response = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/activityCategory/${id}`,
        { title: editTitle },
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingId(null);
        setCategories(listFromResponse(response.data, ["categories"]));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="pagebox">
        <section className="section min-vh-100 d-flex flex-column align-items-center justify-content-start py-4">
          <h3 className="d-flex justify-content-center pt-5">
            <span className="d-none d-lg-block border-bottom border-danger text-success border-2 fw-semibold">
              Activity Category
            </span>
          </h3>

          <div className="container mx-auto">
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark border border-danger">
                  <tr>
                    <th className="text-center">Category Name</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="border border-info">
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td className="text-center">
                        {editingId === category._id ? (
                          <input
                            type="text"
                            className="form-control d-inline-block w-75"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        ) : (
                          category.title
                        )}
                      </td>

                      <td className="text-center">
                        {editingId === category._id ? (
                          <>
                            <button
                              className="btn btn-success btn-md mx-1"
                              onClick={() => handleUpdate(category._id)}
                              disabled={updating}
                            >
                              <i className="bi bi-check"></i> Save
                            </button>
                            <button
                              className="btn btn-secondary btn-md mx-1"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-warning btn-md mx-1 text-dark"
                              onClick={() => handleEdit(category)}
                            >
                              <i className="bi bi-pencil"></i> Edit
                            </button>
                            <button
                              className="btn btn-danger btn-md mx-1"
                              onClick={() => handleDelete(category._id)}
                            >
                              <i className="bi bi-trash"></i> Delete
                            </button>
                          </>
                        )}
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

export default ActivityCategory;
