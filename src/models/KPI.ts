
export interface KPI {
    id: string;
    name: string;
    description: string;
    category: string;
    target: number;
    actual: number;
    unit: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    trend: number[];
    lastUpdated: string;
  }
  