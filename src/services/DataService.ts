
import { Task } from "../models/Task";
import { Objective, KeyResult } from "../models/OKR";
import { KPI } from "../models/KPI";
import { WeeklyNote } from "../models/WeeklyNote";

// Mock data for Tasks
const tasks: Task[] = [
  {
    id: "task1",
    title: "Website Redesign",
    description: "Redesign the company website with new branding",
    assignee: "John Doe",
    dueDate: "2025-05-01",
    priority: "high",
    status: "inProgress",
    notes: ["Initial mockups completed", "Waiting for feedback"],
    tags: ["design", "web"],
    created: "2025-04-01",
    lastUpdated: "2025-04-05"
  },
  {
    id: "task2",
    title: "Q2 Financial Report",
    description: "Prepare the Q2 financial report for the board meeting",
    assignee: "Alice Smith",
    dueDate: "2025-04-20",
    priority: "high",
    status: "todo",
    tags: ["finance", "report"],
    created: "2025-04-02",
    lastUpdated: "2025-04-02"
  },
  {
    id: "task3",
    title: "New Feature Development",
    description: "Develop the new user authentication system",
    assignee: "Bob Johnson",
    dueDate: "2025-04-30",
    priority: "medium",
    status: "inProgress",
    notes: ["Backend implementation started"],
    tags: ["development", "feature"],
    created: "2025-03-25",
    lastUpdated: "2025-04-08"
  },
  {
    id: "task4",
    title: "Team Building Event",
    description: "Organize a team building event for the department",
    assignee: "Emily Davis",
    dueDate: "2025-05-15",
    priority: "low",
    status: "todo",
    tags: ["event", "team"],
    created: "2025-04-06",
    lastUpdated: "2025-04-06"
  },
  {
    id: "task5",
    title: "Client Presentation",
    description: "Prepare presentation for the new client meeting",
    assignee: "John Doe",
    dueDate: "2025-04-18",
    priority: "high",
    status: "review",
    notes: ["First draft completed", "Need marketing input"],
    tags: ["client", "presentation"],
    created: "2025-04-04",
    lastUpdated: "2025-04-10"
  },
  {
    id: "task6",
    title: "Bug Fixes for v2.1",
    description: "Fix critical bugs reported in version 2.1",
    assignee: "Bob Johnson",
    dueDate: "2025-04-15",
    priority: "high",
    status: "inProgress",
    tags: ["bug", "development"],
    created: "2025-04-07",
    lastUpdated: "2025-04-09"
  },
  {
    id: "task7",
    title: "Content Update",
    description: "Update product descriptions on the website",
    assignee: "Alice Smith",
    dueDate: "2025-04-25",
    priority: "medium",
    status: "done",
    notes: ["All content updated and reviewed"],
    tags: ["content", "web"],
    created: "2025-04-03",
    lastUpdated: "2025-04-11"
  },
  {
    id: "task8",
    title: "Marketing Campaign",
    description: "Launch the spring marketing campaign",
    assignee: "Emily Davis",
    dueDate: "2025-05-05",
    priority: "medium",
    status: "todo",
    tags: ["marketing", "campaign"],
    created: "2025-04-08",
    lastUpdated: "2025-04-08"
  }
];

// Mock data for Objectives and Key Results
const objectives: Objective[] = [
  {
    id: "obj1",
    title: "Increase Market Share",
    description: "Expand our market presence in the enterprise segment",
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    progress: 45,
    keyResults: [
      {
        id: "kr1-1",
        title: "New Enterprise Clients",
        description: "Acquire new enterprise clients",
        target: 10,
        current: 4,
        unit: "clients"
      },
      {
        id: "kr1-2",
        title: "Enterprise Revenue",
        description: "Increase enterprise revenue",
        target: 500000,
        current: 215000,
        startValue: 150000,
        unit: "USD"
      }
    ]
  },
  {
    id: "obj2",
    title: "Product Development",
    description: "Enhance our product with new features",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    progress: 30,
    keyResults: [
      {
        id: "kr2-1",
        title: "Feature Releases",
        description: "Release new product features",
        target: 12,
        current: 3,
        unit: "features"
      },
      {
        id: "kr2-2",
        title: "User Satisfaction",
        description: "Improve user satisfaction score",
        target: 9.0,
        current: 7.6,
        startValue: 7.2,
        unit: "score"
      }
    ]
  },
  {
    id: "obj3",
    title: "Team Growth",
    description: "Expand the team with top talent",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    progress: 60,
    keyResults: [
      {
        id: "kr3-1",
        title: "New Team Members",
        description: "Hire new team members",
        target: 5,
        current: 3,
        unit: "people"
      },
      {
        id: "kr3-2",
        title: "Training Hours",
        description: "Complete team training hours",
        target: 200,
        current: 120,
        unit: "hours"
      }
    ]
  }
];

// Mock data for KPIs
const kpis: KPI[] = [
  {
    id: "kpi1",
    name: "Revenue Growth",
    description: "Monthly revenue growth compared to previous month",
    category: "Financial",
    target: 10,
    actual: 8.5,
    unit: "%",
    frequency: "monthly",
    trend: [5.2, 6.1, 7.4, 6.9, 8.5],
    lastUpdated: "2025-04-05"
  },
  {
    id: "kpi2",
    name: "Customer Satisfaction",
    description: "Average customer satisfaction score",
    category: "Customer",
    target: 9.0,
    actual: 8.2,
    unit: "score",
    frequency: "quarterly",
    trend: [7.8, 8.0, 8.1, 8.2],
    lastUpdated: "2025-04-01"
  },
  {
    id: "kpi3",
    name: "Bug Resolution Time",
    description: "Average time to resolve critical bugs",
    category: "Technical",
    target: 2,
    actual: 2.7,
    unit: "days",
    frequency: "weekly",
    trend: [3.5, 3.2, 2.9, 2.7],
    lastUpdated: "2025-04-10"
  },
  {
    id: "kpi4",
    name: "New Users",
    description: "Number of new users registered",
    category: "Growth",
    target: 500,
    actual: 430,
    unit: "users",
    frequency: "monthly",
    trend: [320, 350, 410, 430],
    lastUpdated: "2025-04-03"
  },
  {
    id: "kpi5",
    name: "Team Productivity",
    description: "Average tasks completed per team member",
    category: "Performance",
    target: 15,
    actual: 12,
    unit: "tasks",
    frequency: "weekly",
    trend: [10, 11, 13, 12],
    lastUpdated: "2025-04-08"
  }
];

// Mock data for Weekly Notes
const weeklyNotes: WeeklyNote[] = [
  {
    id: "note1",
    week: "Week 14",
    year: 2025,
    accomplishments: [
      "Completed the initial design for the new website",
      "Resolved 5 critical bugs in the payment system",
      "Conducted team training on the new CRM system"
    ],
    challenges: [
      "Delays in receiving feedback from the marketing department",
      "Technical issues with the test environment"
    ],
    nextWeekPlan: [
      "Start implementing the website redesign",
      "Finalize the Q2 financial report",
      "Prepare for the client presentation"
    ],
    taskReferences: ["task1", "task2", "task5"],
    created: "2025-04-05",
    lastUpdated: "2025-04-05"
  },
  {
    id: "note2",
    week: "Week 13",
    year: 2025,
    accomplishments: [
      "Launched the new user authentication system",
      "Updated all product descriptions on the website",
      "Completed the Q1 financial analysis"
    ],
    challenges: [
      "Integration issues with the third-party payment provider",
      "Team member illness causing resource constraints"
    ],
    nextWeekPlan: [
      "Begin the website redesign project",
      "Fix reported bugs in version 2.1",
      "Start preparing for the board meeting"
    ],
    taskReferences: ["task3", "task6", "task7"],
    created: "2025-03-29",
    lastUpdated: "2025-03-29"
  }
];

// Service methods to retrieve data
export const DataService = {
  getTasks: (): Promise<Task[]> => {
    return Promise.resolve(tasks);
  },

  getTaskById: (id: string): Promise<Task | undefined> => {
    return Promise.resolve(tasks.find(task => task.id === id));
  },

  getTasksByStatus: (status: string): Promise<Task[]> => {
    return Promise.resolve(tasks.filter(task => task.status === status));
  },

  getObjectives: (): Promise<Objective[]> => {
    return Promise.resolve(objectives);
  },

  getObjectiveById: (id: string): Promise<Objective | undefined> => {
    return Promise.resolve(objectives.find(obj => obj.id === id));
  },

  getKPIs: (): Promise<KPI[]> => {
    return Promise.resolve(kpis);
  },

  getKPIById: (id: string): Promise<KPI | undefined> => {
    return Promise.resolve(kpis.find(kpi => kpi.id === id));
  },

  getWeeklyNotes: (): Promise<WeeklyNote[]> => {
    return Promise.resolve(weeklyNotes);
  },

  getWeeklyNoteById: (id: string): Promise<WeeklyNote | undefined> => {
    return Promise.resolve(weeklyNotes.find(note => note.id === id));
  },

  getPendingTasks: (): Promise<Task[]> => {
    return Promise.resolve(tasks.filter(task => task.status !== 'done'));
  },

  getTasksByPriority: (priority: string): Promise<Task[]> => {
    return Promise.resolve(tasks.filter(task => task.priority === priority));
  },

  getTasksByAssignee: (assignee: string): Promise<Task[]> => {
    return Promise.resolve(tasks.filter(task => task.assignee === assignee));
  }
};
