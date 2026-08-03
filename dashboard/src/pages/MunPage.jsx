import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Globe,
  Plus,
  Trash2,
  Save,
  BookOpen,
  Image as ImageIcon,
  ImagePlus,
  X,
} from "lucide-react";

const MunPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    aboutTitle: "",
    aboutText: "",
    whyTitle: "",
    whyText: "",
    goalsTitle: "",
    goalsList: [],
    sliderImages: [],
    gridImages: [],
  });

  // New Upload Files
  const [newSliderFiles, setNewSliderFiles] = useState([]);
  const [newGridFiles, setNewGridFiles] = useState([]);

  // Goal Bullet Input
  const [newGoalItem, setNewGoalItem] = useState("");

  const fetchMunData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/mun`);
      const data = res.data.data || res.data.mun || {};
      setFormData({
        title: data.title || "AKSHARAA MODEL UNITED NATIONS",
        subtitle: data.subtitle || "AMUN",
        aboutTitle: data.aboutTitle || "About MUN",
        aboutText: data.aboutText || "",
        whyTitle: data.whyTitle || "WHY AMUN?",
        whyText: data.whyText || "",
        goalsTitle: data.goalsTitle || "OUR GOALS",
        goalsList: data.goalsList || [],
        sliderImages: data.sliderImages || [],
        gridImages: data.gridImages || [],
      });
      setNewSliderFiles([]);
      setNewGridFiles([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load MUN section data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMunData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add & Remove Goals List
  const addGoalItem = () => {
    if (!newGoalItem.trim()) return;
    setFormData((prev) => ({
      ...prev,
      goalsList: [...prev.goalsList, newGoalItem.trim()],
    }));
    setNewGoalItem("");
  };

  const removeGoalItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      goalsList: prev.goalsList.filter((_, i) => i !== index),
    }));
  };

  // Remove existing uploaded image
  const removeExistingImage = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  // Handle file selections
  const handleSliderFilesSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewSliderFiles((prev) => [...prev, ...files]);
    }
  };

  const handleGridFilesSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewGridFiles((prev) => [...prev, ...files]);
    }
  };

  const removeNewSliderFile = (index) => {
    setNewSliderFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewGridFile = (index) => {
    setNewGridFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const submitData = new FormData();

      submitData.append("title", formData.title);
      submitData.append("subtitle", formData.subtitle);
      submitData.append("aboutTitle", formData.aboutTitle);
      submitData.append("aboutText", formData.aboutText);
      submitData.append("whyTitle", formData.whyTitle);
      submitData.append("whyText", formData.whyText);
      submitData.append("goalsTitle", formData.goalsTitle);

      submitData.append("goalsList", JSON.stringify(formData.goalsList));
      submitData.append("existingSliderImages", JSON.stringify(formData.sliderImages));
      submitData.append("existingGridImages", JSON.stringify(formData.gridImages));

      newSliderFiles.forEach((file) => submitData.append("sliderImages", file));
      newGridFiles.forEach((file) => submitData.append("gridImages", file));

      const res = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/mun`,
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success("Aksharaa MUN section updated successfully!");
        fetchMunData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="main">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Aksharaa Model United Nations (AMUN) Management
          </h4>
          <p className="text-muted mb-0 small">
            Manage top carousel photos, About MUN descriptions, Why AMUN paragraphs, goals list, and side photo grid.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card border-0 shadow-sm p-5 text-center text-muted">
          Loading Aksharaa MUN section details...
        </div>
      ) : (
        <form onSubmit={handleSave} className="row g-4">
          {/* Left Column: Text & Content */}
          <div className="col-lg-7">
            {/* Header Titles */}
            <div className="card border-0 shadow-sm p-4 mb-4">
              <h6 className="fw-semibold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem" }}>
                <Globe size={16} className="text-success" /> Header Titles & Subtitles
              </h6>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label fw-semibold small">Main Section Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Short Subtitle (Badge)</label>
                  <input
                    type="text"
                    name="subtitle"
                    className="form-control"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* About MUN & Why AMUN Text */}
            <div className="card border-0 shadow-sm p-4 mb-4">
              <h6 className="fw-semibold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem" }}>
                <BookOpen size={16} className="text-success" /> About MUN & Why AMUN Paragraphs
              </h6>
              <div className="mb-3">
                <label className="form-label fw-semibold small">About MUN Title</label>
                <input
                  type="text"
                  name="aboutTitle"
                  className="form-control mb-2"
                  value={formData.aboutTitle}
                  onChange={handleInputChange}
                />
                <textarea
                  name="aboutText"
                  rows={4}
                  className="form-control"
                  placeholder="Enter About MUN description..."
                  value={formData.aboutText}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="form-label fw-semibold small">Why AMUN Title</label>
                <input
                  type="text"
                  name="whyTitle"
                  className="form-control mb-2"
                  value={formData.whyTitle}
                  onChange={handleInputChange}
                />
                <textarea
                  name="whyText"
                  rows={4}
                  className="form-control"
                  placeholder="Enter Why AMUN description..."
                  value={formData.whyText}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Goals Section */}
            <div className="card border-0 shadow-sm p-4">
              <h6 className="fw-semibold text-dark border-bottom pb-2 mb-3" style={{ fontSize: "0.95rem" }}>
                Our Goals & Key Objectives
              </h6>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Goals Section Title</label>
                <input
                  type="text"
                  name="goalsTitle"
                  className="form-control"
                  value={formData.goalsTitle}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add goal bullet point..."
                  value={newGoalItem}
                  onChange={(e) => setNewGoalItem(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={addGoalItem}
                >
                  <Plus size={16} /> Add Goal
                </button>
              </div>

              <ul className="list-group">
                {formData.goalsList.map((item, idx) => (
                  <li key={idx} className="list-group-item d-flex align-items-center justify-content-between py-2">
                    <span className="small fw-semibold text-dark">{idx + 1}. {item}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger border-0 p-1"
                      onClick={() => removeGoalItem(idx)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Photos & Previews */}
          <div className="col-lg-5">
            {/* Top Carousel Photos Slider */}
            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                <h6 className="fw-semibold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem" }}>
                  <ImageIcon size={16} className="text-success" /> Top Carousel Photos Slider
                </h6>
                <span className="badge bg-success-subtle text-success border border-success">
                  {formData.sliderImages.length + newSliderFiles.length} Photos
                </span>
              </div>

              {/* Photo Choose Button with Icon */}
              <div className="mb-3">
                <label className="btn btn-sm btn-outline-success px-2.5 py-1 d-inline-flex align-items-center gap-1.5 fw-medium cursor-pointer" style={{ fontSize: "13px" }}>
                  <ImagePlus size={14} />
                  Choose Carousel Photos
                  <input
                    type="file"
                    className="d-none"
                    accept="image/*"
                    multiple
                    onChange={handleSliderFilesSelect}
                  />
                </label>
              </div>

              {/* Circular Avatars Previews with White Cross on Red Background */}
              <div className="d-flex flex-wrap gap-3 align-items-center mt-2">
                {/* Existing Uploaded Images */}
                {formData.sliderImages.map((img, idx) => {
                  const imgUrl = img.startsWith("http")
                    ? img
                    : `${import.meta.env.VITE_SERVERAPI}/${img.replace(/\\/g, "/")}`;

                  return (
                    <div key={`existing-slider-${idx}`} className="position-relative d-inline-block">
                      <img
                        src={imgUrl}
                        alt="MUN Slider"
                        className="rounded-circle border border-2 border-white shadow-sm"
                        style={{ height: "70px", width: "70px", objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.src = "/fallbackimage.avif";
                        }}
                      />
                      <button
                        type="button"
                        className="btn p-0 rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center shadow-sm"
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "#DC2626",
                          color: "#FFFFFF",
                          border: "2px solid #FFFFFF",
                          transform: "translate(25%, -25%)",
                          cursor: "pointer",
                        }}
                        title="Remove Image"
                        onClick={() => removeExistingImage("sliderImages", idx)}
                      >
                        <X size={13} color="#FFFFFF" strokeWidth={3} />
                      </button>
                    </div>
                  );
                })}

                {/* Newly Selected Image Files Previews */}
                {newSliderFiles.map((file, idx) => {
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <div key={`new-slider-${idx}`} className="position-relative d-inline-block">
                      <img
                        src={previewUrl}
                        alt="New Banner Preview"
                        className="rounded-circle border border-2 border-success shadow-sm"
                        style={{ height: "70px", width: "70px", objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.src = "/fallbackimage.avif";
                        }}
                      />
                      <span
                        className="badge bg-success position-absolute bottom-0 start-50 translate-middle-x rounded-pill px-1"
                        style={{ fontSize: "8px" }}
                      >
                        New
                      </span>
                      <button
                        type="button"
                        className="btn p-0 rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center shadow-sm"
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "#DC2626",
                          color: "#FFFFFF",
                          border: "2px solid #FFFFFF",
                          transform: "translate(25%, -25%)",
                          cursor: "pointer",
                        }}
                        title="Cancel New Image"
                        onClick={() => removeNewSliderFile(idx)}
                      >
                        <X size={13} color="#FFFFFF" strokeWidth={3} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side Photo Grid Gallery */}
            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                <h6 className="fw-semibold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem" }}>
                  <ImageIcon size={16} className="text-success" /> Side Photo Grid Gallery
                </h6>
                <span className="badge bg-success-subtle text-success border border-success">
                  {formData.gridImages.length + newGridFiles.length} Photos
                </span>
              </div>

              {/* Photo Choose Button with Icon */}
              <div className="mb-3">
                <label className="btn btn-sm btn-outline-success px-2.5 py-1 d-inline-flex align-items-center gap-1.5 fw-medium cursor-pointer" style={{ fontSize: "13px" }}>
                  <ImagePlus size={14} />
                  Choose Side Grid Photos
                  <input
                    type="file"
                    className="d-none"
                    accept="image/*"
                    multiple
                    onChange={handleGridFilesSelect}
                  />
                </label>
              </div>

              {/* Circular Avatars Previews with White Cross on Red Background */}
              <div className="d-flex flex-wrap gap-3 align-items-center mt-2">
                {/* Existing Uploaded Grid Images */}
                {formData.gridImages.map((img, idx) => {
                  const imgUrl = img.startsWith("http")
                    ? img
                    : `${import.meta.env.VITE_SERVERAPI}/${img.replace(/\\/g, "/")}`;

                  return (
                    <div key={`existing-grid-${idx}`} className="position-relative d-inline-block">
                      <img
                        src={imgUrl}
                        alt="Grid"
                        className="rounded-circle border border-2 border-white shadow-sm"
                        style={{ height: "70px", width: "70px", objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.src = "/fallbackimage.avif";
                        }}
                      />
                      <button
                        type="button"
                        className="btn p-0 rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center shadow-sm"
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "#DC2626",
                          color: "#FFFFFF",
                          border: "2px solid #FFFFFF",
                          transform: "translate(25%, -25%)",
                          cursor: "pointer",
                        }}
                        title="Remove Image"
                        onClick={() => removeExistingImage("gridImages", idx)}
                      >
                        <X size={13} color="#FFFFFF" strokeWidth={3} />
                      </button>
                    </div>
                  );
                })}

                {/* Newly Selected Grid Files Previews */}
                {newGridFiles.map((file, idx) => {
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <div key={`new-grid-${idx}`} className="position-relative d-inline-block">
                      <img
                        src={previewUrl}
                        alt="New Grid Preview"
                        className="rounded-circle border border-2 border-success shadow-sm"
                        style={{ height: "70px", width: "70px", objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.src = "/fallbackimage.avif";
                        }}
                      />
                      <span
                        className="badge bg-success position-absolute bottom-0 start-50 translate-middle-x rounded-pill px-1"
                        style={{ fontSize: "8px" }}
                      >
                        New
                      </span>
                      <button
                        type="button"
                        className="btn p-0 rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center shadow-sm"
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "#DC2626",
                          color: "#FFFFFF",
                          border: "2px solid #FFFFFF",
                          transform: "translate(25%, -25%)",
                          cursor: "pointer",
                        }}
                        title="Cancel New Image"
                        onClick={() => removeNewGridFile(idx)}
                      >
                        <X size={13} color="#FFFFFF" strokeWidth={3} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Save Action Button */}
            <div className="d-flex justify-content-start">
              <button
                type="submit"
                className="btn btn-success px-4 py-2.5 fw-bold shadow-sm rounded-3 d-inline-flex align-items-center gap-2"
                disabled={saving}
              >
                <Save size={18} />
                {saving ? "Saving Changes..." : "Save Aksharaa MUN Changes"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default MunPage;
