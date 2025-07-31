import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, Button, Modal, Form, Input, Select, DatePicker, Avatar, Tag, Space, Typography, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, CalendarOutlined, FlagOutlined } from '@ant-design/icons';
import './App.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Initial data structure
const initialData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Setup project structure',
      description: 'Create the basic folder structure and install dependencies',
      priority: 'high',
      assignee: 'John Doe',
      dueDate: '2025-02-15',
      status: 'todo'
    },
    'task-2': {
      id: 'task-2',
      title: 'Design UI components',
      description: 'Create reusable UI components using Ant Design',
      priority: 'medium',
      assignee: 'Jane Smith',
      dueDate: '2025-02-20',
      status: 'in-progress'
    },
    'task-3': {
      id: 'task-3',
      title: 'Implement authentication',
      description: 'Add user login and registration functionality',
      priority: 'high',
      assignee: 'Bob Johnson',
      dueDate: '2025-02-25',
      status: 'done'
    }
  },
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      taskIds: ['task-1']
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      taskIds: ['task-2']
    },
    'done': {
      id: 'done',
      title: 'Done',
      taskIds: ['task-3']
    }
  },
  columnOrder: ['todo', 'in-progress', 'done']
};

const priorityColors = {
  low: 'green',
  medium: 'orange',
  high: 'red'
};

const TaskCard = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            marginBottom: '8px'
          }}
        >
          <Card
            size="small"
            hoverable
            style={{
              backgroundColor: snapshot.isDragging ? '#f0f0f0' : 'white',
              cursor: 'pointer'
            }}
          >
            <div>
              <Text strong>{task.title}</Text>
              <div style={{ marginTop: '8px' }}>
                <Space size="small">
                  <Tag color={priorityColors[task.priority]} icon={<FlagOutlined />}>
                    {task.priority.toUpperCase()}
                  </Tag>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    <CalendarOutlined /> {task.dueDate}
                  </Text>
                </Space>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

const Column = ({ column, tasks, onAddTask }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: values.title,
      description: values.description || '',
      priority: values.priority || 'medium',
      assignee: values.assignee || 'Unassigned',
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : '',
      status: column.id
    };
    onAddTask(newTask, column.id);
    handleCancel();
  };

  return (
    <div style={{ margin: '0 8px', minWidth: '300px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
        padding: '8px 12px',
        backgroundColor: '#f5f5f5',
        borderRadius: '6px'
      }}>
        <Title level={4} style={{ margin: 0 }}>
          {column.title} ({tasks.length})
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="small"
          onClick={showModal}
        >
          Add
        </Button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              backgroundColor: snapshot.isDraggingOver ? '#e6f7ff' : '#fafafa',
              padding: '8px',
              borderRadius: '6px',
              minHeight: '500px',
              border: '2px dashed #d9d9d9'
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <Modal
        title={`Add Task to ${column.title}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter task title' }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Enter task description" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            initialValue="medium"
          >
            <Select>
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="assignee"
            label="Assignee"
          >
            <Input placeholder="Enter assignee name" />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Task
              </Button>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

function App() {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      // Moving within the same column
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn
        }
      };

      setData(newData);
      return;
    }

    // Moving from one column to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };

    // Update task status
    const updatedTask = {
      ...data.tasks[draggableId],
      status: destination.droppableId
    };

    const newData = {
      ...data,
      tasks: {
        ...data.tasks,
        [draggableId]: updatedTask
      },
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };

    setData(newData);
  };

  const onAddTask = (newTask, columnId) => {
    const newData = {
      ...data,
      tasks: {
        ...data.tasks,
        [newTask.id]: newTask
      },
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          taskIds: [...data.columns[columnId].taskIds, newTask.id]
        }
      }
    };
    setData(newData);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={1} style={{ textAlign: 'center', marginBottom: '30px' }}>
        Jira Clone - Task Management
      </Title>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', overflowX: 'auto', padding: '0 20px' }}>
          {data.columnOrder.map(columnId => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map(taskId => data.tasks[taskId]);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                onAddTask={onAddTask}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;

