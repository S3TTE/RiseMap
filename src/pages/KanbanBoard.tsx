
import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { DataService } from '../services/DataService';
import { Task } from '../models/Task';

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayTaskDialog, setDisplayTaskDialog] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const dragItemRef = useRef<Task | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await DataService.getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  const showTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setDisplayTaskDialog(true);
  };

  const hideTaskDialog = () => {
    setSelectedTask(null);
    setDisplayTaskDialog(false);
  };

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, task: Task) => {
    dragItemRef.current = task;
    dragNodeRef.current = event.currentTarget as HTMLDivElement;
    
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.classList.add('opacity-50');
      }
    }, 0);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>, status: string) => {
    event.preventDefault();
    
    if (dragItemRef.current && dragNodeRef.current) {
      dragNodeRef.current.classList.remove('opacity-50');
      
      const updatedTasks = tasks.map(task => {
        if (task.id === dragItemRef.current?.id) {
          return { ...task, status: status as Task['status'] };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      dragItemRef.current = null;
      dragNodeRef.current = null;
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const renderKanbanColumn = (title: string, status: string, bgColor: string) => {
    const columnTasks = getTasksByStatus(status);
    
    return (
      <div 
        className={`bg-${bgColor}-50 rounded-lg p-4 min-h-[600px] w-full`}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold text-${bgColor}-700`}>{title}</h3>
          <div className={`bg-${bgColor}-200 text-${bgColor}-800 px-2 rounded-full`}>
            {columnTasks.length}
          </div>
        </div>
        
        <div className="space-y-3">
          {columnTasks.map(task => (
            <div 
              key={task.id}
              className="bg-white p-3 rounded-lg shadow-md cursor-move"
              draggable
              onDragStart={(e) => onDragStart(e, task)}
              onClick={() => showTaskDetails(task)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{task.title}</h4>
                <Tag 
                  value={task.priority} 
                  severity={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'} 
                  className="text-xs"
                />
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar 
                    shape="circle" 
                    size="normal" 
                    className="bg-sakai-primary text-white mr-2"
                    label={task.assignee.split(' ').map(n => n[0]).join('')}
                  />
                  <span className="text-xs text-gray-600">{task.assignee}</span>
                </div>
                
                <div className="text-xs text-gray-500">
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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

  const taskDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideTaskDialog} />
      <Button label="Save" icon="pi pi-check" onClick={hideTaskDialog} />
    </>
  );

  return (
    <div className="kanban-board">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold text-gray-800">Kanban Board</h1>
        <Button label="Add Task" icon="pi pi-plus" />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <i className="pi pi-spin pi-spinner text-4xl"></i>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {renderKanbanColumn('To Do', 'todo', 'red')}
          {renderKanbanColumn('In Progress', 'inProgress', 'blue')}
          {renderKanbanColumn('Review', 'review', 'yellow')}
          {renderKanbanColumn('Done', 'done', 'green')}
        </div>
      )}
      
      <Dialog 
        visible={displayTaskDialog} 
        header="Task Details" 
        modal 
        style={{ width: '90%', maxWidth: '600px' }} 
        footer={taskDialogFooter}
        onHide={hideTaskDialog}
      >
        {selectedTask && (
          <div className="p-fluid">
            <div className="field mb-4">
              <label htmlFor="title" className="font-medium text-gray-700 mb-2 block">Title</label>
              <InputText id="title" value={selectedTask.title} />
            </div>
            
            <div className="field mb-4">
              <label htmlFor="description" className="font-medium text-gray-700 mb-2 block">Description</label>
              <InputTextarea id="description" value={selectedTask.description} rows={5} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="field">
                <label htmlFor="assignee" className="font-medium text-gray-700 mb-2 block">Assignee</label>
                <InputText id="assignee" value={selectedTask.assignee} />
              </div>
              
              <div className="field">
                <label htmlFor="dueDate" className="font-medium text-gray-700 mb-2 block">Due Date</label>
                <Calendar 
                  id="dueDate" 
                  value={new Date(selectedTask.dueDate)} 
                  dateFormat="mm/dd/yy"
                  showIcon
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="field">
                <label htmlFor="priority" className="font-medium text-gray-700 mb-2 block">Priority</label>
                <Dropdown 
                  id="priority" 
                  value={selectedTask.priority} 
                  options={priorityOptions} 
                  optionLabel="label"
                />
              </div>
              
              <div className="field">
                <label htmlFor="status" className="font-medium text-gray-700 mb-2 block">Status</label>
                <Dropdown 
                  id="status" 
                  value={selectedTask.status} 
                  options={statusOptions} 
                  optionLabel="label"
                />
              </div>
            </div>
            
            {selectedTask.notes && selectedTask.notes.length > 0 && (
              <div className="field mb-4">
                <label className="font-medium text-gray-700 mb-2 block">Notes</label>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedTask.notes.map((note, i) => (
                    <li key={i} className="text-gray-600">{note}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="field flex justify-between">
              <span className="text-sm text-gray-500">Created: {new Date(selectedTask.created).toLocaleDateString()}</span>
              <span className="text-sm text-gray-500">Last Updated: {new Date(selectedTask.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default KanbanBoard;
