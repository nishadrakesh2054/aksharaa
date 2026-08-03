import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit, Handshake, Link as LinkIcon, Plus, Search, Trash2, Upload, X } from "lucide-react";
import getImageUrl from "../utils/imageUrl";

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [order, setOrder] = useState(0);
  const [logoFile, setLogoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/partners`);
      const list = res.data.partners || res.data.data || [];
      setPartners(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch educational partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setLink("");
    setOrder(partners.length + 1);
    setLogoFile(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setLink(item.link || "");
    setOrder(item.order || 0);
    setLogoFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Partner name is required.");
      return;
    }
    if (!editingItem && !logoFile) {
      toast.error("Please select a partner logo.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("link", link);
      formData.append("order", order);
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const url = editingItem
        ? `${import.meta.env.VITE_SERVERAPI}/api/v1/partners/${editingItem._id}`
        : `${import.meta.env.VITE_SERVERAPI}/api/v1/partners`;

      const response = editingItem
        ? await axios.put(url, formData)
        : await axios.post(url, formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchPartners();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this educational partner?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/partners/${id}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setPartners((prev) => prev.filter((partner) => partner._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const filteredPartners = partners.filter((partner) => {
    const query = searchTerm.toLowerCase();
    return (
      (partner.title || "").toLowerCase().includes(query) ||
      (partner.link || "").toLowerCase().includes(query)
    );
  });

  return (
    <div id="main">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Educational Partners
          </h4>
          <p className="text-muted mb-0 small">
            Manage partner logos displayed in the “Our Educational Partners” carousel.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={15} /> Add Partner
        </button>
      </div>

      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <Handshake size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">Partners Directory ({filteredPartners.length})</h5>
          </div>
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="form-control"
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Partner Logo & Name</th>
                <th>Website Link</th>
                <th>Display Order</th>
                <th>Date Added</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Loading educational partners...
                  </td>
                </tr>
              ) : filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => {
                  const logoUrl = getImageUrl(partner.logo);

                  return (
                    <tr key={partner._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-white rounded-3 p-1 border d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                            <img
                              src={logoUrl}
                              onError={(e) => {
                                e.currentTarget.src = "/fallbackimage.avif";
                              }}
                              alt={partner.title}
                              style={{ maxWidth: "42px", maxHeight: "42px", objectFit: "contain" }}
                            />
                          </div>
                          <span className="fw-semibold text-dark">{partner.title}</span>
                        </div>
                      </td>
                      <td>
                        {partner.link ? (
                          <a
                            href={partner.link.startsWith("http") ? partner.link : `https://${partner.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="small text-primary text-decoration-none d-inline-flex align-items-center gap-1"
                          >
                            <LinkIcon size={13} />
                            <span className="text-truncate" style={{ maxWidth: "200px" }}>{partner.link}</span>
                          </a>
                        ) : (
                          <span className="small text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">Order #{partner.order}</span>
                      </td>
                      <td className="small text-muted">
                        {new Date(partner.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn-icon btn-icon-warning"
                          title="Edit Partner"
                          onClick={() => openEditModal(partner)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          title="Delete Partner"
                          onClick={() => handleDelete(partner._id)}
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
                    No educational partners found. Click &quot;+ Add Partner&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {showModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "620px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {editingItem ? "Edit Educational Partner" : "Add Educational Partner"}
                </h5>
                <small className="text-muted">Manage carousel logo, name, order, and optional link.</small>
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
                  <label className="form-label fw-bold">Partner Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Leader in Me"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-bold">Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-2">
                  <label className="form-label fw-bold">Logo</label>
                  <label className="form-control d-flex align-items-center justify-content-center mb-0 cursor-pointer" title="Choose partner logo">
                    <Upload size={18} />
                    <input
                      type="file"
                      className="d-none"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files[0] || null)}
                    />
                  </label>
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold">Website Link</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
              </div>

              {logoFile && (
                <div className="mb-4">
                  <label className="form-label fw-bold">Selected Logo</label>
                  <div className="position-relative" style={{ width: "70px", height: "70px" }}>
                    <img
                      src={URL.createObjectURL(logoFile)}
                      alt="Selected partner logo"
                      className="rounded-circle w-100 h-100 object-fit-cover border border-2 border-white shadow-sm"
                    />
                    <button
                      type="button"
                      className="btn p-0 rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        width: "22px",
                        height: "22px",
                        backgroundColor: "#DC2626",
                        color: "#FFFFFF",
                        border: "2px solid #FFFFFF",
                        transform: "translate(25%, -25%)",
                      }}
                      title="Remove selected logo"
                      onClick={() => setLogoFile(null)}
                    >
                      <X size={13} color="#FFFFFF" strokeWidth={3} />
                    </button>
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
                  {submitting ? "Saving..." : editingItem ? "Update Partner" : "Save Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersPage;
