import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit, HelpCircle, Plus, Search, Trash2 } from "lucide-react";
import { listFromResponse } from "../utils/apiResponse";

const FAQ_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "admission", label: "Admission" },
  { value: "academics", label: "Academics" },
  { value: "facilities", label: "Facilities" },
];

const categoryLabel = (value) =>
  FAQ_CATEGORIES.find((category) => category.value === value)?.label || "General";

const FaqsPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("general");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchFaqs = useCallback(async () => {
    try {
      setLoading(true);
      const params = categoryFilter === "all" ? {} : { category: categoryFilter };
      const response = await axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/faqs`, { params });
      setFaqs(listFromResponse(response.data, ["faqs"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setCategory("general");
    setOrder(faqs.length + 1);
    setIsActive(true);
  };

  const openAddModal = () => {
    setEditingItem(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setQuestion(item.question || "");
    setAnswer(item.answer || "");
    setCategory(item.category || "general");
    setOrder(item.order || 0);
    setIsActive(item.isActive !== false);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error("FAQ question is required.");
      return;
    }

    if (!answer.trim()) {
      toast.error("FAQ answer is required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        question,
        answer,
        category,
        order: Number(order) || 0,
        isActive,
      };

      const url = editingItem
        ? `${import.meta.env.VITE_SERVERAPI}/api/v1/faqs/${editingItem._id}`
        : `${import.meta.env.VITE_SERVERAPI}/api/v1/faqs`;

      const response = editingItem
        ? await axios.put(url, payload, { headers: { Authorization: token } })
        : await axios.post(url, payload, { headers: { Authorization: token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchFaqs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/faqs/toggle-status/${item._id}`,
        {},
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setFaqs((prev) =>
          prev.map((faq) => (faq._id === item._id ? { ...faq, isActive: !faq.isActive } : faq))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const response = await axios.delete(`${import.meta.env.VITE_SERVERAPI}/api/v1/faqs/${id}`, {
        headers: { Authorization: token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFaqs((prev) => prev.filter((faq) => faq._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const filteredFaqs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return faqs;

    return faqs.filter((faq) =>
      [faq.question, faq.answer, categoryLabel(faq.category)]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [faqs, searchTerm]);

  return (
    <div id="main">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            FAQs
          </h4>
          <p className="text-muted mb-0 small">
            Manage common questions for frontend filtering.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={15} /> Add FAQ
        </button>
      </div>

      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <HelpCircle size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">FAQ Directory ({filteredFaqs.length})</h5>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <select
              className="form-select form-select-sm"
              style={{ width: "150px" }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {FAQ_CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <div className="search-input-wrapper">
              <Search size={15} />
              <input
                type="text"
                className="form-control"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Order</th>
                <th>Status</th>
                <th>Date Added</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading FAQs...
                  </td>
                </tr>
              ) : filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <tr key={faq._id}>
                    <td style={{ maxWidth: "520px" }}>
                      <div className="fw-semibold text-dark mb-1">{faq.question}</div>
                      <div className="small text-muted text-truncate">{faq.answer}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border">
                        {categoryLabel(faq.category)}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border">Order #{faq.order || 0}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`badge border-0 ${faq.isActive ? "bg-success" : "bg-secondary"}`}
                        onClick={() => handleToggleStatus(faq)}
                      >
                        {faq.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="small text-muted">
                      {faq.createdAt
                        ? new Date(faq.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn-icon btn-icon-warning"
                        title="Edit FAQ"
                        onClick={() => openEditModal(faq)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        title="Delete FAQ"
                        onClick={() => handleDelete(faq._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No FAQs found. Click &quot;+ Add FAQ&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "760px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {editingItem ? "Edit FAQ" : "Add FAQ"}
                </h5>
                <small className="text-muted">Write the question, answer, category, and display order.</small>
              </div>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <label className="form-label fw-bold">Question <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. What documents are required for admission?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold">Answer <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Write a clear answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="col-12 col-md-5">
                  <label className="form-label fw-bold">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {FAQ_CATEGORIES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-bold">Order</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold d-block">Status</label>
                  <div className="form-check form-switch mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="faq-status"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="faq-status">
                      {isActive ? "Active" : "Inactive"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                <button type="button" className="btn btn-secondary px-4 py-2" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-executive px-4 py-2" disabled={submitting}>
                  {submitting ? "Saving..." : editingItem ? "Update FAQ" : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqsPage;
