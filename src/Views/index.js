import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AppContext from '../Helpers/Context';

import Calendar from '../Views/Calendar';
import EventDetail from '../Views/Calendar/EventDetail';
import CreateEvent from '../Views/Calendar/CreateEvent';
import EditEvent from '../Views/Calendar/EditEvent';

import Events from '../Views/Events';

import Notifications from '../Views/Notifications';
import About from '../Views/About';
import Settings from '../Views/Settings';

export default function Main() {

  const { color } = useContext(AppContext);

  const CStack = createNativeStackNavigator();
  const EStack = createNativeStackNavigator();
  const NStack = createNativeStackNavigator();
  const SStack = createNativeStackNavigator();

  const stackOptions = ({ navigation, route }) => ({
    headerStyle: { backgroundColor: color.primary },
    headerTitleAlign: 'center',
    headerTintColor: '#fff'
  });

  function CalendarStack() {
    return (
      <CStack.Navigator>
        <CStack.Screen
          name="Calendar"
          component={Calendar}
          options={stackOptions}
        />
        <CStack.Screen
          name="Event"
          component={EventDetail}
          options={{
            headerStyle: { backgroundColor: color.primary },
            headerTintColor: '#fff',
          }}
        />
        <CStack.Screen
          name="Create Event"
          component={CreateEvent}
          options={{
            headerStyle: { backgroundColor: color.primary },
            headerTintColor: '#fff',
          }}
        />
        <CStack.Screen
          name="Edit Event"
          component={EditEvent}
          options={{
            headerStyle: { backgroundColor: color.primary },
            headerTintColor: '#fff',
          }}
        />
      </CStack.Navigator>
    );
  }

  function EventsStack() {
    return (
      <EStack.Navigator>
        <EStack.Screen
          name="Events"
          component={Events}
          options={stackOptions}
        />
      </EStack.Navigator>
    );
  }

  function NotificationsStack() {
    return (
      <NStack.Navigator>
        <NStack.Screen
          name="Notiications"
          component={Notifications}
          options={stackOptions}
        />
      </NStack.Navigator>
    );
  }

  function SettingsStack() {
    return (
      <SStack.Navigator>
        <SStack.Screen
          name="Settings"
          component={Settings}
          options={stackOptions}
        />
        <SStack.Screen
          name="About"
          component={About}
          options={stackOptions}
        />
      </SStack.Navigator>
    );
  }

  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Calendar Screen"
          component={CalendarStack}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <Ionicons name="calendar-outline" size={24} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Events Screen"
          component={EventsStack}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <Ionicons name="list-circle-outline" size={24} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Notifications Screen"
          component={NotificationsStack}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <Ionicons name="notifications-outline" size={24} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Settings Screen"
          component={SettingsStack}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <Ionicons name="cog-outline" size={24} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
