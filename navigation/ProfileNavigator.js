import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import styles from '../styles/Common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangeBioScreen from '../screens/ChangeBioScreen';
import FollowManagementScreen from '../screens/FollowManagementScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PostScreen from '../screens/PostScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import VoterListScreen from '../screens/VoterListScreen';
import {Platform} from 'react-native';
import TagResultsScreen from '../screens/TagResultsScreen';
import TermsOfUse from '../screens/TermsOfUse';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import CollabScreen from '../screens/CollabScreen';

const ProfileStack = createStackNavigator();

const ProfileNavigator = ({route}) => {
  const {logout} = route.params;
  return (
    <ProfileStack.Navigator
      initialRouteName="Profile"
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
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
      <ProfileStack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
      <ProfileStack.Screen
        name="Change Bio"
        component={ChangeBioScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        initialParams={{logoutFn: logout}}
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

      <ProfileStack.Screen
        name="Follow Management"
        component={FollowManagementScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
      <ProfileStack.Screen
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
      <ProfileStack.Screen
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
      <ProfileStack.Screen
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
      <ProfileStack.Screen
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
      <ProfileStack.Screen
        name="Tag Results"
        component={TagResultsScreen}
        options={{
          headerTitleAlign: 'left',
          headerBackTitleVisible: false,
          headerLeftContainerStyle: {
            position: 'relative',
            left: Platform.OS === 'ios' ? 8 : 0,
          },
        }}
      />
      <ProfileStack.Screen
        name="Terms of Use"
        component={TermsOfUse}
        options={{
          headerShown: true,
          headerLeftLabelVisible: false,
          headerTitleContainerStyle:
            styles.headerTitleInitialPageContainerStyle,
          headerLeftContainerStyle: {position: 'relative', left: 8},
        }}
      />
      <ProfileStack.Screen
        name="Privacy Policy"
        component={PrivacyPolicy}
        options={{
          headerShown: true,
          headerLeftLabelVisible: false,
          headerTitleContainerStyle:
            styles.headerTitleInitialPageContainerStyle,
          headerLeftContainerStyle: {position: 'relative', left: 8},
        }}
      />
    </ProfileStack.Navigator>
  );
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

export default ProfileNavigator;
