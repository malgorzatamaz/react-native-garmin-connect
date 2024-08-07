import React from 'react';
import { AnimationView } from './screens/AnimationView';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { DeviceManager } from './screens/DeviceManager/DeviceManager';
import { ChartView } from './screens/ChartView';
import useDeviceConnection from './hooks/useDeviceConnection';
import { PaperProvider } from 'react-native-paper';

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  useDeviceConnection();

  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="DeviceManager">
          <Tab.Screen
            name="DeviceManager"
            options={{
              tabBarLabel: 'Devices',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="devices"
                  color={color}
                  size={26}
                />
              ),
            }}
            component={DeviceManager}
          />
          <Tab.Screen
            name="ChartView"
            options={{
              tabBarLabel: 'Chart',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="chart-areaspline-variant"
                  color={color}
                  size={26}
                />
              ),
            }}
            component={ChartView}
          />
          <Tab.Screen
            name="AnimationView"
            options={{
              tabBarLabel: 'Animation',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="bike" color={color} size={26} />
              ),
            }}
            component={AnimationView}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
