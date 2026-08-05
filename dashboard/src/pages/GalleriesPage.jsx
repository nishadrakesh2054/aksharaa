import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Search, Trash2, Edit, Image as ImageIcon, Eye, Calendar, Layers } from "lucide-react";
import getImageUrl from "../utils/imageUrl";
import { listFromResponse } from "../utils/apiResponse";

const GalleriesPage = () => {
  const [galleries, setGalleries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewAlbum, setViewAlbum] = useState(null);

  const [title, setTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/getallgallery`
      );
      setGalleries(listFromResponse(response.data, ["gallery", "galleries", "Galleries"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch gallery events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setSelectedFiles(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setSelectedFiles(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery event?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/deletegallery/${id}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setGalleries((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Gallery title is required.");
      return;
    }
    if (!editingItem && (!selectedFiles || selectedFiles.length === 0)) {
      toast.error("Please upload at least one image for the gallery.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);

      if (selectedFiles && selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("galleries", selectedFiles[i]);
        }
      }

      let response;
      if (editingItem) {
        response = await axios.put(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/updategallery/${editingItem._id}`,
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/creategallery`,
          formData,
          { headers: { Authorization: token } }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchGalleries();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredGalleries = galleries.filter((g) =>
    (g.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="main">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Photo Gallery Albums
          </h4>
          <p className="text-muted mb-0 small">
            Organize event photos into visual albums.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={16} /> Add Gallery Album
        </button>
      </div>

      {/* Search & Stats Filter Bar */}
      <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-3 rounded-3 border gap-3 flex-wrap">
        <div className="d-flex align-items-center gap-2">
          <Layers size={18} className="text-primary" />
          <h6 className="fw-bold mb-0 text-dark">Albums Register</h6>
          <span className="badge-status badge-indigo ms-1">{filteredGalleries.length} Albums</span>
        </div>
        <div className="search-input-wrapper">
          <Search size={15} />
          <input
            type="text"
            className="form-control"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Album Cards Grid Layout */}
      {loading ? (
        <div className="text-center py-5 bg-white rounded-3 border">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading albums...</span>
          </div>
          <p className="text-muted small mt-2 mb-0">Fetching photo galleries...</p>
        </div>
      ) : filteredGalleries.length > 0 ? (
        <div className="row g-4">
          {filteredGalleries.map((item) => {
            const coverUrl = getImageUrl(item.images);

            return (
              <div key={item._id} className="col-12 col-md-6 col-xl-4">
                <div className="photo-card">
                  {/* Album Cover Photo Wrapper */}
                  <div className="photo-card-img-wrapper" style={{ height: "210px" }}>
                    <img
                      src={coverUrl}
                      onError={(e) => {
                        e.currentTarget.src = "/fallbackimage.avif";
                      }}
                      alt={item.title}
                      className="photo-card-img h-100"
                    />

                    {/* Hover Overlay */}
                    <div className="photo-card-actions-overlay">
                      <span className="badge-status badge-brand">
                        {item.images?.length || 0} Photos
                      </span>
                      <button
                        className="btn btn-sm btn-light rounded-circle p-2 shadow-sm"
                        title="View Album Photos"
                        onClick={() => setViewAlbum(item)}
                      >
                        <Eye size={16} className="text-primary" />
                      </button>
                    </div>
                  </div>

                  {/* Album Details & Action Footer */}
                  <div className="p-3 border-top bg-white">
                    <h6 className="fw-bold text-dark mb-2 text-truncate" title={item.title}>
                      {item.title}
                    </h6>

                    {/* Thumbnail Stack */}
                    {item.images && item.images.length > 1 && (
                      <div className="d-flex gap-2 mb-3">
                        {item.images.slice(0, 4).map((img, i) => (
                          <img
                            key={i}
                            src={`${import.meta.env.VITE_SERVERAPI}/${img.replace(/\\/g, "/")}`}
                            onError={(e) => {
                              e.currentTarget.src = "/fallbackimage.avif";
                            }}
                            alt="Sample"
                            width="44"
                            height="44"
                            className="rounded-2 object-fit-cover border shadow-sm"
                          />
                        ))}
                      </div>
                    )}

                    <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                      <span className="small text-muted d-flex align-items-center gap-1">
                        <Calendar size={13} />
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <div className="d-flex gap-1">
                        <button
                          className="btn-icon btn-icon-warning"
                          title="Edit Album"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          title="Delete Album"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
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
          <h5 className="fw-bold text-dark mb-1">No Gallery Albums Found</h5>
          <p className="text-muted small mb-3">
            Create photo albums to showcase school events, functions, and activities.
          </p>
          <button className="btn btn-executive" onClick={openAddModal}>
            <Plus size={16} /> Create Gallery Album
          </button>
        </div>
      )}

      {/* Album Preview Lightbox Modal */}
      {viewAlbum && (
        <div className="executive-modal-backdrop" onClick={() => setViewAlbum(null)}>
          <div
            className="executive-modal p-4"
            style={{ maxWidth: "900px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
              <div>
                <h5 className="fw-bold mb-0 text-dark">{viewAlbum.title}</h5>
                <small className="text-muted">{viewAlbum.images?.length || 0} Photos in this album</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setViewAlbum(null)}
              ></button>
            </div>
            <div className="row g-3" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {viewAlbum.images?.map((img, idx) => (
                <div key={idx} className="col-6 col-md-4 col-lg-3">
                  <img
                    src={getImageUrl(img)}
                    onError={(e) => {
                      e.currentTarget.src = "/fallbackimage.avif";
                    }}
                    alt={`Photo ${idx + 1}`}
                    className="img-fluid rounded-3 border shadow-sm w-100 object-fit-cover"
                    style={{ height: "140px" }}
                  />
                </div>
              ))}
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
                  {editingItem ? "Edit Gallery Album" : "Create New Gallery Album"}
                </h5>
                <small className="text-muted">Upload one or multiple event photos</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="form-label fw-bold">Album Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sports Day 2026, Science Exhibition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {editingItem && editingItem.images && (
                <div className="mb-4 text-center p-3 bg-light rounded-3 border">
                  <p className="small text-muted fw-bold mb-2">Existing Album Cover:</p>
                  <img
                    src={`${import.meta.env.VITE_SERVERAPI}/${editingItem.images[0].replace(/\\/g, "/")}`}
                    alt="Album Cover"
                    className="img-fluid rounded-3 border shadow-sm"
                    style={{ maxHeight: "150px", objectFit: "cover" }}
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-bold">
                  {editingItem ? "Add More Photos to Album:" : "Select Gallery Photos *:"}
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  multiple
                  onChange={(e) => setSelectedFiles(e.target.files)}
                />
                <small className="text-muted">You can select multiple photos at once</small>
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
                  {submitting ? "Saving..." : editingItem ? "Update Album" : "Create Album"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleriesPage;
