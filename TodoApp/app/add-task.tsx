import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useTaskContext } from '../context/TaskContext';

export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [titleError, setTitleError] = useState('');
  const { addTask } = useTaskContext();

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || scheduledTime;
    setShowDatePicker(false);
    const newDate = new Date(currentDate);
    newDate.setHours(scheduledTime.getHours());
    newDate.setMinutes(scheduledTime.getMinutes());
    setScheduledTime(newDate);
  };

  const onTimeChange = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || scheduledTime;
    setShowTimePicker(false);
    const newDate = new Date(scheduledTime);
    newDate.setHours(currentTime.getHours());
    newDate.setMinutes(currentTime.getMinutes());
    setScheduledTime(newDate);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError('Task title is required');
      return;
    }

    if (scheduledTime < new Date()) {
      alert('Please select a future time for your task');
      return;
    }

    try {
      await addTask({
          title,
          description,
          scheduledTime: scheduledTime.toISOString(),
          completed: false,
          createdAt: ''
      });
      router.back();
    } catch (error) {
      alert('Failed to add task. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Task Title"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (text.trim()) setTitleError('');
          }}
          mode="outlined"
          style={styles.input}
          error={!!titleError}
        />
        {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
        
        <TextInput
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />
        
        <Text style={styles.label}>Scheduled Date & Time</Text>
        <View style={styles.dateTimeContainer}>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateTimeButton}
          >
            {scheduledTime.toLocaleDateString()}
          </Button>
          <Button
            mode="outlined"
            onPress={() => setShowTimePicker(true)}
            style={styles.dateTimeButton}
          >
            {scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Button>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={scheduledTime}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={scheduledTime}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          Add Task
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dateTimeButton: {
    flex: 0.48,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#6200ee',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});