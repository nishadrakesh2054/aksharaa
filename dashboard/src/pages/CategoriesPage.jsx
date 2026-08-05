import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit, Check, X, Search, FolderKanban } from "lucide-react";
import { listFromResponse } from "../utils/apiResponse";

const CategoriesPage = () => {
  const [activeTab, setActiveTab] = useState("blog"); // 'blog' or 'activity'
  const [blogCategories, setBlogCategories] = useState([]);
  const [activityCategories, setActivityCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const [blogCatRes, actCatRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/category`),
        axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/activityCategory`),
      ]);

      setBlogCategories(listFromResponse(blogCatRes.data, ["categories"]));
      setActivityCategories(listFromResponse(actCatRes.data, ["categories"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const isBlogTab = activeTab === "blog";
  const currentCategories = isBlogTab ? blogCategories : activityCategories;
  const apiEndpoint = isBlogTab
    ? `${import.meta.env.VITE_SERVERAPI}/api/v1/category`
    : `${import.meta.env.VITE_SERVERAPI}/api/v1/activityCategory`;

  const filteredCategories = currentCategories.filter((c) =>
    (c.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        apiEndpoint,
        { title: newTitle },
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setNewTitle("");
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editTitle.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.put(
        `${apiEndpoint}/${id}`,
        { title: editTitle },
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingId(null);
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const response = await axios.delete(`${apiEndpoint}/${id}`, {
        headers: { Authorization: token },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div id="main">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Category Directory
          </h4>
          <p className="text-muted mb-0 small">
            Manage and group blogs and school activities into distinct categories.
          </p>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="d-flex align-items-center gap-2 p-1 bg-white rounded-3 border mb-4 d-inline-flex">
        <button
          className={`btn ${isBlogTab ? "btn-primary shadow-sm" : "btn-light text-secondary border-0"} px-4 py-2 rounded-3 fw-semibold`}
          onClick={() => {
            setActiveTab("blog");
            setEditingId(null);
          }}
        >
          Blog Categories ({blogCategories.length})
        </button>
        <button
          className={`btn ${!isBlogTab ? "btn-primary shadow-sm" : "btn-light text-secondary border-0"} px-4 py-2 rounded-3 fw-semibold`}
          onClick={() => {
            setActiveTab("activity");
            setEditingId(null);
          }}
        >
          Activity Categories ({activityCategories.length})
        </button>
      </div>

      <div className="row g-4">
        {/* Create Category Form */}
        <div className="col-12 col-lg-4">
          <div className="executive-card p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <Plus size={18} className="text-primary" />
              Add {isBlogTab ? "Blog" : "Activity"} Category
            </h5>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="form-label fw-bold">Category Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sports, Academics, Events"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-executive px-3 py-2"
                  disabled={submitting}
                >
                  <Plus size={15} />
                  {submitting ? "Saving..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Categories Table Container */}
        <div className="col-12 col-lg-8">
          <div className="modern-table-container">
            <div className="modern-table-header">
              <div className="d-flex align-items-center gap-2">
                <FolderKanban size={20} className="text-primary" />
                <h5 className="fw-bold mb-0 text-dark">
                  {isBlogTab ? "Blog" : "Activity"} Categories Directory
                </h5>
                <span className="badge-status badge-brand ms-2">
                  {filteredCategories.length} Total
                </span>
              </div>

              {/* Category Search Input */}
              <div className="search-input-wrapper">
                <Search size={15} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Category Title</th>
                    <th>Scope</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted">
                        Loading category directory...
                      </td>
                    </tr>
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <tr key={cat._id}>
                        <td>
                          {editingId === cat._id ? (
                            <div className="d-flex align-items-center gap-2">
                              <input
                                type="text"
                                className="form-control py-1 px-2"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <span className="fw-semibold text-dark">{cat.title}</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge-status ${isBlogTab ? "badge-indigo" : "badge-brand"}`}>
                            {isBlogTab ? "Blog Category" : "Activity Category"}
                          </span>
                        </td>
                        <td className="text-end">
                          {editingId === cat._id ? (
                            <div className="d-inline-flex gap-1">
                              <button
                                className="btn-icon btn-icon-primary"
                                title="Save Changes"
                                onClick={() => handleUpdate(cat._id)}
                              >
                                <Check size={16} />
                              </button>
                              <button
                                className="btn-icon"
                                title="Cancel Edit"
                                onClick={() => setEditingId(null)}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="d-inline-flex gap-1">
                              <button
                                className="btn-icon btn-icon-warning"
                                title="Edit Category"
                                onClick={() => {
                                  setEditingId(cat._id);
                                  setEditTitle(cat.title || "");
                                }}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="btn-icon btn-icon-danger"
                                title="Delete Category"
                                onClick={() => handleDelete(cat._id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        No categories found. Add your first category using the form on the left.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
