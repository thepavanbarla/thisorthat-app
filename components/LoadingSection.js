import React from 'react';
import {ActivityIndicator, View} from 'react-native';

const LoadingSection = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 60,
        zIndex: 100000,
      }}>
      <ActivityIndicator size="large" color="grey" />
    </View>
  );
};

export default LoadingSection;
