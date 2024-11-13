import React from 'react';
import {View, Text, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {assetsUrl} from '../services/Constants';
import {getSmall} from '../utils/ConversionUtils';

function Voter(props) {
  const {navigateToProfile} = props;

  const navigateToProfileFn = () => {
    navigateToProfile(props.vote.userDetails.userId);
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
          paddingHorizontal: 0,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#EFEFEF',
        }}>
        <FastImage
          source={
            props.vote.userDetails.profilePicture == null
              ? require('../assets/images/profile_picture_placeholder-thumb.png')
              : {
                  uri:
                    assetsUrl + getSmall(props.vote.userDetails.profilePicture),
                }
          }
          style={{
            height: 36,
            width: 36,
            borderRadius: 12,
          }}
        />
        <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
          <Text
            style={{
              paddingLeft: 10,
              fontSize: 15,
              lineHeight: 22,
              fontWeight: '500',
            }}>
            {props.vote.userDetails.userName}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default Voter;
