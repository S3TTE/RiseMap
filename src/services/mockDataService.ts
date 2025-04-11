import { Request, OKR } from '../types/models';

export const getMockRequests = (): Request[] => [
  {
    id: 1,
    title: 'Fix login bug',
    description: 'Error when clicking login',
    status: 'closed',
    assignee: 'Alice',
    weekStart: '2025-04-08',
    completedAt: '2025-04-10',
  },
  {
    id: 2,
    title: 'Create reporting UI',
    description: 'Initial dashboard for reports',
    status: 'in_progress',
    assignee: 'Bob',
    weekStart: '2025-04-08',
  },
];

export const getMockOKRs = (): OKR[] => [
  {
    id: 1,
    objective: 'Improve bug fix turnaround',
    keyResult: 'Close 10 bugs in April',
    targetValue: 10,
    currentValue: 3,
    deadline: '2025-04-30',
  },
];
