export type Status = 'open' | 'in_progress' | 'closed';

export interface Request {
    id: number;
    title: string;
    description: string;
    status: Status;
    assignee: string;
    weekStart: string;
    completedAt?: string;
  }
  
  export interface OKR {
    id: number;
    objective: string;
    keyResult: string;
    targetValue: number;
    currentValue: number;
    deadline: string;
  }
  