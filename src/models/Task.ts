
export interface Task {
    id: string;
    title: string;
    description: string;
    assignee: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'inProgress' | 'review' | 'done';
    notes?: string[];
    tags?: string[];
    created: string;
    lastUpdated: string;
  }
  