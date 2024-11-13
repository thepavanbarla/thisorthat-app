import React from 'react';

import {View, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getOnlyTimeFromDateObject} from '../utils/ConversionUtils';

const CustomChatBubble = props => {
  const userId = 'abc';

  return (
    <View style={localStyles.bubbleContainer}>
      <View
        style={
          userId == props.message.senderId
            ? localStyles.outgoingBubbleSpace
            : localStyles.incomingBubbleSpace
        }>
        <View
          style={
            userId == props.message.senderId
              ? localStyles.outgoingBubble
              : localStyles.incomingBubble
          }>
          <View style={{paddingVertical: 5, paddingHorizontal: 6}}>
            <Text style={{flexWrap: 'wrap'}}>
              {props.message.text && (
                <Text
                  style={{
                    backgroundColor: 'transparent',
                    fontSize: 16,
                    lineHeight: 20,
                    color:
                      userId == props.message.senderId ? '#111111' : '#FFFFFF',
                  }}>
                  {props.message.text}
                </Text>
              )}
              {userId == props.message.senderId ? (
                <Text
                  style={{flexWrap: 'wrap', backgroundColor: 'transparent'}}>
                  {' '}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              ) : (
                <Text
                  style={{flexWrap: 'wrap', backgroundColor: 'transparent'}}>
                  {' '}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              )}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                right: 0,
                bottom: 0,
                paddingRight: 3,
                backgroundColor: 'transparent',
              }}>
              <Text
                style={{
                  paddingRight: 4,
                  fontWeight: '500',
                  fontSize: 12,
                  color:
                    userId == props.message.senderId ? '#898989' : '#BCBCBC',
                  position: 'relative',
                  top: 1,
                }}>
                {getOnlyTimeFromDateObject(props.message.timestamp)}
              </Text>
              {userId == props.message.senderId &&
                (props.message.readDetails.length > 0 ? (
                  <Ionicons
                    name={'checkmark-done'}
                    size={16}
                    color={'#3483e3'}
                  />
                ) : props.message.deliveryDetails.length > 0 ? (
                  <Ionicons
                    name={'checkmark-done'}
                    size={16}
                    color={'#898989'}
                  />
                ) : props.message.sent ? (
                  <Ionicons name={'checkmark'} size={16} color={'#898989'} />
                ) : (
                  <Ionicons name={'time-outline'} size={14} color={'#898989'} />
                ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  bubbleContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
  },
  outgoingBubbleSpace: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  incomingBubbleSpace: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  bubble: {},
  outgoingBubble: {
    backgroundColor: '#FFFFFF',
    maxWidth: '70%',
    marginTop: 8,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  incomingBubble: {
    backgroundColor: '#59204B',
    maxWidth: '70%',
    marginTop: 8,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  mediaBubble: {},
  chatImage: {
    flex: 1,
    alignSelf: 'stretch',
    resizeMode: 'cover',
    marginBottom: 2,
    width: '100%',
    height: 175,
    borderRadius: 2,
  },
  videoThumbnail: {
    flex: 1,
    alignSelf: 'stretch',
    resizeMode: 'cover',
    marginBottom: 2,
    width: '100%',
    height: 175,
    borderRadius: 2,
  },
});

export default CustomChatBubble;
