import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "Please, enter your name!";
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
        `${import.meta.env.VITE_SERVERAPI}/api/v1/register`,
        formData
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      setErrors({ apiError: error.response?.data?.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="box">
        <section className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="row justify-content-center">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="py-2">
                    <h5 className="card-title text-center pb-0 fs-4">
                      Create Admin Account
                    </h5>
                  </div>
                  {errors.apiError && (
                    <div className="alert alert-danger">{errors.apiError}</div>
                  )}
                  <form
                    className="row g-3 needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    <div className="col-12">
                      <label htmlFor="yourName" className="form-label">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${
                          errors.name && "is-invalid"
                        }`}
                        id="yourName"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label htmlFor="yourEmail" className="form-label">
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${
                          errors.email && "is-invalid"
                        }`}
                        id="yourEmail"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        className={`form-control ${
                          errors.password && "is-invalid"
                        }`}
                        id="yourPassword"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password}
                        </div>
                      )}
                    </div>
                    {/* <div className="col-12">
                      <div className="form-check">
                        <input
                          className={`form-check-input ${
                            errors.terms && "is-invalid"
                          }`}
                          name="terms"
                          type="checkbox"
                          id="acceptTerms"
                          checked={formData.terms}
                          onChange={handleChange}
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="acceptTerms"
                        >
                          I agree and accept the{" "}
                          <a href="#">terms and conditions</a>
                        </label>
                        {errors.terms && (
                          <div className="invalid-feedback">{errors.terms}</div>
                        )}
                      </div>
                    </div> */}
                    <div className="col-12">
                      <button
                        className="btn btn-primary w-100"
                        type="submit"
                        disabled={loading}
                        style={{
                          opacity: loading ? 0.6 : 1,
                          cursor: loading && "not-allowed",
                        }}
                      >
                        {loading ? "Please Wait..." : "Create Account"}
                      </button>
                    </div>
                    {/* <div className="col-12">
                      <p className="small mb-0">
                        Already have an account? <Link to="/login">Log in</Link>
                      </p>
                    </div> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Register;
