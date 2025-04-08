import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { ProgressBar } from 'primereact/progressbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'expo-router';
import AppHeader from '../components/AppHeader';

// Mock data - replace with your API call
const initialObjectives = [
  {
    id: '1',
    title: 'Increase customer satisfaction',
    description: 'Focus on improving overall customer experience',
    progress: 75,
    keyResults: [
      { id: '1-1', title: 'Achieve NPS score of 60+', progress: 90, owner: 'Alice', dueDate: '2025-06-30' },
      { id: '1-2', title: 'Reduce customer tickets by 25%', progress: 60, owner: 'Bob', dueDate: '2025-06-15' }
    ]
  },
  {
    id: '2',
    title: 'Improve team productivity',
    description: 'Streamline processes and reduce waste',
    progress: 45,
    keyResults: [
      { id: '2-1', title: 'Increase sprint velocity by 20%', progress: 50, owner: 'Charlie', dueDate: '2025-05-30' },
      { id: '2-2', title: 'Reduce meeting time by 15%', progress: 40, owner: 'Diana', dueDate: '2025-05-15' }
    ]
  }
];

export default function OKRManagement() {
  const [objectives, setObjectives] = useState(initialObjectives);
  const [editDialog, setEditDialog] = useState(false);
  const [krDialog, setKrDialog] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedKeyResult, setSelectedKeyResult] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  
  const router = useRouter();
  
  const teamMembers = [
    { label: 'Alice', value: 'Alice' },
    { label: 'Bob', value: 'Bob' },
    { label: 'Charlie', value: 'Charlie' },
    { label: 'Diana', value: 'Diana' }
  ];
  
  const openNewObjective = () => {
    setSelectedObjective({
      id: Date.now().toString(),
      title: '',
      description: '',
      progress: 0,
      keyResults: []
    });
    setEditDialog(true);
  };
  
  const openEditObjective = (objective) => {
    setSelectedObjective({...objective});
    setEditDialog(true);
  };
  
  const openNewKeyResult = (objective) => {
    setSelectedObjective({...objective});
    setSelectedKeyResult({
      id: Date.now().toString(),
      title: '',
      progress: 0,
      owner: '',
      dueDate: ''
    });
    setKrDialog(true);
  };
  
  const openEditKeyResult = (objective, keyResult) => {
    setSelectedObjective({...objective});
    setSelectedKeyResult({...keyResult});
    setKrDialog(true);
  };
  
  const saveObjective = () => {
    const newObjectives = [...objectives];
    const index = newObjectives.findIndex(o => o.id === selectedObjective.id);
    
    if (index >= 0) {
      newObjectives[index] = {...selectedObjective};
    } else {
      newObjectives.push({...selectedObjective});
    }
    
    setObjectives(newObjectives);
    setEditDialog(false);
    
    // Here you would update your backend via API call
  };
  
  const saveKeyResult = () => {
    const newObjectives = [...objectives];
    const objectiveIndex = newObjectives.findIndex(o => o.id === selectedObjective.id);
    
    if (objectiveIndex >= 0) {
      const keyResults = [...selectedObjective.keyResults];
      const krIndex = keyResults.findIndex(kr => kr.id === selectedKeyResult.id);
      
      if (krIndex >= 0) {
        keyResults[krIndex] = {...selectedKeyResult};
      } else {
        keyResults.push({...selectedKeyResult});
      }
      
      // Recalculate objective progress based on key results
      const totalProgress = keyResults.reduce((sum, kr) => sum + kr.progress, 0);
      const avgProgress = keyResults.length > 0 ? Math.round(totalProgress / keyResults.length) : 0;
      
      newObjectives[objectiveIndex] = {
        ...selectedObjective,
        keyResults,
        progress: avgProgress
      };
      
      setObjectives(newObjectives);
      setKrDialog(false);
      
      // Here you would update your backend via API call
    }
  };
  
  const deleteObjective = (objectiveId) => {
    setObjectives(objectives.filter(o => o.id !== objectiveId));
    // Here you would update your backend via API call
  };
  
  const deleteKeyResult = (objectiveId, keyResultId) => {
    const newObjectives = [...objectives];
    const objectiveIndex = newObjectives.findIndex(o => o.id === objectiveId);
    
    if (objectiveIndex >= 0) {
      const objective = newObjectives[objectiveIndex];
      const keyResults = objective.keyResults.filter(kr => kr.id !== keyResultId);
      
      // Recalculate progress
      const totalProgress = keyResults.reduce((sum, kr) => sum + kr.progress, 0);
      const avgProgress = keyResults.length > 0 ? Math.round(totalProgress / keyResults.length) : 0;
      
      newObjectives[objectiveIndex] = {
        ...objective,
        keyResults,
        progress: avgProgress
      };
      
      setObjectives(newObjectives);
      
      // Here you would update your backend via API call
    }
  };
  
  const progressTemplate = (rowData) => {
    return (
      <div>
        <ProgressBar value={rowData.progress} showValue={false} style={{ height: '8px' }} />
        <span style={{ marginLeft: '8px' }}>{rowData.progress}%</span>
      </div>
    );
  };
  
  const actionTemplate = (rowData) => {
    return (
      <div>
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-text" 
          onClick={() => openEditObjective(rowData)} 
        />
        <Button 
          icon="pi pi-plus" 
          className="p-button-rounded p-button-text" 
          onClick={() => openNewKeyResult(rowData)} 
        />
        <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-text p-button-danger" 
          onClick={() => deleteObjective(rowData.id)} 
        />
      </div>
    );
  };
  
  const krActionTemplate = (rowData, column) => {
    const objective = objectives.find(o => o.keyResults.some(kr => kr.id === rowData.id));
    
    return (
      <div>
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-text" 
          onClick={() => openEditKeyResult(objective, rowData)} 
        />
        <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-text p-button-danger" 
          onClick={() => deleteKeyResult(objective.id, rowData.id)} 
        />
      </div>
    );
  };
  
  const rowExpansionTemplate = (data) => {
    return (
      <DataTable value={data.keyResults} style={{ marginTop: '10px' }}>
        <Column field="title" header="Key Result" />
        <Column field="owner" header="Owner" />
        <Column field="dueDate" header="Due Date" />
        <Column field="progress" header="Progress" body={progressTemplate} />
        <Column body={krActionTemplate} style={{ width: '10%', textAlign: 'center' }} />
      </DataTable>
    );
  };
  
  return (
    <View style={styles.container}>
      <AppHeader title="OKR Management" 
        leftButton={{
          icon: 'pi pi-arrow-left',
          onClick: () => router.back()
        }}
      />
      
      <ScrollView style={styles.content}>
        <Card title="Objectives & Key Results" style={styles.card}>
          <Button 
            label="New Objective" 
            icon="pi pi-plus" 
            onClick={openNewObjective} 
            style={styles.button} 
          />
          
          <DataTable 
            value={objectives} 
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="id"
          >
            <Column expander style={{ width: '3em' }} />
            <Column field="title" header="Objective" />
            <Column field="description" header="Description" />
            <Column field="progress" header="Progress" body={progressTemplate} />
            <Column body={actionTemplate} style={{ width: '10%', textAlign: 'center' }} />
          </DataTable>
        </Card>
      </ScrollView>
      
      {/* Objective Edit Dialog */}
      <Dialog 
        header={selectedObjective?.id ? 'Edit Objective' : 'New Objective'} 
        visible={editDialog} 
        style={{width: '50vw'}} 
        onHide={() => setEditDialog(false)}
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setEditDialog(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={saveObjective} />
          </div>
        }
      >
        {selectedObjective && (
          <div className="p-fluid">
            <div className="p-field" style={styles.formField}>
              <label htmlFor="title">Title</label>
              <InputText 
                id="title" 
                value={selectedObjective.title} 
                onChange={(e) => setSelectedObjective({...selectedObjective, title: e.target.value})} 
                required 
              />
            </div>
            
            <div className="p-field" style={styles.formField}>
              <label htmlFor="description">Description</label>
              <InputTextarea 
                id="description" 
                value={selectedObjective.description} 
                onChange={(e) => setSelectedObjective({...selectedObjective, description: e.target.value})} 
                rows={3} 
              />
            </div>
          </div>
        )}
      </Dialog>
      
      {/* Key Result Edit Dialog */}
      <Dialog 
        header={selectedKeyResult?.id ? 'Edit Key Result' : 'New Key Result'} 
        visible={krDialog} 
        style={{width: '50vw'}} 
        onHide={() => setKrDialog(false)}
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setKrDialog(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={saveKeyResult} />
          </div>
        }
      >
        {selectedKeyResult && (
          <div className="p-fluid">
            <div className="p-field" style={styles.formField}>
              <label htmlFor="kr-title">Title</label>
              <InputText 
                id="kr-title" 
                value={selectedKeyResult.title} 
                onChange={(e) => setSelectedKeyResult({...selectedKeyResult, title: e.target.value})} 
                required 
              />
            </div>
            
            <div className="p-field" style={styles.formField}>
              <label htmlFor="kr-owner">Owner</label>
              <Dropdown 
                id="kr-owner" 
                value={selectedKeyResult.owner} 
                options={teamMembers} 
                onChange={(e) => setSelectedKeyResult({...selectedKeyResult, owner: e.value})} 
                placeholder="Select Owner" 
              />
            </div>
            
            <div className="p-field" style={styles.formField}>
              <label htmlFor="kr-duedate">Due Date</label>
              <InputText 
                id="kr-duedate" 
                value={selectedKeyResult.dueDate} 
                onChange={(e) => setSelectedKeyResult({...selectedKeyResult, dueDate: e.target.value})} 
                type="date" 
              />
            </div>
            
            <div className="p-field" style={styles.formField}>
              <label htmlFor="kr-progress">Progress: {selectedKeyResult.progress}%</label>
              <Slider 
                id="kr-progress" 
                value={selectedKeyResult.progress} 
                onChange={(e) => setSelectedKeyResult({...selectedKeyResult, progress: e.value})} 
                min={0} 
                max={100} 
              />
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
    }
  });