// data/mockData.js

export const teamMembers = [
    {
      id: '1',
      name: 'Alice Johnson',
      role: 'Frontend Developer',
      status: 'available',
      avatarColor: '#2196f3',
      currentTasks: 3,
      totalTasks: 5,
      okrProgress: 75
    },
    {
      id: '2',
      name: 'Bob Smith',
      role: 'Backend Developer',
      status: 'busy',
      avatarColor: '#ff9800',
      currentTasks: 4,
      totalTasks: 6,
      okrProgress: 60
    },
    {
      id: '3',
      name: 'Charlie Davis',
      role: 'UI/UX Designer',
      status: 'meeting',
      avatarColor: '#4caf50',
      currentTasks: 2,
      totalTasks: 4,
      okrProgress: 90
    },
    {
      id: '4',
      name: 'Diana Wilson',
      role: 'Project Manager',
      status: 'available',
      avatarColor: '#9c27b0',
      currentTasks: 5,
      totalTasks: 8,
      okrProgress: 45
    },
    {
      id: '5',
      name: 'Eric Brown',
      role: 'QA Engineer',
      status: 'offline',
      avatarColor: '#f44336',
      currentTasks: 1,
      totalTasks: 3,
      okrProgress: 80
    }
  ];
  
  export const projects = [
    {
      id: '1',
      title: 'User Authentication Module',
      description: 'Implement JWT authentication for the new application',
      status: 'inProgress',
      priority: 'high',
      assignees: [
        { id: '1', name: 'Alice Johnson' },
        { id: '2', name: 'Bob Smith' }
      ]
    },
    {
      id: '2',
      title: 'Dashboard UI Design',
      description: 'Create wireframes and mockups for the admin dashboard',
      status: 'todo',
      priority: 'medium',
      assignees: [
        { id: '3', name: 'Charlie Davis' }
      ]
    },
    {
      id: '3',
      title: 'API Integration',
      description: 'Connect the frontend with the new RESTful API endpoints',
      status: 'review',
      priority: 'high',
      assignees: [
        { id: '1', name: 'Alice Johnson' }
      ]
    },
    {
      id: '4',
      title: 'Unit Testing Framework',
      description: 'Set up Jest and implement initial test cases',
      status: 'done',
      priority: 'medium',
      assignees: [
        { id: '5', name: 'Eric Brown' }
      ]
    },
    {
      id: '5',
      title: 'Performance Optimization',
      description: 'Improve load time and optimize database queries',
      status: 'todo',
      priority: 'low',
      assignees: [
        { id: '2', name: 'Bob Smith' }
      ]
    },
    {
      id: '6', 
      title: 'Documentation Update',
      description: 'Update API documentation with new endpoints',
      status: 'inProgress',
      priority: 'low',
      assignees: [
        { id: '4', name: 'Diana Wilson' }
      ]
    }
  ];
  
  export const notes = [
    {
      id: '1',
      title: 'Weekly Team Meeting Notes',
      content: 'Discussed project timelines and assigned new tasks. Everyone agreed to focus on finishing the authentication module by Friday.',
      type: 'meeting',
      author: 'Diana',
      date: '2025-04-07',
      relatedTo: 'Team Sync'
    },
    {
      id: '2',
      title: 'API Performance Issues',
      content: 'Identified bottleneck in the user query endpoint. Need to optimize database indices and add caching layer.',
      type: 'issue',
      author: 'Bob',
      date: '2025-04-05',
      relatedTo: 'Performance Optimization'
    },
    {
      id: '3',
      title: 'New Design System Proposal',
      content: 'Suggesting we standardize our UI components using PrimeReact to improve consistency and development speed.',
      type: 'idea',
      author: 'Charlie',
      date: '2025-04-03',
      relatedTo: 'UI Development'
    },
    {
      id: '4',
      title: 'Authentication Module Completed',
      content: 'Finished implementing JWT authentication with refresh tokens. All tests are passing.',
      type: 'success',
      author: 'Alice',
      date: '2025-04-01',
      relatedTo: 'User Authentication Module'
    },
    {
      id: '5',
      title: 'Code Review Reminder',
      content: 'Please review PR #142 for the dashboard analytics features by EOD.',
      type: 'task',
      author: 'Diana',
      date: '2025-03-28',
      relatedTo: 'Dashboard UI Design'
    }
  ];