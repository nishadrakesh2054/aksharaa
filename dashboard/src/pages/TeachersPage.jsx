import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  Edit,
  Users,
  Image as ImageIcon,
  ImagePlus,
  X,

} from "lucide-react";
import { listFromResponse } from "../utils/apiResponse";

const TeachersPage = () => {
  const [activeTab, setActiveTab] = useState("banners"); // "banners" or "members"

  // Group Team Banners State
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerOrder, setBannerOrder] = useState(0);
  const [selectedBannerFile, setSelectedBannerFile] = useState(null);
  const [submittingBanner, setSubmittingBanner] = useState(false);

  // Individual Profiles State
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
  const [category, setCategory] = useState("Administration & Operations");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [viber, setViber] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [order, setOrder] = useState(0);
  const [selectedTeacherFile, setSelectedTeacherFile] = useState(null);
  const [submittingTeacher, setSubmittingTeacher] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch Team Banners
  const fetchBanners = async () => {
    try {
      setLoadingBanners(true);
      const res = await axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/teambanners`);
      setBanners(listFromResponse(res.data, ["banners"]));
    } catch (err) {
      toast.error("Failed to load team section banners");
    } finally {
      setLoadingBanners(false);
    }
  };

  // Fetch Member Profiles
  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/getallprofile`
      );
      setTeachers(listFromResponse(response.data, ["profiles"]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch staff profiles");
    } finally {
      setLoadingTeachers(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchTeachers();
  }, []);

  // --- Team Banner Handlers ---
  const openAddBannerModal = () => {
    setEditingBanner(null);
    setBannerTitle("");
    setBannerOrder(banners.length + 1);
    setSelectedBannerFile(null);
    setShowBannerModal(true);
  };

  const openEditBannerModal = (item) => {
    setEditingBanner(item);
    setBannerTitle(item.title || "");
    setBannerOrder(item.order || 0);
    setSelectedBannerFile(null);
    setShowBannerModal(true);
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team group banner section?")) return;
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/teambanners/${id}`,
        { headers: { Authorization: token } }
      );
      if (res.data.success) {
        toast.success("Team banner section deleted successfully");
        setBanners((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete banner");
    }
  };

  const clearSelectedBannerFile = () => {
    setSelectedBannerFile(null);
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerTitle.trim()) {
      toast.error("Section title is required.");
      return;
    }
    if (!editingBanner && !selectedBannerFile) {
      toast.error("Please select a group banner photo.");
      return;
    }

    try {
      setSubmittingBanner(true);
      const formData = new FormData();
      formData.append("title", bannerTitle);
      formData.append("order", bannerOrder);
      if (selectedBannerFile) {
        formData.append("image", selectedBannerFile);
      }

      let res;
      if (editingBanner) {
        res = await axios.put(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/teambanners/${editingBanner._id}`,
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        res = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/teambanners`,
          formData,
          { headers: { Authorization: token } }
        );
      }

      if (res.data.success) {
        toast.success(editingBanner ? "Team banner updated!" : "Team banner created!");
        setShowBannerModal(false);
        fetchBanners();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save banner section");
    } finally {
      setSubmittingBanner(false);
    }
  };

  // --- Member Profile Handlers ---
  const openAddTeacherModal = () => {
    setEditingTeacher(null);
    setTitle("");
    setPosition("");
    setCategory("Administration & Operations");
    setFacebook("");
    setInstagram("");
    setViber("");
    setLinkedin("");
    setWhatsapp("");
    setOrder(teachers.length + 1);
    setSelectedTeacherFile(null);
    setShowTeacherModal(true);
  };

  const openEditTeacherModal = (item) => {
    setEditingTeacher(item);
    setTitle(item.title || "");
    setPosition(item.position || "");
    setCategory(item.category || "Administration & Operations");
    setFacebook(item.facebook || "");
    setInstagram(item.instagram || "");
    setViber(item.viber || "");
    setLinkedin(item.linkedin || "");
    setWhatsapp(item.whatsapp || "");
    setOrder(item.order || 0);
    setSelectedTeacherFile(null);
    setShowTeacherModal(true);
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff profile?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/deleteprofile/${id}`,
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setTeachers((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const clearSelectedTeacherFile = () => {
    setSelectedTeacherFile(null);
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !position.trim()) {
      toast.error("Full Name and Position are required.");
      return;
    }
    if (!editingTeacher && !selectedTeacherFile) {
      toast.error("Please select a profile photo.");
      return;
    }

    try {
      setSubmittingTeacher(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("position", position);
      formData.append("category", category);
      formData.append("facebook", facebook);
      formData.append("instagram", instagram);
      formData.append("viber", viber);
      formData.append("linkedin", linkedin);
      formData.append("whatsapp", whatsapp);
      formData.append("order", order);

      if (selectedTeacherFile) {
        formData.append("profileimage", selectedTeacherFile);
      }

      let response;
      if (editingTeacher) {
        response = await axios.put(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/updateprofile/${editingTeacher._id}`,
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/createprofile`,
          formData,
          { headers: { Authorization: token } }
        );
      }

      if (response.data.success) {
        toast.success(
          editingTeacher ? "Profile updated successfully" : "Profile created successfully"
        );
        setShowTeacherModal(false);
        fetchTeachers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSubmittingTeacher(false);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      (t.title && t.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.position && t.position.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div id="main">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Team & Staff Profiles Management
          </h4>
          <p className="text-muted mb-0 small">
            Manage section group banners (Team High School, Middle, Kindergarten) and individual staff profiles.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex align-items-center gap-2 mb-4 bg-white p-2 rounded-3 border flex-wrap">
        <button
          className={`btn ${activeTab === "banners" ? "btn-success shadow-sm" : "btn-light text-secondary border-0"} px-3 py-2 rounded-3 fw-semibold small`}
          onClick={() => setActiveTab("banners")}
        >
          <ImageIcon size={16} className="me-1" />
          Group Section Banners ({banners.length})
        </button>
        <button
          className={`btn ${activeTab === "members" ? "btn-success shadow-sm" : "btn-light text-secondary border-0"} px-3 py-2 rounded-3 fw-semibold small`}
          onClick={() => setActiveTab("members")}
        >
          <Users size={16} className="me-1" />
          Staff & Member Profiles ({teachers.length})
        </button>
      </div>

      {/* TAB 1: GROUP TEAM BANNERS */}
      {activeTab === "banners" && (
        <>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "0.95rem" }}>
              Team Group Photo Banners
            </h6>
            <button
              className="btn btn-sm btn-outline-success px-2.5 py-1 d-inline-flex align-items-center gap-1.5 fw-medium cursor-pointer"
              style={{ fontSize: "13px" }}
              onClick={openAddBannerModal}
            >
              <Plus size={14} /> Add Group Banner
            </button>
          </div>

          {loadingBanners ? (
            <div className="card border-0 shadow-sm p-5 text-center text-muted">
              Loading group team banners...
            </div>
          ) : banners.length === 0 ? (
            <div className="card border-0 shadow-sm p-5 text-center text-muted">
              No team group banners added yet. Click "Add Group Banner" to create one.
            </div>
          ) : (
            <div className="row g-4">
              {banners.map((item) => {
                const imgUrl = item.image.startsWith("http")
                  ? item.image
                  : `${import.meta.env.VITE_SERVERAPI}/${item.image.replace(/\\/g, "/")}`;

                return (
                  <div key={item._id} className="col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm overflow-hidden h-100 position-relative">
                      <div className="position-relative" style={{ height: "160px" }}>
                        <img
                          src={imgUrl}
                          alt={item.title}
                          className="w-100 h-100 object-fit-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/fallbackimage.avif";
                          }}
                        />
                        <button
                          type="button"
                          className="btn p-0 rounded-circle position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center shadow-sm"
                          style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: "#DC2626",
                            color: "#FFFFFF",
                            border: "2px solid #FFFFFF",
                            cursor: "pointer",
                          }}
                          title="Delete Banner"
                          onClick={() => handleDeleteBanner(item._id)}
                        >
                          <X size={13} color="#FFFFFF" strokeWidth={3} />
                        </button>
                      </div>
                      <div className="card-body p-3 d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="fw-semibold mb-0 text-dark" style={{ fontSize: "0.95rem" }}>
                            {item.title}
                          </h6>
                          <span className="badge bg-light text-secondary border mt-1" style={{ fontSize: "10px" }}>
                            Order: #{item.order}
                          </span>
                        </div>
                        <button
                          className="btn btn-sm btn-light border"
                          onClick={() => openEditBannerModal(item)}
                        >
                          <Edit size={14} className="text-secondary" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: INDIVIDUAL STAFF PROFILES */}
      {activeTab === "members" && (
        <>
          <div className="card border-0 shadow-sm p-3 mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Search size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0"
                    placeholder="Search by name or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-4 text-end">
                <button
                  className="btn btn-sm btn-outline-success px-2.5 py-1 d-inline-flex align-items-center gap-1.5 fw-medium cursor-pointer"
                  style={{ fontSize: "13px" }}
                  onClick={openAddTeacherModal}
                >
                  <Plus size={14} /> Add Staff Profile
                </button>
              </div>
            </div>
          </div>

          {loadingTeachers ? (
            <div className="card border-0 shadow-sm p-5 text-center text-muted">
              Loading staff profiles...
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="card border-0 shadow-sm p-5 text-center text-muted">
              No staff profiles found matching your search.
            </div>
          ) : (
            <div className="row g-3">
              {filteredTeachers.map((teacher) => {
                const imgUrl = teacher.image.startsWith("http")
                  ? teacher.image
                  : `${import.meta.env.VITE_SERVERAPI}/${teacher.image.replace(/\\/g, "/")}`;

                return (
                  <div key={teacher._id} className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm text-center p-3 h-100 position-relative">
                      {/* Avatar preview with White Cross on Red Background */}
                      <div className="position-relative mx-auto mb-2" style={{ width: "75px", height: "75px" }}>
                        <img
                          src={imgUrl}
                          alt={teacher.title}
                          className="rounded-circle w-100 h-100 object-fit-cover border border-2 border-white shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = "/fallbackimage.avif";
                          }}
                        />
                        <button
                          type="button"
                          className="btn p-0 rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center shadow-sm"
                          style={{
                            width: "22px",
                            height: "22px",
                            backgroundColor: "#DC2626",
                            color: "#FFFFFF",
                            border: "2px solid #FFFFFF",
                            transform: "translate(20%, -20%)",
                            cursor: "pointer",
                          }}
                          title="Delete Profile"
                          onClick={() => handleDeleteTeacher(teacher._id)}
                        >
                          <X size={12} color="#FFFFFF" strokeWidth={3} />
                        </button>
                      </div>

                      <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "0.9rem" }}>
                        {teacher.title}
                      </h6>
                      <p className="small text-success fw-medium mb-1">{teacher.position}</p>
                      <span className="badge bg-light text-secondary border mx-auto mb-2" style={{ fontSize: "9px" }}>
                        {teacher.category || "Administration & Operations"}
                      </span>

                      <div className="mt-auto border-top pt-2 d-flex justify-content-center">
                        <button
                          className="btn btn-sm btn-light border d-flex align-items-center gap-1"
                          onClick={() => openEditTeacherModal(teacher)}
                        >
                          <Edit size={13} className="text-secondary" /> Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* MODAL 1: ADD / EDIT GROUP TEAM BANNER */}
      {showBannerModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom py-2">
                <h6 className="modal-title fw-bold">
                  {editingBanner ? "Edit Team Group Banner" : "Add Team Group Banner"}
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowBannerModal(false)}
                />
              </div>
              <form onSubmit={handleBannerSubmit}>
                <div className="modal-body p-3">
                  <div className="mb-2">
                    <label className="form-label fw-semibold small">Section Title</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Team High School, Team Middle School"
                      value={bannerTitle}
                      onChange={(e) => setBannerTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row g-2 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Display Order</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={bannerOrder}
                        onChange={(e) => setBannerOrder(e.target.value)}
                      />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label fw-semibold small">Group Banner Photo</label>
                      <div className="d-flex align-items-center gap-2">
                        <label
                          className="form-control form-control-sm d-flex align-items-center justify-content-center mb-0 cursor-pointer"
                          style={{ maxWidth: "46px", minHeight: "31px" }}
                          title="Choose group banner photo"
                        >
                          <ImagePlus size={14} />
                          <input
                            type="file"
                            className="d-none"
                            accept="image/*"
                            onChange={(e) => setSelectedBannerFile(e.target.files[0])}
                          />
                        </label>
                        {selectedBannerFile && (
                          <div className="position-relative flex-shrink-0" style={{ width: "38px", height: "38px" }}>
                            <img
                              src={URL.createObjectURL(selectedBannerFile)}
                              alt="Selected group banner"
                              className="rounded-circle w-100 h-100 object-fit-cover border border-2 border-white shadow-sm"
                            />
                            <button
                              type="button"
                              className="btn p-0 rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center shadow-sm"
                              style={{
                                width: "17px",
                                height: "17px",
                                backgroundColor: "#DC2626",
                                color: "#FFFFFF",
                                border: "1px solid #FFFFFF",
                                transform: "translate(25%, -25%)",
                              }}
                              title="Remove selected photo"
                              onClick={clearSelectedBannerFile}
                            >
                              <X size={10} color="#FFFFFF" strokeWidth={3} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top py-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={() => setShowBannerModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-success px-3"
                    disabled={submittingBanner}
                  >
                    {submittingBanner ? "Saving..." : "Save Banner"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT MEMBER PROFILE */}
      {showTeacherModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom py-2">
                <h6 className="modal-title fw-bold">
                  {editingTeacher ? "Edit Staff Profile" : "Add Staff Profile"}
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTeacherModal(false)}
                />
              </div>
              <form onSubmit={handleTeacherSubmit}>
                <div className="modal-body p-3">
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Full Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Rashmila Thapa"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Position / Designation</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Accountant, IT Incharge"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Category / Section</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Administration & Operations, Executive Team"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Display Order</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                      />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label fw-semibold small">Profile Photo</label>
                      <div className="d-flex align-items-center gap-2">
                        <label
                          className="form-control form-control-sm d-flex align-items-center justify-content-center mb-0 cursor-pointer"
                          style={{ maxWidth: "46px", minHeight: "31px" }}
                          title="Choose profile photo"
                        >
                          <ImagePlus size={14} />
                          <input
                            type="file"
                            className="d-none"
                            accept="image/*"
                            onChange={(e) => setSelectedTeacherFile(e.target.files[0])}
                          />
                        </label>
                        {selectedTeacherFile && (
                          <div className="position-relative flex-shrink-0" style={{ width: "38px", height: "38px" }}>
                            <img
                              src={URL.createObjectURL(selectedTeacherFile)}
                              alt="Selected profile"
                              className="rounded-circle w-100 h-100 object-fit-cover border border-2 border-white shadow-sm"
                            />
                            <button
                              type="button"
                              className="btn p-0 rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center shadow-sm"
                              style={{
                                width: "17px",
                                height: "17px",
                                backgroundColor: "#DC2626",
                                color: "#FFFFFF",
                                border: "1px solid #FFFFFF",
                                transform: "translate(25%, -25%)",
                              }}
                              title="Remove selected photo"
                              onClick={clearSelectedTeacherFile}
                            >
                              <X size={10} color="#FFFFFF" strokeWidth={3} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-12 border-top pt-2 mt-1">
                      <h6 className="fw-semibold small text-muted mb-2">Social Links (Optional)</h6>
                      <div className="row g-2">
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Facebook URL"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Instagram URL"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="WhatsApp / Viber"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top py-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={() => setShowTeacherModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-success px-3"
                    disabled={submittingTeacher}
                  >
                    {submittingTeacher ? "Saving..." : "Save Staff Profile"}
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

export default TeachersPage;
