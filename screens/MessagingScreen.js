import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import ChatTeaser from '../components/ChatTeaser';

function MessagingScreen({navigation}) {
  const chats = [
    {
      _id: '1',
      chatPicture:
        'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg',
      title: 'Mohammad Khosravi',
      unreadMessages: 0,
      lastMessageStatus: 'RECEIVED',
      lastMessage: 'Helloww! Can we meet for dinner tonight?',
      lastMessageTime: new Date('2020-11-18T20:34:45Z'),
      messages: [
        {
          chatId: '1',
          messageId: '1113',
          senderId: 'def',
          messageType: 'TEXT_MSG',
          text: "Hi man, that's so cool!",
          postId: null,
          timestamp: new Date('2020-11-20T03:18:15Z'),
          sent: true,
          deliveryDetails: [
            {
              userId: 'abc',
              ackTime: new Date('2020-11-20T03:18:16Z'),
            },
          ],
          readDetails: [
            {
              userId: 'abc',
              ackTime: new Date('2020-11-20T03:18:28Z'),
            },
          ],
        },
        {
          chatId: '1',
          messageId: '1114',
          senderId: 'abc',
          messageType: 'TEXT_MSG',
          text: "Yes it's amazing!",
          postId: null,
          timestamp: new Date('2020-11-20T03:19:15Z'),
          sent: true,
          deliveryDetails: [
            {
              userId: 'abc',
              ackTime: new Date('2020-11-20T03:20:46Z'),
            },
          ],
          readDetails: [
            {
              userId: 'abc',
              ackTime: new Date('2020-11-20T03:20:54Z'),
            },
          ],
        },
      ],
    },
    {
      _id: '2',
      chatPicture:
        'https://dunham-bush.com/wp-content/uploads/2019/02/person1.jpg',
      title: 'Kamal Ravikanth',
      unreadMessages: 2,
      lastMessageStatus: 'RECEIVED',
      lastMessage:
        'Last night was amazing. Learned a lot about how to read books correctly!',
      lastMessageTime: new Date('2021-12-29T07:34:45Z'),
      messages: [
        {
          chatId: '1',
          messageId: '1113',
          senderId: 'def',
          messageType: 'TEXT_MSG',
          text: "Hi man, that's so cool! This can ber the best thing that happened to us over the course of last 5 years. ",
          postId: null,
          timestamp: new Date('2020-11-20T03:18:15Z'),
          sent: true,
          deliveryDetails: [
            {
              userId: 'abc',
              ackTime: new Date('2020-11-20T03:18:16Z'),
            },
          ],
          readDetails: [
            {
              userId: 'abc',
              ackTime: new Date('2020-11-20T03:18:28Z'),
            },
          ],
        },
        {
          chatId: '1',
          messageId: '1114',
          senderId: 'abc',
          messageType: 'TEXT_MSG',
          text: "Yes it's amazing!",
          postId: null,
          timestamp: new Date('2020-11-20T03:19:15Z'),
          sent: true,
          deliveryDetails: [
            {
              userId: 'abc',
              ackTime: new Date('2020-11-20T03:20:46Z'),
            },
          ],
          readDetails: [
            {
              userId: 'abc',
              ackTime: new Date('2020-11-20T03:20:54Z'),
            },
          ],
        },
        {
          chatId: '1',
          messageId: '1119',
          senderId: 'def',
          messageType: 'TEXT_MSG',
          text: "Hi man, that's so cool! This can ber the best thing that happened to us over the course of last 5 years. Can you believe this?",
          postId: null,
          timestamp: new Date('2020-11-20T03:28:15Z'),
          sent: true,
          deliveryDetails: [
            {
              userId: 'abc',
              ackTime: new Date('2020-11-20T03:28:16Z'),
            },
          ],
          readDetails: [
            {
              userId: 'abc',
              ackTime: new Date('2020-11-20T03:28:28Z'),
            },
          ],
        },
        {
          chatId: '1',
          messageId: '1120',
          senderId: 'def',
          messageType: 'TEXT_MSG',
          text: 'Are you seeing this?',
          postId: null,
          timestamp: new Date('2020-11-20T04:28:15Z'),
          sent: true,
          deliveryDetails: [
            {
              userId: 'abc',
              ackTime: new Date('2020-11-20T04:28:16Z'),
            },
          ],
          readDetails: [
            {
              userId: 'abc',
              ackTime: new Date('2020-11-20T04:28:28Z'),
            },
          ],
        },
      ],
    },
  ];

  const renderTeaser = ({item}) => (
    <ChatTeaser
      onPress={() => {
        navigation.navigate('Chat', {chatDetails: item});
      }}
      chat={item}
    />
  );

  return (
    <FlatList
      style={localStyles.list}
      data={chats.sort((a, b) => a.lastMessageTime < b.lastMessageTime)}
      renderItem={renderTeaser}
      keyExtractor={chat => chat._id}
    />
  );
}

const localStyles = StyleSheet.create({
  list: {
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
});

export default MessagingScreen;
