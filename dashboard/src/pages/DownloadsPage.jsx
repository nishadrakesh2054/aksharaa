import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {  Search, Trash2, Edit, Download, FileText, FileUp, X } from "lucide-react";
import getImageUrl from "../utils/imageUrl";
import { listFromResponse } from "../utils/apiResponse";

const MAX_PDF_SIZE = 10 * 1024 * 1024;

const DownloadsPage = () => {
  const [pdfs, setPdfs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/getallpdf`
      );
      setPdfs(listFromResponse(response.data, ["pdfs", "pdf"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch PDF downloads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      toast.error("PDF file size must be 10MB or less.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    const input = document.getElementById("pdfFile");
    if (input) input.value = "";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PDF download?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/deletepdf/${id}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setPdfs((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Document title is required.");
      return;
    }
    if (!editingItem && !selectedFile) {
      toast.error("Please select a PDF file.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);

      if (selectedFile) {
        formData.append("pdfFile", selectedFile);
      }

      let response;
      if (editingItem) {
        response = await axios.put(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/updatepdf/${editingItem._id}`,
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/uploadpdf`,
          formData,
          { headers: { Authorization: token } }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchPdfs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPdfs = pdfs.filter((p) =>
    (p.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="main">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="fw-bold mb-0" style={{ color: "#0F172A", fontSize: "1.15rem" }}>
            PDF Downloads
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
            Downloadable forms and resources.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <FileUp size={15} /> Upload PDF
        </button>
      </div>

      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <FileText size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">PDF Directory ({filteredPdfs.length})</h5>
          </div>
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="form-control"
              placeholder="Search PDF documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Upload Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Loading PDF documents...
                  </td>
                </tr>
              ) : filteredPdfs.length > 0 ? (
                filteredPdfs.map((pdf) => (
                  <tr key={pdf._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="icon-wrapper badge-amber p-2 rounded-2">
                          <FileText size={20} />
                        </div>
                        <span className="fw-semibold text-dark">{pdf.title}</span>
                      </div>
                    </td>
                    <td className="small text-muted">
                      {new Date(pdf.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="text-end">
                      <a
                        href={getImageUrl(pdf.filePath)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-icon btn-icon-primary"
                        title="Download PDF"
                        download
                      >
                        <Download size={16} />
                      </a>
                      <button
                        className="btn-icon btn-icon-warning"
                        title="Edit PDF"
                        onClick={() => openEditModal(pdf)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        title="Delete PDF"
                        onClick={() => handleDelete(pdf._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">
                    No PDF documents uploaded yet. Click &quot;+ Upload PDF&quot; to post a document.
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
          <div className="executive-modal" style={{ maxWidth: "560px" }}>
            <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "1rem" }}>
                  {editingItem ? "Edit PDF Document" : "Upload New PDF Document"}
                </h5>
                <small className="text-muted">Title and PDF attachment</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="row g-3 mb-3">
                <div className="col-12">
                  <label className="form-label fw-bold">Document Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. School Prospectus 2026-2027"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold">
                    {editingItem ? "Replace PDF File" : "PDF File"} {!editingItem && <span className="text-danger">*</span>}
                  </label>
                  <label
                    htmlFor="pdfFile"
                    className="d-flex align-items-center justify-content-center gap-2 border rounded-3 px-3 py-3 mb-0"
                    style={{
                      borderStyle: "dashed",
                      cursor: "pointer",
                      background: "#F8FAFC",
                      color: "#334155",
                    }}
                  >
                    <FileUp size={18} />
                    <span className="fw-semibold">
                      {selectedFile ? "Change PDF" : editingItem ? "Choose replacement PDF" : "Choose PDF"}
                    </span>
                  </label>
                  <input
                    type="file"
                    className="d-none"
                    id="pdfFile"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <div className="d-flex align-items-center justify-content-between gap-3 rounded-3 border px-3 py-2 mt-2">
                      <div className="d-flex align-items-center gap-2 min-width-0">
                        <span className="icon-wrapper badge-amber p-2 rounded-circle">
                          <FileText size={16} />
                        </span>
                        <div className="min-width-0">
                          <div className="fw-semibold text-truncate" style={{ maxWidth: "360px", fontSize: "13px" }}>
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
                        title="Remove PDF"
                        onClick={clearSelectedFile}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
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
                  {submitting ? "Saving..." : editingItem ? "Update PDF" : "Upload PDF"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadsPage;
