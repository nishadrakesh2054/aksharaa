import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  ClipboardList,
  Search,
  Trash2,
  Eye,
  Mail,
  MailOpen,
  Phone,
  User,
  GraduationCap,
  Bus,
  CheckCircle2,
  Clock,
  MapPin,
  Briefcase,
  Share2,
} from "lucide-react";

const EnquiriesPage = () => {
  const { user } = useSelector((state) => state.login.loggedInUser);
  const canDeleteRecords = user?.role !== "frontdesk";
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // 'all', 'unread', 'read'
  const [viewEnquiry, setViewEnquiry] = useState(null);

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

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/enquiry`
      );
      const list = response.data.enquiries || response.data.data || [];

      // Filter specifically for General Inquiries (/getinquiry)
      const generalInquiries = Array.isArray(list)
        ? list.filter(
            (e) =>
              (e.source || "").toLowerCase().includes("inquiry") ||
              (!e.studentPhoto && (!e.documents || e.documents.length === 0))
          )
        : [];
      setEnquiries(generalInquiries);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleToggleStatus = async (item, targetReadState = null) => {
    try {
      const newStatus = typeof targetReadState === "boolean" ? targetReadState : !item.isRead;
      const response = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/enquiry/status/${item._id}`,
        { isRead: newStatus }
      );

      if (response.data.success) {
        toast.success(response.data.message || `Marked as ${newStatus ? "Read" : "Unread"}`);
        setEnquiries((prev) =>
          prev.map((e) => (e._id === item._id ? { ...e, isRead: newStatus } : e))
        );
        if (viewEnquiry && viewEnquiry._id === item._id) {
          setViewEnquiry((prev) => ({ ...prev, isRead: newStatus }));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleOpenView = (item) => {
    setViewEnquiry(item);
    if (!item.isRead) {
      handleToggleStatus(item, true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry record?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/enquiry/${id}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
        if (viewEnquiry && viewEnquiry._id === id) {
          setViewEnquiry(null);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const unreadCount = enquiries.filter((e) => !e.isRead).length;

  const filteredEnquiries = enquiries
    .filter((e) => {
      if (filterTab === "unread") return !e.isRead;
      if (filterTab === "read") return e.isRead;
      return true;
    })
    .filter(
      (e) =>
        (e.studentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.parentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.parentEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.studentGrade || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.phone || "").toString().includes(searchTerm)
    );

  return (
    <div id="main">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Admission General Inquiries
          </h4>
          <p className="text-muted mb-0 small">
            General student and parent inquiry messages submitted online via /getinquiry.
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
            All Inquiries ({enquiries.length})
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
            Read ({enquiries.length - unreadCount})
          </button>
        </div>

        <div className="search-input-wrapper">
          <Search size={15} />
          <input
            type="text"
            className="form-control"
            placeholder="Search student, parent, grade, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <ClipboardList size={20} className="text-primary" />
            <h5 className="fw-bold mb-0 text-dark">General Inquiries Inbox</h5>
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Parent Contact</th>
                <th>Transport & Source</th>
                <th>Received Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Loading general inquiries...
                  </td>
                </tr>
              ) : filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((item) => (
                  <tr key={item._id} className={!item.isRead ? "fw-bold" : ""}>
                    <td>
                      <div>
                        <div className="fw-bold text-dark d-flex align-items-center gap-1">
                          <GraduationCap size={15} className="text-primary" /> {item.studentName}
                        </div>
                        <div className="d-flex gap-2 align-items-center mt-1">
                          <span className="badge-status badge-indigo">
                            Grade: {item.studentGrade}
                          </span>
                          <span className="small text-muted">
                            {item.studentGender}, Age {item.studentAge}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold text-dark">
                          <User size={13} className="text-muted me-1" />
                          {item.parentName}
                        </div>
                        <small className="text-muted d-block">{item.parentEmail}</small>
                        <small className="text-secondary d-block">
                          <Phone size={12} className="me-1" />
                          {item.phone}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div>
                        {item.transportation ? (
                          <span className="badge-status badge-brand me-1">
                            <Bus size={12} /> Bus Required
                          </span>
                        ) : (
                          <span className="badge-status badge-secondary me-1">
                            No Bus
                          </span>
                        )}
                        <small className="text-muted d-block mt-1">
                          Source: {item.source || "Get Inquiry"}
                        </small>
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
                          className="btn-icon btn-icon-primary"
                          title="View Full Details"
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
                            title="Delete Record"
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
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No general inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {viewEnquiry && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "780px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <ClipboardList size={22} className="text-primary" />
                <div>
                  <h5 className="fw-bold mb-0 text-dark">General Admission Inquiry</h5>
                  <small className="text-muted">
                    Received: {formatDateTime(viewEnquiry)}
                  </small>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setViewEnquiry(null)}
              ></button>
            </div>

            <div className="p-4 p-md-5">
              {/* Student Details Section */}
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2 border-bottom pb-2">
                  <GraduationCap size={18} /> Student Information
                </h6>
                <div className="row g-3 bg-light p-3 rounded-3 border">
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Student Full Name:</span>
                    <span className="fw-bold text-dark fs-6">{viewEnquiry.studentName}</span>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Applying for Grade:</span>
                    <span className="badge-status badge-brand fs-6">{viewEnquiry.studentGrade}</span>
                  </div>
                  <div className="col-12 col-md-4">
                    <span className="small text-muted d-block fw-semibold">Age:</span>
                    <span className="fw-semibold text-dark">{viewEnquiry.studentAge} years old</span>
                  </div>
                  <div className="col-12 col-md-4">
                    <span className="small text-muted d-block fw-semibold">Gender:</span>
                    <span className="fw-semibold text-dark">{viewEnquiry.studentGender}</span>
                  </div>
                  <div className="col-12 col-md-4">
                    <span className="small text-muted d-block fw-semibold">Transport Needed:</span>
                    <span className="fw-semibold text-dark">
                      {viewEnquiry.transportation ? "Yes (School Bus)" : "No"}
                    </span>
                  </div>
                  <div className="col-12">
                    <span className="small text-muted d-block fw-semibold">Student Address:</span>
                    <span className="text-secondary fw-medium">
                      <MapPin size={14} className="me-1" />
                      {viewEnquiry.studentAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Parent Details Section */}
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2 border-bottom pb-2">
                  <User size={18} /> Parent / Guardian Information
                </h6>
                <div className="row g-3 bg-light p-3 rounded-3 border">
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Parent / Guardian Name:</span>
                    <span className="fw-bold text-dark fs-6">{viewEnquiry.parentName}</span>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Parent Occupation:</span>
                    <span className="fw-semibold text-dark">
                      <Briefcase size={14} className="me-1 text-muted" />
                      {viewEnquiry.occupation || "N/A"}
                    </span>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Email Address:</span>
                    <a href={`mailto:${viewEnquiry.parentEmail}`} className="text-primary fw-semibold">
                      {viewEnquiry.parentEmail}
                    </a>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Phone Number:</span>
                    <a href={`tel:${viewEnquiry.phone}`} className="text-dark fw-bold">
                      <Phone size={14} className="me-1 text-muted" />
                      {viewEnquiry.phone}
                    </a>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Parent Address:</span>
                    <span className="text-secondary fw-medium">
                      {viewEnquiry.parentAddress || viewEnquiry.studentAddress}
                    </span>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">How did you hear about us?</span>
                    <span className="badge-status badge-indigo">
                      <Share2 size={13} className="me-1" />
                      {viewEnquiry.source || "Get Inquiry"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                <button
                  className={`btn ${viewEnquiry.isRead ? "btn-outline-secondary" : "btn-success"} px-3`}
                  onClick={() => handleToggleStatus(viewEnquiry)}
                >
                  {viewEnquiry.isRead ? "Mark as Unread" : "Mark as Read"}
                </button>

                <div className="d-flex gap-2">
                  <button className="btn btn-secondary px-4" onClick={() => setViewEnquiry(null)}>
                    Close
                  </button>
                  {canDeleteRecords && (
                    <button
                      className="btn btn-danger px-4"
                      onClick={() => handleDelete(viewEnquiry._id)}
                    >
                      Delete Record
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

export default EnquiriesPage;
