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
  Image as ImageIcon,
  Download,
  Printer,
  FileCheck,
} from "lucide-react";
import { listFromResponse } from "../utils/apiResponse";

const OnlineApplicationsPage = () => {
  const { user } = useSelector((state) => state.login.loggedInUser);
  const canDeleteRecords = user?.role !== "frontdesk";
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // 'all', 'unread', 'read'
  const [viewApp, setViewApp] = useState(null);

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

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/enquiry`
      );
      const list = listFromResponse(response.data, ["enquiries"]);

      // Filter specifically for Online Applications (/apply-online)
      const onlineApps = list.filter(
            (e) =>
              (e.source || "").toLowerCase().includes("apply") ||
              (e.documents && e.documents.length > 0) ||
              !!e.studentPhoto
          );
      setApplications(onlineApps);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch online applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
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
        setApplications((prev) =>
          prev.map((e) => (e._id === item._id ? { ...e, isRead: newStatus } : e))
        );
        if (viewApp && viewApp._id === item._id) {
          setViewApp((prev) => ({ ...prev, isRead: newStatus }));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleOpenView = (item) => {
    setViewApp(item);
    if (!item.isRead) {
      handleToggleStatus(item, true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application record?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/enquiry/${id}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setApplications((prev) => prev.filter((e) => e._id !== id));
        if (viewApp && viewApp._id === id) {
          setViewApp(null);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Bulk Excel / CSV Export Function
  const handleExportCSV = () => {
    if (!filteredApplications || filteredApplications.length === 0) {
      toast.error("No application data available to export");
      return;
    }

    const headers = [
      "Application ID",
      "Student Name",
      "Student Name (Nepali)",
      "Grade",
      "Age",
      "Gender",
      "DOB",
      "Nationality",
      "Student Address",
      "Parent Name",
      "Parent Email",
      "Phone",
      "Father Name",
      "Mother Name",
      "Guardian Name",
      "Occupation",
      "Parent Address",
      "Previous School",
      "Transport Needed",
      "Submission Date",
      "Read Status",
    ];

    const rows = filteredApplications.map((item) => [
      `"${item._id}"`,
      `"${(item.studentName || "").replace(/"/g, '""')}"`,
      `"${(item.studentNameNepali || "").replace(/"/g, '""')}"`,
      `"${(item.studentGrade || "").replace(/"/g, '""')}"`,
      `"${item.studentAge || ""}"`,
      `"${item.studentGender || ""}"`,
      `"${item.dob || ""}"`,
      `"${item.nationality || ""}"`,
      `"${(item.studentAddress || "").replace(/"/g, '""')}"`,
      `"${(item.parentName || "").replace(/"/g, '""')}"`,
      `"${(item.parentEmail || "").replace(/"/g, '""')}"`,
      `"${(item.phone || "").replace(/"/g, '""')}"`,
      `"${(item.fatherName || "").replace(/"/g, '""')}"`,
      `"${(item.motherName || "").replace(/"/g, '""')}"`,
      `"${(item.guardianName || "").replace(/"/g, '""')}"`,
      `"${(item.occupation || "").replace(/"/g, '""')}"`,
      `"${(item.parentAddress || "").replace(/"/g, '""')}"`,
      `"${(item.previousSchool || "").replace(/"/g, '""')}"`,
      `"${item.transportation ? "Yes" : "No"}"`,
      `"${formatDate(item)}"`,
      `"${item.isRead ? "Read" : "Unread"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Aksharaa_Online_Admissions_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredApplications.length} applications to CSV!`);
  };

  // Official PDF Print Application Generator
  const handlePrintPDF = (item) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print/download PDF application");
      return;
    }

    const imgUrl = item.studentPhoto
      ? item.studentPhoto.startsWith("http")
        ? item.studentPhoto
        : `${import.meta.env.VITE_SERVERAPI}/${item.studentPhoto.replace(/\\/g, "/")}`
      : "/fallbackimage.avif";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Admission Application - ${item.studentName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 25px; color: #111; line-height: 1.5; }
            .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #22B24C; padding-bottom: 15px; margin-bottom: 20px; }
            .school-title { font-size: 24px; font-weight: bold; color: #22B24C; }
            .school-sub { font-size: 13px; color: #555; }
            .photo-box { width: 110px; height: 130px; border: 1px solid #ccc; text-align: center; overflow: hidden; background: #fafafa; }
            .photo-box img { width: 100%; height: 100%; object-fit: cover; }
            .section-title { font-size: 14px; font-weight: bold; color: #0F172A; background: #E8F7EC; padding: 6px 12px; margin-top: 20px; margin-bottom: 12px; border-left: 4px solid #22B24C; text-transform: uppercase; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; }
            .field-label { font-weight: bold; color: #555; font-size: 11px; text-transform: uppercase; display: block; }
            .field-val { font-size: 13px; font-weight: 600; color: #111; margin-top: 2px; }
            .footer { margin-top: 50px; display: flex; justify-content: space-between; font-size: 12px; border-top: 1px solid #ddd; padding-top: 25px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="school-title">AKSHARAA SCHOOL</div>
              <div class="school-sub">Kageshwori Manohara - 9, Kathmandu, Nepal</div>
              <div class="school-sub">Phone: 01-4993031 / 32 / 33 | Email: info@aksharaaschool.edu.np</div>
              <div style="margin-top: 10px; font-weight: bold; font-size: 16px; color: #111;">
                OFFICIAL ONLINE ADMISSION FORM
              </div>
            </div>
            <div class="photo-box">
              <img src="${imgUrl}" onerror="this.style.display='none'" />
              <span style="font-size: 10px; color: #888;">Student Photo</span>
            </div>
          </div>

          <div class="section-title">1. Student Information</div>
          <div class="grid">
            <div><span class="field-label">Student Full Name:</span><div class="field-val">${item.studentName} ${item.studentNameNepali ? `(${item.studentNameNepali})` : ""}</div></div>
            <div><span class="field-label">Applying for Grade:</span><div class="field-val">${item.studentGrade}</div></div>
            <div><span class="field-label">Date of Birth / Age:</span><div class="field-val">${item.dob || "N/A"} (${item.studentAge} years old)</div></div>
            <div><span class="field-label">Gender & Nationality:</span><div class="field-val">${item.studentGender} | ${item.nationality || "Nepali"}</div></div>
            <div style="grid-column: span 2;"><span class="field-label">Student Permanent Address:</span><div class="field-val">${item.studentAddress}</div></div>
          </div>

          <div class="section-title">2. Parent & Guardian Contact Information</div>
          <div class="grid">
            <div><span class="field-label">Primary Applicant / Parent Name:</span><div class="field-val">${item.parentName}</div></div>
            <div><span class="field-label">Parent Occupation:</span><div class="field-val">${item.occupation || "N/A"}</div></div>
            <div><span class="field-label">Parent Email Address:</span><div class="field-val">${item.parentEmail}</div></div>
            <div><span class="field-label">Contact Phone Number:</span><div class="field-val">${item.phone}</div></div>
            <div><span class="field-label">Father's Name:</span><div class="field-val">${item.fatherName || "N/A"}</div></div>
            <div><span class="field-label">Mother's Name:</span><div class="field-val">${item.motherName || "N/A"}</div></div>
            <div style="grid-column: span 2;"><span class="field-label">Parent Address:</span><div class="field-val">${item.parentAddress || item.studentAddress}</div></div>
          </div>

          <div class="section-title">3. Academic History & Transport Options</div>
          <div class="grid">
            <div><span class="field-label">Previous School Name:</span><div class="field-val">${item.previousSchool || "N/A"}</div></div>
            <div><span class="field-label">Require School Bus Transport:</span><div class="field-val">${item.transportation ? "Yes (School Bus Requested)" : "No"}</div></div>
            <div><span class="field-label">Application Received Date:</span><div class="field-val">${formatDateTime(item)}</div></div>
          </div>

          <div class="footer">
            <div>
              <p>____________________________________</p>
              <p><strong>Parent / Applicant Signature</strong></p>
            </div>
            <div>
              <p>____________________________________</p>
              <p><strong>Admissions Officer Signature</strong></p>
            </div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const unreadCount = applications.filter((e) => !e.isRead).length;

  const filteredApplications = applications
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
            Online Admission Applications
          </h4>
          <p className="text-muted mb-0 small">
            Full student admission forms submitted online via /apply-online with document photo attachments.
          </p>
        </div>
        <button className="btn btn-executive" onClick={handleExportCSV}>
          <Download size={15} /> Export Bulk Excel / CSV
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-3 rounded-3 border gap-3 flex-wrap">
        <div className="d-flex align-items-center gap-2 p-1 bg-light rounded-3">
          <button
            className={`btn ${filterTab === "all" ? "btn-primary shadow-sm" : "btn-light text-secondary border-0"} px-3 py-1.5 rounded-3 fw-semibold small`}
            onClick={() => setFilterTab("all")}
          >
            All Applications ({applications.length})
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
            Read ({applications.length - unreadCount})
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

      {/* Applications Directory Table */}
      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <FileCheck size={20} className="text-primary" />
            <h5 className="fw-bold mb-0 text-dark">Online Applications Inbox</h5>
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Parent Contact</th>
                <th>Photo Docs</th>
                <th>Transport</th>
                <th>Received Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Loading online admission applications...
                  </td>
                </tr>
              ) : filteredApplications.length > 0 ? (
                filteredApplications.map((item) => {
                  const docCount =
                    (item.documents ? item.documents.length : 0) ||
                    [
                      item.studentPhoto,
                      item.birthCertificate,
                      item.fatherPhoto,
                      item.motherPhoto,
                      item.previousMarksheet,
                      item.transferCertificate,
                      item.citizenshipDoc,
                    ].filter(Boolean).length;

                  return (
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
                        {docCount > 0 ? (
                          <span className="badge-status badge-brand">
                            <ImageIcon size={13} /> {docCount} Photos Attached
                          </span>
                        ) : (
                          <span className="badge-status badge-secondary">
                            No Photos
                          </span>
                        )}
                      </td>
                      <td>
                        {item.transportation ? (
                          <span className="badge-status badge-brand me-1">
                            <Bus size={12} /> Bus Required
                          </span>
                        ) : (
                          <span className="badge-status badge-secondary me-1">
                            No Bus
                          </span>
                        )}
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
                            title="View Full Application"
                            onClick={() => handleOpenView(item)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn-icon btn-icon-warning"
                            title="Print / Save PDF Form"
                            onClick={() => handlePrintPDF(item)}
                          >
                            <Printer size={16} />
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No online admission applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail & Printable PDF Modal */}
      {viewApp && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "840px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <ClipboardList size={22} className="text-primary" />
                <div>
                  <h5 className="fw-bold mb-0 text-dark">
                    Online Admission Application - {viewApp.studentName}
                  </h5>
                  <small className="text-muted">
                    Submitted: {formatDateTime(viewApp)}
                  </small>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setViewApp(null)}
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
                    <span className="fw-bold text-dark fs-6">{viewApp.studentName} {viewApp.studentNameNepali ? `(${viewApp.studentNameNepali})` : ""}</span>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Applying for Grade:</span>
                    <span className="badge-status badge-brand fs-6">{viewApp.studentGrade}</span>
                  </div>
                  <div className="col-12 col-md-4">
                    <span className="small text-muted d-block fw-semibold">Age / Date of Birth:</span>
                    <span className="fw-semibold text-dark">{viewApp.dob || "N/A"} ({viewApp.studentAge} yrs)</span>
                  </div>
                  <div className="col-12 col-md-4">
                    <span className="small text-muted d-block fw-semibold">Gender & Nationality:</span>
                    <span className="fw-semibold text-dark">{viewApp.studentGender} | {viewApp.nationality || "Nepali"}</span>
                  </div>
                  <div className="col-12 col-md-4">
                    <span className="small text-muted d-block fw-semibold">Transport Needed:</span>
                    <span className="fw-semibold text-dark">
                      {viewApp.transportation ? "Yes (School Bus)" : "No"}
                    </span>
                  </div>
                  <div className="col-12">
                    <span className="small text-muted d-block fw-semibold">Student Address:</span>
                    <span className="text-secondary fw-medium">
                      <MapPin size={14} className="me-1" />
                      {viewApp.studentAddress}
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
                    <span className="small text-muted d-block fw-semibold">Parent / Applicant Name:</span>
                    <span className="fw-bold text-dark fs-6">{viewApp.parentName}</span>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Parent Occupation:</span>
                    <span className="fw-semibold text-dark">
                      <Briefcase size={14} className="me-1 text-muted" />
                      {viewApp.occupation || "N/A"}
                    </span>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Email Address:</span>
                    <a href={`mailto:${viewApp.parentEmail}`} className="text-primary fw-semibold">
                      {viewApp.parentEmail}
                    </a>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Phone Number:</span>
                    <a href={`tel:${viewApp.phone}`} className="text-dark fw-bold">
                      <Phone size={14} className="me-1 text-muted" />
                      {viewApp.phone}
                    </a>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Father Name:</span>
                    <span className="fw-semibold text-dark">{viewApp.fatherName || "N/A"}</span>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="small text-muted d-block fw-semibold">Mother Name:</span>
                    <span className="fw-semibold text-dark">{viewApp.motherName || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Uploaded Document Photos Section */}
              {((viewApp.documents && viewApp.documents.length > 0) ||
                viewApp.studentPhoto ||
                viewApp.birthCertificate ||
                viewApp.fatherPhoto ||
                viewApp.motherPhoto ||
                viewApp.previousMarksheet ||
                viewApp.transferCertificate ||
                viewApp.citizenshipDoc) && (
                <div className="mb-4">
                  <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2 border-bottom pb-2">
                    <ImageIcon size={18} /> Uploaded Document Photos (Max 300KB each)
                  </h6>
                  <div className="row g-3">
                    {[
                      { label: "Student Photo", path: viewApp.studentPhoto },
                      { label: "Birth Certificate", path: viewApp.birthCertificate },
                      { label: "Father Photo", path: viewApp.fatherPhoto },
                      { label: "Mother Photo", path: viewApp.motherPhoto },
                      { label: "Guardian Photo", path: viewApp.guardianPhoto },
                      { label: "Previous Marksheet", path: viewApp.previousMarksheet },
                      { label: "Transfer Certificate", path: viewApp.transferCertificate },
                      { label: "Citizenship / Medical", path: viewApp.citizenshipDoc },
                    ]
                      .filter((doc) => !!doc.path)
                      .map((doc, idx) => {
                        const imgUrl = doc.path.startsWith("http")
                          ? doc.path
                          : `${import.meta.env.VITE_SERVERAPI}/${doc.path.replace(/\\/g, "/")}`;

                        return (
                          <div key={idx} className="col-6 col-md-3">
                            <div className="border rounded p-2 text-center bg-white h-100 shadow-sm">
                              <span className="small text-muted fw-semibold d-block mb-1 text-truncate">
                                {doc.label}
                              </span>
                              <a href={imgUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={imgUrl}
                                  alt={doc.label}
                                  className="img-fluid rounded border"
                                  style={{ height: "110px", width: "100%", objectFit: "cover" }}
                                  onError={(e) => {
                                    e.currentTarget.src = "/fallbackimage.avif";
                                  }}
                                />
                              </a>
                              <a
                                href={imgUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-link text-decoration-none p-0 mt-1 small"
                              >
                                View Full Image ↗
                              </a>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex align-items-center justify-content-between pt-3 border-top gap-2 flex-wrap">
                <button
                  className="btn btn-executive px-4"
                  onClick={() => handlePrintPDF(viewApp)}
                >
                  <Printer size={16} /> Print / Save Form PDF
                </button>

                <div className="d-flex gap-2">
                  <button
                    className={`btn ${viewApp.isRead ? "btn-outline-secondary" : "btn-success"} px-3`}
                    onClick={() => handleToggleStatus(viewApp)}
                  >
                    {viewApp.isRead ? "Mark Unread" : "Mark Read"}
                  </button>
                  <button className="btn btn-secondary px-4" onClick={() => setViewApp(null)}>
                    Close
                  </button>
                  {canDeleteRecords && (
                    <button
                      className="btn btn-danger px-4"
                      onClick={() => handleDelete(viewApp._id)}
                    >
                      Delete
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

export default OnlineApplicationsPage;
