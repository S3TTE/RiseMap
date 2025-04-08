// components/ProductivityInsights.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const ProductivityInsights = ({ insights, onShowInsight }) => {
  const getInsightIcon = (type) => {
    switch(type) {
      case 'positive': return 'pi pi-arrow-up';
      case 'warning': return 'pi pi-exclamation-triangle';
      case 'info': return 'pi pi-info-circle';
      default: return 'pi pi-chart-line';
    }
  };
  
  const getInsightColor = (type) => {
    switch(type) {
      case 'positive': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'info': return '#2196f3';
      default: return '#9c27b0';
    }
  };
  
  return (
    <View style={styles.container}>
      {insights.length === 0 ? (
        <div style={styles.noData}>No insights available at the moment.</div>
      ) : (
        insights.map(insight => (
          <Card key={insight.id} style={styles.insightCard}>
            <div style={styles.insightHeader}>
              <div 
                style={{
                  ...styles.insightIcon,
                  backgroundColor: getInsightColor(insight.type)
                }}
              >
                <i className={getInsightIcon(insight.type)} style={styles.icon}></i>
              </div>
              <div style={styles.insightTitle}>{insight.title}</div>
            </div>
            <div style={styles.insightDescription}>{insight.description}</div>
            <Button 
              label="View Details" 
              className="p-button-text" 
              onClick={() => onShowInsight(insight)} 
            />
          </Card>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  insightCard: {
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  insightHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    color: '#ffffff',
    fontSize: 16,
  },
  insightTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  insightDescription: {
    marginBottom: 16,
    color: '#555',
  },
  noData: {
    padding: 24,
    textAlign: 'center',
    color: '#666',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  }
});

export default ProductivityInsights;