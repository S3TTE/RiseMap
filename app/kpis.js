// app/kpis.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { useRouter } from 'expo-router';
import AppHeader from '../components/AppHeader';

// Mock data - replace with your API call
const initialKPIs = [
  {
    id: '1',
    name: 'Sprint Velocity',
    description: 'Average number of story points completed per sprint',
    category: 'productivity',
    target: 30,
    current: 25,
    unit: 'points',
    frequency: 'Sprint',
    owner: 'Alice',
    trend: [20, 22, 24, 23, 25],
    trendLabels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5']
  },
  {
    id: '2',
    name: 'Bug Fix Rate',
    description: 'Number of bugs fixed per week',
    category: 'quality',
    target: 15,
    current: 12,
    unit: 'bugs',
    frequency: 'Weekly',
    owner: 'Bob',
    trend: [8, 10, 11, 10, 12],
    trendLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
  },
  {
    id: '3',
    name: 'Code Review Time',
    description: 'Average time to complete code reviews',
    category: 'efficiency',
    target: 24,
    current: 36,
    unit: 'hours',
    frequency: 'Weekly',
    owner: 'Charlie',
    trend: [48, 42, 38, 36, 36],
    trendLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
  }
];

export default function KPIManagement() {
  const [kpis, setKPIs] = useState(initialKPIs);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  
  const router = useRouter();
  
  const categories = [
    { label: 'Productivity', value: 'productivity' },
    { label: 'Quality', value: 'quality' },
    { label: 'Efficiency', value: 'efficiency' },
    { label: 'Customer', value: 'customer' }
  ];
  
  const frequencies = [
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Sprint', value: 'Sprint' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Quarterly', value: 'Quarterly' }
  ];
  
  const teamMembers = [
    { label: 'Alice', value: 'Alice' },
    { label: 'Bob', value: 'Bob' },
    { label: 'Charlie', value: 'Charlie' },
    { label: 'Diana', value: 'Diana' }
  ];
  
  const openNewKPI = () => {
    setSelectedKPI({
      id: Date.now().toString(),
      name: '',
      description: '',
      category: '',
      target: 0,
      current: 0,
      unit: '',
      frequency: '',
      owner: '',
      trend: [],
      trendLabels: []
    });
    setEditDialog(true);
  };
  
  const openEditKPI = (kpi) => {
    setSelectedKPI({...kpi});
    setEditDialog(true);
  };
  
  const saveKPI = () => {
    const newKPIs = [...kpis];
    const index = newKPIs.findIndex(k => k.id === selectedKPI.id);
    
    if (index >= 0) {
      newKPIs[index] = {...selectedKPI};
    } else {
      // For new KPIs, initialize empty trend data
      const newKPI = {
        ...selectedKPI,
        trend: [selectedKPI.current],
        trendLabels: ['Current']
      };
      newKPIs.push(newKPI);
    }
    
    setKPIs(newKPIs);
    setEditDialog(false);
    
    // Here you would update your backend via API call
  };
  
  const deleteKPI = (kpiId) => {
    setKPIs(kpis.filter(k => k.id !== kpiId));
    // Here you would update your backend via API call
  };
  
  const viewKPIDetails = (kpi) => {
    setSelectedKPI({...kpi});
    setDetailsDialog(true);
  };
  
  const getCategoryLabel = (category) => {
    const found = categories.find(c => c.value === category);
    return found ? found.label : category;
  };
  
  const getProgressPercentage = (current, target) => {
    // For KPIs where lower is better
    if (current > target && ['Code Review Time'].includes(selectedKPI?.name)) {
      return Math.min(100, Math.max(0, target / current * 100));
    }
    // For KPIs where higher is better (default)
    return Math.min(100, Math.max(0, current / target * 100));
  };
  
  const getProgressColor = (current, target) => {
    // For KPIs where lower is better
    if (['Code Review Time'].includes(selectedKPI?.name)) {
      if (current <= target) return '#4caf50'; // Green for meeting target
      if (current <= target * 1.25) return '#ff9800'; // Orange for within 25% of target
      return '#f44336'; // Red for significantly off target
    }
    
    // For KPIs where higher is better
    const percentage = getProgressPercentage(current, target);
    if (percentage >= 90) return '#4caf50'; // Green for >= 90%
    if (percentage >= 75) return '#ff9800'; // Orange for >= 75%
    return '#f44336'; // Red for < 75%
  };
  
  const categoryTemplate = (rowData) => {
    return (
      <span className={`category-badge category-${rowData.category}`}>
        {getCategoryLabel(rowData.category)}
      </span>
    );
  };
  
  const progressTemplate = (rowData) => {
    const percentage = getProgressPercentage(rowData.current, rowData.target);
    const color = getProgressColor(rowData.current, rowData.target);
    
    return (
      <div style={{ position: 'relative', height: '20px', width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
        <div 
          style={{ 
            position: 'absolute', 
            height: '100%', 
            width: `${percentage}%`, 
            backgroundColor: color,
            borderRadius: '4px'
          }} 
        />
        <div 
          style={{ 
            position: 'absolute', 
            width: '100%', 
            textAlign: 'center', 
            color: percentage > 50 ? '#fff' : '#333',
            lineHeight: '20px'
          }}
        >
          {rowData.current} / {rowData.target} {rowData.unit}
        </div>
      </div>
    );
  };
  
  const actionTemplate = (rowData) => {
    return (
      <div>
        <Button 
          icon="pi pi-eye" 
          className="p-button-rounded p-button-text" 
          onClick={() => viewKPIDetails(rowData)} 
          tooltip="View Details"
        />
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-text" 
          onClick={() => openEditKPI(rowData)} 
          tooltip="Edit"
        />
        <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-text p-button-danger" 
          onClick={() => deleteKPI(rowData.id)} 
          tooltip="Delete"
        />
      </div>
    );
  };
  
  const getChartOptions = (kpi) => {
    return {
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            display: true
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };
  };
  
  const getChartData = (kpi) => {
    return {
      labels: kpi.trendLabels,
      datasets: [
        {
          label: kpi.name,
          data: kpi.trend,
          fill: false,
          borderColor: '#2196f3',
          tension: 0.4
        },
        {
          label: 'Target',
          data: Array(kpi.trend.length).fill(kpi.target),
          fill: false,
          borderColor: '#4caf50',
          borderDash: [5, 5],
          tension: 0
        }
      ]
    };
  };
  
  return (
    <View style={styles.container}>
      <AppHeader title="KPI Management" 
        leftButton={{
          icon: 'pi pi-arrow-left',
          onClick: () => router.back()
        }}
      />
      
      <ScrollView style={styles.content}>
        <Card title="Key Performance Indicators" style={styles.card}>
          <Button 
            label="New KPI" 
            icon="pi pi-plus" 
            onClick={openNewKPI} 
            style={styles.button} 
          />
          
          <DataTable value={kpis} paginator rows={10}>
            <Column field="name" header="KPI" sortable />
            <Column field="category" header="Category" body={categoryTemplate} sortable />
            <Column field="owner" header="Owner" sortable />
            <Column field="frequency" header="Frequency" sortable />
            <Column header="Progress" body={progressTemplate} />
            <Column body={actionTemplate} style={{ width: '10%', textAlign: 'center' }} />
          </DataTable>
        </Card>
      </ScrollView>
      
      {/* KPI Edit Dialog */}
      <Dialog 
        header={selectedKPI?.id ? 'Edit KPI' : 'New KPI'} 
        visible={editDialog} 
        style={{width: '50vw'}} 
        onHide={() => setEditDialog(false)}
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setEditDialog(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={saveKPI} />
          </div>
        }
      >
        {selectedKPI && (
          <div className="p-fluid">
            <div className="p-field" style={styles.formField}>
              <label htmlFor="kpi-name">Name</label>
              <InputText 
                id="kpi-name" 
                value={selectedKPI.name} 
                onChange={(e) => setSelectedKPI({...selectedKPI, name: e.target.value})} 
                required 
              />
            </div>
            
            <div className="p-field" style={styles.formField}>
              <label htmlFor="kpi-description">Description</label>
              <InputTextarea 
                id="kpi-description" 
                value={selectedKPI.description} 
                onChange={(e) => setSelectedKPI({...selectedKPI, description: e.target.value})} 
                rows={2} 
              />
            </div>
            
            <div className="p-field" style={styles.formField}>
              <label htmlFor="kpi-category">Category</label>
              <Dropdown 
                id="kpi-category" 
                value={selectedKPI.category} 
                options={categories} 
                onChange={(e) => setSelectedKPI({...selectedKPI, category: e.value})} 
                placeholder="Select Category" 
              />
            </div>
            
            <div className="p-field" style={styles.formField}>
              <label htmlFor="kpi-target">Target Value</label>
              <InputNumber 
                id="kpi-target" 
                value={selectedKPI.target} 
                onValueChange={(e) => setSelectedKPI({...selectedKPI, target: e.value})} 
              />
            </div>
            
            <div className="p-field" style={styles.formField}>
              <label htmlFor="kpi-current">Current Value</label>
              <InputNumber 
                id="kpi-current" 
                value={selectedKPI.current} 
                onValueChange={(e) => setSelectedKPI({...selectedKPI, current: e.value})} 
              />
            </div>
            
            <div className="p-field" style={styles.formField}>
              <label htmlFor="kpi-unit">Unit</label>
              <InputText 
                id="kpi-unit" 
                value={selectedKPI.unit} 
                onChange={(e) => setSelectedKPI({...selectedKPI, unit: e.target.value})} 
                placeholder="e.g. points, hours, %" 
              />
            </div>
            
            <div className="p-field" style={styles.formField}>
              <label htmlFor="kpi-frequency">Measurement Frequency</label>
              <Dropdown 
                id="kpi-frequency" 
                value={selectedKPI.frequency} 
                options={frequencies} 
                onChange={(e) => setSelectedKPI({...selectedKPI, frequency: e.value})} 
                placeholder="Select Frequency" 
              />
            </div>
            
            <div className="p-field" style={styles.formField}>
              <label htmlFor="kpi-owner">Owner</label>
              <Dropdown 
                id="kpi-owner" 
                value={selectedKPI.owner} 
                options={teamMembers} 
                onChange={(e) => setSelectedKPI({...selectedKPI, owner: e.value})} 
                placeholder="Select Owner" 
              />
            </div>
          </div>
        )}
      </Dialog>
      
      {/* KPI Details Dialog */}
      <Dialog 
        header={selectedKPI?.name} 
        visible={detailsDialog} 
        style={{width: '70vw'}} 
        onHide={() => setDetailsDialog(false)}
      >
        {selectedKPI && (
          <div>
            <div className="p-grid">
              <div className="p-col-12 p-md-6">
                <h3>Details</h3>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Description:</span>
                  <span>{selectedKPI.description}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Category:</span>
                  <span>{getCategoryLabel(selectedKPI.category)}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Owner:</span>
                  <span>{selectedKPI.owner}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Frequency:</span>
                  <span>{selectedKPI.frequency}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Current Value:</span>
                  <span>{selectedKPI.current} {selectedKPI.unit}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Target Value:</span>
                  <span>{selectedKPI.target} {selectedKPI.unit}</span>
                </div>
                
                <h3>Progress</h3>
                <div style={{ marginTop: '16px' }}>
                  {progressTemplate(selectedKPI)}
                </div>
              </div>
              
              <div className="p-col-12 p-md-6">
                <h3>Trend</h3>
                <div style={{ height: '300px' }}>
                  <Chart 
                    type="line" 
                    data={getChartData(selectedKPI)} 
                    options={getChartOptions(selectedKPI)} 
                  />
                </div>
              </div>
            </div>
            
            <h3 style={{ marginTop: '24px' }}>Productivity Tips</h3>
            <div style={styles.tipsContainer}>
              {selectedKPI.name === 'Sprint Velocity' && (
                <div>
                  <div style={styles.tip}>
                    <i className="pi pi-check-circle" style={styles.tipIcon}></i>
                    <span>Consider breaking down larger tasks into smaller, more manageable stories.</span>
                  </div>
                  <div style={styles.tip}>
                    <i className="pi pi-check-circle" style={styles.tipIcon}></i>
                    <span>Review sprint retrospectives to identify and remove common blockers.</span>
                  </div>
                  <div style={styles.tip}>
                    <i className="pi pi-check-circle" style={styles.tipIcon}></i>
                    <span>Implement pair programming sessions for complex tasks.</span>
                  </div>
                </div>
              )}
              
              {selectedKPI.name === 'Bug Fix Rate' && (
                <div>
                  <div style={styles.tip}>
                    <i className="pi pi-check-circle" style={styles.tipIcon}></i>
                    <span>Consider dedicating specific time blocks for bug fixing.</span>
                  </div>
                  <div style={styles.tip}>
                    <i className="pi pi-check-circle" style={styles.tipIcon}></i>
                    <span>Implement automated testing to catch bugs earlier.</span>
                  </div>
                  <div style={styles.tip}>
                    <i className="pi pi-check-circle" style={styles.tipIcon}></i>
                    <span>Categorize bugs by severity to prioritize critical issues.</span>
                  </div>
                </div>
              )}
              
              {selectedKPI.name === 'Code Review Time' && (
                <div>
                  <div style={styles.tip}>
                    <i className="pi pi-check-circle" style={styles.tipIcon}></i>
                    <span>Set up daily short timeboxes dedicated to code reviews.</span>
                  </div>
                  <div style={styles.tip}>
                    <i className="pi pi-check-circle" style={styles.tipIcon}></i>
                    <span>Consider using pair reviews for complex changes.</span>
                  </div>
                  <div style={styles.tip}>
                    <i className="pi pi-check-circle" style={styles.tipIcon}></i>
                    <span>Implement automated code quality checks to reduce manual review time.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  tipsContainer: {
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 8,
  },
  tip: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIcon: {
    color: '#2196f3',
    marginRight: 8,
  }
});