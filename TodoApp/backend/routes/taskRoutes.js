const express = require('express');
const router = express.Router();
const { addTask, updateTask, getTasks, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, addTask);
router.put('/:taskId', authMiddleware, updateTask);
router.get('/', authMiddleware, getTasks);
router.delete('/:taskId', authMiddleware, deleteTask);

module.exports = router;