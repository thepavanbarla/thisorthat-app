import React from 'react';
import {Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';

function CustomSplashScreen({navigation}) {
  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        paddingVertical: 0,
        justifyContent: 'center',
      }}>
      <Image
        style={{flex: 1, width: '100%', aspectRatio: 1080 / 2277}}
        source={require('../assets/images/splashx3.png')}
      />
    </View>
  );
}

export default CustomSplashScreen;
