const Task = require('../models/taskSchema');

// Get all tasks for the logged-in user or all tasks (admin)
exports.getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'admin') {
      // Admins can view all tasks
      tasks = await Task.find().populate('createdBy').populate('category');
    } else {
      // Regular users can only view their tasks
      tasks = await Task.find({ createdBy: req.user.id }).populate('category');
    }

    res.render('taskList', { tasks, role: req.user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, status, category } = req.body;

  try {
    const task = new Task({
      title,
      description,
      status,
      category,
      createdBy: req.user.id,
    });

    await task.save();
    res.redirect('/tasks');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, category } = req.body;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the user has permission to update the task
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.title = title;
    task.description = description;
    task.status = status;
    task.category = category;

    await task.save();
    res.redirect('/tasks');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the user has permission to delete the task
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.remove();
    res.redirect('/tasks');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
