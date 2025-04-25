import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="clipboard-text-outline" size={80} color="#BDBDBD" />
      <Text style={styles.title}>No tasks yet</Text>
      <Text style={styles.subtitle}>Add a task using the + button below</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#424242',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default EmptyState;