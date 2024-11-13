import React from 'react';
import {ActivityIndicator, View} from 'react-native';

const LoadingView = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 100000,
      }}>
      <ActivityIndicator size="large" color="grey" />
    </View>
  );
};

export default LoadingView;
