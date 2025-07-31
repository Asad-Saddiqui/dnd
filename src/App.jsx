import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, Button, Modal, Form, Input, Select, DatePicker, Avatar, Tag, Space, Typography, Row, Col, Dropdown, Tooltip, Popconfirm, ColorPicker, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, CalendarOutlined, FlagOutlined, SettingOutlined, MoreOutlined, PlusCircleOutlined } from '@ant-design/icons';
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
      status: 'backlog',
      labels: ['setup', 'infrastructure'],
      estimation: '3h',
      progress: 0,
      comments: [
        { id: 'c1', author: 'John Doe', text: 'Starting with basic setup', timestamp: '2024-02-15T10:00:00Z' }
      ]
    },
    'task-2': {
      id: 'task-2',
      title: 'Design UI components',
      description: 'Create reusable UI components using Ant Design',
      priority: 'medium',
      assignee: 'Jane Smith',
      dueDate: '2025-02-20',
      status: 'in-progress',
      labels: ['ui', 'design'],
      estimation: '8h',
      progress: 60,
      comments: [
        { id: 'c2', author: 'Jane Smith', text: 'Working on component library', timestamp: '2024-02-16T09:30:00Z' }
      ]
    },
    'task-3': {
      id: 'task-3',
      title: 'Implement authentication',
      description: 'Add user login and registration functionality',
      priority: 'high',
      assignee: 'Bob Johnson',
      dueDate: '2025-02-25',
      status: 'review',
      labels: ['security', 'backend'],
      estimation: '5h',
      progress: 100,
      comments: [
        { id: 'c3', author: 'Bob Johnson', text: 'Ready for code review', timestamp: '2024-02-17T14:20:00Z' }
      ]
    }
  },
  columns: {
    'backlog': {
      id: 'backlog',
      title: 'Backlog',
      taskIds: ['task-1'],
      color: '#f0f0f0'
    },
    'todo': {
      id: 'todo',
      title: 'To Do',
      taskIds: [],
      color: '#e6f7ff'
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      taskIds: ['task-2'],
      color: '#fff7e6'
    },
    'review': {
      id: 'review',
      title: 'In Review',
      taskIds: ['task-3'],
      color: '#f6ffed'
    },
    'testing': {
      id: 'testing',
      title: 'Testing',
      taskIds: [],
      color: '#fff1f0'
    },
    'done': {
      id: 'done',
      title: 'Done',
      taskIds: [],
      color: '#f6ffed'
    }
  },
  columnOrder: ['backlog', 'todo', 'in-progress', 'review', 'testing', 'done']
};

const priorityColors = {
  low: 'green',
  medium: 'orange',
  high: 'red'
};

const TaskCard = ({ task, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            marginBottom: '8px',
            width: '100%',
            maxWidth: '350px'
          }}
        >
          <Card
            size="small"
            hoverable
            style={{
              backgroundColor: snapshot.isDragging ? '#f0f0f0' : 'white',
              cursor: 'pointer',
              width: snapshot.isDragging ? '350px' : '100%',
              maxWidth: '350px',
              transition: 'all 0.3s ease',
              opacity: snapshot.isDragging ? 0.9 : 1,
              transform: snapshot.isDragging ? 'scale(1.02)' : 'scale(1)'
            }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div style={{ width: '100%' }}>
              {/* Title and Priority */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <Text strong style={{ 
                  flex: 1,
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>{task.title}</Text>
                <Tag color={priorityColors[task.priority]} icon={<FlagOutlined />}>
                  {task.priority.toUpperCase()}
                </Tag>
              </div>

              {/* Labels */}
              {task.labels.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <Space size={[0, 4]} wrap>
                    {task.labels.map((label, idx) => (
                      <Tag key={idx} color="blue" style={{ margin: '2px' }}>{label}</Tag>
                    ))}
                  </Space>
                </div>
              )}

              {/* Description when expanded */}
              {isExpanded && task.description && (
                <div style={{ 
                  marginBottom: '12px',
                  padding: '8px',
                  backgroundColor: '#fafafa',
                  borderRadius: '4px'
                }}>
                  <Text type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
                    {task.description}
                  </Text>
                </div>
              )}

              {/* Task Details */}
              <Row gutter={[8, 8]} align="middle" style={{ marginBottom: '8px' }}>
                <Col flex="auto">
                  <Space size={8} wrap>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar size="small" icon={<UserOutlined />} />
                      <Text type="secondary" style={{ marginLeft: '4px', fontSize: '12px' }}>
                        {task.assignee}
                      </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <CalendarOutlined /> {task.dueDate}
                    </Text>
                    <Tag color="purple">{task.estimation}</Tag>
                  </Space>
                </Col>
              </Row>

              {/* Progress Bar */}
              {task.progress > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ 
                    width: '100%', 
                    height: '4px', 
                    backgroundColor: '#f0f0f0',
                    borderRadius: '2px'
                  }}>
                    <div style={{
                      width: `${task.progress}%`,
                      height: '100%',
                      backgroundColor: '#1890ff',
                      borderRadius: '2px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>
                    Progress: {task.progress}%
                  </Text>
                </div>
              )}

              {/* Comments when expanded */}
              {isExpanded && task.comments.length > 0 && (
                <div style={{ 
                  marginTop: '12px', 
                  borderTop: '1px solid #f0f0f0', 
                  paddingTop: '12px'
                }}>
                  <Text strong style={{ fontSize: '13px', marginBottom: '8px', display: 'block' }}>
                    Comments ({task.comments.length})
                  </Text>
                  {task.comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      style={{ 
                        marginBottom: '8px',
                        padding: '8px',
                        backgroundColor: '#fafafa',
                        borderRadius: '4px'
                      }}
                    >
                      <div style={{ marginBottom: '4px' }}>
                        <Text strong style={{ fontSize: '12px' }}>{comment.author}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}> - {new Date(comment.timestamp).toLocaleString()}</Text>
                      </div>
                      <Text style={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>{comment.text}</Text>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

const Column = ({ column, tasks, onAddTask, onEdit, onDelete }) => {
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
      status: column.id,
      labels: values.labels || [],
      estimation: values.estimation || '0h',
      progress: 0,
      comments: []
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
        backgroundColor: column.color,
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Title level={4} style={{ margin: 0 }}>
            {column.title}
          </Title>
          <Tag color={column.color}>
            {tasks.length}{column.wip ? `/${column.wip}` : ''}
          </Tag>
        </div>
        <Space>
          <Button 
            type="text" 
            icon={<PlusOutlined />} 
            size="small"
            onClick={showModal}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  icon: <EditOutlined />,
                  label: 'Edit Column',
                  onClick: () => onEdit(column.id)
                },
                {
                  key: 'delete',
                  icon: <DeleteOutlined />,
                  label: 'Delete Column',
                  danger: true,
                  onClick: () => {
                    if (tasks.length === 0) {
                      onDelete(column.id);
                    }
                  }
                }
              ]
            }}
            trigger={['click']}
          >
            <Button 
              type="text" 
              icon={<MoreOutlined />} 
              size="small"
            />
          </Dropdown>
        </Space>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              backgroundColor: snapshot.isDraggingOver ? `${column.color}80` : '#fafafa',
              padding: '8px',
              borderRadius: '6px',
              minHeight: '500px',
              width: '100%',
              maxWidth: '350px',
              border: `2px dashed ${column.color}`,
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
              boxShadow: snapshot.isDraggingOver ? '0 0 8px rgba(0,0,0,0.1)' : 'none'
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

          <Form.Item
            name="labels"
            label="Labels"
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Add labels"
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item
            name="estimation"
            label="Estimation"
          >
            <Select style={{ width: '100%' }}>
              <Select.Option value="1h">1 hour</Select.Option>
              <Select.Option value="2h">2 hours</Select.Option>
              <Select.Option value="4h">4 hours</Select.Option>
              <Select.Option value="8h">1 day</Select.Option>
              <Select.Option value="16h">2 days</Select.Option>
              <Select.Option value="40h">1 week</Select.Option>
            </Select>
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

const ColumnForm = ({ onSubmit, initialValues, onCancel }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        onSubmit(values);
        form.resetFields();
      }}
    >
      <Form.Item
        name="title"
        label="Column Title"
        rules={[{ required: true, message: 'Please enter column title' }]}
      >
        <Input placeholder="Enter column title" />
      </Form.Item>

      <Form.Item
        name="color"
        label="Column Color"
      >
        <ColorPicker />
      </Form.Item>

      <Form.Item
        name="wip"
        label="WIP Limit"
        tooltip="Work in Progress limit (0 for no limit)"
      >
        <Input type="number" min={0} placeholder="Enter WIP limit" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Save Column
          </Button>
          <Button onClick={onCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

const DraggableColumn = ({ column, tasks, onAddTask, onEdit, onDelete, index }) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            margin: '0 8px',
            width: '350px',
            minWidth: '350px',
            maxWidth: '350px',
            ...provided.draggableProps.style
          }}
        >
          <div {...provided.dragHandleProps}>
            <Column
              column={column}
              tasks={tasks}
              onAddTask={onAddTask}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

function App() {
  const [data, setData] = useState(initialData);
  const [isColumnModalVisible, setIsColumnModalVisible] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle column reordering
    if (type === 'column') {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newData = {
        ...data,
        columnOrder: newColumnOrder
      };

      setData(newData);
      return;
    }

    // Handle task reordering
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

    // Check WIP limit before moving to a new column
    if (finish.wip && finish.taskIds.length >= finish.wip) {
      message.warning(`Column "${finish.title}" has reached its WIP limit of ${finish.wip}`);
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
    // Check WIP limit
    const column = data.columns[columnId];
    if (column.wip && column.taskIds.length >= column.wip) {
      message.warning(`Column "${column.title}" has reached its WIP limit of ${column.wip}`);
      return;
    }

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

  const handleAddColumn = (values) => {
    const columnId = `column-${Date.now()}`;
    const newColumn = {
      id: columnId,
      title: values.title,
      taskIds: [],
      color: values.color || '#f0f0f0',
      wip: parseInt(values.wip) || 0
    };

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [columnId]: newColumn
      },
      columnOrder: [...data.columnOrder, columnId]
    };

    setData(newData);
    setIsColumnModalVisible(false);
  };

  const handleEditColumn = (columnId, values) => {
    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          title: values.title,
          color: values.color,
          wip: parseInt(values.wip) || 0
        }
      }
    };

    setData(newData);
    setEditingColumn(null);
    setIsColumnModalVisible(false);
  };

  const handleDeleteColumn = (columnId) => {
    const column = data.columns[columnId];
    if (column.taskIds.length > 0) {
      message.error('Cannot delete column with tasks. Please move tasks first.');
      return;
    }

    const newColumns = { ...data.columns };
    delete newColumns[columnId];

    const newData = {
      ...data,
      columns: newColumns,
      columnOrder: data.columnOrder.filter(id => id !== columnId)
    };

    setData(newData);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        padding: '0 20px'
      }}>
        <Title level={1} style={{ margin: 0 }}>
          Task Management
        </Title>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => {
            setEditingColumn(null);
            setIsColumnModalVisible(true);
          }}
        >
          Add Column
        </Button>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ 
                display: 'flex', 
                overflowX: 'auto', 
                padding: '0 20px',
                minHeight: '70vh',
                alignItems: 'flex-start'
              }}
            >
              {data.columnOrder.map((columnId, index) => {
                const column = data.columns[columnId];
                const tasks = column.taskIds.map(taskId => data.tasks[taskId]);

                return (
                  <DraggableColumn
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    index={index}
                    onAddTask={onAddTask}
                    onEdit={(columnId) => {
                      setEditingColumn(columnId);
                      setIsColumnModalVisible(true);
                    }}
                    onDelete={handleDeleteColumn}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Modal
        title={editingColumn ? "Edit Column" : "Add New Column"}
        open={isColumnModalVisible}
        onCancel={() => {
          setIsColumnModalVisible(false);
          setEditingColumn(null);
        }}
        footer={null}
      >
        <ColumnForm
          initialValues={editingColumn ? {
            title: data.columns[editingColumn].title,
            color: data.columns[editingColumn].color,
            wip: data.columns[editingColumn].wip
          } : null}
          onSubmit={(values) => {
            if (editingColumn) {
              handleEditColumn(editingColumn, values);
            } else {
              handleAddColumn(values);
            }
          }}
          onCancel={() => {
            setIsColumnModalVisible(false);
            setEditingColumn(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default App;

