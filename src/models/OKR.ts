
export interface Objective {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    progress: number;
    keyResults: KeyResult[];
  }
  
  export interface KeyResult {
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    unit: string;
    startValue?: number;
  }
  