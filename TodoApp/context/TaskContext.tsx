import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Notifications from 'expo-notifications';
import { mongoDBService } from '../services/mongodbService';

type Task = {
  _id: string;
  title: string;
  description?: string;
  scheduledTime: string;
  completed: boolean;
  createdAt: string;
  notificationId?: string;
};

type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  error?: string;
  addTask: (task: Omit<Task, '_id' | 'notificationId' | 'createdAt'>) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleComplete: (taskId: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const fetchedTasks = await mongoDBService.getTasks().catch(() => {
        return [
          {
            _id: '1',
            title: 'Complete React Native assignment',
            description: 'Finish the todo app with notifications',
            scheduledTime: new Date(Date.now() + 3600000).toISOString(),
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            _id: '2',
            title: 'Buy groceries',
            description: 'Milk, eggs, bread',
            scheduledTime: new Date(Date.now() + 7200000).toISOString(),
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ];
      });
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const scheduleNotification = async (task: Task): Promise<string | undefined> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
        return undefined;
      }

      const triggerTime = new Date(task.scheduledTime);
      if (triggerTime <= new Date()) return undefined;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: `Time to start: ${task.title}`,
          data: { taskId: task._id },
          sound: true,
        },
        trigger: {
          type: 'date',
          date: triggerTime,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return undefined;
    }
  };

  const addTask = async (newTask: Omit<Task, '_id' | 'notificationId' | 'createdAt'>): Promise<Task> => {
    try {
      setError(undefined);
      const taskToSave = {
        ...newTask,
        _id: '',
        createdAt: new Date().toISOString(),
        completed: false,
      };

      const savedTask = await mongoDBService.addTask(taskToSave).catch(() => {
        return {
          ...taskToSave,
          _id: Date.now().toString(),
        };
      });

      const notificationId = await scheduleNotification(savedTask);
      const updatedTask = { ...savedTask, notificationId };

      if (notificationId) {
        await mongoDBService.updateTask(updatedTask).catch(() => {});
      }

      setTasks((prev) => [...prev, updatedTask]);
      return updatedTask;
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task');
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setError(undefined);
      const taskToDelete = tasks.find((task) => task._id === taskId);
      if (!taskToDelete) return;

      if (taskToDelete.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(taskToDelete.notificationId);
      }

      await mongoDBService.deleteTask(taskId).catch(() => {});
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
      throw error;
    }
  };

  const toggleComplete = async (taskId: string) => {
    try {
      setError(undefined);
      const taskIndex = tasks.findIndex((task) => task._id === taskId);
      if (taskIndex === -1) return;

      const updatedTask = {
        ...tasks[taskIndex],
        completed: !tasks[taskIndex].completed,
      };

      await mongoDBService.updateTask(updatedTask).catch(() => {});
      setTasks((prev) => {
        const newTasks = [...prev];
        newTasks[taskIndex] = updatedTask;
        return newTasks;
      });
    } catch (error) {
      console.error('Error toggling task completion:', error);
      setError('Failed to update task');
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
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

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};