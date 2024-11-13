import React from 'react';
import {StyleSheet} from 'react-native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FollowersTab from '../components/FollowersTab';
import FollowingTab from '../components/FollowingTab';

const FollowManagementTab = createMaterialTopTabNavigator();
function FollowManagementScreen({route}) {
  const {userId, followerCount, followingCount} = route.params;

  return (
    <FollowManagementTab.Navigator
      screenOptions={{
        showIcon: false,
        showLabel: true,
        indicatorStyle: localStyles.indicatorStyle,
        tabBarLabelStyle: localStyles.labelStyle,
      }}
      style={localStyles.tabStyle}>
      <FollowManagementTab.Screen
        name="Followers"
        component={FollowersTab}
        initialParams={{userId: userId}}
        options={{title: followerCount + ' Followers'}}
      />
      <FollowManagementTab.Screen
        name="Following"
        component={FollowingTab}
        initialParams={{userId: userId}}
        options={{title: followingCount + ' Following'}}
      />
    </FollowManagementTab.Navigator>
  );
}

const localStyles = StyleSheet.create({
  tabStyle: {
    borderTopWidth: 0.3,
    borderTopColor: '#cdcdcd',
    textTransform: 'none',
  },
  labelStyle: {
    fontWeight: '600',
    fontSize: 15.5,
    textTransform: 'capitalize',
    letterSpacing: -0.2,
  },
  indicatorStyle: {
    backgroundColor: '#343434',
    height: 1.6,
  },
});

export default FollowManagementScreen;
