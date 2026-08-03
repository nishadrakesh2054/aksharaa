import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, Trash2, Edit, Bell, ImageUp, X } from "lucide-react";
import getImageUrl from "../utils/imageUrl";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const allowedImageTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const selectedPreviewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : ""),
    [selectedFile]
  );

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/notice/getallnotice`
      );
      const list = response.data.notices || response.data.data || [];
      setNotices(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    return () => {
      if (selectedPreviewUrl) URL.revokeObjectURL(selectedPreviewUrl);
    };
  }, [selectedPreviewUrl]);

  const openAddModal = () => {
    setEditingItem(null);
    setSelectedFile(null);
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (notice) => {
    setEditingItem(notice);
    setSelectedFile(null);
    setIsActive(notice.isActive !== false);
    setShowModal(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/notice/toggle-status/${id}`,
        {},
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setNotices((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, isActive: !item.isActive } : item
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, JPG, or WEBP images are allowed.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Notice image must be 2MB or less.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    const input = document.getElementById("noticeImage");
    if (input) input.value = "";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/notice/deletenotice/${id}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setNotices((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem && !selectedFile) {
      toast.error("Please select a notice image.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("isActive", isActive);
      if (selectedFile) {
        formData.append("Noticeimage", selectedFile);
      }


      let response;
      if (editingItem) {
        response = await axios.put(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/notice/updatenotice/${editingItem._id}`,
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/notice/createnotice`,
          formData,
          { headers: { Authorization: token } }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchNotices();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNotices = notices.filter((notice) =>
    (notice.title || "Notice").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="main">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="fw-bold mb-0" style={{ color: "#0F172A", fontSize: "1.15rem" }}>
            Notices & Announcements
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
            Official school notice management.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <ImageUp size={15} /> Add New Notice
        </button>
      </div>

      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <Bell size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">Notice Board ({filteredNotices.length})</h5>
          </div>
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="form-control"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Notice Image</th>
                <th>Status</th>
                <th>Date Added</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading notices...
                  </td>
                </tr>
              ) : filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => (
                  <tr key={notice._id}>
                    <td>
                      <img
                        src={getImageUrl(notice.images)}
                        onError={(e) => {
                          e.currentTarget.src = "/fallbackimage.avif";
                        }}
                        alt="Notice"
                        width="100"
                        height="60"
                        className="rounded-3 object-fit-cover border"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm ${
                          notice.isActive !== false
                            ? "btn-success"
                            : "btn-outline-secondary"
                        } rounded-pill px-3 py-1 text-uppercase fw-bold`}
                        style={{ fontSize: "11px" }}
                        onClick={() => handleToggleStatus(notice._id)}
                      >
                        {notice.isActive !== false ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="small text-muted">
                      {new Date(notice.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn-icon btn-icon-warning"
                        title="Edit Notice"
                        onClick={() => openEditModal(notice)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        title="Delete Notice"
                        onClick={() => handleDelete(notice._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No notices found. Click &quot;+ Add New Notice&quot; to post one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "560px" }}>
            <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "1rem" }}>
                  {editingItem ? "Edit Notice" : "Add New Notice"}
                </h5>
                <small className="text-muted">Upload a notice image and set status</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="form-check form-switch mb-3 p-2 bg-light rounded border px-4 d-flex align-items-center justify-content-between">
                <label className="form-check-label fw-bold me-3 text-dark mb-0" htmlFor="noticeStatusSwitch">
                  Notice Display Status ({isActive ? "Active / Visible" : "Inactive / Hidden"})
                </label>
                <input
                  className="form-check-input ms-auto"
                  type="checkbox"
                  role="switch"
                  id="noticeStatusSwitch"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ width: "2.5em", height: "1.25em", cursor: "pointer" }}
                />
              </div>

              {editingItem && (
                <div className="mb-3">
                  <p className="small text-muted fw-semibold mb-2">Current Notice</p>
                  <img
                    src={getImageUrl(editingItem.images)}
                    onError={(e) => {
                      e.currentTarget.src = "/fallbackimage.avif";
                    }}
                    alt="Current Notice"
                    className="w-100 rounded-3 border object-fit-cover"
                    style={{ height: "150px" }}
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {editingItem ? "Replace Notice Image" : "Notice Image"} {!editingItem && <span className="text-danger">*</span>}
                </label>
                <label
                  htmlFor="noticeImage"
                  className="d-flex align-items-center justify-content-center gap-2 border rounded-3 px-3 py-3 mb-0"
                  style={{
                    borderStyle: "dashed",
                    cursor: "pointer",
                    background: "#F8FAFC",
                    color: "#334155",
                  }}
                >
                  <ImageUp size={18} />
                  <span className="fw-semibold">
                    {selectedFile ? "Change Image" : editingItem ? "Choose replacement image" : "Choose image"}
                  </span>
                </label>
                <input
                  type="file"
                  id="noticeImage"
                  className="d-none"
                  accept="image/png,image/jpg,image/jpeg,image/webp"
                  onChange={handleFileChange}
                />
                <small className="text-muted d-block mt-2">PNG, JPG, JPEG or WEBP up to 2MB.</small>
              </div>

              {selectedFile && (
                <div className="d-flex align-items-center justify-content-between gap-3 rounded-3 border px-3 py-2 mb-4">
                  <div className="d-flex align-items-center gap-3 min-width-0">
                    <img
                      src={selectedPreviewUrl}
                      alt="Selected notice"
                      className="rounded-circle border object-fit-cover"
                      style={{ width: "54px", height: "54px" }}
                    />
                    <div className="min-width-0">
                      <div className="fw-semibold text-truncate" style={{ maxWidth: "350px", fontSize: "13px" }}>
                        {selectedFile.name}
                      </div>
                      <small className="text-muted">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-icon btn-icon-danger flex-shrink-0"
                    title="Remove image"
                    onClick={clearSelectedFile}
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-executive px-4"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingItem ? "Update Notice" : "Publish Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesPage;
