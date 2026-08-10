import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit, Eye, HeartHandshake, Plus, Search, Trash2 } from "lucide-react";
import { listFromResponse } from "../utils/apiResponse";

const STYLE_OPTIONS = [
  {
    label: "Mission Green",
    iconClass: "fas fa-bullseye",
    badgeClass: "badge-emerald",
    cardClass: "card-emerald",
  },
  {
    label: "Vision Blue",
    iconClass: "fas fa-eye",
    badgeClass: "badge-blue",
    cardClass: "card-blue",
  },
  {
    label: "Values Pink",
    iconClass: "fas fa-heart",
    badgeClass: "badge-pink",
    cardClass: "card-pink",
  },
];

const defaultForm = {
  title: "",
  description: "",
  iconClass: STYLE_OPTIONS[0].iconClass,
  badgeClass: STYLE_OPTIONS[0].badgeClass,
  cardClass: STYLE_OPTIONS[0].cardClass,
  order: 0,
  isActive: true,
};

const VisionMissionPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/vision-mission?includeInactive=true`
      );
      setItems(listFromResponse(response.data, ["items", "visionMission"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch vision and mission items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openAddModal = () => {
    setEditingItem(null);
    setForm({ ...defaultForm, order: items.length + 1 });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || "",
      description: item.description || "",
      iconClass: item.iconClass || STYLE_OPTIONS[0].iconClass,
      badgeClass: item.badgeClass || STYLE_OPTIONS[0].badgeClass,
      cardClass: item.cardClass || STYLE_OPTIONS[0].cardClass,
      order: item.order || 0,
      isActive: item.isActive !== false,
    });
    setShowModal(true);
  };

  const applyStyle = (option) => {
    setForm((prev) => ({
      ...prev,
      iconClass: option.iconClass,
      badgeClass: option.badgeClass,
      cardClass: option.cardClass,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        order: Number(form.order) || 0,
      };
      const url = editingItem
        ? `${import.meta.env.VITE_SERVERAPI}/api/v1/vision-mission/${editingItem._id}`
        : `${import.meta.env.VITE_SERVERAPI}/api/v1/vision-mission`;

      const response = editingItem
        ? await axios.put(url, payload, { headers: { Authorization: token } })
        : await axios.post(url, payload, { headers: { Authorization: token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchItems();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await axios.delete(`${import.meta.env.VITE_SERVERAPI}/api/v1/vision-mission/${id}`, {
        headers: { Authorization: token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) =>
      [item.title, item.description].join(" ").toLowerCase().includes(query)
    );
  }, [items, searchTerm]);

  return (
    <div id="main">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Vision & Mission
          </h4>
          <p className="text-muted mb-0 small">
            Manage the mission, vision, and values cards shown on the homepage.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={15} /> Add Item
        </button>
      </div>

      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <HeartHandshake size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">Vision & Mission ({filteredItems.length})</h5>
          </div>
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="form-control"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Style</th>
                <th>Order</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Loading vision and mission items...
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td style={{ maxWidth: "560px" }}>
                      <div className="fw-semibold text-dark mb-1">{item.title}</div>
                      <div className="small text-muted text-truncate">{item.description}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border">{item.cardClass}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border">Order #{item.order || 0}</span>
                    </td>
                    <td>
                      <span className={`badge-status ${item.isActive !== false ? "badge-brand" : "badge-secondary"}`}>
                        {item.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn-icon btn-icon-primary" title="View Item" onClick={() => setViewItem(item)}>
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon btn-icon-warning" title="Edit Item" onClick={() => openEditModal(item)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-icon-danger" title="Delete Item" onClick={() => handleDelete(item._id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No vision and mission items found. Click &quot;Add Item&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewItem && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "680px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-light">
              <div>
                <h5 className="fw-bold mb-0 text-dark">{viewItem.title}</h5>
                <small className="text-muted">Homepage card preview content</small>
              </div>
              <button type="button" className="btn-close" onClick={() => setViewItem(null)}></button>
            </div>
            <div className="p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="badge bg-light text-secondary border">{viewItem.iconClass}</span>
                <span className="badge bg-light text-secondary border">{viewItem.badgeClass}</span>
                <span className="badge bg-light text-secondary border">{viewItem.cardClass}</span>
              </div>
              <p className="text-secondary mb-0">{viewItem.description}</p>
            </div>
            <div className="p-3 border-top bg-light text-end">
              <button className="btn btn-secondary px-4" onClick={() => setViewItem(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "760px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {editingItem ? "Edit Vision & Mission Item" : "Add Vision & Mission Item"}
                </h5>
                <small className="text-muted">Update card text and reuse the existing homepage styles.</small>
              </div>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-8">
                  <label className="form-label fw-bold">
                    Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={(event) => updateForm("title", event.target.value)}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold">Order</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={form.order}
                    onChange={(event) => updateForm("order", event.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={form.description}
                    onChange={(event) => updateForm("description", event.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold">Card Style</label>
                  <div className="d-flex flex-wrap gap-2">
                    {STYLE_OPTIONS.map((option) => {
                      const selected = form.cardClass === option.cardClass;
                      return (
                        <button
                          key={option.cardClass}
                          type="button"
                          className={`btn btn-sm ${selected ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => applyStyle(option)}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold">Icon Class</label>
                  <input
                    className="form-control"
                    value={form.iconClass}
                    onChange={(event) => updateForm("iconClass", event.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold">Badge Class</label>
                  <input
                    className="form-control"
                    value={form.badgeClass}
                    onChange={(event) => updateForm("badgeClass", event.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold">Card Class</label>
                  <input
                    className="form-control"
                    value={form.cardClass}
                    onChange={(event) => updateForm("cardClass", event.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-check d-flex align-items-center gap-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) => updateForm("isActive", event.target.checked)}
                    />
                    <span className="form-check-label fw-bold">Active on frontend</span>
                  </label>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                <button type="button" className="btn btn-secondary px-4 py-2" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-executive px-4 py-2" disabled={submitting}>
                  {submitting ? "Saving..." : editingItem ? "Update Item" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionMissionPage;
