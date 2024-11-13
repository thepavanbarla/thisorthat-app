import React, {useState} from 'react';
import {View, Pressable, StyleSheet, Platform} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomChatBubble from '../components/CustomChatBubble';
import {TextInput} from 'react-native-gesture-handler';

const ChatScreen = ({route}) => {
  const [message, setMessage] = useState('');
  const [disableSend, setDisableSend] = useState(true);
  const chatDetails = route.params.chatDetails;

  const handleSend = () => {
    chatDetails.messages.push({
      chatId: '1',
      messageId: Math.random() * 1000,
      senderId: 'abc',
      messageType: 'TEXT_MSG',
      text: message,
      postId: null,
      timestamp: new Date(),
      sent: true,
      deliveryDetails: [],
      readDetails: [],
    });

    // TODO add bubble to current chat
    setMessage('');
    setDisableSend(true);
  };

  const renderMessage = ({item}) => <CustomChatBubble message={item} />;

  return (
    <>
      <KeyboardAwareFlatList
        nestedScrollEnabled={true}
        keyboardOpeningTime={0}
        extraScrollHeight={0}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 5,
          paddingTop: Platform.OS === 'ios' ? 26 : 12,
        }}
        style={{paddingHorizontal: 8}}
        inverted
        data={chatDetails.messages.sort((a, b) => {
          return a.timestamp < b.timestamp;
        })}
        renderItem={renderMessage}
        keyExtractor={message => message.messageId}
      />
      <View
        style={{
          backgroundColor: '#efefef',
          left: 0,
          right: 0,
          bottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          paddingHorizontal: 8,
          flexDirection: 'row',
        }}>
        <TextInput
          multiline={true}
          value={message}
          onChangeText={text => {
            setMessage(text);
            if (text) setDisableSend(false);
            else setDisableSend(true);
          }}
          style={{
            backgroundColor: '#fff',
            color: '#232323',
            fontSize: 17,
            borderRadius: 28,
            paddingTop: 6,
            paddingBottom: 6,
            paddingHorizontal: 18,
            flex: 1,
            lineHeight: 24,
          }}
        />

        <Pressable
          disabled={disableSend}
          activeOpacity={0.6}
          delayPressIn={0}
          onPress={handleSend}
          style={
            disableSend ? localStyles.disabledButton : localStyles.activeButton
          }>
          <Ionicons
            name={'send'}
            size={17}
            color={'white'}
            style={{
              position: 'relative',
              left: 1,
            }}
          />
        </Pressable>
      </View>
      {Platform.OS === 'ios' && <KeyboardSpacer topSpacing={-24} />}
    </>
  );
};

const localStyles = StyleSheet.create({
  activeButton: {
    height: 42,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a7bdb',
    borderRadius: 32,
    marginLeft: 6,
  },
  disabledButton: {
    height: 42,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9a9a9a',
    borderRadius: 32,
    marginLeft: 6,
  },
  screenStyle: {
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
});

export default ChatScreen;
