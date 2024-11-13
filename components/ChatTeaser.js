import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {getSimpleTimeFromDateObject} from '../utils/ConversionUtils';

const ChatTeaser = props => {
  const openChat = () => {
    props.onPress(props.chat);
  };

  return (
    <Pressable activeOpacity={0.6} delayPressIn={0} onPress={openChat}>
      <View style={localStyles.view}>
        <FastImage
          source={{uri: props.chat.chatPicture}}
          style={localStyles.image}
        />
        <View style={localStyles.textView}>
          <Text style={localStyles.title}>{props.chat.title}</Text>
          <Text
            numberOfLines={1}
            style={[
              localStyles.subTitle,
              props.chat.unreadMessages > 0 && localStyles.activeSubTitle,
            ]}>
            <Text>
              {props.chat.lastMessageStatus === 'READ' ? (
                <Ionicons name={'checkmark-done'} size={16} color={'#3483e3'} />
              ) : props.chat.lastMessageStatus === 'DELIVERED' ? (
                <Ionicons name={'checkmark-done'} size={16} color={'#898989'} />
              ) : props.chat.lastMessageStatus === 'SENT' ? (
                <Ionicons name={'checkmark'} size={16} color={'#898989'} />
              ) : props.chat.lastMessageStatus === 'PENDING' ? (
                <Ionicons name={'time-outline'} size={14} color={'#898989'} />
              ) : (
                <></>
              )}
              {props.chat.lastMessageStatus !== 'RECEIVED' && (
                <Text>&nbsp;</Text>
              )}
            </Text>
            {props.chat.lastMessage}
          </Text>
        </View>
        <View style={localStyles.metaView}>
          <Text
            style={[
              localStyles.lastMessageTime,
              props.chat.unreadMessages > 0 &&
                localStyles.activeLastMessageTime,
            ]}>
            {getSimpleTimeFromDateObject(props.chat.lastMessageTime)}
          </Text>

          {/* Note: This fade sucks, fades all chats */}
          {/* <Fade visible={props.chat.unreadMessages > 0}> */}
          {props.chat.unreadMessages > 0 ? (
            <View style={localStyles.unreadMessages}>
              <Text style={localStyles.unreadMessagesText}>
                {props.chat.unreadMessages}
              </Text>
            </View>
          ) : (
            <Text style={localStyles.unreadMessagesDisabled}>
              {props.chat.unreadMessages}
            </Text>
          )}
          {/* </Fade> */}
        </View>
      </View>
    </Pressable>
  );
};

const localStyles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 16,
  },
  textView: {
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 12,
  },
  activeSubTitle: {
    fontWeight: '400',
    color: '#000000',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111111',
    marginBottom: 2,
  },
  subTitle: {
    fontWeight: '400',
    color: '#787878',
    fontSize: 14,
  },
  metaView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  lastMessageTime: {
    fontWeight: '500',
    fontSize: 12,
    color: '#676767',
    backgroundColor: 'transparent',
    marginBottom: 6,
  },
  activeLastMessageTime: {
    color: '#B7008A',
  },
  unreadMessages: {
    width: 20,
    height: 20,
    paddingTop: 1.5,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#B7008A',
    borderRadius: 8,
  },
  unreadMessagesText: {
    fontWeight: '600',
    color: 'white',
    fontSize: 11.5,
  },
  unreadMessagesDisabled: {
    opacity: 0,
  },
});

export default ChatTeaser;
