import React from 'react';
import {StyleSheet, FlatList, Alert} from 'react-native';
import ChatTeaser from '../components/ChatTeaser';

function MessagingArchiveScreen({navigation}) {
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
    },
  ];

  const renderTeaser = ({item}) => (
    <ChatTeaser
      onPress={() => {
        Alert.alert('Opens the chat!');
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

export default MessagingArchiveScreen;
