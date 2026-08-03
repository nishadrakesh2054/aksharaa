import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Search, Trash2, Edit, MessageSquareQuote } from "lucide-react";
import getImageUrl from "../utils/imageUrl";

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [title, setTitle] = useState("");
  const [parentname, setParentname] = useState("");
  const [feedback, setFeedback] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/testimonial`
      );
      const list = response.data.testimonial || response.data.testimonials || response.data.data || [];
      setTestimonials(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setParentname("");
    setFeedback("");
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setParentname(item.parentname || "");
    setFeedback(item.feedback || "");
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/testimonial/${id}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setTestimonials((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error("Feedback content is required.");
      return;
    }
    if (!editingItem && !imageFile) {
      toast.error("Please select a photo for the testimonial.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title || "Parent Review");
      formData.append("parentname", parentname || "Anonymous Parent");
      formData.append("feedback", feedback);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let response;
      if (editingItem) {
        response = await axios.put(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/testimonial/${editingItem._id}`,
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/createtestimonial`,
          formData,
          { headers: { Authorization: token } }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchTestimonials();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTestimonials = testimonials.filter(
    (t) =>
      (t.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.parentname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.feedback || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="main">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="fw-bold mb-0" style={{ color: "#0F172A", fontSize: "1.15rem" }}>
            Testimonials
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
            Parent feedback and reviews.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={15} /> Add Testimonial
        </button>
      </div>

      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <MessageSquareQuote size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">Parent Feedback ({filteredTestimonials.length})</h5>
          </div>
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="form-control"
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: "240px" }}>Parent Profile</th>
                <th>Feedback Statement</th>
                <th className="text-end" style={{ width: "90px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Loading testimonials...
                  </td>
                </tr>
              ) : filteredTestimonials.length > 0 ? (
                filteredTestimonials.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={getImageUrl(item.image)}
                          onError={(e) => {
                            e.currentTarget.src = "/fallbackimage.avif";
                          }}
                          alt={item.parentname || "Parent"}
                          width="38"
                          height="38"
                          className="rounded-circle object-fit-cover border flex-shrink-0"
                        />
                        <div>
                          <div className="fw-semibold text-dark text-nowrap" style={{ fontSize: "13px" }}>
                            {item.parentname || "Anonymous Parent"}
                          </div>
                          <small className="text-muted d-block" style={{ fontSize: "11px" }}>
                            {item.title || "Parent Review"}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary" style={{ fontSize: "13px", lineHeight: "1.4" }}>
                      {item.feedback}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn-icon btn-icon-warning"
                        title="Edit Testimonial"
                        onClick={() => openEditModal(item)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        title="Delete Testimonial"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">
                    No testimonials found. Click &quot;+ Add Testimonial&quot; to post review.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "780px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {editingItem ? "Edit Testimonial" : "Add Parent Testimonial"}
                </h5>
                <small className="text-muted">Enter reviewer information, feedback text, and optional photo</small>
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
                  <label className="form-label fw-bold">Parent Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. John Doe (Parent of Grade 5)"
                    value={parentname}
                    onChange={(e) => setParentname(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Title / Tagline</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Exceptional Academic Quality"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Feedback Content <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Enter parent feedback statement..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  {editingItem ? "Replace Photo (Optional):" : "Parent Photo (Optional):"}
                </label>
                <div className="d-flex align-items-center gap-3">
                  {(imageFile || editingItem?.image) && (
                    <div className="position-relative">
                      <img
                        src={
                          imageFile
                            ? URL.createObjectURL(imageFile)
                            : getImageUrl(editingItem?.image)
                        }
                        alt="Parent Avatar Preview"
                        width="60"
                        height="60"
                        className="rounded-circle object-fit-cover border shadow-sm"
                      />
                    </div>
                  )}
                  <div className="flex-grow-1">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </div>
                </div>
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
                  {submitting ? "Saving..." : editingItem ? "Update Review" : "Post Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;
