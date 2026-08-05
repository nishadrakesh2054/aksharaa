import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Mail, Search, Trash2, Eye, MailOpen, Phone, User, CheckCircle2, Clock } from "lucide-react";
import { listFromResponse } from "../utils/apiResponse";

const ContactMessagesPage = () => {
  const { user } = useSelector((state) => state.login.loggedInUser);
  const canDeleteRecords = user?.role !== "frontdesk";
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // 'all', 'unread', 'read'
  const [viewMessage, setViewMessage] = useState(null);

  const getRecordDate = (item) => {
    if (item?.createdAt) return new Date(item.createdAt);
    if (item?.updatedAt) return new Date(item.updatedAt);
    if (item?._id && typeof item._id === "string" && item._id.length === 24) {
      const timestamp = parseInt(item._id.substring(0, 8), 16) * 1000;
      if (!isNaN(timestamp)) return new Date(timestamp);
    }
    return new Date();
  };

  const formatDate = (item) => {
    return getRecordDate(item).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (item) => {
    return getRecordDate(item).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/getallcontacts`
      );
      setContacts(listFromResponse(response.data, ["contacts"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleToggleStatus = async (item, targetReadState = null) => {
    try {
      const newStatus = typeof targetReadState === "boolean" ? targetReadState : !item.isRead;
      const response = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/contact/status/${item._id}`,
        { isRead: newStatus }
      );

      if (response.data.success) {
        toast.success(response.data.message || `Marked as ${newStatus ? "Read" : "Unread"}`);
        setContacts((prev) =>
          prev.map((c) => (c._id === item._id ? { ...c, isRead: newStatus } : c))
        );
        if (viewMessage && viewMessage._id === item._id) {
          setViewMessage((prev) => ({ ...prev, isRead: newStatus }));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleOpenView = (item) => {
    setViewMessage(item);
    // Auto-mark as read when opened if unread
    if (!item.isRead) {
      handleToggleStatus(item, true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact message?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/contact/${id}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setContacts((prev) => prev.filter((c) => c._id !== id));
        if (viewMessage && viewMessage._id === id) {
          setViewMessage(null);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const unreadCount = contacts.filter((c) => !c.isRead).length;
  const readCount = contacts.filter((c) => c.isRead).length;

  const filteredContacts = contacts
    .filter((c) => {
      if (filterTab === "unread") return !c.isRead;
      if (filterTab === "read") return c.isRead;
      return true;
    })
    .filter(
      (c) =>
        (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.phone || "").toString().includes(searchTerm) ||
        (c.message || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div id="main">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Contact Form Messages
          </h4>
          <p className="text-muted mb-0 small">
            Review inquiries submitted via the website contact form.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-3 rounded-3 border gap-3 flex-wrap">
        <div className="d-flex align-items-center gap-2 p-1 bg-light rounded-3">
          <button
            className={`btn ${filterTab === "all" ? "btn-primary shadow-sm" : "btn-light text-secondary border-0"} px-3 py-1.5 rounded-3 fw-semibold small`}
            onClick={() => setFilterTab("all")}
          >
            All Messages ({contacts.length})
          </button>
          <button
            className={`btn ${filterTab === "unread" ? "btn-danger shadow-sm" : "btn-light text-secondary border-0"} px-3 py-1.5 rounded-3 fw-semibold small`}
            onClick={() => setFilterTab("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`btn ${filterTab === "read" ? "btn-primary shadow-sm" : "btn-light text-secondary border-0"} px-3 py-1.5 rounded-3 fw-semibold small`}
            onClick={() => setFilterTab("read")}
          >
            Read ({readCount})
          </button>
        </div>

        <div className="search-input-wrapper">
          <Search size={15} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Contact Messages Table */}
      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <Mail size={20} className="text-primary" />
            <h5 className="fw-bold mb-0 text-dark">Inquiries Inbox</h5>
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Sender Info</th>
                <th>Subject & Message</th>
                <th>Received Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    Loading messages...
                  </td>
                </tr>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((item) => (
                  <tr key={item._id} className={!item.isRead ? "fw-bold" : ""}>
                    <td>
                      <div>
                        <div className="fw-bold text-dark d-flex align-items-center gap-1">
                          <User size={14} className="text-muted" /> {item.name}
                        </div>
                        <small className="text-muted d-block">{item.email}</small>
                        <small className="text-secondary d-block">
                          <Phone size={12} className="me-1" /> {item.phone}
                        </small>
                      </div>
                    </td>
                    <td style={{ maxWidth: "320px" }}>
                      <span className="badge-status badge-indigo mb-1 d-inline-block">
                        {item.subject || "General Inquiry"}
                      </span>
                      <p className="text-truncate text-muted small mb-0" style={{ maxWidth: "300px" }}>
                        {item.message}
                      </p>
                    </td>
                    <td className="small text-muted">
                      {formatDate(item)}
                    </td>
                    <td>
                      {item.isRead ? (
                        <span className="badge-status badge-brand">
                          <CheckCircle2 size={13} /> Read
                        </span>
                      ) : (
                        <span className="badge-status badge-rose animate-pulse">
                          <Clock size={13} /> Unread
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          className="btn-icon btn-icon-primary"
                          title="View Message Details"
                          onClick={() => handleOpenView(item)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn-icon btn-icon-warning"
                          title={item.isRead ? "Mark as Unread" : "Mark as Read"}
                          onClick={() => handleToggleStatus(item)}
                        >
                          {item.isRead ? <Mail size={16} /> : <MailOpen size={16} />}
                        </button>
                        {canDeleteRecords && (
                          <button
                            className="btn-icon btn-icon-danger"
                            title="Delete Message"
                            onClick={() => handleDelete(item._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No contact messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Reader Modal */}
      {viewMessage && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "750px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <Mail size={22} className="text-primary" />
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Contact Submission</h5>
                  <small className="text-muted">
                    Received: {formatDateTime(viewMessage)}
                  </small>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setViewMessage(null)}
              ></button>
            </div>

            <div className="p-4 p-md-5">
              <div className="row g-3 mb-4 bg-light p-3 rounded-3 border">
                <div className="col-12 col-md-6">
                  <span className="small text-muted d-block fw-semibold">Sender Name:</span>
                  <span className="fw-bold text-dark fs-6">{viewMessage.name}</span>
                </div>
                <div className="col-12 col-md-6">
                  <span className="small text-muted d-block fw-semibold">Email Address:</span>
                  <a href={`mailto:${viewMessage.email}`} className="text-primary fw-semibold">
                    {viewMessage.email}
                  </a>
                </div>
                <div className="col-12 col-md-6">
                  <span className="small text-muted d-block fw-semibold">Phone Number:</span>
                  <a href={`tel:${viewMessage.phone}`} className="text-dark fw-medium">
                    {viewMessage.phone}
                  </a>
                </div>
                <div className="col-12 col-md-6">
                  <span className="small text-muted d-block fw-semibold">Subject:</span>
                  <span className="badge-status badge-indigo">
                    {viewMessage.subject || "General Inquiry"}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2">Message Body:</h6>
                <div className="p-3 bg-white border rounded-3 text-secondary lh-lg" style={{ whiteSpace: "pre-wrap" }}>
                  {viewMessage.message}
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                <button
                  className={`btn ${viewMessage.isRead ? "btn-outline-secondary" : "btn-success"} px-3`}
                  onClick={() => handleToggleStatus(viewMessage)}
                >
                  {viewMessage.isRead ? "Mark as Unread" : "Mark as Read"}
                </button>

                <div className="d-flex gap-2">
                  <button className="btn btn-secondary px-4" onClick={() => setViewMessage(null)}>
                    Close
                  </button>
                  {canDeleteRecords && (
                    <button
                      className="btn btn-danger px-4"
                      onClick={() => handleDelete(viewMessage._id)}
                    >
                      Delete Message
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesPage;
