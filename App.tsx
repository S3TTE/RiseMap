import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { PrimeReactProvider } from 'primereact/api';
import { Slot } from 'expo-router';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';

export default function App() {
  return (
    <PrimeReactProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <Slot />
      </SafeAreaView>
    </PrimeReactProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});