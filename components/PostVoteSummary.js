import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {assetsUrl} from '../services/Constants';
import {getTiny} from '../utils/ConversionUtils';

function PostVoteSummary(props) {
  const navigation = useNavigation();

  const showVoters = () => {
    navigation.push('Voters', {
      showChoices: true,
      option: null,
      postId: props.post.postId,
      optionId: null,
    });
  };

  const openCollabScreen = () => {
    navigation.push('Collab', {
      draftPost: props.post,
      draftPostId: props.post.postId,
    });
  };

  return (
    <>
      {props.post.type !== 'draft' ? (
        <Pressable
          onPress={props.openResults}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            padding: 8,
          }}>
          <Text
            style={{
              position: 'relative',
              fontSize: 14,
            }}>
            <Text style={{color: '#898989'}}>
              {props.voteCounts[0] + props.voteCounts[1]}
              {props.voteCounts[0] + props.voteCounts[1] === 1
                ? ' vote'
                : ' votes'}
            </Text>
          </Text>
          {props.votes.length > 0 && (
            <View
              style={[
                {
                  borderColor: '#FFFFFF',
                  borderWidth: 2.2,
                  padding: 0,
                  borderRadius: 12,
                  zIndex: 10002,
                },
                localStyles.firstVoterImage,
              ]}>
              <FastImage
                style={[localStyles.voterImages]}
                source={
                  props.votes[0].userDetails.profilePicture == null
                    ? require('../assets/images/profile_picture_placeholder-thumb.png')
                    : {
                        uri:
                          assetsUrl +
                          getTiny(props.votes[0].userDetails.profilePicture),
                      }
                }
              />
            </View>
          )}
          {props.votes.length > 1 && (
            <View
              style={[
                {
                  borderColor: '#FFFFFF',
                  borderWidth: 2.2,
                  padding: 0,
                  borderRadius: 12,
                  zIndex: 10001,
                },
                localStyles.secondVoterImage,
              ]}>
              <FastImage
                style={[localStyles.voterImages]}
                source={
                  props.votes[1].userDetails.profilePicture == null
                    ? require('../assets/images/profile_picture_placeholder-thumb.png')
                    : {
                        uri:
                          assetsUrl +
                          getTiny(props.votes[1].userDetails.profilePicture),
                      }
                }
              />
            </View>
          )}
          {props.votes.length > 2 && (
            <View
              style={[
                {
                  borderColor: '#FFFFFF',
                  borderWidth: 2.2,
                  padding: 0,
                  borderRadius: 12,
                  zIndex: 10000,
                },
                localStyles.thirdVoterImage,
              ]}>
              <FastImage
                style={[localStyles.voterImages]}
                source={
                  props.votes[2].userDetails.profilePicture == null
                    ? require('../assets/images/profile_picture_placeholder-thumb.png')
                    : {
                        uri:
                          assetsUrl +
                          getTiny(props.votes[2].userDetails.profilePicture),
                      }
                }
              />
            </View>
          )}
        </Pressable>
      ) : (
        <Pressable
          activeOpacity={0.8}
          onPress={openCollabScreen}
          style={{
            marginVertical: 4,
            paddingHorizontal: 10,
            justifyContent: 'center',
            borderRadius: 4,
            backgroundColor: '#EFEFEF',
          }}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 14,
              color: 'rgba(102, 49, 247, 1)',
            }}>
            See Collaborations
          </Text>
        </Pressable>
      )}
    </>
  );
}

const localStyles = StyleSheet.create({
  voterImages: {
    borderRadius: 9,
    width: 22,
    height: 22,
    position: 'relative',
  },
  firstVoterImage: {
    left: 4,
  },
  secondVoterImage: {
    left: -6,
  },
  thirdVoterImage: {
    left: -16,
  },
});

export default memo(PostVoteSummary);
