import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ImageUp, Save, ShieldCheck } from "lucide-react";
import getImageUrl from "../utils/imageUrl";

const defaultForm = {
  badge: "CORE VALUES & PHILOSOPHY",
  title: "Our Core",
  highlight: "Values Framework",
  description:
    "Aksharaa School provides a balanced education that emphasizes both strong values and academic achievement. Through collaboration with parents and stakeholders, we focus on building resilience, leadership skills, and emotional intelligence in every student, ensuring their holistic growth and development. We cultivate critical thinking and a positive attitude, guiding students to embrace new perspectives and take responsible action.",
  imageAlt: "Aksharaa Core Values Infographic",
  isActive: true,
};

const CoreValuesFrameworkPage = () => {
  const [form, setForm] = useState(defaultForm);
  const [currentImage, setCurrentImage] = useState("/round.jpeg");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/core-values-framework?includeInactive=true`
      );
      const item = response.data?.data?.item || response.data?.data?.coreValuesFramework || response.data?.item;

      if (item) {
        setForm({
          badge: item.badge || defaultForm.badge,
          title: item.title || defaultForm.title,
          highlight: item.highlight || defaultForm.highlight,
          description: item.description || defaultForm.description,
          imageAlt: item.imageAlt || defaultForm.imageAlt,
          isActive: item.isActive !== false,
        });
        setCurrentImage(item.image || "/round.jpeg");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch core values framework");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.badge.trim() || !form.title.trim() || !form.highlight.trim() || !form.description.trim()) {
      toast.error("Badge, title, highlight, and description are required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (imageFile) payload.append("image", imageFile);

      const response = await axios.put(`${import.meta.env.VITE_SERVERAPI}/api/v1/core-values-framework`, payload, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setImageFile(null);
        fetchContent();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="main">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Core Values Framework
          </h4>
          <p className="text-muted mb-0 small">
            Manage the values text and infographic shown on the homepage.
          </p>
        </div>
      </div>

      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <ShieldCheck size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">Homepage Section</h5>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading core values framework...</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4">
            <div className="row g-4">
              <div className="col-lg-7">
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Badge</label>
                    <input
                      className="form-control"
                      value={form.badge}
                      onChange={(event) => updateForm("badge", event.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Title</label>
                    <input
                      className="form-control"
                      value={form.title}
                      onChange={(event) => updateForm("title", event.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Highlight</label>
                    <input
                      className="form-control"
                      value={form.highlight}
                      onChange={(event) => updateForm("highlight", event.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="8"
                      value={form.description}
                      onChange={(event) => updateForm("description", event.target.value)}
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label fw-semibold">Image Alt Text</label>
                    <input
                      className="form-control"
                      value={form.imageAlt}
                      onChange={(event) => updateForm("imageAlt", event.target.value)}
                    />
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="coreValuesActive"
                        checked={form.isActive}
                        onChange={(event) => updateForm("isActive", event.target.checked)}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="coreValuesActive">
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <label className="form-label fw-semibold">Infographic Image</label>
                <div className="border rounded-3 p-3 bg-light">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : getImageUrl(currentImage, "/round.jpeg")}
                    alt={form.imageAlt}
                    className="img-fluid rounded-3 bg-white mb-3"
                    style={{ width: "100%", maxHeight: "340px", objectFit: "contain" }}
                  />
                  <label className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2">
                    <ImageUp size={16} />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="border-top mt-4 pt-4 text-end">
              <button className="btn btn-executive" type="submit" disabled={submitting}>
                <Save size={16} /> {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CoreValuesFrameworkPage;
