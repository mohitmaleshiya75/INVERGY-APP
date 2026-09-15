import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { AuthScreen } from './src/screens/auth/AuthScreen';
import { UserHomeScreen } from './src/screens/user/UserHomeScreen';
import { CategorySelectScreen } from './src/screens/user/CategorySelectScreen';
import { RaiseComplaintScreen } from './src/screens/user/RaiseComplaintScreen';
import { ComplaintDetailScreen } from './src/screens/user/ComplaintDetailScreen';
import { AdminDashboardScreen } from './src/screens/admin/AdminDashboardScreen';
import { EmployeeDashboardScreen } from './src/screens/employee/EmployeeDashboardScreen';

const MainNavigator: React.FC = () => {
  const { currentScreen, setCurrentScreen, role } = useApp();

  const getHeaderProps = () => {
    switch (currentScreen) {
      case 'AUTH':
        return {
          title: 'User Registration & Roles',
          showBack: true,
          onBack: () => {
            if (role === 'END_USER') setCurrentScreen('USER_HOME');
            else if (role === 'ADMIN') setCurrentScreen('ADMIN_HOME');
            else setCurrentScreen('EMPLOYEE_HOME');
          },
        };
      case 'CATEGORY_SELECT':
        return {
          title: 'Select Problem Category',
          showBack: true,
          onBack: () => setCurrentScreen('USER_HOME'),
        };
      case 'RAISE_COMPLAINT':
        return {
          title: 'Raise Support Complaint',
          showBack: true,
          onBack: () => setCurrentScreen('CATEGORY_SELECT'),
        };
      case 'COMPLAINT_DETAIL':
        return {
          title: 'Complaint & Repair Progress',
          showBack: true,
          onBack: () => setCurrentScreen('USER_HOME'),
        };
      case 'USER_HOME':
        return { title: undefined, showBack: false };
      case 'ADMIN_HOME':
        return { title: undefined, showBack: false };
      case 'EMPLOYEE_HOME':
        return { title: undefined, showBack: false };
      default:
        return { title: undefined, showBack: false };
    }
  };

  const headerProps = getHeaderProps();

  const renderScreen = () => {
    // If user clicked Profile/Register button
    if (currentScreen === 'AUTH') {
      return <AuthScreen />;
    }

    // Role-specific screens
    if (role === 'ADMIN') {
      return <AdminDashboardScreen />;
    }

    if (role === 'EMPLOYEE') {
      return <EmployeeDashboardScreen />;
    }

    // Default: END_USER screens
    switch (currentScreen) {
      case 'CATEGORY_SELECT':
        return <CategorySelectScreen />;
      case 'RAISE_COMPLAINT':
        return <RaiseComplaintScreen />;
      case 'COMPLAINT_DETAIL':
        return <ComplaintDetailScreen />;
      case 'USER_HOME':
      default:
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
