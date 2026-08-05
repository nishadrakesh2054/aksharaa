import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Search, Trash2, Edit, Video, FolderGit2 } from "lucide-react";
import getImageUrl from "../utils/imageUrl";
import { listFromResponse } from "../utils/apiResponse";

const LongTermProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/projects`);
      setProjects(listFromResponse(res.data, ["projects"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch long term projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setVideo("");
    setSelectedFiles([]);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setVideo(item.video || "");
    setSelectedFiles([]);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Project title and description are required.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("video", video);

      if (selectedFiles && selectedFiles.length > 0) {
        Array.from(selectedFiles).forEach((file) => {
          formData.append("images", file);
        });
      }

      let response;
      if (editingItem) {
        response = await axios.put(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/projects/${editingItem._id}`,
          formData
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/projects`,
          formData
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchProjects();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this long term project?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/projects/${id}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      (p.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="main">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Our Long Term Projects
          </h4>
          <p className="text-muted mb-0 small">
            Curriculum initiatives and hands-on learning projects shown on /newsactivity.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={15} /> Add Long Term Project
        </button>
      </div>

      {/* Header Search Filter Bar */}
      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <FolderGit2 size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">Projects Directory ({filteredProjects.length})</h5>
          </div>
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="form-control"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Project Title & Media</th>
                <th>Video Embed</th>
                <th>Date Added</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading long term projects...
                  </td>
                </tr>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((item) => {
                  const firstImg = getImageUrl(item.images);
                  const imageCount = Array.isArray(item.images) ? item.images.length : item.images ? 1 : 0;

                  return (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={firstImg}
                            onError={(e) => {
                              e.currentTarget.src = "/fallbackimage.avif";
                            }}
                            alt={item.title}
                            width="50"
                            height="50"
                            className="rounded-3 object-fit-cover border"
                          />
                          <div>
                            <span className="fw-semibold text-dark d-block">{item.title}</span>
                            {imageCount > 1 && (
                              <small className="text-muted">+{imageCount - 1} additional photos</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        {item.video ? (
                          <a
                            href={item.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="small text-primary text-decoration-none d-inline-flex align-items-center gap-1"
                          >
                            <Video size={14} />
                            <span className="text-truncate" style={{ maxWidth: "220px" }}>{item.video}</span>
                          </a>
                        ) : (
                          <span className="small text-muted">—</span>
                        )}
                      </td>
                      <td className="small text-muted">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn-icon btn-icon-warning"
                          title="Edit Project"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          title="Delete Project"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No long term projects found. Click &quot;+ Add Long Term Project&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "800px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {editingItem ? "Edit Long Term Project" : "Add Long Term Project"}
                </h5>
                <small className="text-muted">Enter project title, detailed description, photos, and video link</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 p-md-5">
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Project Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Kitchen Gardening Project"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Video Embed URL (Optional):</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. https://www.youtube.com/embed/PDoYP4LqDdY"
                    value={video}
                    onChange={(e) => setVideo(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Detailed Project Description <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  rows="6"
                  placeholder="Describe the long-term learning goals, activities, and student experience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  {editingItem ? "Replace Project Photos (Optional):" : "Project Photos:"}
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  multiple
                  onChange={(e) => setSelectedFiles(e.target.files)}
                />
                <small className="text-muted d-block mt-1">
                  You can select multiple photos at once.
                </small>
              </div>

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
                  {submitting ? "Saving..." : editingItem ? "Update Project" : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LongTermProjectsPage;
