import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

type Task = {
  _id: string;
  title: string;
  description?: string;
  scheduledTime: string;
  completed: boolean;
  createdAt: string;
  notificationId?: string;
};

export const mongoDBService = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  addTask: async (task: Omit<Task, '_id' | 'notificationId'>): Promise<Task> => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, task);
      return response.data;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  updateTask: async (task: Task): Promise<Task> => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${task._id}`, task);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (taskId: string): Promise<boolean> => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};