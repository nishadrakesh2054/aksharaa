import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Search, Trash2, Edit, Activity, Eye } from "lucide-react";
import getImageUrl from "../utils/imageUrl";
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
  FontColor,
  FontBackgroundColor,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import DOMPurify from "dompurify";
import { listFromResponse } from "../utils/apiResponse";

const editorConfig = {
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
    FontColor,
    FontBackgroundColor,
  ],
  toolbar: [
    "undo",
    "redo",
    "|",
    "heading",
    "|",
    "bold",
    "italic",
    "fontColor",
    "fontBackgroundColor",
    "|",
    "link",
    "bulletedList",
    "numberedList",
    "insertTable",
  ],
};

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [actRes, catsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/activity`),
        axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/activityCategory`),
      ]);

      setActivities(listFromResponse(actRes.data, ["activities"]));
      setCategories(listFromResponse(catsRes.data, ["categories"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setExcerpt("");
    setDescription("");
    setSelectedCategory("");
    setEventDate("");
    setLocation("");
    setIsFeatured(false);
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (act) => {
    setEditingItem(act);
    setTitle(act.title || "");
    setExcerpt(act.excerpt || "");
    setDescription(act.description || "");
    setSelectedCategory(act.category?._id || act.category || "");
    setEventDate(act.eventDate ? new Date(act.eventDate).toISOString().slice(0, 10) : "");
    setLocation(act.location || "");
    setIsFeatured(Boolean(act.isFeatured));
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity entry?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/activity/${id}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setActivities((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    if (!editingItem && !imageFile) {
      toast.error("Please upload an activity cover image.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("description", description);
      formData.append("eventDate", eventDate);
      formData.append("location", location);
      formData.append("isFeatured", String(isFeatured));
      if (selectedCategory) {
        formData.append("selectedCategory", selectedCategory);
        formData.append("category", selectedCategory);
      }
      if (imageFile) {
        formData.append("activityImage", imageFile);
        formData.append("activityimage", imageFile);
        formData.append("image", imageFile);
      }


      let response;
      if (editingItem) {
        response = await axios.put(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/activity/${editingItem._id}`,
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/activity`,
          formData,
          { headers: { Authorization: token } }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredActivities = activities.filter((a) => {
    const query = searchTerm.toLowerCase();
    return (
      (a.title || "").toLowerCase().includes(query) ||
      (a.excerpt || "").toLowerCase().includes(query) ||
      (a.location || "").toLowerCase().includes(query)
    );
  });

  return (
    <div id="main">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="fw-bold mb-0" style={{ color: "#0F172A", fontSize: "1.15rem" }}>
            School Activities
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
            Manage activities and event logs.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={15} /> Add Activity
        </button>
      </div>

      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <Activity size={20} className="text-success" />
            <h5 className="fw-bold mb-0">Activities Register ({filteredActivities.length})</h5>
          </div>
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="form-control"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Activity Title</th>
                <th>Category</th>
                <th>Date Posted</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading activities...
                  </td>
                </tr>
              ) : filteredActivities.length > 0 ? (
                filteredActivities.map((act) => (
                  <tr key={act._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={getImageUrl(act.image)}
                          onError={(e) => {
                            e.currentTarget.src = "/fallbackimage.avif";
                          }}
                          alt={act.title}
                          width="50"
                          height="50"
                          className="rounded-3 object-fit-cover border"
                        />
                        <div>
                          <span className="fw-semibold text-dark d-block">{act.title}</span>
                          <small className="text-muted">
                            {act.excerpt || act.location || "No short summary added"}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge-status badge-emerald">
                        {act.category?.title || "General"}
                      </span>
                    </td>
                    <td className="small text-muted">
                      {new Date(act.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn-icon btn-icon-primary"
                        title="View Activity Details"
                        onClick={() => setViewItem(act)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn-icon btn-icon-warning"
                        title="Edit Activity"
                        onClick={() => openEditModal(act)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        title="Delete Activity"
                        onClick={() => handleDelete(act._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No activities found. Click &quot;+ Add Activity&quot; to log an event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Preview Modal */}
      {viewItem && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "900px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-light">
              <div>
                <h5 className="fw-bold mb-0 text-dark">Activity Log Detailed View</h5>
                <small className="text-muted">Preview event activity details and gallery images</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setViewItem(null)}
              ></button>
            </div>
            <div className="p-4 p-md-5">
              {viewItem.image && (
                <div className="mb-4 text-center">
                  <img
                    src={getImageUrl(viewItem.image)}
                    onError={(e) => {
                      e.currentTarget.src = "/fallbackimage.avif";
                    }}
                    alt={viewItem.title}
                    className="img-fluid rounded-3 border shadow-sm"
                    style={{ maxHeight: "380px", width: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                <span className="badge-status badge-brand fs-6">
                  {viewItem.category?.title || "General"}
                </span>
                <span className="text-muted small">
                  Posted: {new Date(viewItem.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                {viewItem.eventDate && (
                  <span className="text-muted small">
                    Event: {new Date(viewItem.eventDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                )}
                {viewItem.isFeatured && (
                  <span className="badge-status badge-emerald fs-6">Featured</span>
                )}
              </div>
              <h2 className="fw-bold mb-4 text-dark">{viewItem.title}</h2>
              {viewItem.excerpt && <p className="lead text-muted">{viewItem.excerpt}</p>}
              <div className="row g-3 mb-3">
                {viewItem.location && (
                  <div className="col-md-4 small text-muted"><strong>Location:</strong> {viewItem.location}</div>
                )}
              </div>
              <hr className="my-4" />
              <div
                className="activity-preview-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(viewItem.description || ""),
                }}
              />
            </div>
            <div className="p-3 border-top bg-light text-end">
              <button className="btn btn-secondary px-4" onClick={() => setViewItem(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "960px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {editingItem ? "Edit Activity Entry" : "Create New Activity Entry"}
                </h5>
                <small className="text-muted">Fill out event information, assign categories, and edit rich details</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 p-md-5">
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-7">
                  <label className="form-label fw-bold">Activity Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter activity event title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12 col-md-5">
                  <label className="form-label fw-bold">Activity Category</label>
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select Category (Optional)</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold">Short Summary / Excerpt</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    maxLength="280"
                    placeholder="Write a short card preview explaining what happened and why it matters..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  ></textarea>
                  <small className="text-muted">{excerpt.length}/280 characters</small>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Event Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. School auditorium"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-check d-flex align-items-center gap-2 mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                    />
                    <span className="form-check-label fw-bold">Featured activity</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  Activity Cover Image {editingItem ? "(Optional to replace)" : <span className="text-danger">*</span>}
                </label>
                <div className="p-3 rounded-3 border bg-light text-center" style={{ borderStyle: "dashed" }}>
                  {imageFile || editingItem?.image ? (
                    <div className="d-flex flex-column align-items-center gap-2">
                      <div className="position-relative overflow-hidden rounded-3 border shadow-sm w-100" style={{ maxHeight: "240px" }}>
                        <img
                          src={
                            imageFile
                              ? URL.createObjectURL(imageFile)
                              : getImageUrl(editingItem?.image)
                          }
                          alt="Activity Cover Preview"
                          className="w-100 object-fit-cover"
                          style={{ maxHeight: "240px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <label className="btn btn-sm btn-outline-primary mb-0 cursor-pointer">
                          <Plus size={14} className="me-1" /> Choose Different Image
                          <input
                            type="file"
                            className="d-none"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                          />
                        </label>
                        {imageFile && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setImageFile(null)}
                          >
                            Remove Selection
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <label className="d-flex flex-column align-items-center py-4 cursor-pointer m-0">
                      <Plus size={36} className="text-primary mb-2" />
                      <span className="fw-semibold text-dark mb-1">Click to select activity cover image</span>
                      <small className="text-muted">Supports PNG, JPG, WEBP, GIF (Max 10MB)</small>
                      <input
                        type="file"
                        className="d-none"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        required={!editingItem}
                      />
                    </label>
                  )}
                </div>
              </div>


              <div className="mb-4">
                <label className="form-label fw-bold mb-2">Activity Details & Description <span className="text-danger">*</span></label>
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
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
                  {submitting ? "Saving..." : editingItem ? "Update Activity" : "Publish Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
