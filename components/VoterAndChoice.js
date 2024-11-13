import React from 'react';
import {View, Text, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {assetsUrl} from '../services/Constants';
import {getSmall} from '../utils/ConversionUtils';

function VoterAndChoice(props) {
  const {navigateToProfile, focusOptionFn} = props;

  const navigateToProfileFn = () => {
    navigateToProfile(props.vote.userDetails.userId);
  };

  const focusOption = () => {
    focusOptionFn(props.vote.option);
  };

  return (
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
      <Pressable
        onPress={navigateToProfileFn}
        activeOpacity={0.6}
        delayPressIn={0}>
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
      </Pressable>
      <View
        style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}>
        <Pressable
          onPress={navigateToProfileFn}
          activeOpacity={0.6}
          delayPressIn={0}>
          <Text
            style={{
              paddingLeft: 10,
              fontSize: 15,
              lineHeight: 22,
              fontWeight: '500',
            }}>
            {props.vote.userDetails.userName}
          </Text>

          {props.vote.option.title.trim() !== '' && (
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 12,
                lineHeight: 18,
                color: 'grey',
                fontWeight: '400',
              }}>
              Voted for {props.vote.option.title}
            </Text>
          )}
        </Pressable>
      </View>

      {props.vote.option.picture !== null && (
        <Pressable onPress={focusOption} activeOpacity={0.8}>
          <FastImage
            source={{uri: assetsUrl + getSmall(props.vote.option.picture)}}
            style={{height: 48, width: 48, borderRadius: 4}}
          />
        </Pressable>
      )}
    </View>
  );
}

export default VoterAndChoice;
