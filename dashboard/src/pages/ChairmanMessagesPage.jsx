import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Heading,
  Italic,
  Link,
  List,
  Paragraph,
  Table,
  Undo,
  FontColor,
  FontBackgroundColor,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { Edit, Eye, Plus, Search, Trash2, UserRoundCog } from "lucide-react";
import getImageUrl from "../utils/imageUrl";
import { listFromResponse } from "../utils/apiResponse";

const editorConfig = {
  plugins: [
    Essentials,
    Bold,
    Italic,
    Paragraph,
    Heading,
    List,
    Link,
    Table,
    Undo,
    FontColor,
    FontBackgroundColor,
  ],
  toolbar: [
    "undo",
    "redo",
    "|",
    "heading",
    "|",
    "bold",
    "italic",
    "fontColor",
    "fontBackgroundColor",
    "|",
    "link",
    "bulletedList",
    "numberedList",
    "insertTable",
  ],
};

const ChairmanMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/chairman-messages?includeInactive=true`
      );
      setMessages(listFromResponse(response.data, ["messages"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch chairman messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName("");
    setPosition("");
    setDescription("");
    setActive(true);
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (message) => {
    setEditingItem(message);
    setName(message.name || "");
    setPosition(message.position || "");
    setDescription(message.description || "");
    setActive(Boolean(message.active));
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/chairman-messages/${id}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setMessages((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !position.trim() || !description.trim()) {
      toast.error("Name, position, and description are required.");
      return;
    }
    if (!editingItem && !imageFile) {
      toast.error("Please upload a profile image.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("position", position);
      formData.append("description", description);
      formData.append("active", String(active));
      if (imageFile) {
        formData.append("image", imageFile);
        formData.append("chairmanImage", imageFile);
      }

      const url = editingItem
        ? `${import.meta.env.VITE_SERVERAPI}/api/v1/chairman-messages/${editingItem._id}`
        : `${import.meta.env.VITE_SERVERAPI}/api/v1/chairman-messages`;
      const response = editingItem
        ? await axios.put(url, formData, { headers: { Authorization: token } })
        : await axios.post(url, formData, { headers: { Authorization: token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchMessages();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const query = searchTerm.toLowerCase();
    return (
      (message.name || "").toLowerCase().includes(query) ||
      (message.position || "").toLowerCase().includes(query)
    );
  });

  return (
    <div id="main">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="fw-bold mb-0" style={{ color: "#0F172A", fontSize: "1.15rem" }}>
            Chairman Messages
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
            Manage the leadership message blocks shown on the public page.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={15} /> Add Message
        </button>
      </div>

      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <UserRoundCog size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">Leadership Messages ({filteredMessages.length})</h5>
          </div>
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="form-control"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Position</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading chairman messages...
                  </td>
                </tr>
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <tr key={message._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={getImageUrl(message.image)}
                          onError={(event) => {
                            event.currentTarget.src = "/fallbackimage.avif";
                          }}
                          alt={message.name}
                          width="50"
                          height="50"
                          className="rounded-3 object-fit-cover border"
                        />
                        <span className="fw-semibold text-dark">{message.name}</span>
                      </div>
                    </td>
                    <td>{message.position}</td>
                    <td>
                      <span className={`badge-status ${message.active ? "badge-brand" : "badge-secondary"}`}>
                        {message.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn-icon btn-icon-primary" title="View Message" onClick={() => setViewItem(message)}>
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon btn-icon-warning" title="Edit Message" onClick={() => openEditModal(message)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-icon-danger" title="Delete Message" onClick={() => handleDelete(message._id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No chairman messages found. Click &quot;Add Message&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewItem && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "900px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-light">
              <div>
                <h5 className="fw-bold mb-0 text-dark">{viewItem.name}</h5>
                <small className="text-muted">{viewItem.position}</small>
              </div>
              <button type="button" className="btn-close" onClick={() => setViewItem(null)}></button>
            </div>
            <div className="p-4 p-md-5">
              <div className="mb-4 text-center">
                <img
                  src={getImageUrl(viewItem.image)}
                  onError={(event) => {
                    event.currentTarget.src = "/fallbackimage.avif";
                  }}
                  alt={viewItem.name}
                  className="img-fluid rounded-3 border shadow-sm"
                  style={{ maxHeight: "380px", objectFit: "cover" }}
                />
              </div>
              <div
                className="blog-preview-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(viewItem.description || "", {
                    ADD_ATTR: ["style", "target", "class"],
                  }),
                }}
              />
            </div>
            <div className="p-3 border-top bg-light text-end">
              <button className="btn btn-secondary px-4" onClick={() => setViewItem(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "960px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {editingItem ? "Edit Chairman Message" : "Create Chairman Message"}
                </h5>
                <small className="text-muted">Use the editor for the long message text shown on the public page.</small>
              </div>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 p-md-5">
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" value={name} onChange={(event) => setName(event.target.value)} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">
                    Position <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" value={position} onChange={(event) => setPosition(event.target.value)} required />
                </div>
                <div className="col-12">
                  <label className="form-check d-flex align-items-center gap-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={active}
                      onChange={(event) => setActive(event.target.checked)}
                    />
                    <span className="form-check-label fw-bold">Active on frontend</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  Image {editingItem ? "(Optional to replace)" : <span className="text-danger">*</span>}
                </label>
                <div className="p-3 rounded-3 border bg-light text-center" style={{ borderStyle: "dashed" }}>
                  {imageFile || editingItem?.image ? (
                    <div className="d-flex flex-column align-items-center gap-2">
                      <img
                        src={imageFile ? URL.createObjectURL(imageFile) : getImageUrl(editingItem?.image)}
                        alt="Profile preview"
                        className="img-fluid rounded-3 border shadow-sm"
                        style={{ maxHeight: "260px", objectFit: "cover" }}
                      />
                      <label className="btn btn-sm btn-outline-primary mb-0 cursor-pointer">
                        <Plus size={14} className="me-1" /> Choose Different Image
                        <input type="file" className="d-none" accept="image/*" onChange={(event) => setImageFile(event.target.files[0])} />
                      </label>
                    </div>
                  ) : (
                    <label className="d-flex flex-column align-items-center py-4 cursor-pointer m-0">
                      <Plus size={36} className="text-primary mb-2" />
                      <span className="fw-semibold text-dark mb-1">Click to select profile image</span>
                      <small className="text-muted">Supports PNG, JPG, WEBP, GIF (Max 5MB)</small>
                      <input type="file" className="d-none" accept="image/*" onChange={(event) => setImageFile(event.target.files[0])} required={!editingItem} />
                    </label>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold mb-2">
                  Description <span className="text-danger">*</span>
                </label>
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={description}
                  onChange={(_event, editor) => setDescription(editor.getData())}
                />
              </div>

              <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                <button type="button" className="btn btn-secondary px-4 py-2" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-executive px-4 py-2" disabled={submitting}>
                  {submitting ? "Saving..." : editingItem ? "Update Message" : "Create Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChairmanMessagesPage;
