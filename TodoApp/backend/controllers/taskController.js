const Task = require('../models/Task');

exports.addTask = async (req, res) => {
  try {
    const { title, description, scheduledTime } = req.body;
    const newTask = new Task({
      title,
      description,
      scheduledTime,
      userId: req.user.id
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add task', error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ scheduledTime: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get tasks', error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updates = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      updates,
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId: req.user.id });
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};