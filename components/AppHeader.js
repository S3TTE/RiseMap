// components/AppHeader.js

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

const AppHeader = ({ title, leftButton }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {leftButton && (
          <Button 
            icon={leftButton.icon} 
            className="p-button-rounded p-button-text" 
            onClick={leftButton.onClick} 
          />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.headerRight}>
        <Button 
          icon="pi pi-bell" 
          className="p-button-rounded p-button-text" 
          onClick={() => {}}
          badge="3" 
          badgeClassName="p-badge-danger" 
        />
        <Button 
          icon="pi pi-cog" 
          className="p-button-rounded p-button-text" 
          onClick={() => {}}
        />
        <Avatar 
          label="U" 
          shape="circle" 
          style={{ backgroundColor: '#4caf50', color: '#ffffff' }} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  }
});

export default AppHeader;