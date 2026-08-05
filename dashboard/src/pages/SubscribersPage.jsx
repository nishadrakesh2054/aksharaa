import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Mail, Search, Trash2, MailOpen, CheckCircle2, Clock, Send } from "lucide-react";
import { listFromResponse } from "../utils/apiResponse";

const SubscribersPage = () => {
  const { user } = useSelector((state) => state.login.loggedInUser);
  const canDeleteRecords = user?.role !== "frontdesk";
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // 'all', 'unread', 'read'

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

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/getallsubscribers`
      );
      setSubscribers(listFromResponse(response.data, ["subscribers"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleToggleStatus = async (item) => {
    try {
      const newStatus = !item.isRead;
      const response = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/subscribe/status/${item._id}`,
        { isRead: newStatus }
      );

      if (response.data.success) {
        toast.success(response.data.message || `Marked as ${newStatus ? "Read" : "Unread"}`);
        setSubscribers((prev) =>
          prev.map((s) => (s._id === item._id ? { ...s, isRead: newStatus } : s))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update subscriber status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/subscribe/${id}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const unreadCount = subscribers.filter((s) => !s.isRead).length;
  const readCount = subscribers.filter((s) => s.isRead).length;

  const filteredSubscribers = subscribers
    .filter((s) => {
      if (filterTab === "unread") return !s.isRead;
      if (filterTab === "read") return s.isRead;
      return true;
    })
    .filter((s) => (s.email || "").toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div id="main">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Newsletter Subscribers
          </h4>
          <p className="text-muted mb-0 small">
            Email subscription list for announcements and newsletters.
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
            All Subscribers ({subscribers.length})
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
            placeholder="Search by subscriber email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <Send size={20} className="text-primary" />
            <h5 className="fw-bold mb-0 text-dark">Subscribers List</h5>
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>#</th>
                <th>Subscriber Email</th>
                <th>Subscribed Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    Loading subscribers...
                  </td>
                </tr>
              ) : filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((item, index) => (
                  <tr key={item._id} className={!item.isRead ? "fw-bold" : ""}>
                    <td className="text-muted small fw-bold">#{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Mail size={16} className="text-primary" />
                        <a href={`mailto:${item.email}`} className="fw-semibold text-dark text-decoration-none">
                          {item.email}
                        </a>
                      </div>
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
                          className="btn-icon btn-icon-warning"
                          title={item.isRead ? "Mark as Unread" : "Mark as Read"}
                          onClick={() => handleToggleStatus(item)}
                        >
                          {item.isRead ? <Mail size={16} /> : <MailOpen size={16} />}
                        </button>
                        {canDeleteRecords && (
                          <button
                            className="btn-icon btn-icon-danger"
                            title="Delete Subscriber"
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
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscribersPage;
