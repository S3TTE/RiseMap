import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'expo-router';
import TeamOverview from '../components/TeamOverview';
import KanbanBoard from '../components/KanbanBoard';
import RecentNotes from '../components/RecentNotes';
import ProductivityInsights from '../components/ProductivityInsights';
import AppHeader from '../components/AppHeader';

// Dummy data - replace with your API calls
import { teamMembers, projects, notes } from '../data/mockData';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [insightDialogVisible, setInsightDialogVisible] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const router = useRouter();

  const showInsight = (insight) => {
    setSelectedInsight(insight);
    setInsightDialogVisible(true);
  };

  const insights = [
    {
      id: 1,
      title: "Team Velocity Trend",
      description: "Your team's velocity has increased by 15% in the last sprint. Consider sharing successful practices across projects.",
      type: "positive"
    },
    {
      id: 2,
      title: "OKR Progress Alert",
      description: "The 'Customer Satisfaction' key result is falling behind schedule. Consider allocating more resources to this area.",
      type: "warning"
    },
    {
      id: 3,
      title: "Workload Distribution",
      description: "Workload appears unevenly distributed. Team members A and C might benefit from task redistribution.",
      type: "info"
    }
  ];

  return (
    <View style={styles.container}>
      <AppHeader title="Team Productivity Dashboard" />
      
      <ScrollView style={styles.content}>
        <Card title="Team Overview" style={styles.card}>
          <TeamOverview teamData={teamMembers} />
          <Button 
            label="View Team Details" 
            icon="pi pi-users" 
            className="p-button-outlined" 
            onClick={() => router.push('/team')}
            style={styles.button}
          />
        </Card>

        <Card title="Productivity Insights" style={styles.card}>
          <ProductivityInsights insights={insights} onShowInsight={showInsight} />
        </Card>
        
        <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
          <TabPanel header="Project Kanban">
            <KanbanBoard projects={projects} />
          </TabPanel>
          <TabPanel header="Recent Notes">
            <RecentNotes notes={notes} />
          </TabPanel>
          <TabPanel header="OKRs & KPIs">
            <Button 
              label="Manage OKRs" 
              icon="pi pi-chart-line" 
              style={styles.button} 
              onClick={() => router.push('/okrs')}
            />
            <Button 
              label="Manage KPIs" 
              icon="pi pi-chart-bar" 
              style={styles.button} 
              onClick={() => router.push('/kpis')}
            />
          </TabPanel>
        </TabView>
      </ScrollView>

      <Dialog 
        header={selectedInsight?.title} 
        visible={insightDialogVisible} 
        style={{width: '50vw'}} 
        onHide={() => setInsightDialogVisible(false)}
      >
        <p>{selectedInsight?.description}</p>
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
    margin: 8,
  }
});