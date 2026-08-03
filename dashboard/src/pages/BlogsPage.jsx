import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Search, Trash2, Edit, FileText, Eye } from "lucide-react";
import getImageUrl from "../utils/imageUrl";
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
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import DOMPurify from "dompurify";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogsRes, catsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/blog`),
        axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/category`),
      ]);

      const blogList = blogsRes.data.blogs || blogsRes.data.data || [];
      const catList = catsRes.data.categories || catsRes.data.data || [];

      setBlogs(Array.isArray(blogList) ? blogList : []);
      setCategories(Array.isArray(catList) ? catList : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setSelectedCategory("");
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (blog) => {
    setEditingItem(blog);
    setTitle(blog.title || "");
    setDescription(blog.description || "");
    setSelectedCategory(blog.category?._id || blog.category || "");
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/blog/${id}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setBlogs((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    if (!editingItem && !imageFile) {
      toast.error("Please upload a featured blog image.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (selectedCategory) {
        formData.append("selectedCategory", selectedCategory);
        formData.append("category", selectedCategory);
      }
      if (imageFile) {
        formData.append("Blogimage", imageFile);
        formData.append("blogimage", imageFile);
        formData.append("image", imageFile);
      }


      let response;
      if (editingItem) {
        response = await axios.put(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/blog/${editingItem._id}`,
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/blog`,
          formData,
          { headers: { Authorization: token } }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBlogs = blogs.filter((b) =>
    (b.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="main">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="fw-bold mb-0" style={{ color: "#0F172A", fontSize: "1.15rem" }}>
            Blogs & Articles
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
            Publish and manage blog posts.
          </p>
        </div>
        <button className="btn btn-executive" onClick={openAddModal}>
          <Plus size={15} /> Add New Blog
        </button>
      </div>

      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <FileText size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">Published Articles ({filteredBlogs.length})</h5>
          </div>
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="form-control"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Category</th>
                <th>Published Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading blog posts...
                  </td>
                </tr>
              ) : filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <tr key={blog._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={getImageUrl(blog.image)}
                          onError={(e) => {
                            e.currentTarget.src = "/fallbackimage.avif";
                          }}
                          alt={blog.title}
                          width="50"
                          height="50"
                          className="rounded-3 object-fit-cover border"
                        />
                        <span className="fw-semibold text-dark">{blog.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge-status badge-indigo">
                        {blog.category?.title || "General"}
                      </span>
                    </td>
                    <td className="small text-muted">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn-icon btn-icon-primary"
                        title="View Blog Details"
                        onClick={() => setViewItem(blog)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn-icon btn-icon-warning"
                        title="Edit Blog"
                        onClick={() => openEditModal(blog)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        title="Delete Blog"
                        onClick={() => handleDelete(blog._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No blogs found. Click &quot;+ Add New Blog&quot; to post an article.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Preview Modal */}
      {viewItem && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "900px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-light">
              <div>
                <h5 className="fw-bold mb-0 text-dark">Article Detailed View</h5>
                <small className="text-muted">Preview article layout before public display</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setViewItem(null)}
              ></button>
            </div>
            <div className="p-4 p-md-5">
              {viewItem.image && (
                <div className="mb-4 text-center">
                  <img
                    src={getImageUrl(viewItem.image)}
                    onError={(e) => {
                      e.currentTarget.src = "/fallbackimage.avif";
                    }}
                    alt={viewItem.title}
                    className="img-fluid rounded-3 border shadow-sm"
                    style={{ maxHeight: "380px", width: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                <span className="badge-status badge-indigo fs-6">
                  {viewItem.category?.title || "General"}
                </span>
                <span className="text-muted small">
                  Published: {new Date(viewItem.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <h2 className="fw-bold mb-4 text-dark">{viewItem.title}</h2>
              <hr className="my-4" />
              <div
                className="blog-preview-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(viewItem.description || ""),
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "960px" }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {editingItem ? "Edit Blog Article" : "Create New Blog Article"}
                </h5>
                <small className="text-muted">Draft content, upload cover graphics, and organize by category</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 p-md-5">
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-7">
                  <label className="form-label fw-bold">Article Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter descriptive article title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12 col-md-5">
                  <label className="form-label fw-bold">Category</label>
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select Category (Optional)</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  Featured Graphic Image {editingItem ? "(Optional to replace)" : <span className="text-danger">*</span>}
                </label>
                <div className="p-3 rounded-3 border bg-light text-center" style={{ borderStyle: "dashed" }}>
                  {imageFile || editingItem?.image ? (
                    <div className="d-flex flex-column align-items-center gap-2">
                      <div className="position-relative overflow-hidden rounded-3 border shadow-sm w-100" style={{ maxHeight: "240px" }}>
                        <img
                          src={
                            imageFile
                              ? URL.createObjectURL(imageFile)
                              : getImageUrl(editingItem?.image)
                          }
                          alt="Featured Graphic Preview"
                          className="w-100 object-fit-cover"
                          style={{ maxHeight: "240px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <label className="btn btn-sm btn-outline-primary mb-0 cursor-pointer">
                          <Plus size={14} className="me-1" /> Choose Different Image
                          <input
                            type="file"
                            className="d-none"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                          />
                        </label>
                        {imageFile && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setImageFile(null)}
                          >
                            Remove Selection
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <label className="d-flex flex-column align-items-center py-4 cursor-pointer m-0">
                      <Plus size={36} className="text-primary mb-2" />
                      <span className="fw-semibold text-dark mb-1">Click to select cover graphic image</span>
                      <small className="text-muted">Supports PNG, JPG, WEBP, GIF (Max 10MB)</small>
                      <input
                        type="file"
                        className="d-none"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        required={!editingItem}
                      />
                    </label>
                  )}
                </div>
              </div>


              <div className="mb-4">
                <label className="form-label fw-bold mb-2">Article Content & Details <span className="text-danger">*</span></label>
                <CKEditor
                  editor={ClassicEditor}
                  config={{
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
                    ],
                    toolbar: [
                      "undo",
                      "redo",
                      "|",
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "|",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "insertTable",
                    ],
                  }}
                  data={description}
                  onChange={(_event, editor) => {
                    setDescription(editor.getData());
                  }}
                />
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
                  {submitting ? "Publishing..." : editingItem ? "Update Article" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
