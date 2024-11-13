import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';

const TextWithTags = props => {
  const navigation = useNavigation();
  const reactStringReplace = require('react-string-replace');

  const openTagPosts = tagName => {
    navigation.navigate('Tag Results', {tag: tagName.substring(1)});
  };

  const openUserProfile = userName => {
    navigation.push('Profile', {userName: userName.substring(1)});
  };

  return (
    <View
      style={{
        marginTop: 8,
        paddingHorizontal: 16,
        display: 'flex',
      }}>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 20,
          color: '#121212',
        }}>
        {reactStringReplace(props.text, /([@#]{1}[a-z0-9_]+)/g, (match, i) =>
          match[0] === '#' ? (
            <Text
              key={Math.random() * 100}
              suppressHighlighting={true}
              style={{margin: 0, padding: 0, color: '#4487F2'}}
              activeOpacity={0.5}
              onPress={() => openTagPosts(match)}>
              {match}
            </Text>
          ) : (
            <Text
              key={Math.random() * 100}
              suppressHighlighting={true}
              style={{margin: 0, padding: 0, color: '#4487F2'}}
              activeOpacity={0.5}
              onPress={() => openUserProfile(match)}>
              {match}
            </Text>
          ),
        )}
      </Text>
    </View>
  );
};

export default TextWithTags;
