import 'react-native-gesture-handler';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import styles from '../styles/Common';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FollowManagementScreen from '../screens/FollowManagementScreen';
import PostScreen from '../screens/PostScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import VoterListScreen from '../screens/VoterListScreen';
import TagResultsScreen from '../screens/TagResultsScreen';
import {Platform} from 'react-native';
import CollabScreen from '../screens/CollabScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const NotificationStack = createStackNavigator();

const ExploreNavigator = () => {
  return (
    <NotificationStack.Navigator
      initialRouteName="Notifications"
      backBehavior="history"
      screenOptions={{
        animationEnabled: false,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerTitleContainerStyle: styles.headerTitleStackedPageContainerStyle,
        headerBackImage: () => (
          <Ionicons name="chevron-back-outline" size={30} color={'#121212'} />
        ),
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <NotificationStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={({navigation, route}) =>
          notificationsScreenOptionsBuilder(navigation, route)
        }
      />
      <NotificationStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
      <NotificationStack.Screen
        name="Follow Management"
        component={FollowManagementScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
      <NotificationStack.Screen
        name="Post"
        component={PostScreen}
        options={{
          headerShown: true,
          animationEnabled: true,
          headerBackTitleVisible: false,
          headerTitleContainerStyle: {marginLeft: 0},
          headerLeftContainerStyle: {
            position: 'relative',
            left: Platform.OS === 'ios' ? 8 : 0,
          },
        }}
      />
      <NotificationStack.Screen
        name="Analyze Results"
        component={AnalyticsScreen}
        options={{
          headerShown: true,
          animationEnabled: true,
          headerBackTitleVisible: false,
          headerTitleContainerStyle: {marginLeft: 0},
          headerLeftContainerStyle: {
            position: 'relative',
            left: Platform.OS === 'ios' ? 8 : 0,
          },
        }}
      />
      <NotificationStack.Screen
        name="Collab"
        component={CollabScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          headerBackTitleVisible: false,
          headerTitleContainerStyle: {marginLeft: 0},
          headerLeftContainerStyle: {
            position: 'relative',
            left: Platform.OS === 'ios' ? 8 : 0,
          },
        }}
      />
      <NotificationStack.Screen
        name="Voters"
        component={VoterListScreen}
        options={{
          headerShown: true,
          animationEnabled: true,
          headerBackTitleVisible: false,
          headerTitleContainerStyle: {marginLeft: 0},
          headerLeftContainerStyle: {
            position: 'relative',
            left: Platform.OS === 'ios' ? 8 : 0,
          },
        }}
      />
      <NotificationStack.Screen
        name="Tag Results"
        component={TagResultsScreen}
        options={{
          headerTitleAlign: 'left',
          headerBackTitleVisible: false,
          headerTitleContainerStyle: {marginLeft: 0},
          headerLeftContainerStyle: {
            position: 'relative',
            left: Platform.OS === 'ios' ? 8 : 0,
          },
        }}
      />
      <NotificationStack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
    </NotificationStack.Navigator>
  );
};

const notificationsScreenOptionsBuilder = (navigation, route) => {
  return {
    headerTitleAlign: route.name == 'Notifications' ? 'left' : 'center',
  };
};

const profileNavOptionsBuilder = (navigation, route) => {
  return {
    headerTitleAlign: route.name === 'Profile' ? 'left' : 'center',
    headerShown: route.name === 'Profile' ? false : true,
    headerBackTitleVisible: false,
    headerStyle:
      route.name === 'Profile'
        ? {height: 48, shadowColor: 'rgba(255, 255, 255, 0)'}
        : {},
    headerLeftContainerStyle: {
      position: 'relative',
      left: Platform.OS === 'ios' ? 8 : 0,
    },
  };
};

export default ExploreNavigator;
