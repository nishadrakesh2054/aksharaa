import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import getImageUrl from "../utils/imageUrl";

const GetDownload = () => {
  const [pdfs, setPdfs] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPdfs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/getallpdf`
      );
      const list = response.data.pdfs || response.data.data || [];
      setPdfs(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PDF download?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/deletepdf/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setPdfs((prev) => prev.filter((pdf) => pdf._id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (pdf) => {
    setEditingItem(pdf);
    setEditTitle(pdf.title || "");
    setSelectedFile(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      toast.error("PDF title is required.");
      return;
    }

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("title", editTitle);
      if (selectedFile) {
        formData.append("pdfFile", selectedFile);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/updatepdf/${editingItem._id}`,
        formData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingItem(null);
        setSelectedFile(null);
        fetchPdfs();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="pagebox py-4">
      <div className="row">
        <div className="col-12 text-center">
          <h2 className="page-title mb-4">Available Downloads</h2>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-10">
          <ul className="list-group">
            {pdfs.map((pdf) => {
              const createdDate = new Date(pdf.createdAt);
              const formattedDate = createdDate.toLocaleDateString();

              return (
                <li
                  key={pdf._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <span className="pdf-name fw-bold">{pdf.title}</span>
                    <br />
                    <small className="text-muted">
                      Uploaded on:{" "}
                      {isNaN(createdDate) ? "Invalid Date" : formattedDate}
                    </small>
                  </div>
                  <div>
                    <a
                      href={getImageUrl(pdf.filePath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm me-2"
                      download
                    >
                      <i className="bi bi-download"></i> Download
                    </a>
                    <button
                      className="btn btn-warning btn-sm me-2 text-dark"
                      onClick={() => handleEdit(pdf)}
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(pdf._id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit PDF Download</h5>
                <button type="button" className="btn-close" onClick={() => setEditingItem(null)}></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">PDF Title:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Replace PDF File (Optional):</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="application/pdf"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingItem(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={updating}>
                    {updating ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetDownload;
