import React from 'react';
import {ActivityIndicator, View} from 'react-native';

const LoadingOverlay = () => {
  return (
    <View
      style={{
        backgroundColor: '#EFEFEF',
        width: '100%',
        height: '100%',
        zIndex: 100000,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color="grey" />
    </View>
  );
};

export default LoadingOverlay;
