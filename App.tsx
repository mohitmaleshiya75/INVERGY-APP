import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { UserHomeScreen } from './src/screens/user/UserHomeScreen';
import { ProfileScreen } from './src/screens/user/ProfileScreen';
import { CategorySelectScreen } from './src/screens/user/CategorySelectScreen';
import { RaiseComplaintScreen } from './src/screens/user/RaiseComplaintScreen';
import { ComplaintDetailScreen } from './src/screens/user/ComplaintDetailScreen';
import { AdminDashboardScreen } from './src/screens/admin/AdminDashboardScreen';

const MainNavigator: React.FC = () => {
  const { currentScreen, setCurrentScreen, role, userTab } = useApp();

  const getHeaderProps = () => {
    switch (currentScreen) {
      case 'CATEGORY_SELECT':
        return {
          title: 'Select Problem Category',
          showBack: true,
          onBack: () => setCurrentScreen('USER_MAIN'),
        };
      case 'RAISE_COMPLAINT':
        return {
          title: 'Raise Support Query',
          showBack: true,
          onBack: () => setCurrentScreen('CATEGORY_SELECT'),
        };
      case 'COMPLAINT_DETAIL':
        return {
          title: 'Query & Admin Chat',
          showBack: true,
          onBack: () => setCurrentScreen('USER_MAIN'),
        };
      case 'USER_MAIN':
      case 'ADMIN_HOME':
      default:
        return { title: undefined, showBack: false };
    }
  };

  const headerProps = getHeaderProps();

  const renderScreen = () => {
    // Role: ADMIN
    if (role === 'ADMIN') {
      return <AdminDashboardScreen />;
    }

    // Role: END_USER
    switch (currentScreen) {
      case 'CATEGORY_SELECT':
        return <CategorySelectScreen />;
      case 'RAISE_COMPLAINT':
        return <RaiseComplaintScreen />;
      case 'COMPLAINT_DETAIL':
        return <ComplaintDetailScreen />;
      case 'USER_MAIN':
      default:
        // Render according to the selected user tab
        if (userTab === 'PROFILE') {
          return <ProfileScreen />;
        }
        return <UserHomeScreen />;
    }
  };

  return (
    <View style={styles.appContainer}>
      <StatusBar style="dark" />
      <Header
        title={headerProps.title}
        showBack={headerProps.showBack}
        onBack={headerProps.onBack}
      />
      <View style={styles.screenContainer}>{renderScreen()}</View>
    </View>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  screenContainer: {
    flex: 1,
  },
});
