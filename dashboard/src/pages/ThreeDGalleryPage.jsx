import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit, RotateCw, Eye, Calendar } from "lucide-react";
import getImageUrl from "../utils/imageUrl";
import { listFromResponse } from "../utils/apiResponse";

const ThreeDGalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(null);

  const token = localStorage.getItem("token");

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/three/getallthreedimg`
      );
      setPhotos(listFromResponse(response.data, ["gallery", "threeDImages", "threeD"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch 3D images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this 3D photo entry?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/three/deletethreedimg/${id}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setPhotos((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem && !selectedFile) {
      toast.error("Please select a 3D image file.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      if (selectedFile) {
        formData.append("ThreeDimage", selectedFile);
      }

      let response;
      if (editingItem) {
        response = await axios.put(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/three/updatethreedimg/${editingItem._id}`,
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/three/createthreed`,
          formData,
          { headers: { Authorization: token } }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchPhotos();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="main">
      {/* Top Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            3D Gallery Photos
          </h4>
          <p className="text-muted mb-0 small">
            3D rotating component photo collection and interactive gallery entries.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={16} /> Upload 3D Photo
        </button>
      </div>

      {/* Grid Header Info Bar */}
      <div className="d-flex align-items-center justify-content-between mb-3 bg-white p-3 rounded-3 border">
        <div className="d-flex align-items-center gap-2">
          <RotateCw size={18} className="text-primary" />
          <h6 className="fw-bold mb-0 text-dark">3D Photo Collection</h6>
          <span className="badge-status badge-indigo ms-2">{photos.length} Photos</span>
        </div>
        <span className="small text-muted">Card Gallery Grid</span>
      </div>

      {/* 3D Gallery Photo Card Grid */}
      {loading ? (
        <div className="text-center py-5 bg-white rounded-3 border">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading 3D photos...</span>
          </div>
          <p className="text-muted small mt-2 mb-0">Fetching 3D gallery...</p>
        </div>
      ) : photos.length > 0 ? (
        <div className="row g-4">
          {photos.map((item, idx) => {
            const imageUrl = getImageUrl(item.images);

            return (
              <div key={item._id} className="col-12 col-sm-6 col-md-4 col-xl-3">
                <div className="photo-card">
                  {/* Photo Image Wrapper */}
                  <div className="photo-card-img-wrapper" style={{ height: "220px" }}>
                    <img
                      src={imageUrl}
                      onError={(e) => {
                        e.currentTarget.src = "/fallbackimage.avif";
                      }}
                      alt={`3D Entry ${idx + 1}`}
                      className="photo-card-img h-100"
                    />

                    {/* Hover Overlay with Lightbox */}
                    <div className="photo-card-actions-overlay">
                      <span className="badge bg-dark bg-opacity-75 text-white fw-semibold small">
                        Photo #{idx + 1}
                      </span>
                      <button
                        className="btn btn-sm btn-light rounded-circle p-2 shadow-sm"
                        title="Zoom 3D Image"
                        onClick={() => setViewPhoto(imageUrl)}
                      >
                        <Eye size={16} className="text-primary" />
                      </button>
                    </div>
                  </div>

                  {/* Card Footer Bar */}
                  <div className="photo-card-body">
                    <div className="d-flex align-items-center gap-1 text-muted small">
                      <Calendar size={14} />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-1">
                      <button
                        className="btn-icon btn-icon-warning"
                        title="Edit 3D Image"
                        onClick={() => openEditModal(item)}
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        title="Delete 3D Image"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="photo-empty-state">
          <div className="icon-wrapper p-3 bg-light rounded-circle d-inline-flex mb-3">
            <RotateCw size={32} className="text-muted" />
          </div>
          <h5 className="fw-bold text-dark mb-1">No 3D Photos Uploaded</h5>
          <p className="text-muted small mb-3">
            Upload high-quality images to populate your interactive 3D rotation gallery.
          </p>
          <button className="btn btn-executive" onClick={openAddModal}>
            <Plus size={16} /> Upload First 3D Photo
          </button>
        </div>
      )}

      {/* Lightbox Image Preview Modal */}
      {viewPhoto && (
        <div className="executive-modal-backdrop" onClick={() => setViewPhoto(null)}>
          <div
            className="executive-modal p-3 bg-transparent border-0 shadow-none text-center"
            style={{ maxWidth: "900px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="position-relative d-inline-block">
              <button
                type="button"
                className="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3 bg-dark p-2 rounded-circle"
                onClick={() => setViewPhoto(null)}
              ></button>
              <img
                src={viewPhoto}
                alt="3D Image Zoom View"
                className="img-fluid rounded-3 shadow-lg border border-secondary"
                style={{ maxHeight: "82vh", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "580px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {editingItem ? "Edit 3D Gallery Image" : "Upload New 3D Photo"}
                </h5>
                <small className="text-muted">Select high-resolution image file</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              {/* Thumbnail Preview */}
              {(selectedFile || editingItem?.images) && (
                <div className="mb-4 text-center p-3 bg-light rounded-3 border">
                  <p className="small text-muted fw-bold mb-2">Selected Image Preview:</p>
                  <img
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : getImageUrl(editingItem?.images)
                    }
                    alt="Preview"
                    className="img-fluid rounded-3 border shadow-sm"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-bold">
                  {editingItem ? "Replace 3D Image (Optional):" : "Select 3D Image File *:"}
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>

              <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-secondary px-4 py-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-executive px-4 py-2"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingItem ? "Update 3D Photo" : "Upload 3D Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDGalleryPage;
