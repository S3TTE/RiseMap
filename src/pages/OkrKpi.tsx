
import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Chart } from 'primereact/chart';
import { ProgressBar } from 'primereact/progressbar';
import { DataService } from '../services/DataService';
import { Objective, KeyResult } from '../models/OKR';
import { KPI } from '../models/KPI';

const OkrKpi: React.FC = () => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [displayObjectiveDialog, setDisplayObjectiveDialog] = useState<boolean>(false);
  const [displayKPIDialog, setDisplayKPIDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [kpiChartData, setKpiChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const objectivesData = await DataService.getObjectives();
        const kpisData = await DataService.getKPIs();
        
        setObjectives(objectivesData);
        setKpis(kpisData);
        
        // Prepare chart data for KPIs
        const labels = kpisData.map(kpi => kpi.name);
        const actuals = kpisData.map(kpi => kpi.actual);
        const targets = kpisData.map(kpi => kpi.target);
        
        setKpiChartData({
          labels: labels,
          datasets: [
            {
              label: 'Actual',
              backgroundColor: '#36A2EB',
              data: actuals
            },
            {
              label: 'Target',
              backgroundColor: '#FF6384',
              data: targets
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching OKR/KPI data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const showObjectiveDetails = (objective: Objective) => {
    setSelectedObjective(objective);
    setDisplayObjectiveDialog(true);
  };

  const hideObjectiveDialog = () => {
    setSelectedObjective(null);
    setDisplayObjectiveDialog(false);
  };

  const showKPIDetails = (kpi: KPI) => {
    setSelectedKPI(kpi);
    setDisplayKPIDialog(true);
  };

  const hideKPIDialog = () => {
    setSelectedKPI(null);
    setDisplayKPIDialog(false);
  };

  const progressBodyTemplate = (rowData: Objective) => {
    return (
      <div className="w-full">
        <ProgressBar value={rowData.progress} showValue={false} style={{ height: '8px' }} />
        <div className="text-center mt-1">{rowData.progress}%</div>
      </div>
    );
  };

  const kpiProgressBodyTemplate = (rowData: KPI) => {
    const percentage = (rowData.actual / rowData.target) * 100;
    const status = percentage >= 100 ? 'success' : 
                  percentage >= 70 ? 'warning' : 'danger';
                  
    return (
      <div className="w-full">
        <ProgressBar 
          value={Math.min(Math.round(percentage), 100)} 
          showValue={false} 
          style={{ height: '8px' }} 
          className={status === 'success' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'} 
        />
        <div className="text-center mt-1">{Math.round(percentage)}%</div>
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Objective) => {
    return (
      <div>
        {new Date(rowData.startDate).toLocaleDateString()} - {new Date(rowData.endDate).toLocaleDateString()}
      </div>
    );
  };

  const actionBodyTemplate = (rowData: Objective) => {
    return (
      <div className="flex gap-2 justify-center">
        <Button 
          icon="pi pi-eye" 
          className="p-button-rounded p-button-text p-button-outlined" 
          onClick={() => showObjectiveDetails(rowData)}
          tooltip="View Details"
          tooltipOptions={{ position: 'left' }}
        />
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-text p-button-outlined" 
          tooltip="Edit"
          tooltipOptions={{ position: 'left' }}
        />
      </div>
    );
  };

  const kpiActionBodyTemplate = (rowData: KPI) => {
    return (
      <div className="flex gap-2 justify-center">
        <Button 
          icon="pi pi-eye" 
          className="p-button-rounded p-button-text p-button-outlined" 
          onClick={() => showKPIDetails(rowData)}
          tooltip="View Details"
          tooltipOptions={{ position: 'left' }}
        />
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-text p-button-outlined" 
          tooltip="Edit"
          tooltipOptions={{ position: 'left' }}
        />
      </div>
    );
  };

  const renderKeyResults = (keyResults: KeyResult[]) => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-3">Key Results</h3>
        <div className="space-y-4">
          {keyResults.map((kr, index) => {
            const percentage = kr.target ? (kr.current / kr.target) * 100 : 0;
            const status = percentage >= 100 ? 'success' : 
                          percentage >= 70 ? 'warning' : 'danger';
                          
            return (
              <Card key={kr.id} className="shadow-sm">
                <div>
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">{index + 1}. {kr.title}</div>
                    <div className={`text-${status === 'success' ? 'green' : status === 'warning' ? 'orange' : 'red'}-500`}>
                      {kr.current} / {kr.target} {kr.unit}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{kr.description}</p>
                  <div className="w-full">
                    <ProgressBar 
                      value={Math.min(Math.round(percentage), 100)} 
                      showValue={false} 
                      style={{ height: '8px' }} 
                      className={status === 'success' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'} 
                    />
                    <div className="text-right mt-1 text-sm">{Math.round(percentage)}%</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const objectiveDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideObjectiveDialog} />
      <Button label="Save" icon="pi pi-check" onClick={hideObjectiveDialog} />
    </>
  );

  const kpiDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideKPIDialog} />
      <Button label="Save" icon="pi pi-check" onClick={hideKPIDialog} />
    </>
  );

  const chartOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  const frequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' }
  ];

  return (
    <div className="okr-kpi">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold text-gray-800">OKR & KPI Tracking</h1>
      </div>
      
      <TabView>
        <TabPanel header="Objectives & Key Results">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Objectives</h2>
            <Button label="New Objective" icon="pi pi-plus" />
          </div>
          
          <DataTable 
            value={objectives} 
            loading={loading}
            paginator 
            rows={5} 
            rowsPerPageOptions={[5, 10, 25]}
            responsiveLayout="scroll"
          >
            <Column field="title" header="Objective" sortable></Column>
            <Column field="period" header="Period" body={dateBodyTemplate} sortable></Column>
            <Column field="progress" header="Progress" body={progressBodyTemplate} sortable></Column>
            <Column body={actionBodyTemplate} exportable={false} style={{ width: '10%' }}></Column>
          </DataTable>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Current Focus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {objectives.slice(0, 2).map(objective => (
                <Card key={objective.id} title={objective.title} className="shadow-md">
                  <p className="text-gray-600 mb-4">{objective.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <div>
                      {new Date(objective.startDate).toLocaleDateString()} - {new Date(objective.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-lg font-semibold text-sakai-primary">
                      {objective.progress}%
                    </div>
                  </div>
                  <ProgressBar value={objective.progress} style={{ height: '10px' }} className="mb-4" />
                  
                  {renderKeyResults(objective.keyResults)}
                </Card>
              ))}
            </div>
          </div>
        </TabPanel>
        
        <TabPanel header="Key Performance Indicators">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">KPIs</h2>
            <Button label="New KPI" icon="pi pi-plus" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="shadow-md">
              <div className="flex flex-col items-center">
                <div className="text-xl font-semibold mb-2">KPIs On Track</div>
                <div className="text-4xl font-bold text-green-500">
                  {kpis.filter(kpi => kpi.actual >= kpi.target).length}
                </div>
              </div>
            </Card>
            <Card className="shadow-md">
              <div className="flex flex-col items-center">
                <div className="text-xl font-semibold mb-2">KPIs At Risk</div>
                <div className="text-4xl font-bold text-yellow-500">
                  {kpis.filter(kpi => kpi.actual < kpi.target && (kpi.actual / kpi.target) >= 0.7).length}
                </div>
              </div>
            </Card>
            <Card className="shadow-md">
              <div className="flex flex-col items-center">
                <div className="text-xl font-semibold mb-2">KPIs Off Track</div>
                <div className="text-4xl font-bold text-red-500">
                  {kpis.filter(kpi => (kpi.actual / kpi.target) < 0.7).length}
                </div>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <Card title="KPI Overview" className="shadow-md h-80">
              <Chart type="bar" data={kpiChartData} options={chartOptions} />
            </Card>
          </div>
          
          <DataTable 
            value={kpis} 
            loading={loading}
            paginator 
            rows={5} 
            rowsPerPageOptions={[5, 10, 25]}
            responsiveLayout="scroll"
          >
            <Column field="name" header="KPI" sortable></Column>
            <Column field="category" header="Category" sortable></Column>
            <Column field="actual" header="Actual" body={(rowData) => `${rowData.actual} ${rowData.unit}`} sortable></Column>
            <Column field="target" header="Target" body={(rowData) => `${rowData.target} ${rowData.unit}`} sortable></Column>
            <Column field="progress" header="Progress" body={kpiProgressBodyTemplate} sortable></Column>
            <Column field="frequency" header="Frequency" sortable></Column>
            <Column field="lastUpdated" header="Last Updated" body={(rowData) => new Date(rowData.lastUpdated).toLocaleDateString()} sortable></Column>
            <Column body={kpiActionBodyTemplate} exportable={false} style={{ width: '10%' }}></Column>
          </DataTable>
        </TabPanel>
      </TabView>
      
      <Dialog 
        visible={displayObjectiveDialog} 
        header="Objective Details" 
        modal 
        style={{ width: '90%', maxWidth: '700px' }} 
        footer={objectiveDialogFooter}
        onHide={hideObjectiveDialog}
      >
        {selectedObjective && (
          <div className="p-fluid">
            <div className="field mb-4">
              <label htmlFor="title" className="font-medium text-gray-700 mb-2 block">Title</label>
              <InputText id="title" value={selectedObjective.title} />
            </div>
            
            <div className="field mb-4">
              <label htmlFor="description" className="font-medium text-gray-700 mb-2 block">Description</label>
              <InputTextarea id="description" value={selectedObjective.description} rows={3} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="field">
                <label htmlFor="startDate" className="font-medium text-gray-700 mb-2 block">Start Date</label>
                <Calendar 
                  id="startDate" 
                  value={new Date(selectedObjective.startDate)} 
                  dateFormat="mm/dd/yy"
                  showIcon
                />
              </div>
              
              <div className="field">
                <label htmlFor="endDate" className="font-medium text-gray-700 mb-2 block">End Date</label>
                <Calendar 
                  id="endDate" 
                  value={new Date(selectedObjective.endDate)} 
                  dateFormat="mm/dd/yy"
                  showIcon
                />
              </div>
            </div>
            
            <div className="field mb-4">
              <label htmlFor="progress" className="font-medium text-gray-700 mb-2 block">Progress (%)</label>
              <InputNumber id="progress" value={selectedObjective.progress} mode="decimal" min={0} max={100} />
            </div>
            
            <h3 className="text-lg font-semibold mb-3">Key Results</h3>
            {selectedObjective.keyResults.map((kr, index) => (
              <div key={kr.id} className="p-card p-3 mb-3">
                <div className="field mb-3">
                  <label htmlFor={`kr-title-${index}`} className="font-medium text-gray-700 mb-1 block">Title</label>
                  <InputText id={`kr-title-${index}`} value={kr.title} />
                </div>
                
                <div className="field mb-3">
                  <label htmlFor={`kr-description-${index}`} className="font-medium text-gray-700 mb-1 block">Description</label>
                  <InputTextarea id={`kr-description-${index}`} value={kr.description} rows={2} />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="field">
                    <label htmlFor={`kr-current-${index}`} className="font-medium text-gray-700 mb-1 block">Current Value</label>
                    <InputNumber id={`kr-current-${index}`} value={kr.current} />
                  </div>
                  
                  <div className="field">
                    <label htmlFor={`kr-target-${index}`} className="font-medium text-gray-700 mb-1 block">Target Value</label>
                    <InputNumber id={`kr-target-${index}`} value={kr.target} />
                  </div>
                  
                  <div className="field">
                    <label htmlFor={`kr-unit-${index}`} className="font-medium text-gray-700 mb-1 block">Unit</label>
                    <InputText id={`kr-unit-${index}`} value={kr.unit} />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center mt-2">
              <Button label="Add Key Result" icon="pi pi-plus" className="p-button-text" />
            </div>
          </div>
        )}
      </Dialog>
      
      <Dialog 
        visible={displayKPIDialog} 
        header="KPI Details" 
        modal 
        style={{ width: '90%', maxWidth: '600px' }} 
        footer={kpiDialogFooter}
        onHide={hideKPIDialog}
      >
        {selectedKPI && (
          <div className="p-fluid">
            <div className="field mb-4">
              <label htmlFor="name" className="font-medium text-gray-700 mb-2 block">Name</label>
              <InputText id="name" value={selectedKPI.name} />
            </div>
            
            <div className="field mb-4">
              <label htmlFor="description" className="font-medium text-gray-700 mb-2 block">Description</label>
              <InputTextarea id="description" value={selectedKPI.description} rows={3} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="field">
                <label htmlFor="category" className="font-medium text-gray-700 mb-2 block">Category</label>
                <InputText id="category" value={selectedKPI.category} />
              </div>
              
              <div className="field">
                <label htmlFor="frequency" className="font-medium text-gray-700 mb-2 block">Frequency</label>
                <Dropdown 
                  id="frequency" 
                  value={selectedKPI.frequency} 
                  options={frequencyOptions} 
                  optionLabel="label"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="field">
                <label htmlFor="actual" className="font-medium text-gray-700 mb-2 block">Actual Value</label>
                <InputNumber id="actual" value={selectedKPI.actual} />
              </div>
              
              <div className="field">
                <label htmlFor="target" className="font-medium text-gray-700 mb-2 block">Target Value</label>
                <InputNumber id="target" value={selectedKPI.target} />
              </div>
              
              <div className="field">
                <label htmlFor="unit" className="font-medium text-gray-700 mb-2 block">Unit</label>
                <InputText id="unit" value={selectedKPI.unit} />
              </div>
            </div>
            
            <div className="field mb-4">
              <label className="font-medium text-gray-700 mb-2 block">Trend</label>
              <Chart 
                type="line" 
                data={{
                  labels: ['Point 1', 'Point 2', 'Point 3', 'Point 4', 'Point 5'].slice(0, selectedKPI.trend.length),
                  datasets: [
                    {
                      label: selectedKPI.name,
                      data: selectedKPI.trend,
                      fill: false,
                      borderColor: '#36A2EB'
                    }
                  ]
                }} 
                options={{
                  maintainAspectRatio: false,
                  aspectRatio: 2
                }}
                height="200px"
              />
            </div>
            
            <div className="field">
              <label htmlFor="lastUpdated" className="font-medium text-gray-700 mb-2 block">Last Updated</label>
              <Calendar 
                id="lastUpdated" 
                value={new Date(selectedKPI.lastUpdated)} 
                dateFormat="mm/dd/yy"
                showIcon
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default OkrKpi;
