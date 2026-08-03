import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { UserCheck, ShieldCheck, Key, Mail, Building, Phone, UserPlus } from "lucide-react";

const Profile = () => {
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.login.loggedInUser);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor",
  });
  const isAdmin = user?.role === "admin" || profileData?.role === "admin";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/profile`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const data = response.data.data?.profile || response.data.profile;
        if (data) setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data", error);
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Both current and new passwords are required");
      return;
    }

    setIsChangingPassword(true);
    const userId = localStorage.getItem("userId");

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/changepassword`,
        {
          userId,
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email || !newUserData.password || !newUserData.role) {
      toast.error("Name, email, password and role are required");
      return;
    }

    try {
      setIsCreatingUser(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/register`,
        newUserData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "User account created successfully");
        setNewUserData({
          name: "",
          email: "",
          password: "",
          role: "editor",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user account");
    } finally {
      setIsCreatingUser(false);
    }
  };

  if (loading) {
    return (
      <div id="main" className="py-5 text-center text-muted">
        Loading Profile Information...
      </div>
    );
  }

  return (
    <div id="main">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Account & Profile Settings
          </h4>
          <p className="text-muted mb-0 small">
            Manage your administrative account details and credentials.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Summary Card */}
        <div className="col-12 col-lg-4">
          <div className="executive-card p-4 text-center">
            <div
              className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
              style={{
                width: "90px",
                height: "90px",
                backgroundColor: "#ECFDF5",
                color: "#059669",
              }}
            >
              <UserCheck size={44} />
            </div>
            <h5 className="fw-bold text-dark mb-1 text-capitalize">
              {profileData.name || "School Administrator"}
            </h5>
            <span className="badge-status badge-emerald mb-3">
              <ShieldCheck size={14} /> {(profileData.role || "admin").toUpperCase()}
            </span>

            <hr className="my-3" />

            <div className="text-start d-flex flex-column gap-2 small">
              <div className="d-flex align-items-center gap-2 text-muted">
                <Building size={16} className="text-primary" />
                <span className="fw-medium text-dark">Aksharaa Educational Academy</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <Mail size={16} className="text-primary" />
                <span className="fw-medium text-dark">{profileData.email}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <ShieldCheck size={16} className="text-primary" />
                <span className="fw-medium text-dark text-capitalize">{profileData.role || "admin"}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <Phone size={16} className="text-primary" />
                <span className="fw-medium text-dark">+977 9845892346</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs & Form Settings */}
        <div className="col-12 col-lg-8">
          <div className="modern-table-container">
            <div className="modern-table-header pb-0 border-bottom-0">
              <div className="d-flex gap-2">
                <button
                  className={`btn ${activeTab === "overview" ? "btn-primary" : "btn-light text-secondary"} px-4 rounded-3`}
                  onClick={() => setActiveTab("overview")}
                >
                  <UserCheck size={16} className="me-1" /> Profile Overview
                </button>
                <button
                  className={`btn ${activeTab === "password" ? "btn-primary" : "btn-light text-secondary"} px-4 rounded-3`}
                  onClick={() => setActiveTab("password")}
                >
                  <Key size={16} className="me-1" /> Change Password
                </button>
                {isAdmin && (
                  <button
                    className={`btn ${activeTab === "users" ? "btn-primary" : "btn-light text-secondary"} px-4 rounded-3`}
                    onClick={() => setActiveTab("users")}
                  >
                    <UserPlus size={16} className="me-1" /> Create User
                  </button>
                )}
              </div>
            </div>

            <div className="p-4">
              {activeTab === "overview" ? (
                <div>
                  <h6 className="fw-bold text-dark mb-4">Account Information</h6>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label text-muted small fw-semibold">Full Name:</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={profileData.name}
                        readOnly
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label text-muted small fw-semibold">Email Address:</label>
                      <input
                        type="email"
                        className="form-control bg-light"
                        value={profileData.email}
                        readOnly
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label text-muted small fw-semibold">Role:</label>
                      <input
                        type="text"
                        className="form-control bg-light text-capitalize"
                        value={profileData.role || "admin"}
                        readOnly
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label text-muted small fw-semibold">Institution Name:</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value="Aksharaa School"
                        readOnly
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label text-muted small fw-semibold">Contact Phone:</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value="9845892346"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              ) : activeTab === "password" ? (
                <div>
                  <h6 className="fw-bold text-dark mb-3">Update Account Password</h6>
                  <form onSubmit={handlePasswordChange}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Current Password:</label>
                      <input
                        name="currentPassword"
                        type="password"
                        className="form-control"
                        placeholder="Enter current password"
                        value={passwordData.currentPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">New Password:</label>
                      <input
                        name="newPassword"
                        type="password"
                        className="form-control"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-executive px-4"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>
              ) : activeTab === "users" && isAdmin ? (
                <div>
                  <h6 className="fw-bold text-dark mb-3">Create Dashboard User</h6>
                  <form onSubmit={handleCreateUser}>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Full Name:</label>
                        <input
                          name="name"
                          type="text"
                          className="form-control"
                          placeholder="Enter full name"
                          value={newUserData.name}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Email:</label>
                        <input
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="user@example.com"
                          value={newUserData.email}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Password:</label>
                        <input
                          name="password"
                          type="password"
                          className="form-control"
                          placeholder="Minimum 6 characters"
                          value={newUserData.password}
                          onChange={handleNewUserChange}
                          required
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Role:</label>
                        <select
                          name="role"
                          className="form-select"
                          value={newUserData.role}
                          onChange={handleNewUserChange}
                          required
                        >
                          <option value="editor">Editor - all CRUD</option>
                          <option value="frontdesk">Frontdesk - admissions only, no delete</option>
                          <option value="admin">Admin - full access</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-executive px-4"
                          disabled={isCreatingUser}
                        >
                          {isCreatingUser ? "Creating..." : "Create User"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
