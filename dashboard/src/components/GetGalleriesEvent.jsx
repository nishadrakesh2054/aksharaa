import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getImageUrl from "../utils/imageUrl";

const GetGalleriesEvent = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/getallgallery`
      );

      const list = response.data.gallery || response.data.data || [];
      setGalleries(Array.isArray(list) ? list : []);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery event?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/deletegallery/${id}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setGalleries((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error("Failed to delete item: " + response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleEdit = (gallery) => {
    setEditingItem(gallery);
    setEditTitle(gallery.title || "");
    setSelectedFiles(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      toast.error("Gallery title is required.");
      return;
    }

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("title", editTitle);

      if (selectedFiles && selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("galleries", selectedFiles[i]);
        }
      }

      const response = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/updategallery/${editingItem._id}`,
        formData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingItem(null);
        setSelectedFiles(null);
        fetchGalleries();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center my-5">Loading galleries...</p>;
  if (error) return <p className="text-center my-5 text-danger">Error: {error}</p>;

  return (
    <>
      <div className="pagebox my-5">
        <h2 className="text-center mb-4">Gallery Events</h2>

        {galleries.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Images</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {galleries.map((gallery) => (
                <tr key={gallery._id}>
                  <td>{gallery.title}</td>
                  <td>
                    <div className="d-flex flex-wrap">
                      {gallery.images && gallery.images.length > 0 ? (
                        gallery.images.map((image, index) => (
                          <img
                            key={index}
                            src={getImageUrl(image)}
                            alt={`Gallery ${gallery.title} Image ${index + 1}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              marginRight: "10px",
                              marginBottom: "10px",
                            }}
                          />
                        ))
                      ) : (
                        <p>No images available</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-md mx-1 text-dark"
                      onClick={() => handleEdit(gallery)}
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </button>

                    <button
                      className="btn btn-danger btn-md mx-1"
                      onClick={() => handleDelete(gallery._id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No galleries found</p>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Gallery Event</h5>
                  <button type="button" className="btn-close" onClick={() => setEditingItem(null)}></button>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Gallery Title:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Replace Images (Optional):</label>
                      <input
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={(e) => setSelectedFiles(e.target.files)}
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
    </>
  );
};

export default GetGalleriesEvent;
