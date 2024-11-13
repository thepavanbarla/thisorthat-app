import React, {useEffect, useState} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform, Text} from 'react-native';
import FeedNavigator from './FeedNavigator';
import ExploreNavigator from './ExploreNavigator';
import NotificationsNavigator from './NotificationsNavigator';
import ProfileNavigator from './ProfileNavigator';
import CreateNavigator from './CreateNavigator';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {Home, Search, PlusCircle, Bell} from 'react-native-feather';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {ReloadContext} from '../contexts/ReloadContext';

const Tab = createBottomTabNavigator();

function MainAppNavigator({route}) {
  const {logout} = route.params;
  const [tabSelected, setTabSelected] = useState(
    route.params.tabSelected || 'FeedNav',
  );

  const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (!routeName) {
      return true;
    }
    const hideOnScreens = ['Collab'];
    if (hideOnScreens.indexOf(routeName) > -1) {
      console.log(routeName, 'Hiding bar...');
      return {display: 'none'};
    }
    console.log(routeName, 'Showing bar...');
    return {display: 'flex'};
  };

  const [reloadFeed, setReloadFeed] = useState(false);

  return (
    <ReloadContext.Provider value={{reloadFeed, setReloadFeed}}>
      <Tab.Navigator
        backBehavior="history"
        screenOptions={({route, size, color}) => ({
          lazy: false,
          tabBarIcon: ({focused}) => {
            let color = focused ? '#6631F7' : '#898989';
            let iconName;
            let iconSize = 28;
            if (route.name === 'FeedNav') {
              return (
                <Home strokeWidth={1.8} stroke={color} width={24} height={24} />
              );
            } else if (route.name === 'ExploreNav') {
              return (
                <Search
                  stroke={color}
                  strokeWidth={1.8}
                  height={24}
                  width={24}
                />
              );
            } else if (route.name === 'CreateNav') {
              return (
                <PlusCircle
                  strokeWidth={1.8}
                  stroke={color}
                  width={25}
                  height={25}
                />
              );
            } else if (route.name === 'NotificationsNav') {
              return (
                <Bell
                  style={{position: 'relative', top: 1}}
                  strokeWidth={1.8}
                  stroke={color}
                  width={25}
                  height={25}
                />
              );
            } else if (route.name === 'ProfileNav') {
              iconName = 'person-circle-outline';
            }
            return (
              <Ionicons
                name={iconName}
                size={iconSize}
                color={focused ? '#6631F7' : '#898989'}
              />
            );
          },
          headerShown: false,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'grey',
          tabBarShowLabel: false,
          tabBarStyle:
            Platform.OS === 'ios'
              ? {}
              : {
                  height: 54,
                },
        })}>
        <Tab.Screen
          name="FeedNav"
          component={FeedNavigator}
          options={({route}) => ({
            tabBarStyle: getTabBarVisibility(route),
          })}
          listeners={({route, navigation}) => ({
            tabPress: e => {
              setTabSelected('FeedNav');
            },
          })}
        />
        <Tab.Screen
          name="ExploreNav"
          component={ExploreNavigator}
          options={({route}) => ({
            tabBarStyle: getTabBarVisibility(route),
          })}
          listeners={({route, navigation}) => ({
            tabPress: e => {
              setTabSelected('ExploreNav');
            },
          })}
        />
        <Tab.Screen
          name="CreateNav"
          component={CreateNavigator}
          options={{
            tabBarStyle: {display: 'none'},
          }}
          listeners={({route, navigation}) => ({
            tabPress: e => {
              // e.preventDefault();
              setTabSelected('CreateNav');
            },
          })}
        />
        <Tab.Screen
          name="NotificationsNav"
          component={NotificationsNavigator}
          options={({route}) => ({
            tabBarStyle: getTabBarVisibility(route),
          })}
          listeners={({route, navigation}) => ({
            tabPress: e => {
              if (tabSelected === 'NotificationsNav') {
                if (route?.state?.routes?.length > 1) {
                  e.preventDefault();
                }
                try {
                  navigation.navigate('Notifications');
                } catch (error) {
                  navigation.navigate('NotificationsNav');
                }
              }
              setTabSelected('NotificationsNav');
            },
          })}
        />
        <Tab.Screen
          name="ProfileNav"
          component={ProfileNavigator}
          initialParams={{logout}}
          options={({route}) => ({
            tabBarStyle: getTabBarVisibility(route),
          })}
          listeners={({route, navigation}) => ({
            tabPress: e => {
              setTabSelected('ProfileNav');
            },
          })}
        />
      </Tab.Navigator>
    </ReloadContext.Provider>
  );
}

export default MainAppNavigator;
