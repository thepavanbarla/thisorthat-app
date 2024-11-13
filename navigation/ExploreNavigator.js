import 'react-native-gesture-handler';
import React from 'react';
import {View, StyleSheet, Platform, Pressable} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import styles from '../styles/Common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExploreScreen from '../screens/ExploreScreen';
import SearchScreen from '../screens/SearchScreen';
import TagResultsScreen from '../screens/TagResultsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FollowManagementScreen from '../screens/FollowManagementScreen';
import PostScreen from '../screens/PostScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import VoterListScreen from '../screens/VoterListScreen';
import CollabScreen from '../screens/CollabScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import {Search} from 'react-native-feather';

const ExploreStack = createStackNavigator();

const ExploreNavigator = () => {
  const [searchText, setSearchText] = React.useState();

  return (
    <ExploreStack.Navigator
      initialRouteName="Search"
      backBehavior="history"
      screenOptions={{
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerTitleContainerStyle: styles.headerTitleStackedPageContainerStyle,
        headerBackImage: () => (
          <Ionicons name="chevron-back-outline" size={30} color={'#121212'} />
        ),
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      {/* <ExploreStack.Screen
        name="Explore"
        component={ExploreScreen}
        options={({navigation, route}) =>
          exploreScreenOptionsBuilder(navigation, route)
        }
      /> */}
      <ExploreStack.Screen
        name="Tag Results"
        component={TagResultsScreen}
        options={({navigation, route}) =>
          exploreScreenOptionsBuilder(navigation, route)
        }
      />
      <ExploreStack.Screen
        name="Search"
        component={SearchScreen}
        initialParams={{searchText}}
        options={({navigation}) => {
          return {
            headerTitleAlign: 'left',
            headerStyle: localStyles.searchHeader,
            headerTitleContainerStyle: {marginLeft: 0},
            headerLeftContainerStyle: {
              position: 'relative',
              left: Platform.OS === 'ios' ? 8 : 0,
            },
            headerBackTitleVisible: false,
            headerBackImage: () => <></>,
          };
        }}
      />
      <ExploreStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
      <ExploreStack.Screen
        name="Follow Management"
        component={FollowManagementScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
      <ExploreStack.Screen
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
      <ExploreStack.Screen
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
      <ExploreStack.Screen
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
      <ExploreStack.Screen
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
      <ExploreStack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={({navigation, route}) =>
          profileNavOptionsBuilder(navigation, route)
        }
      />
    </ExploreStack.Navigator>
  );
};

const exploreScreenOptionsBuilder = (navigation, route) => {
  return {
    headerTitleAlign: 'left',
    headerBackTitleVisible: false,
    headerTitleContainerStyle: {
      marginLeft:
        route.name === 'Explore' || route.name === 'Tag Results' ? 16 : 0,
    },
    headerLeftContainerStyle: {
      position: 'relative',
      left: Platform.OS === 'ios' ? 8 : 0,
    },
    headerRight: () => {
      return (
        <View style={{marginRight: 16}}>
          {route.name === 'Explore' && (
            <Pressable
              onPress={() => {
                navigation.navigate('Search');
              }}>
              <Search
                stroke={'#121212'}
                strokeWidth={2.4}
                height={22}
                width={22}
              />
            </Pressable>
          )}
        </View>
      );
    },
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

const localStyles = StyleSheet.create({
  searchHeader: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  searchInput: {
    fontSize: 16,
    fontWeight: '500',
    width: '100%',
    color: '#565656',
  },
});

export default ExploreNavigator;
