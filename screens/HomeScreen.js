import React, {useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FeedScreen from './FeedScreen';
import ExploreScreen from './ExploreScreen';
import {SafeAreaView} from 'react-native';
import {ReloadContext} from '../contexts/ReloadContext';

const HomeTab = createMaterialTopTabNavigator();

const HomeScreen = ({navigation, route}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <HomeTab.Navigator
        sceneContainerStyle={{
          height: '100%',
        }}
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 15,
            textTransform: 'capitalize',
            fontWeight: '600',
          },
          tabBarActiveTintColor: '#121212',
          tabBarInactiveTintColor: '#ABABAB',
          tabBarIndicatorContainerStyle: {
            marginHorizontal: 45,
            paddingHorizontal: 90,
          },
          tabBarIndicatorStyle: {
            height: 3,
            borderRadius: 2,
            backgroundColor: '#6631F7',
          },
          tabBarContentContainerStyle: {},
        }}>
        <HomeTab.Screen name="For You" component={ExploreScreen} />
        <HomeTab.Screen name="Following" component={FeedScreen} />
      </HomeTab.Navigator>
    </SafeAreaView>
  );
};

export default HomeScreen;
