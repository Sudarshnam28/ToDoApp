import axios from 'axios';

// Replace with your MongoDB Realm API endpoint
const API_URL = 'http://localhost:5000';

export const mongoDBService = {
  // Get all tasks
  getTasks: async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Add a new task
  addTask: async (task) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, task);
      return response.data;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (task) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${task._id}`, task);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};