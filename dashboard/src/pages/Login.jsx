import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginActions } from "../redux/slices/loginSlice";
import { ArrowRight, Lock, Mail } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.email)
      formErrors.email = "Please enter a valid Email address!";
    if (!formData.password) formErrors.password = "Please enter your password!";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/login`,
        formData
      );
      if (response.data.success) {
        toast.success("Login successful!", { id: "login-success" });
        const token = response.data.data?.token || response.data.token;
        const user = response.data.data?.user || response.data.user || {
          name: response.data.data?.name || response.data.name,
          email: response.data.data?.email || response.data.email,
          role: response.data.data?.role || response.data.role || "admin",
        };

        if (token) {
          localStorage.setItem("token", token);
          axios.defaults.headers.common.Authorization = token;
        }
        if (user?.name) {
          dispatch(loginActions.setLoggedInUser(user));
        }
        navigate(user?.role === "frontdesk" ? "/online-applications" : "/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      const message = error.response?.data?.message || "Login failed. Please check your credentials and try again.";
      toast.error(message);
      setErrors({
        apiError: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-logo-wrap">
          <img src="/akasharalogo.png" alt="Aksharaa School" className="auth-logo" />
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <span className="auth-kicker">Dashboard Access</span>
            <h1>Welcome back</h1>
            <p>Sign in to manage dashboard and content.</p>
          </div>

          {errors.apiError && (
            <div className="alert alert-danger py-2 small mb-3">{errors.apiError}</div>
          )}

          <form className="auth-form" noValidate onSubmit={handleSubmit}>
            <div>
              <label htmlFor="yourEmail" className="form-label">
                Email Address
              </label>
              <div className="auth-input">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  id="yourEmail"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@school.com"
                  required
                />
              </div>
              {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
            </div>

            <div>
              <label htmlFor="yourPassword" className="form-label">
                Password
              </label>
              <div className="auth-input">
                <Lock size={18} />
                <input
                  type="password"
                  name="password"
                  id="yourPassword"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>
              {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
            </div>

            <div className="auth-options">
              <label className="form-check d-flex align-items-center gap-2 mb-0">
                <input
                  className="form-check-input mt-0"
                  type="checkbox"
                  name="remember"
                  id="rememberMe"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span className="small fw-semibold text-secondary">Remember Me</span>
              </label>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              <span>{loading ? "Signing in..." : "Login"}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;
