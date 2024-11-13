import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, Animated, StyleSheet, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {assetsUrl} from '../services/Constants';
import {getSessionUserId} from '../services/SessionService';
import {getSmall, timeSinceExtended} from '../utils/ConversionUtils';

function Comment(props) {
  const navigation = useNavigation();

  const navigateToProfileFn = () => {
    navigation.push('Profile', {userId: props.comment.userDetails.userId});
  };
  const [liked, setLiked] = React.useState(props.liked);

  useEffect(() => {
    getSessionUserId().then(setSessionUserId);
  }, []);

  const ScaleOutline = new Animated.Value(liked ? 0 : 1);
  const ScaleOutlineValue = ScaleOutline.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const ScaleFilled = new Animated.Value(liked ? 1 : 0);
  const ScaleFilledValue = ScaleFilled.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const likePressed = () => {
    const varLiked = liked == false;
    Animated.sequence([
      Animated.parallel([
        Animated.timing(ScaleOutline, {
          toValue: varLiked ? 0 : 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(ScaleFilled, {
          toValue: varLiked ? 1 : 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    setTimeout(() => {
      setLiked(liked => !liked);
    }, 500);
  };

  const [sessionUserId, setSessionUserId] = useState(null);

  return (
    <View
      style={{
        paddingVertical: props.isReply ? 10 : 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginLeft: props.isReply ? 36 : 0,
      }}>
      <Pressable activeOpacity={0.8} onPress={navigateToProfileFn}>
        <FastImage
          style={localStyles.commentUserImage}
          source={
            props.comment.userDetails.profilePicture == null
              ? require('../assets/images/profile_picture_placeholder-thumb.png')
              : {
                  uri:
                    assetsUrl +
                    getSmall(props.comment.userDetails.profilePicture),
                }
          }
        />
      </Pressable>
      <View style={localStyles.commentContentView}>
        <Text style={localStyles.commentText}>
          <Text
            style={localStyles.commentUsername}
            onPress={navigateToProfileFn}
            suppressHighlighting={true}>
            {props.comment.userDetails.userName}
          </Text>
          &nbsp;
          {props.comment.comment}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: '85%',
            marginTop: 2,
          }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '400',
              color: '#676767',
              marginRight: 20,
            }}>
            {timeSinceExtended(new Date(props.comment.createdTime))}
          </Text>

          {/* 
                    Uncomment when comment liking is implemented
                    <Text style={{fontSize: 13.5, fontWeight: '600', color: '#232323'}}>3 Likes</Text> */}

          {/* 
                    Uncomment when comment-level replying is implemented
                    <Text style={{fontSize: 13.5, fontWeight: '600', color: '#232323'}}>Reply</Text> */}

          {/* Uncomment when delete comment functionality is implemented */}
          {/* { sessionUserId == props.comment.userId && 
                    <Pressable onPress={() => props.deletePostComment(props.comment.commentId)}>
                        <Text style={{fontSize: 13.5, fontWeight: '600', color: '#232323'}}>Delete</Text>
                    </Pressable> } */}
        </View>
      </View>
      {/* 
            Uncomment when comment liking is implemented
            <TouchableWithoutFeedback onPress={likePressed} style={{flexDirection: 'column', justifyContent: 'flex-start', width:36, height: 36}}>
                <Animated.View style={{ position: 'absolute', top: 8, left: 8, right: 8, bottom: 8, transform:[{scale:ScaleOutlineValue}] }}>
                    <Ionicons name='heart-outline' size={19} color={'#343434'} />
                </Animated.View>
                <Animated.View style={{ position: 'absolute', top: 8, left: 8, right: 8, bottom: 8, transform:[{scale:ScaleFilledValue}] }}>
                    <Ionicons name='heart' size={19} color={'#FF0000'} />
                </Animated.View>
            </TouchableWithoutFeedback> */}
    </View>
  );
}

const localStyles = StyleSheet.create({
  commentView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentUserImage: {
    height: 36,
    width: 36,
    borderRadius: 8,
    marginTop: 2,
    marginRight: 12,
  },
  commentContentView: {
    flex: 1,
    flexDirection: 'column',
  },
  commentText: {fontSize: 14, fontWeight: '400', lineHeight: 18},
  commentUsername: {fontWeight: '600', marginRight: 8, color: '#121212'},
});

export default Comment;
