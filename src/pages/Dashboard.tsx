
import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { DataService } from '../services/DataService';
import { Task } from '../models/Task';
import { KPI } from '../models/KPI';

const Dashboard: React.FC = () => {
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [taskStatusData, setTaskStatusData] = useState({});
  const [taskPriorityData, setTaskPriorityData] = useState({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tasks = await DataService.getTasks();
        const pendingTasksData = await DataService.getPendingTasks();
        const kpisData = await DataService.getKPIs();
        
        setPendingTasks(pendingTasksData);
        setKpis(kpisData);
        
        // Process data for charts
        const statusCounts = {
          todo: tasks.filter(t => t.status === 'todo').length,
          inProgress: tasks.filter(t => t.status === 'inProgress').length,
          review: tasks.filter(t => t.status === 'review').length,
          done: tasks.filter(t => t.status === 'done').length
        };
        
        setTaskStatusData({
          labels: ['To Do', 'In Progress', 'Review', 'Done'],
          datasets: [
            {
              data: [statusCounts.todo, statusCounts.inProgress, statusCounts.review, statusCounts.done],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }
          ]
        });
        
        const priorityCounts = {
          high: tasks.filter(t => t.priority === 'high').length,
          medium: tasks.filter(t => t.priority === 'medium').length,
          low: tasks.filter(t => t.priority === 'low').length
        };
        
        setTaskPriorityData({
          labels: ['High', 'Medium', 'Low'],
          datasets: [
            {
              data: [priorityCounts.high, priorityCounts.medium, priorityCounts.low],
              backgroundColor: ['#FF6384', '#FFCE56', '#4BC0C0'],
              hoverBackgroundColor: ['#FF6384', '#FFCE56', '#4BC0C0']
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const priorityTemplate = (rowData: Task) => {
    const severity = rowData.priority === 'high' ? 'danger' : 
                     rowData.priority === 'medium' ? 'warning' : 'success';
                     
    return <Tag value={rowData.priority} severity={severity} />;
  };
  
  const statusTemplate = (rowData: Task) => {
    const severity = rowData.status === 'todo' ? 'danger' : 
                     rowData.status === 'inProgress' ? 'warning' :
                     rowData.status === 'review' ? 'info' : 'success';
                     
    return <Tag value={rowData.status} severity={severity} />;
  };

  const dueDateTemplate = (rowData: Task) => {
    const dueDate = new Date(rowData.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let severity = 'success';
    if (diffDays < 0) {
      severity = 'danger';
    } else if (diffDays <= 3) {
      severity = 'warning';
    }
    
    return (
      <div className="flex items-center">
        <span className={`text-${severity === 'danger' ? 'red' : severity === 'warning' ? 'orange' : 'green'}-500`}>
          {new Date(rowData.dueDate).toLocaleDateString()}
        </span>
        {diffDays < 0 && <span className="ml-2 text-red-500">({Math.abs(diffDays)} days overdue)</span>}
        {diffDays >= 0 && diffDays <= 3 && <span className="ml-2 text-orange-500">({diffDays} days left)</span>}
      </div>
    );
  };

  const kpiTemplate = (rowData: KPI) => {
    const percentage = (rowData.actual / rowData.target) * 100;
    const status = percentage >= 100 ? 'success' : 
                  percentage >= 70 ? 'warning' : 'danger';
                  
    return (
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${status === 'success' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} 
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <span className="ml-2">{Math.round(percentage)}%</span>
      </div>
    );
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div>
          <Button label="Refresh Data" icon="pi pi-refresh" className="p-button-outlined" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <Card className="shadow-md">
          <div className="flex flex-col items-center">
            <div className="text-xl font-semibold mb-2">Pending Tasks</div>
            <div className="text-4xl font-bold text-sakai-primary">{pendingTasks.length}</div>
          </div>
        </Card>
        <Card className="shadow-md">
          <div className="flex flex-col items-center">
            <div className="text-xl font-semibold mb-2">High Priority</div>
            <div className="text-4xl font-bold text-red-500">
              {pendingTasks.filter(task => task.priority === 'high').length}
            </div>
          </div>
        </Card>
        <Card className="shadow-md">
          <div className="flex flex-col items-center">
            <div className="text-xl font-semibold mb-2">In Progress</div>
            <div className="text-4xl font-bold text-yellow-500">
              {pendingTasks.filter(task => task.status === 'inProgress').length}
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Tasks by Status" className="shadow-md">
          <Chart type="pie" data={taskStatusData} options={chartOptions} className="h-80" />
        </Card>
        <Card title="Tasks by Priority" className="shadow-md">
          <Chart type="doughnut" data={taskPriorityData} options={chartOptions} className="h-80" />
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card title="Key Performance Indicators" className="shadow-md">
          <DataTable value={kpis} loading={loading} paginator rows={5} rowsPerPageOptions={[5, 10, 25]}>
            <Column field="name" header="KPI" sortable></Column>
            <Column field="category" header="Category" sortable></Column>
            <Column field="actual" header={`Actual`} body={(rowData) => `${rowData.actual} ${rowData.unit}`} sortable></Column>
            <Column field="target" header={`Target`} body={(rowData) => `${rowData.target} ${rowData.unit}`} sortable></Column>
            <Column field="progress" header="Progress" body={kpiTemplate}></Column>
            <Column field="lastUpdated" header="Last Updated" body={(rowData) => new Date(rowData.lastUpdated).toLocaleDateString()} sortable></Column>
          </DataTable>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card title="Pending Activities" className="shadow-md">
          <DataTable 
            value={pendingTasks} 
            loading={loading}
            paginator 
            rows={5} 
            rowsPerPageOptions={[5, 10, 25]}
            sortField="dueDate"
            sortOrder={1}
          >
            <Column field="title" header="Task" sortable></Column>
            <Column field="assignee" header="Assignee" sortable></Column>
            <Column field="priority" header="Priority" body={priorityTemplate} sortable></Column>
            <Column field="status" header="Status" body={statusTemplate} sortable></Column>
            <Column field="dueDate" header="Due Date" body={dueDateTemplate} sortable></Column>
            <Column 
              body={(rowData) => (
                <Button 
                  icon="pi pi-eye" 
                  className="p-button-rounded p-button-text" 
                  tooltip="View Details"
                  tooltipOptions={{ position: 'left' }}
                />
              )}
            />
          </DataTable>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
