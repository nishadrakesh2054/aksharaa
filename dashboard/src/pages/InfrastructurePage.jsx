import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Building2, Edit, Image, Plus, Search, Trash2, Upload, X } from "lucide-react";
import getImageUrl from "../utils/imageUrl";

const iconOptions = [
  { label: "Computer Laboratory", value: "fas fa-desktop text-primary" },
  { label: "Science Laboratory", value: "fas fa-flask text-success" },
  { label: "Cafeteria", value: "fas fa-utensils text-success" },
  { label: "Library", value: "fas fa-book text-warning" },
  { label: "Play Area", value: "fas fa-futbol text-info" },
  { label: "Transportation", value: "fas fa-bus text-primary" },
  { label: "Outdoor Learning Spaces", value: "fas fa-seedling text-warning" },
  { label: "Infirmary", value: "fas fa-stethoscope text-danger" },
  { label: "School Facility", value: "fas fa-school text-primary" },
];

const getFileKey = (file) => `${file.name}-${file.size}-${file.lastModified}`;

const InfrastructurePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [title, setTitle] = useState("");
  const [iconClass, setIconClass] = useState("fas fa-school text-primary");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchInfrastructure = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/infrastructure`);
      const list = res.data.infrastructure || res.data.data || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch infrastructure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfrastructure();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setIconClass("fas fa-school text-primary");
    setDescription("");
    setOrder(items.length + 1);
    setSelectedFiles([]);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setIconClass(item.iconClass || "fas fa-school text-primary");
    setDescription(item.description || "");
    setOrder(item.order || 0);
    setSelectedFiles([]);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const incomingFiles = Array.from(e.target.files || []);
    setSelectedFiles((prev) => {
      const existingKeys = new Set(prev.map(getFileKey));
      const newFiles = incomingFiles.filter((file) => !existingKeys.has(getFileKey(file)));
      const nextFiles = [...prev, ...newFiles].slice(0, 5);

      if (prev.length + newFiles.length > 5) {
        toast.error("You can upload up to 5 photos only.");
      }

      return nextFiles;
    });
    e.target.value = "";
  };

  const removeSelectedFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    if (!editingItem && (!selectedFiles || selectedFiles.length === 0)) {
      toast.error("Please select at least one infrastructure photo.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("iconClass", iconClass);
      formData.append("description", description);
      formData.append("order", order);

      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      const url = editingItem
        ? `${import.meta.env.VITE_SERVERAPI}/api/v1/infrastructure/${editingItem._id}`
        : `${import.meta.env.VITE_SERVERAPI}/api/v1/infrastructure`;

      const response = editingItem
        ? await axios.put(url, formData)
        : await axios.post(url, formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchInfrastructure();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this infrastructure item?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/infrastructure/${id}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const filteredItems = items.filter((item) => {
    const query = searchTerm.toLowerCase();
    return (
      (item.title || "").toLowerCase().includes(query) ||
      (item.description || "").toLowerCase().includes(query)
    );
  });

  return (
    <div id="main">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Infrastructure Management
          </h4>
          <p className="text-muted mb-0 small">
            Manage infrastructure cards, detail descriptions, icons, ordering, and photos.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={15} /> Add Infrastructure
        </button>
      </div>

      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <Building2 size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">Infrastructure Directory ({filteredItems.length})</h5>
          </div>
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="form-control"
              placeholder="Search infrastructure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Facility / Infrastructure</th>
                <th>Icon</th>
                <th>Display Order</th>
                <th>Date Added</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Loading infrastructure...
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const firstImg = getImageUrl(item.images);
                  const imageCount = Array.isArray(item.images) ? item.images.length : item.images ? 1 : 0;

                  return (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={firstImg}
                            onError={(e) => {
                              e.currentTarget.src = "/fallbackimage.avif";
                            }}
                            alt={item.title}
                            width="50"
                            height="50"
                            className="rounded-3 object-fit-cover border"
                          />
                          <div>
                            <span className="fw-semibold text-dark d-block">{item.title}</span>
                            {imageCount > 1 && (
                              <small className="text-muted">+{imageCount - 1} additional photos</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="p-2 rounded-circle bg-light border d-inline-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
                            <i className={item.iconClass || "fas fa-school text-primary"}></i>
                          </span>
                          <span className="small text-muted font-monospace">{item.iconClass || "fas fa-school"}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">Order #{item.order}</span>
                      </td>
                      <td className="small text-muted">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn-icon btn-icon-warning"
                          title="Edit Infrastructure"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          title="Delete Infrastructure"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No infrastructure items found. Click &quot;+ Add Infrastructure&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {showModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "820px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {editingItem ? "Edit Infrastructure" : "Add Infrastructure"}
                </h5>
                <small className="text-muted">The page intro text remains static; manage the cards and detail data here.</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 p-md-5">
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Computer Laboratory"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-bold">Display Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-bold">Photos ({selectedFiles.length}/5)</label>
                  <label className="form-control d-flex align-items-center justify-content-center mb-0 cursor-pointer" title="Choose up to 5 infrastructure photos">
                    <Upload size={18} />
                    <input
                      type="file"
                      className="d-none"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                <div className="col-12 col-md-5">
                  <label className="form-label fw-bold">Icon Preset</label>
                  <select
                    className="form-select"
                    value={iconClass}
                    onChange={(e) => setIconClass(e.target.value)}
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-7">
                  <label className="form-label fw-bold">Icon Class / Color</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className={iconClass}></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. fas fa-desktop text-primary"
                      value={iconClass}
                      onChange={(e) => setIconClass(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Description <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  rows="7"
                  placeholder="Write the infrastructure detail description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              {selectedFiles && selectedFiles.length > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-bold">Selected Photos</label>
                  <div className="d-flex flex-wrap gap-3">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="position-relative"
                        style={{ width: "64px", height: "64px" }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Selected infrastructure ${index + 1}`}
                          className="rounded-circle w-100 h-100 object-fit-cover border border-2 border-white shadow-sm"
                        />
                        <button
                          type="button"
                          className="btn p-0 rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center shadow-sm"
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "#DC2626",
                            color: "#FFFFFF",
                            border: "2px solid #FFFFFF",
                            transform: "translate(25%, -25%)",
                          }}
                          title="Remove selected photo"
                          onClick={() => removeSelectedFile(index)}
                        >
                          <X size={12} color="#FFFFFF" strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  {submitting ? "Saving..." : editingItem ? "Update Infrastructure" : "Save Infrastructure"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfrastructurePage;
