import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-root-toast';
import {getUser} from '../services/AccountService';
import {assetsUrl} from '../services/Constants';
import {getPost} from '../services/PostService';
import {respondToFollowRequest} from '../services/UserService';
import {getSmall, timeSinceExtended} from '../utils/ConversionUtils';

const Notification = props => {
  const navigation = useNavigation();

  const [notificationUser, setNotificationUser] = useState(null);
  const [notificationPostAndDetails, setNotificationPostAndDetails] =
    useState(null);

  useEffect(() => {
    let isMounted = true;
    getUser(props.notification.senderId)
      .then(response => response.json())
      .then(json => {
        if (isMounted) setNotificationUser(json.data);
      });

    if (props.notification.postId) {
      getPost(props.notification.postId)
        .then(response => response.json())
        .then(json => {
          if (isMounted) setNotificationPostAndDetails(json.data);
        });
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateToNotification = () => {
    if (props.notification.type === 'comment') {
      navigation.navigate('Post', {
        postId: notificationPostAndDetails.post.postId,
      });
    } else if (props.notification.type === 'vote') {
      navigation.navigate('Analyze Results', {
        postId: notificationPostAndDetails.post.postId,
      });
    } else {
      navigation.push('Profile', {userId: props.notification.senderId});
    }
  };

  const navigateToSenderProfile = () => {
    navigation.push('Profile', {userId: props.notification.senderId});
  };

  const [showActions, setShowActions] = useState(props.notification.isValid);

  const respondToRequest = async (action, userId) => {
    respondToFollowRequest(userId, action)
      .then(response => response.json())
      .then(json => {
        setShowActions(false);
        Toast.show(`Request ${action}ed`, {duration: 2000});
      });
  };

  const acceptFn = () => {
    respondToRequest('accept', props.notification.senderId);
  };

  const rejectFn = () => {
    respondToRequest('reject', props.notification.senderId);
  };

  return (
    <>
      {notificationUser && props.notification.isValid && (
        <View
          style={{
            paddingVertical: 16,
            alignSelf: 'stretch',
            flexDirection: 'row',
            alignItems: 'flex-start',
            borderBottomWidth: 1,
            borderBottomColor: '#EFEFEF',
          }}>
          <Pressable onPress={navigateToSenderProfile}>
            <FastImage
              style={{
                height: 36,
                width: 36,
                borderRadius: 8,
                marginTop: 2,
                marginRight: 12,
              }}
              source={
                notificationUser.profilePicture == null
                  ? require('../assets/images/profile_picture_placeholder-thumb.png')
                  : {uri: assetsUrl + getSmall(notificationUser.profilePicture)}
              }
            />
          </Pressable>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Pressable onPress={navigateToNotification} style={{flex: 1}}>
              <Text style={{fontSize: 15, fontWeight: '400', lineHeight: 20}}>
                <Text style={{fontWeight: '600', marginRight: 8}}>
                  {notificationUser.userName}
                </Text>
                &nbsp;
                {props.notification.type === 'comment'
                  ? 'commented on your post'
                  : props.notification.type === 'follow'
                  ? 'is now following you'
                  : props.notification.type === 'follow_request'
                  ? 'has requested to follow you'
                  : props.notification.type === 'follow_accept'
                  ? 'has accepted your follow request'
                  : 'voted on your post'}
                &nbsp;
                {(props.notification.type === 'vote' ||
                  props.notification.type === 'comment') &&
                  notificationPostAndDetails &&
                  (notificationPostAndDetails.post.context ? (
                    <Text style={{fontWeight: '600', marginRight: 8}}>
                      {notificationPostAndDetails.post.context}
                    </Text>
                  ) : (
                    <Text style={{fontWeight: '600', marginRight: 8}}>
                      {notificationPostAndDetails.post.options[0].title ||
                        'This'}{' '}
                      vs{' '}
                      {notificationPostAndDetails.post.options[1].title ||
                        'That'}{' '}
                    </Text>
                  ))}
              </Text>
            </Pressable>
            <View
              style={{
                flexDirection: 'row',
                marginTop: props.notification.type === 'followRequest' ? 8 : 0,
              }}>
              {props.notification.type === 'follow_request' && showActions && (
                <>
                  <Pressable
                    onPress={acceptFn}
                    style={{
                      borderRadius: 4,
                      backgroundColor: 'rgba(102, 49, 247, 1)',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginRight: 10,
                      marginTop: 6,
                    }}>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 12,
                        color: '#FFFFFF',
                      }}>
                      Accept
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={rejectFn}
                    style={{
                      borderRadius: 4,
                      backgroundColor: 'rgba(102, 49, 247, 0.4)',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginRight: 10,
                      marginTop: 6,
                    }}>
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 12,
                        color: '#121212',
                      }}>
                      Reject
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: '60%',
                marginTop: 2,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: '#565656',
                  marginRight: 20,
                }}>
                {timeSinceExtended(new Date(props.notification.createdAt))}
              </Text>
            </View>
          </View>

          {/* TODO: Implement comment likes to uncomment */}
          {/* { (props.notification.type === 'comment') ?
                (<TouchableWithoutFeedback onPress={likePressed} style={{flexDirection: 'column', justifyContent: 'flex-start', width:36, height: 48}}>
                    <Animated.View style={{ position: 'absolute', top: 12, left: 8, right: 8, bottom: 8, transform:[{scale:ScaleOutlineValue}] }}>
                        <Ionicons name='heart-outline' size={19} color={'#343434'} />
                    </Animated.View>
                    <Animated.View style={{ position: 'absolute', top: 12, left: 8, right: 8, bottom: 8, transform:[{scale:ScaleFilledValue}] }}>
                        <Ionicons name='heart' size={19} color={'#FF0000'} />
                    </Animated.View>
                </TouchableWithoutFeedback>)
                :
                <View style={{flexDirection: 'column', justifyContent: 'flex-start', width:36, height: 48}}>
                </View>
            } */}
        </View>
      )}
    </>
  );
};

export default Notification;
