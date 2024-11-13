import React from 'react';
import {View, Image, Text, Pressable} from 'react-native';

import styles from '../styles/Common';
import {useNavigation} from '@react-navigation/native';
import {getSmall, timeSinceExtended} from '../utils/ConversionUtils';
import {assetsUrl} from '../services/Constants';
import {MoreVertical} from 'react-native-feather';
import FastImage from 'react-native-fast-image';

function PostUser(props) {
  const navigation = useNavigation();

  const navigateToProfile = varUserId => {
    navigation.push('Profile', {userId: varUserId});
  };

  return (
    <View style={styles.FeedPostUser}>
      <Pressable
        activeOpacity={0.8}
        onPress={() => navigateToProfile(props.userId)}>
        <View
          style={{
            position: 'relative',
            height: 36,
            width: props.post.draftPostUserDetails ? 54 : 36,
          }}>
          {props.post.draftPostUserDetails && (
            <FastImage
              source={
                props.post.draftPostUserDetails.profilePicture == null
                  ? require('../assets/images/profile_picture_placeholder-thumb.png')
                  : {
                      uri:
                        assetsUrl +
                        getSmall(
                          props.post.draftPostUserDetails.profilePicture,
                        ),
                    }
              }
              loadingImageComponent={
                <View
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    position: 'absolute',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    zIndex: -2,
                    backgroundColor: '#EFEFEF',
                  }}
                />
              }
              style={[
                styles.FeedPostUserImage,
                {
                  position: 'absolute',
                  height: 28,
                  width: 28,
                  borderRadius: 5,
                  top: 4,
                  left: 0,
                },
              ]}
            />
          )}
          <FastImage
            source={
              props.profilePicture == null
                ? require('../assets/images/profile_picture_placeholder-thumb.png')
                : {uri: assetsUrl + getSmall(props.profilePicture)}
            }
            style={[
              styles.FeedPostUserImage,
              {
                position: 'absolute',
                backgroundColor: '#EFEFEF',
                left: props.post.draftPostUserDetails ? 20 : 0,
              },
            ]}
          />
        </View>
      </Pressable>

      <View style={styles.FeedUserNameView}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {props.post.draftPostUserDetails && (
            <Pressable
              activeOpacity={0.8}
              onPress={() =>
                navigateToProfile(props.post.draftPostUserDetails.userId)
              }>
              <Text
                style={[
                  styles.FeedPostUserName,
                  {fontWeight: '500', color: '#898989', fontSize: 13},
                ]}>
                <Text style={styles.FeedPostUserName}>
                  {props.post.draftPostUserDetails.userName}
                </Text>{' '}
                and{' '}
              </Text>
            </Pressable>
          )}
          <Pressable
            activeOpacity={0.8}
            onPress={() => navigateToProfile(props.userId)}>
            <Text style={styles.FeedPostUserName}>{props.userName}</Text>
          </Pressable>
        </View>
        <Text style={styles.FeedPostTime}>
          {timeSinceExtended(new Date(props.post.createdTime))}
        </Text>
      </View>

      <Pressable
        activeOpacity={0.8}
        onPress={() => props.openMenu('Menu here')}
        style={styles.FeedPostMoreOptions}>
        <MoreVertical color="#343434" />
      </Pressable>
    </View>
  );
}

export default PostUser;
