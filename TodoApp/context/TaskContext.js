// Create this file at context/TaskContext.js
import React, { createContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { mongoDBService } from '../services/mongoDBService';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from MongoDB on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await mongoDBService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // For development, add some dummy tasks if MongoDB is not connected
      setTasks([
        {
          _id: '1',
          title: 'Complete React Native assignment',
          description: 'Finish the todo app with notifications',
          scheduledTime: new Date(Date.now() + 3600000).toISOString(),
          completed: false
        },
        {
          _id: '2',
          title: 'Buy groceries',
          description: 'Milk, eggs, bread',
          scheduledTime: new Date(Date.now() + 7200000).toISOString(),
          completed: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (newTask) => {
    try {
      // Add to MongoDB
      const savedTask = await mongoDBService.addTask(newTask).catch(err => {
        console.error('MongoDB error:', err);
        // For development without MongoDB
        return { ...newTask, _id: Date.now().toString() };
      });
      
      // Schedule notification
      const notificationId = await scheduleNotification(savedTask);
      
      // Update the task with notification ID
      const updatedTask = { 
        ...savedTask, 
        notificationId 
      };
      
      await mongoDBService.updateTask(updatedTask).catch(err => {
        console.error('MongoDB update error:', err);
      });
      
      // Update local state
      setTasks([...tasks, updatedTask]);
      
      return updatedTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      // Find the task to get the notification ID
      const taskToDelete = tasks.find(task => task._id === taskId);
      
      // Cancel the notification if it exists
      if (taskToDelete?.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(taskToDelete.notificationId);
      }
      
      // Delete from MongoDB
      await mongoDBService.deleteTask(taskId).catch(err => {
        console.error('MongoDB delete error:', err);
      });
      
      // Update local state
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      // Find the task
      const taskIndex = tasks.findIndex(task => task._id === taskId);
      if (taskIndex === -1) return;
      
      const updatedTask = {
        ...tasks[taskIndex],
        completed: !tasks[taskIndex].completed
      };
      
      // Update in MongoDB
      await mongoDBService.updateTask(updatedTask).catch(err => {
        console.error('MongoDB update error:', err);
      });
      
      // Update local state
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = updatedTask;
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  };

  // Schedule a notification for a task
  const scheduleNotification = async (task) => {
    const trigger = new Date(task.scheduledTime);
    
    // Only schedule if the time is in the future
    if (trigger > new Date()) {
      try {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Task Reminder',
            body: `Time to start: ${task.title}`,
            data: { taskId: task._id },
          },
          trigger,
        });
        
        return notificationId;
      } catch (error) {
        console.error('Error scheduling notification:', error);
        return null;
      }
    }
    
    return null;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        deleteTask,
        toggleComplete,
        refreshTasks: fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};