import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {assetsUrl} from '../services/Constants';
import {getSmall} from '../utils/ConversionUtils';

function SearchUser(props) {
  const navigation = useNavigation();

  const navigateToProfileFn = () => {
    navigation.push('Profile', {userId: props.user.userId});
  };

  return (
    <Pressable
      onPress={navigateToProfileFn}
      activeOpacity={0.6}
      delayPressIn={0}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 8,
          backgroundColor: '#FFFFFF',
        }}>
        <FastImage
          source={
            props.user.profilePicture == null
              ? require('../assets/images/profile_picture_placeholder-thumb.png')
              : {uri: assetsUrl + getSmall(props.user.profilePicture)}
          }
          style={{
            height: 36,
            width: 36,
            borderRadius: 12,
            borderColor: '#CDCDCD',
            borderWidth: 1,
          }}
        />
        <View
          style={{
            paddingLeft: 10,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              fontSize: 15,
              lineHeight: 20,
              fontWeight: '500',
            }}>
            {props.user.userName}
          </Text>
          <Text
            style={{
              fontSize: 13,
              lineHeight: 18,
              color: 'grey',
              fontWeight: '400',
            }}>
            {props.user.fullName}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default SearchUser;
