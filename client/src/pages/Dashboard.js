import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
const [editTitle, setEditTitle] = useState("");

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      setFetchLoading(true);
      setError("");

      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks.");
    } finally {
      setFetchLoading(false);
    }
  };

  // Add Task
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      setError("");

      await axios.post(
        "http://localhost:5000/api/tasks",
        { title },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      fetchTasks();
    } catch (err) {
      setError("Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task.");
    }
  };
  const updateTask = async (id) => {
  if (!editTitle.trim()) return;

  try {
    await axios.put(
      `http://localhost:5000/api/tasks/${id}`,
      { title: editTitle },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setEditId(null);
    setEditTitle("");
    fetchTasks();
  } catch (err) {
    setError("Failed to update task.");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if (!token) navigate("/");
    else fetchTasks();
  }, []);

  // 🔍 Filter + Sort Logic
  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-start pt-5"
      style={{
        background: "linear-gradient(135deg, #4e73df, #1cc88a)",
      }}
    >
      <div
        className="p-4 shadow-lg"
        style={{
          width: "650px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "white",
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">My Dashboard</h3>
          <button className="btn btn-light btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {/* Add Task */}
        <form onSubmit={addTask} className="d-flex mb-4">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.3)",
              border: "none",
              color: "white",
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        {/* 🔍 Search + Sort */}
        <div className="d-flex mb-3 gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">A–Z</option>
            <option value="desc">Z–A</option>
          </select>
        </div>

        {/* Loading Spinner */}
        {fetchLoading && (
          <div className="text-center my-3">
            <div className="spinner-border text-light"></div>
          </div>
        )}

        {/* Task List */}
        {!fetchLoading && filteredTasks.length === 0 ? (
          <div className="text-center mt-3">
            <h5>No tasks found 🔍</h5>
            <p>Try adjusting your search.</p>
          </div>
        ) : (
          <ul className="list-group">
  {filteredTasks.map((task) => (
    <li
      key={task._id}
      className="list-group-item d-flex justify-content-between align-items-center"
      style={{
        background: "rgba(255,255,255,0.2)",
        border: "none",
        color: "white",
      }}
    >
      {editId === task._id ? (
        <>
          <input
            type="text"
            className="form-control me-2"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => updateTask(task._id)}
          >
            Save
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setEditId(null)}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          {task.title}
          <div>
            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => {
                setEditId(task._id);
                setEditTitle(task.title);
              }}
            >
              Edit
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  ))}
</ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;