import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  GraduationCap,
  Plus,
  Trash2,
  Save, 
  BookOpen,
  Image as ImageIcon,
  ImagePlus,
  CheckCircle,
  X,
} from "lucide-react";

const ACADEMIC_CATEGORIES = [
  { id: "kindergarten", name: "Kindergarten", grade: "(PG-UKG)" },
  { id: "elementary", name: "Elementary School", grade: "(Grade 1-5)" },
  { id: "middle", name: "Middle School", grade: "(Grade 6-7)" },
  { id: "high", name: "Senior School", grade: "(Grade 8-10)" },
];

const AcademicsPage = () => {
  const [activeTab, setActiveTab] = useState("kindergarten");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    gradeRange: "",
    description: "",
    learningCentersTitle: "",
    learningCenters: [],
    extraActivitiesTitle: "",
    extraActivities: [],
    approachTitle: "",
    approachItems: [],
    sliderImages: [],
    gridImages: [],
  });

  // New Upload Files
  const [newSliderFiles, setNewSliderFiles] = useState([]);
  const [newGridFiles, setNewGridFiles] = useState([]);

  // Bullet Inputs
  const [newLearningCenter, setNewLearningCenter] = useState("");
  const [newExtraActivity, setNewExtraActivity] = useState("");
  const [newApproachItem, setNewApproachItem] = useState("");

  const fetchAcademicData = async (catId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/academic/${catId}`
      );
      const data = res.data.data || res.data.academic || {};
      setFormData({
        title: data.title || "",
        gradeRange: data.gradeRange || "",
        description: data.description || "",
        learningCentersTitle: data.learningCentersTitle || "Learning Centers",
        learningCenters: data.learningCenters || [],
        extraActivitiesTitle: data.extraActivitiesTitle || "Extra / Co-Curricular Activities",
        extraActivities: data.extraActivities || [],
        approachTitle: data.approachTitle || "Aksharaa Approach to Quality Education",
        approachItems: data.approachItems || [],
        sliderImages: data.sliderImages || [],
        gridImages: data.gridImages || [],
      });
      setNewSliderFiles([]);
      setNewGridFiles([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load academic program data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicData(activeTab);
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add & Delete List Items
  const addListItem = (fieldName, itemText, setInputState) => {
    if (!itemText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], itemText.trim()],
    }));
    setInputState("");
  };

  const removeListItem = (fieldName, index) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  // Delete existing uploaded image
  const removeExistingImage = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  // Handle file selection
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
      submitData.append("gradeRange", formData.gradeRange);
      submitData.append("description", formData.description);
      submitData.append("learningCentersTitle", formData.learningCentersTitle);
      submitData.append("extraActivitiesTitle", formData.extraActivitiesTitle);
      submitData.append("approachTitle", formData.approachTitle);

      submitData.append("learningCenters", JSON.stringify(formData.learningCenters));
      submitData.append("extraActivities", JSON.stringify(formData.extraActivities));
      submitData.append("approachItems", JSON.stringify(formData.approachItems));

      submitData.append("existingSliderImages", JSON.stringify(formData.sliderImages));
      submitData.append("existingGridImages", JSON.stringify(formData.gridImages));

      // Append new files
      newSliderFiles.forEach((file) => submitData.append("sliderImages", file));
      newGridFiles.forEach((file) => submitData.append("gridImages", file));

      const res = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/academic/${activeTab}`,
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success(`${formData.title} updated successfully!`);
        fetchAcademicData(activeTab);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="main">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Academics Program Management
          </h4>
          <p className="text-muted mb-0 small">
            Manage top banner scroll photos, descriptions, learning centers, and bottom image grids for Kindergarten, Elementary, Middle, and Senior School.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="d-flex align-items-center gap-2 mb-4 bg-white p-2 rounded-3 border flex-wrap">
        {ACADEMIC_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`btn ${activeTab === cat.id ? "btn-success shadow-sm" : "btn-light text-secondary border-0"} px-3 py-2 rounded-3 fw-semibold small`}
            onClick={() => setActiveTab(cat.id)}
          >
            <GraduationCap size={16} className="me-1" />
            {cat.name} <span className="small opacity-75">{cat.grade}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card border-0 shadow-sm p-5 text-center text-muted">
          Loading {activeTab} program details...
        </div>
      ) : (
        <form onSubmit={handleSave} className="row g-4">
          {/* Left Column: General Details & Text */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-4 mb-4">
              <h6 className="fw-semibold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem" }}>
                <BookOpen size={16} className="text-success" /> Program Overview & Content
              </h6>

              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label fw-semibold small">Program Title</label>
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
                  <label className="form-label fw-semibold small">Grade Range</label>
                  <input
                    type="text"
                    name="gradeRange"
                    className="form-control"
                    placeholder="e.g. (PG-UKG)"
                    value={formData.gradeRange}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold small">Program Description Paragraphs</label>
                  <textarea
                    name="description"
                    rows={6}
                    className="form-control"
                    placeholder="Enter detailed description of the academic program..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Learning Centers & Activities */}
            <div className="card border-0 shadow-sm p-4 mb-4">
              <h6 className="fw-semibold text-dark border-bottom pb-2 mb-3" style={{ fontSize: "0.95rem" }}>
                Learning Centers & Key Pillars
              </h6>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Section Title</label>
                <input
                  type="text"
                  name="learningCentersTitle"
                  className="form-control"
                  value={formData.learningCentersTitle}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add learning center / pillar item..."
                  value={newLearningCenter}
                  onChange={(e) => setNewLearningCenter(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() =>
                    addListItem("learningCenters", newLearningCenter, setNewLearningCenter)
                  }
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>

              <ul className="list-group mb-2">
                {formData.learningCenters.map((item, idx) => (
                  <li key={idx} className="list-group-item d-flex align-items-center justify-content-between py-2">
                    <span className="small fw-semibold text-dark">{idx + 1}. {item}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger border-0 p-1"
                      onClick={() => removeListItem("learningCenters", idx)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Co-curricular Activities & Approach */}
            <div className="card border-0 shadow-sm p-4">
              <h6 className="fw-semibold text-dark border-bottom pb-2 mb-3" style={{ fontSize: "0.95rem" }}>
                Extra / Co-Curricular & Approach
              </h6>

              {/* Extra Activities */}
              <div className="mb-4">
                <label className="form-label fw-semibold small">Extra Activities Title</label>
                <input
                  type="text"
                  name="extraActivitiesTitle"
                  className="form-control mb-2"
                  value={formData.extraActivitiesTitle}
                  onChange={handleInputChange}
                />
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add extra activity (e.g. Yoga & Mindfulness)..."
                    value={newExtraActivity}
                    onChange={(e) => setNewExtraActivity(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={() =>
                      addListItem("extraActivities", newExtraActivity, setNewExtraActivity)
                    }
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {formData.extraActivities.map((act, idx) => (
                    <span key={idx} className="badge bg-light text-dark border p-2 d-flex align-items-center gap-1">
                      {act}
                      <Trash2
                        size={13}
                        className="text-danger cursor-pointer ms-1"
                        onClick={() => removeListItem("extraActivities", idx)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              {/* Aksharaa Approach Items */}
              <div>
                <label className="form-label fw-semibold small">Educational Approach Title</label>
                <input
                  type="text"
                  name="approachTitle"
                  className="form-control mb-2"
                  value={formData.approachTitle}
                  onChange={handleInputChange}
                />
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add approach pillar (e.g. Activity-based learning)..."
                    value={newApproachItem}
                    onChange={(e) => setNewApproachItem(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={() =>
                      addListItem("approachItems", newApproachItem, setNewApproachItem)
                    }
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {formData.approachItems.map((item, idx) => (
                    <span key={idx} className="badge bg-success-subtle text-success border border-success p-2 d-flex align-items-center gap-1">
                      <CheckCircle size={12} /> {item}
                      <Trash2
                        size={13}
                        className="text-danger cursor-pointer ms-1"
                        onClick={() => removeListItem("approachItems", idx)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Top Scroll Banner Photos & Bottom Image Grid Photos */}
          <div className="col-lg-5">
            {/* Top Banner Scroll Photos */}
            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                <h6 className="fw-semibold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem" }}>
                  <ImageIcon size={16} className="text-success" /> Top Banner Scroll Photos
                </h6>
                <span className="badge bg-success-subtle text-success border border-success">
                  {formData.sliderImages.length + newSliderFiles.length} Photos
                </span>
              </div>
              <p className="small text-muted mb-3">
                Upload photos that display in the top auto-scrolling carousel slider on the frontend.
              </p>

              {/* Photo Choose Button with Icon */}
              <div className="mb-3">
                <label className="btn btn-sm btn-outline-success px-2.5 py-1 d-inline-flex align-items-center gap-1.5 fw-medium cursor-pointer" style={{ fontSize: "13px" }}>
                  <ImagePlus size={14} />
                  Choose Banner Photos
                  <input
                    type="file"
                    className="d-none"
                    accept="image/*"
                    multiple
                    onChange={handleSliderFilesSelect}
                  />
                </label>
              </div>

              {/* Photos Preview Gallery with Circular Avatars & White Cross on Red Background */}
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
                        alt="Banner"
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

            {/* Bottom Image Grid Photos */}
            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                <h6 className="fw-semibold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem" }}>
                  <ImageIcon size={16} className="text-success" /> Bottom Photo Grid Gallery
                </h6>
                <span className="badge bg-success-subtle text-success border border-success">
                  {formData.gridImages.length + newGridFiles.length} Photos
                </span>
              </div>
              <p className="small text-muted mb-3">
                Upload photo gallery images displayed in the bottom image grid section of the page.
              </p>

              {/* Photo Choose Button with Icon */}
              <div className="mb-3">
                <label className="btn btn-sm btn-outline-success px-2.5 py-1 d-inline-flex align-items-center gap-1.5 fw-medium cursor-pointer" style={{ fontSize: "13px" }}>
                  <ImagePlus size={14} />
                  Choose Grid Photos
                  <input
                    type="file"
                    className="d-none"
                    accept="image/*"
                    multiple
                    onChange={handleGridFilesSelect}
                  />
                </label>
              </div>

              {/* Photos Preview Gallery with Circular Avatars & White Cross on Red Background */}
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
                {saving ? "Saving Changes..." : `Save ${formData.title} Changes`}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AcademicsPage;
