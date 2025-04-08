import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { DataView } from 'primereact/dataview';

const TeamOverview = ({ teamData }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'meeting': return 'info';
      case 'offline': return 'danger';
      default: return 'secondary';
    }
  };
  
  const getStatusLabel = (status) => {
    switch(status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'meeting': return 'In Meeting';
      case 'offline': return 'Offline';
      default: return status;
    }
  };
  
  const itemTemplate = (item) => {
    return (
      <div className="p-col-12 p-md-6 p-lg-4">
        <div style={styles.memberCard}>
          <div style={styles.memberHeader}>
            <Avatar 
              label={item.name.charAt(0)} 
              style={{ backgroundColor: item.avatarColor || '#2196f3', color: '#ffffff' }} 
              shape="circle" 
              size="large" 
            />
            <div style={styles.memberInfo}>
              <div style={styles.memberName}>{item.name}</div>
              <div style={styles.memberRole}>{item.role}</div>
              <Tag 
                value={getStatusLabel(item.status)} 
                severity={getStatusColor(item.status)} 
                style={styles.statusTag} 
              />
            </div>
          </div>
          
          <div style={styles.progressSection}>
            <div style={styles.progressItem}>
              <div style={styles.progressLabel}>
                <span>Current Tasks: {item.currentTasks}/{item.totalTasks}</span>
              </div>
              <ProgressBar 
                value={(item.currentTasks / item.totalTasks) * 100} 
                showValue={false} 
                style={styles.progressBar} 
              />
            </div>
            
            <div style={styles.progressItem}>
              <div style={styles.progressLabel}>
                <span>OKR Progress: {item.okrProgress}%</span>
              </div>
              <ProgressBar 
                value={item.okrProgress} 
                showValue={false} 
                style={styles.progressBar} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <DataView 
      value={teamData} 
      layout="grid" 
      itemTemplate={itemTemplate} 
      paginator 
      rows={6} 
    />
  );
};

const styles = StyleSheet.create({
  memberCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    margin: 8,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberInfo: {
    marginLeft: 16,
    flex: 1,
  },
  memberName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  memberRole: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  statusTag: {
    alignSelf: 'flex-start',
  },
  progressSection: {
    marginTop: 8,
  },
  progressItem: {
    marginBottom: 8,
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBar: {
    height: '8px',
  }
});

export default TeamOverview;