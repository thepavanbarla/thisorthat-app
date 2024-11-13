import 'react-native-gesture-handler';
import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import styles from '../styles/Common';
import ProfileScreen from '../screens/ProfileScreen';
import FollowManagementScreen from '../screens/FollowManagementScreen';
import PostScreen from '../screens/PostScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import VoterListScreen from '../screens/VoterListScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TagResultsScreen from '../screens/TagResultsScreen';
import CollabScreen from '../screens/CollabScreen';
import NewPostScren from '../screens/NewPostScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import HomeScreen from '../screens/HomeScreen';

const FeedStack = createStackNavigator();

const FeedNavigator = () => {
  return (
    <FeedStack.Navigator
      initialRouteName="TOT"
      backBehavior="history"
      screenOptions={{
        headerTitleStyle: {alignSelf: 'flex-start'},
        headerTitleContainerStyle: styles.headerTitleStackedPageContainerStyle,
        headerBackImage: () => (
          <Ionicons name="chevron-back-outline" size={30} color={'#121212'} />
        ),
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <FeedStack.Screen
        name="TOT"
        component={HomeScreen}
        options={({navigation, route}) =>
          feedScreenOptionsBuilder(navigation, route)
        }
      />
      <FeedStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
      <FeedStack.Screen
        name="Follow Management"
        component={FollowManagementScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
      <FeedStack.Screen
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
      <FeedStack.Screen
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
      <FeedStack.Screen
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
      <FeedStack.Screen
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
      <FeedStack.Screen
        name="NewPost"
        component={NewPostScren}
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
      <FeedStack.Screen
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
      <FeedStack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
    </FeedStack.Navigator>
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

const feedScreenOptionsBuilder = (navigation, route) => {
  return {
    headerTitleContainerStyle: styles.headerTitleInitialPageContainerStyle,
    headerTitleAlign: route.name === 'TOT' ? 'left' : 'center',
    title: route.name === 'TOT' ? '' : route.name,
    headerShown: false,
    // TODO: Implement Messaging to Uncomment
    // headerRight: () => {
    //   return (
    //     <View style={{marginRight: 16}}>
    //       {route.name == 'TOT' && (
    //         <Pressable
    //           onPress={() => {
    //             navigation.push('NewPost');
    //           }}>
    //           <Ionicons
    //             name="chatbubble-ellipses-outline"
    //             size={26}
    //             color={'#121212'}
    //           />
    //         </Pressable>
    //       )}
    //     </View>
    //   );
    // },
    // headerLeft: () => {
    //   return (
    //     <Image
    //       source={require('../assets/images/this_or_that.png')}
    //       style={{marginLeft: 16, width: 100, resizeMode: 'contain'}}
    //     />
    //   );
    // },
  };
};

export default FeedNavigator;
