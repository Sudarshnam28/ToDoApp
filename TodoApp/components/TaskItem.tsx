import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, IconButton, Text } from 'react-native-paper';

type Task = {
  _id: string;
  title: string;
  description?: string;
  scheduledTime: string;
  completed: boolean;
  createdAt: string;
  notificationId?: string;
};

type TaskItemProps = {
  task: Task;
  onDelete: () => void;
  onToggleComplete: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggleComplete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formattedTime = formatDate(task.scheduledTime);

  return (
    <Card style={[styles.card, task.completed && styles.completedCard]}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={[styles.title, task.completed && styles.completedText]}>
            {task.title}
          </Title>
          <IconButton
            icon={task.completed ? 'check-circle' : 'circle-outline'}
            iconColor={task.completed ? '#4CAF50' : '#757575'}
            size={24}
            onPress={onToggleComplete}
          />
        </View>

        {task.description ? (
          <Paragraph style={[styles.description, task.completed && styles.completedText]}>
            {task.description}
          </Paragraph>
        ) : null}

        <View style={styles.footer}>
          <Text style={[styles.time, task.completed && styles.completedText]}>
            {formattedTime}
          </Text>
          <IconButton
            icon="delete"
            iconColor="#F44336"
            size={20}
            onPress={onDelete}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    marginTop: 4,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  time: {
    fontSize: 12,
    color: '#757575',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
});

export default TaskItem;