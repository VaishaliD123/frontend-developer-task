import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div
      className="vh-100 d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        background: "linear-gradient(135deg, #4e73df, #1cc88a)",
        color: "white",
      }}
    >
      <h1 className="fw-bold mb-3">🚀 Task Creator App</h1>
      <p className="mb-4">
        Organize your tasks efficiently and stay productive.
      </p>

      <div>
        <button
          className="btn btn-light me-3 px-4"
          onClick={() => navigate("/register")}
        >
          Register
        </button>

        <button
          className="btn btn-outline-light px-4"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;