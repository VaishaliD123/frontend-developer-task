import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      return setError("Please enter a valid email");
    }

    if (!password) {
      return setError("Password is required");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
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
      <div className="card shadow-lg p-4" style={{ width: "380px", borderRadius: "15px" }}>
        <div className="card-body">
          <h3 className="text-center mb-3 text-primary fw-bold">
            Welcome Back 👋
          </h3>
          <p className="text-center text-muted mb-4">
            Login to access your dashboard
          </p>

          <form onSubmit={handleLogin}>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 fw-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-4">
            <small>
              Don't have an account?{" "}
              <Link to="/register" className="text-decoration-none fw-semibold">
                Register
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;