// components/KanbanBoard.js

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';

const KanbanBoard = ({ projects: initialProjects }) => {
  const [columns, setColumns] = useState({
    'todo': {
      id: 'todo',
      title: 'To Do',
      tasks: initialProjects.filter(p => p.status === 'todo')
    },
    'inProgress': {
      id: 'inProgress',
      title: 'In Progress',
      tasks: initialProjects.filter(p => p.status === 'inProgress')
    },
    'review': {
      id: 'review',
      title: 'Review',
      tasks: initialProjects.filter(p => p.status === 'review')
    },
    'done': {
      id: 'done',
      title: 'Done',
      tasks: initialProjects.filter(p => p.status === 'done')
    }
  });
  
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    id: null,
    title: '',
    description: '',
    assignees: [],
    status: 'todo',
    priority: 'medium'
  });
  
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination or the item was dropped back in its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    
    // Get the task that was dragged
    const task = columns[source.droppableId].tasks.find(task => task.id === draggableId);
    
    // Create new columns state
    const newColumns = {...columns};
    
    // Remove the task from its source column
    newColumns[source.droppableId].tasks = 
      newColumns[source.droppableId].tasks.filter(task => task.id !== draggableId);
      
    // Add the task to its destination column
    // First, update the task's status to match the new column
    const updatedTask = {...task, status: destination.droppableId};
    
    // Then insert it at the correct position
    newColumns[destination.droppableId].tasks.splice(destination.index, 0, updatedTask);
    
    // Update state
    setColumns(newColumns);
    
    // Here you would also update your backend via API call
  };
  
  const openNewTaskDialog = () => {
    setTaskDetails({
      id: Date.now().toString(),
      title: '',
      description: '',
      assignees: [],
      status: 'todo',
      priority: 'medium'
    });
    setShowTaskDialog(true);
  };
  
  const openEditTaskDialog = (task) => {
    setTaskDetails({...task});
    setShowTaskDialog(true);
  };
  
  const saveTask = () => {
    const newColumns = {...columns};
    const columnId = taskDetails.status;
    
    // Check if this is an edit or a new task
    const existingTaskIndex = newColumns[columnId].tasks.findIndex(task => task.id === taskDetails.id);
    
    if (existingTaskIndex >= 0) {
      // Edit existing task
      newColumns[columnId].tasks[existingTaskIndex] = {...taskDetails};
    } else {
      // Add new task
      newColumns[columnId].tasks.push({...taskDetails});
    }
    
    setColumns(newColumns);
    setShowTaskDialog(false);
    
    // Here you would also update your backend via API call
  };
  
  const priorityOptions = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ];
  
  const statusOptions = [
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Review', value: 'review' },
    { label: 'Done', value: 'done' }
  ];
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#faad14';
    }
  };
  
  const renderTaskDialog = () => {
    return (
      <Dialog 
        header={taskDetails.id ? 'Edit Task' : 'New Task'} 
        visible={showTaskDialog} 
        style={{width: '50vw'}} 
        onHide={() => setShowTaskDialog(false)}
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setShowTaskDialog(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={saveTask} />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="p-field" style={styles.formField}>
            <label htmlFor="title">Title</label>
            <InputText 
              id="title" 
              value={taskDetails.title} 
              onChange={(e) => setTaskDetails({...taskDetails, title: e.target.value})} 
              required 
            />
          </div>
          
          <div className="p-field" style={styles.formField}>
            <label htmlFor="description">Description</label>
            <InputTextarea 
              id="description" 
              value={taskDetails.description} 
              onChange={(e) => setTaskDetails({...taskDetails, description: e.target.value})} 
              rows={5} 
            />
          </div>
          
          <div className="p-field" style={styles.formField}>
            <label htmlFor="status">Status</label>
            <Dropdown 
              id="status" 
              value={taskDetails.status} 
              options={statusOptions} 
              onChange={(e) => setTaskDetails({...taskDetails, status: e.value})} 
              placeholder="Select Status" 
            />
          </div>
          
          <div className="p-field" style={styles.formField}>
            <label htmlFor="priority">Priority</label>
            <Dropdown 
              id="priority" 
              value={taskDetails.priority} 
              options={priorityOptions} 
              onChange={(e) => setTaskDetails({...taskDetails, priority: e.value})} 
              placeholder="Select Priority" 
            />
          </div>
        </div>
      </Dialog>
    );
  };
  
  return (
    <View style={styles.container}>
      <Button label="Add New Task" icon="pi pi-plus" onClick={openNewTaskDialog} style={styles.addButton} />
      
      <DragDropContext onDragEnd={onDragEnd}>
        <View style={styles.board}>
          {Object.values(columns).map(column => (
            <View key={column.id} style={styles.column}>
              <Card title={column.title} style={styles.columnCard}>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <View
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={styles.taskList}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...styles.taskCard,
                                ...provided.draggableProps.style,
                                borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                              }}
                              onClick={() => openEditTaskDialog(task)}
                            >
                              <div style={styles.taskHeader}>
                                <div style={styles.taskTitle}>{task.title}</div>
                                <Button 
                                  icon="pi pi-ellipsis-v" 
                                  className="p-button-rounded p-button-text p-button-sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditTaskDialog(task);
                                  }} 
                                />
                              </div>
                              
                              <div style={styles.taskDescription}>{task.description}</div>
                              
                              {task.assignees && task.assignees.length > 0 && (
                                <AvatarGroup>
                                  {task.assignees.map(assignee => (
                                    <Avatar 
                                      key={assignee.id} 
                                      label={assignee.name.charAt(0)} 
                                      shape="circle" 
                                      style={styles.avatar}
                                    />
                                  ))}
                                </AvatarGroup>
                              )}
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </View>
                  )}
                </Droppable>
              </Card>
            </View>
          ))}
        </View>
      </DragDropContext>
      
      {renderTaskDialog()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  board: {
    flexDirection: 'row',
    overflowX: 'auto',
    height: 600,
  },
  column: {
    width: 280,
    marginRight: 16,
    height: '100%',
  },
  columnCard: {
    height: '100%',
    backgroundColor: '#f0f2f5',
  },
  taskList: {
    minHeight: 100,
    padding: 8,
  },
  taskCard: {
    marginBottom: 8,
    cursor: 'pointer',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: '#1677ff',
    color: '#ffffff',
  },
  addButton: {
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  }
});

export default KanbanBoard;