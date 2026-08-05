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
  X,
} from "lucide-react";
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
import { itemFromResponse } from "../utils/apiResponse";

const normalizeAcademicItems = (items = []) =>
  items
    .map((item) => {
      if (typeof item === "string") return { title: item, details: "" };
      return {
        title: item?.title || item?.name || "",
        details: item?.details || item?.description || "",
      };
    })
    .filter((item) => item.title || item.details);

const emptyListItem = { title: "", details: "" };

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
  const [newLearningCenter, setNewLearningCenter] = useState(emptyListItem);
  const [newExtraActivity, setNewExtraActivity] = useState(emptyListItem);
  const [newApproachItem, setNewApproachItem] = useState(emptyListItem);

  const fetchAcademicData = async (catId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/academic/${catId}`
      );
      const data = itemFromResponse(res.data, ["academic"]);
      setFormData({
        title: data.title || "",
        gradeRange: data.gradeRange || "",
        description: data.description || "",
        learningCentersTitle: data.learningCentersTitle || "Learning Centers",
        learningCenters: normalizeAcademicItems(data.learningCenters || []),
        extraActivitiesTitle: data.extraActivitiesTitle || "Extra / Co-Curricular Activities",
        extraActivities: normalizeAcademicItems(data.extraActivities || []),
        approachTitle: data.approachTitle || "Aksharaa Approach to Quality Education",
        approachItems: normalizeAcademicItems(data.approachItems || []),
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

  // Add, edit & delete nested list items
  const addListItem = (fieldName, itemData, setInputState) => {
    const title = itemData.title.trim();
    const details = itemData.details.trim();
    if (!title) return;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], { title, details }],
    }));
    setInputState(emptyListItem);
  };

  const updateListItem = (fieldName, index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const showListItemDescription = (fieldName, index) => {
    updateListItem(fieldName, index, "showDetails", true);
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
            <div className="card border p-3 mb-4">
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
                    data={formData.description}
                    onChange={(_event, editor) => {
                      setFormData((prev) => ({ ...prev, description: editor.getData() }));
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Learning Centers & Activities */}
            <div className="card border p-3 mb-4">
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

              <div className="border rounded-2 p-2 bg-white mb-3">
                <div className="row g-2 align-items-stretch">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control h-100"
                      style={{ minHeight: "58px" }}
                      placeholder="Item title..."
                      value={newLearningCenter.title}
                      onChange={(e) =>
                        setNewLearningCenter((prev) => ({ ...prev, title: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Description"
                      value={newLearningCenter.details}
                      onChange={(e) =>
                        setNewLearningCenter((prev) => ({ ...prev, details: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-success btn-sm mt-2 px-3 d-inline-flex align-items-center gap-1"
                  onClick={() =>
                    addListItem("learningCenters", newLearningCenter, setNewLearningCenter)
                  }
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>

              <div className="d-flex flex-column gap-2">
                {formData.learningCenters.map((item, idx) => (
                  <div key={idx} className="border rounded-2 p-2 bg-white">
                    <div className="d-flex gap-2 align-items-start">
                      <div className="flex-grow-1">
                        <input
                          type="text"
                          className="form-control form-control-sm fw-semibold mb-2"
                          value={item.title}
                          onChange={(e) =>
                            updateListItem("learningCenters", idx, "title", e.target.value)
                          }
                        />
                        {item.details || item.showDetails ? (
                          <textarea
                            className="form-control form-control-sm"
                            rows={2}
                            placeholder="Description"
                            value={item.details}
                            onChange={(e) =>
                              updateListItem("learningCenters", idx, "details", e.target.value)
                            }
                          />
                        ) : (
                          <button
                            type="button"
                            className="btn btn-link btn-sm text-success p-0 text-decoration-none"
                            onClick={() => showListItemDescription("learningCenters", idx)}
                          >
                            <Plus size={13} /> Add description
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger border-0 p-1"
                        onClick={() => removeListItem("learningCenters", idx)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Co-curricular Activities & Approach */}
            <div className="card border p-3">
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
                <div className="border rounded-2 p-2 bg-white mb-3">
                  <div className="row g-2 align-items-stretch">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control h-100"
                        style={{ minHeight: "58px" }}
                        placeholder="Activity title..."
                        value={newExtraActivity.title}
                        onChange={(e) =>
                          setNewExtraActivity((prev) => ({ ...prev, title: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Description"
                        value={newExtraActivity.details}
                        onChange={(e) =>
                          setNewExtraActivity((prev) => ({ ...prev, details: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-success btn-sm mt-2 px-3 d-inline-flex align-items-center gap-1"
                    onClick={() =>
                      addListItem("extraActivities", newExtraActivity, setNewExtraActivity)
                    }
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="d-flex flex-column gap-2">
                  {formData.extraActivities.map((act, idx) => (
                    <div key={idx} className="border rounded-2 p-2 bg-white">
                      <div className="d-flex gap-2 align-items-start">
                        <div className="flex-grow-1">
                          <input
                            type="text"
                            className="form-control form-control-sm fw-semibold mb-2"
                            value={act.title}
                            onChange={(e) =>
                              updateListItem("extraActivities", idx, "title", e.target.value)
                            }
                          />
                          {act.details || act.showDetails ? (
                            <textarea
                              className="form-control form-control-sm"
                              rows={2}
                              placeholder="Description"
                              value={act.details}
                              onChange={(e) =>
                                updateListItem("extraActivities", idx, "details", e.target.value)
                              }
                            />
                          ) : (
                            <button
                              type="button"
                              className="btn btn-link btn-sm text-success p-0 text-decoration-none"
                              onClick={() => showListItemDescription("extraActivities", idx)}
                            >
                              <Plus size={13} /> Add description
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger border-0 p-1"
                          onClick={() => removeListItem("extraActivities", idx)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
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
                <div className="border rounded-2 p-2 bg-white mb-3">
                  <div className="row g-2 align-items-stretch">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control h-100"
                        style={{ minHeight: "58px" }}
                        placeholder="Approach title..."
                        value={newApproachItem.title}
                        onChange={(e) =>
                          setNewApproachItem((prev) => ({ ...prev, title: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Description"
                        value={newApproachItem.details}
                        onChange={(e) =>
                          setNewApproachItem((prev) => ({ ...prev, details: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-success btn-sm mt-2 px-3 d-inline-flex align-items-center gap-1"
                    onClick={() =>
                      addListItem("approachItems", newApproachItem, setNewApproachItem)
                    }
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="d-flex flex-column gap-2">
                  {formData.approachItems.map((item, idx) => (
                    <div key={idx} className="border rounded-2 p-2 bg-white">
                      <div className="d-flex gap-2 align-items-start">
                        <div className="flex-grow-1">
                          <input
                            type="text"
                            className="form-control form-control-sm fw-semibold mb-2"
                            value={item.title}
                            onChange={(e) =>
                              updateListItem("approachItems", idx, "title", e.target.value)
                            }
                          />
                          {item.details || item.showDetails ? (
                            <textarea
                              className="form-control form-control-sm"
                              rows={2}
                              placeholder="Description"
                              value={item.details}
                              onChange={(e) =>
                                updateListItem("approachItems", idx, "details", e.target.value)
                              }
                            />
                          ) : (
                            <button
                              type="button"
                              className="btn btn-link btn-sm text-success p-0 text-decoration-none"
                              onClick={() => showListItemDescription("approachItems", idx)}
                            >
                              <Plus size={13} /> Add description
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger border-0 p-1"
                          onClick={() => removeListItem("approachItems", idx)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Top Scroll Banner Photos & Bottom Image Grid Photos */}
          <div className="col-lg-5">
            {/* Top Banner Scroll Photos */}
            <div className="card border p-3 mb-4">
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
            <div className="card border p-3 mb-4">
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
