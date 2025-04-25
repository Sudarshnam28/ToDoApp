import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { FAB, ActivityIndicator } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { useTaskContext } from '../../context/TaskContext';
import TaskItem from '../../components/TaskItem';
import EmptyState from '../../components/EmptyState';

export default function HomeScreen() {
  const { tasks, loading, deleteTask, toggleComplete, refreshTasks } = useTaskContext();

  useEffect(() => {
    refreshTasks();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onDelete={() => deleteTask(item._id)}
              onToggleComplete={() => toggleComplete(item._id)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => router.push('/add-task')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});