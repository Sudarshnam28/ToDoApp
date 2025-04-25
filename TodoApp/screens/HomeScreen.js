// Create this file at screens/HomeScreen.js
import React, { useContext, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, ActivityIndicator } from 'react-native-paper';
import { TaskContext } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';
import EmptyState from '../components/EmptyState';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const { tasks, loading, deleteTask, toggleComplete, refreshTasks } = useContext(TaskContext);

  // Refresh tasks when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshTasks();
    }, [])
  );

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
        onPress={() => navigation.navigate('AddTask')}
      />
    </View>
  );
};

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

export default HomeScreen;