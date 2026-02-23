const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create Task
router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      user: req.user.id
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Tasks
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // ensure user owns task
      { title: req.body.title },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Task
router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;