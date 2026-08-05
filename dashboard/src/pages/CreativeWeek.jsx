import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit, Eye, Image, Palette, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Heading,
  Italic,
  Link,
  List,
  Paragraph,
  Table,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import DOMPurify from "dompurify";
import { listFromResponse } from "../utils/apiResponse";

const getFileKey = (file) => `${file.name}-${file.size}-${file.lastModified}`;

const CreativeWeek = () => {
  const [creatives, setCreatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCreatives = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/creative/getallcreativeweek`
      );
      setCreatives(listFromResponse(response.data, ["creative", "notices"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch creatives of this week");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatives();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setOrder(creatives.length + 1);
    setSelectedFiles([]);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
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
        toast.error("You can upload up to 5 images only.");
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
    if (!editingItem && selectedFiles.length === 0) {
      toast.error("Please select at least one creative image.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("order", order);
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const url = editingItem
        ? `${import.meta.env.VITE_SERVERAPI}/api/v1/creative/updatecreativeweek/${editingItem._id}`
        : `${import.meta.env.VITE_SERVERAPI}/api/v1/creative/createcreativeweek`;

      const response = editingItem
        ? await axios.put(url, formData, { headers: { Authorization: token } })
        : await axios.post(url, formData, { headers: { Authorization: token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchCreatives();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this creative week entry?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/creative/deletecreativeweek/${id}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setCreatives((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/fallbackimage.avif";
    return imagePath.startsWith("http")
      ? imagePath
      : `${import.meta.env.VITE_SERVERAPI}/${imagePath.replace(/\\/g, "/")}`;
  };

  const filteredCreatives = creatives.filter((item) => {
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
            Creatives Of This Week
          </h4>
          <p className="text-muted mb-0 small">
            Manage weekly creative posts with rich descriptions and multiple images.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={15} /> Add Creative
        </button>
      </div>

      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <Palette size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">Creative Directory ({filteredCreatives.length})</h5>
          </div>
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="form-control"
              placeholder="Search creatives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Creative Title</th>
                <th>Display Order</th>
                <th>Date Added</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading creatives...
                  </td>
                </tr>
              ) : filteredCreatives.length > 0 ? (
                filteredCreatives.map((item) => {
                  const images = Array.isArray(item.images) ? item.images : [item.images].filter(Boolean);
                  const firstImg = getImageUrl(images[0]);

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
                            {images.length > 1 && (
                              <small className="text-muted">+{images.length - 1} additional photos</small>
                            )}
                          </div>
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
                          className="btn-icon btn-icon-primary"
                          title="View Creative Details"
                          onClick={() => setViewItem(item)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn-icon btn-icon-warning"
                          title="Edit Creative"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          title="Delete Creative"
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
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No creatives found. Click &quot;+ Add Creative&quot; to post an entry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {showModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "900px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {editingItem ? "Edit Creative" : "Add Creative"}
                </h5>
                <small className="text-muted">Add title, rich description, display order, and up to 5 images.</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-7">
                  <label className="form-label fw-bold">Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Grade 5 Creative Writing Showcase"
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

                <div className="col-12 col-md-2">
                  <label className="form-label fw-bold">Images ({selectedFiles.length}/5)</label>
                  <label className="form-control d-flex align-items-center justify-content-center mb-0 cursor-pointer" title="Choose creative images">
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
              </div>

              {selectedFiles.length > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-bold">Selected Images</label>
                  <div className="d-flex flex-wrap gap-3">
                    {selectedFiles.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="position-relative" style={{ width: "66px", height: "66px" }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Selected creative ${index + 1}`}
                          className="rounded-circle w-100 h-100 object-fit-cover border border-2 border-white shadow-sm"
                        />
                        <button
                          type="button"
                          className="btn p-0 rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center shadow-sm"
                          style={{
                            width: "21px",
                            height: "21px",
                            backgroundColor: "#DC2626",
                            color: "#FFFFFF",
                            border: "2px solid #FFFFFF",
                            transform: "translate(25%, -25%)",
                          }}
                          title="Remove selected image"
                          onClick={() => removeSelectedFile(index)}
                        >
                          <X size={12} color="#FFFFFF" strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-bold mb-2">Description <span className="text-danger">*</span></label>
                <CKEditor
                  editor={ClassicEditor}
                  config={{
                    plugins: [
                      Essentials,
                      Bold,
                      Italic,
                      Paragraph,
                      Heading,
                      List,
                      Link,
                      Table,
                      Undo,
                    ],
                    toolbar: [
                      "undo",
                      "redo",
                      "|",
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "|",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "insertTable",
                    ],
                  }}
                  data={description}
                  onChange={(_event, editor) => {
                    setDescription(editor.getData());
                  }}
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
                  {submitting ? "Saving..." : editingItem ? "Update Creative" : "Save Creative"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "900px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0 text-dark">{viewItem.title}</h5>
              <button type="button" className="btn-close" onClick={() => setViewItem(null)}></button>
            </div>
            <div className="p-4">
              <div className="row g-3 mb-4">
                {(Array.isArray(viewItem.images) ? viewItem.images : [viewItem.images].filter(Boolean)).map((imagePath, index) => (
                  <div key={`${imagePath}-${index}`} className="col-12 col-md-4">
                    <img
                      src={getImageUrl(imagePath)}
                      alt={`${viewItem.title} ${index + 1}`}
                      className="img-fluid rounded-3 border"
                      style={{ width: "100%", height: "180px", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.src = "/fallbackimage.avif";
                      }}
                    />
                  </div>
                ))}
              </div>
              <div
                className="text-secondary"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(viewItem.description || ""),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeWeek;
