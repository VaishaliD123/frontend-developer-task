
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!name) return setError("Name is required");
    if (!validateEmail(email)) return setError("Enter a valid email");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (password !== confirmPassword)
      return setError("Passwords do not match");

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/dashboard");
  }
}, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "15px" }}>
        <div className="card-body">
          <h3 className="text-center mb-3 text-primary fw-bold">
            Create Account 🚀
          </h3>
          <p className="text-center text-muted mb-4">
            Register to get started
          </p>

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2 text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success py-2 text-center">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 fw-semibold"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-4">
            <small>
              Already have an account?{" "}
              <Link to="/Login" className="text-decoration-none fw-semibold">
                Login
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;