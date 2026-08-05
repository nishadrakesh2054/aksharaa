import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit, Image as ImageIcon, Eye, Calendar, Sparkles } from "lucide-react";
import getImageUrl from "../utils/imageUrl";
import { listFromResponse } from "../utils/apiResponse";

const HeroSlidersPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(null);

  const token = localStorage.getItem("token");

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/hero/getallheroimg`
      );
      setBanners(listFromResponse(response.data, ["Heros", "heros"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch hero sliders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
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
    if (!window.confirm("Are you sure you want to delete this hero slider photo?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/hero/deleteheroimg/${id}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setBanners((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem && !selectedFile) {
      toast.error("Please select a hero banner image.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      if (selectedFile) {
        formData.append("Heroimage", selectedFile);
      }

      let response;
      if (editingItem) {
        response = await axios.put(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/hero/updateheroimg/${editingItem._id}`,
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/hero/herobanner`,
          formData,
          { headers: { Authorization: token } }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchBanners();
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
            Hero Banner Sliders
          </h4>
          <p className="text-muted mb-0 small">
            Manage homepage visual banner carousel slides and full-width photos.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={16} /> Upload New Slider
        </button>
      </div>

      {/* Grid Header Info Bar */}
      <div className="d-flex align-items-center justify-content-between mb-3 bg-white p-3 rounded-3 border">
        <div className="d-flex align-items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          <h6 className="fw-bold mb-0 text-dark">Active Hero Sliders</h6>
          <span className="badge-status badge-brand ms-2">{banners.length} Banners</span>
        </div>
        <span className="small text-muted">Landscape Aspect Ratio (16:9)</span>
      </div>

      {/* Hero Sliders Photo Grid Layout */}
      {loading ? (
        <div className="text-center py-5 bg-white rounded-3 border">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading sliders...</span>
          </div>
          <p className="text-muted small mt-2 mb-0">Fetching slider gallery...</p>
        </div>
      ) : banners.length > 0 ? (
        <div className="row g-4">
          {banners.map((item, idx) => {
            const imageUrl = getImageUrl(item.images);

            return (
              <div key={item._id} className="col-12 col-md-6 col-xl-4">
                <div className="photo-card">
                  {/* Photo Thumbnail Wrapper */}
                  <div className="photo-card-img-wrapper" style={{ height: "210px" }}>
                    <img
                      src={imageUrl}
                      onError={(e) => {
                        e.currentTarget.src = "/fallbackimage.avif";
                      }}
                      alt={`Hero Slide ${idx + 1}`}
                      className="photo-card-img h-100"
                    />

                    {/* Hover Overlay with Lightbox Trigger */}
                    <div className="photo-card-actions-overlay">
                      <span className="badge bg-dark bg-opacity-75 text-white fw-semibold small">
                        Slide #{idx + 1}
                      </span>
                      <button
                        className="btn btn-sm btn-light rounded-circle p-2 shadow-sm"
                        title="Zoom Image"
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
                        title="Edit Banner"
                        onClick={() => openEditModal(item)}
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        title="Delete Banner"
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
            <ImageIcon size={32} className="text-muted" />
          </div>
          <h5 className="fw-bold text-dark mb-1">No Hero Sliders Uploaded</h5>
          <p className="text-muted small mb-3">
            Upload high-resolution landscape images for the school homepage banner slider.
          </p>
          <button className="btn btn-executive" onClick={openAddModal}>
            <Plus size={16} /> Upload First Hero Banner
          </button>
        </div>
      )}

      {/* Lightbox Image Preview Modal */}
      {viewPhoto && (
        <div className="executive-modal-backdrop" onClick={() => setViewPhoto(null)}>
          <div
            className="executive-modal p-3 bg-transparent border-0 shadow-none text-center"
            style={{ maxWidth: "1000px" }}
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
                alt="Banner Zoom View"
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
          <div className="executive-modal" style={{ maxWidth: "600px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {editingItem ? "Edit Hero Banner" : "Upload New Hero Banner"}
                </h5>
                <small className="text-muted">Select high-quality landscape image (16:9 ratio)</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              {/* Thumbnail Preview if selected or editing */}
              {(selectedFile || editingItem?.images) && (
                <div className="mb-4 text-center p-3 bg-light rounded-3 border">
                  <p className="small text-muted fw-bold mb-2">Image Preview:</p>
                  <img
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : getImageUrl(editingItem?.images)
                    }
                    alt="Preview"
                    className="img-fluid rounded-3 border shadow-sm"
                    style={{ maxHeight: "200px", width: "100%", objectFit: "cover" }}
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-bold">
                  {editingItem ? "Replace Banner Image (Optional):" : "Select Banner Image *:"}
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
                  {submitting ? "Saving..." : editingItem ? "Update Banner" : "Upload Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSlidersPage;
