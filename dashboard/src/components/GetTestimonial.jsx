import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getImageUrl from "../utils/imageUrl";

const GetTestimonial = () => {
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editParentname, setEditParentname] = useState("");
  const [editFeedback, setEditFeedback] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/testimonial`
      );
      if (response.data.success) {
        const list = response.data.testimonial || response.data.testimonials || response.data.data || [];
        setData(Array.isArray(list) ? list : []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/testimonial/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setData((prevData) => prevData.filter((item) => item._id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditTitle(item.title || "");
    setEditParentname(item.parentname || "");
    setEditFeedback(item.feedback || "");
    setSelectedFile(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editFeedback.trim()) {
      toast.error("Feedback content is required.");
      return;
    }

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("parentname", editParentname);
      formData.append("feedback", editFeedback);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/testimonial/${editingItem._id}`,
        formData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingItem(null);
        setSelectedFile(null);
        fetchData();
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
    <div className="pagebox">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <h3 className="d-flex justify-content-center py-4">
          <span className="d-none d-lg-block border-bottom border-danger border-2">
            All Testimonials
          </span>
        </h3>
        <div className="container">
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center">Image</th>
                  <th className="text-center">Title</th>
                  <th className="text-center">Parent Name</th>
                  <th className="text-center">Feedback</th>
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
                        className="img-fluid rounded"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <span>{item.title}</span>
                    </td>
                    <td className="text-center">
                      <span>{item.parentname}</span>
                    </td>
                    <td className="text-center">
                      <span>{item.feedback}</span>
                    </td>

                    <td className="text-center">
                      <button
                        className="btn btn-warning btn-sm mx-1 text-dark"
                        onClick={() => handleEdit(item)}
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm mx-1"
                        onClick={() => handleDelete(item._id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Testimonial</h5>
                <button type="button" className="btn-close" onClick={() => setEditingItem(null)}></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title / Role:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Parent Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editParentname}
                      onChange={(e) => setEditParentname(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Feedback Content:</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editFeedback}
                      onChange={(e) => setEditFeedback(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Replace Image (Optional):</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingItem(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={updating}>
                    {updating ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetTestimonial;
