import React from 'react';
import {View, Image, Text} from 'react-native';
import FastImage from 'react-native-fast-image';

import styles from '../styles/Common';

function SearchPostUser(props) {
  const userImg = props.userImg;
  const fullName = props.fullName;

  return (
    <View style={styles.FeedPostUser}>
      <FastImage source={{uri: userImg}} style={styles.SearchPostUserImage} />
      <View style={styles.SearchUserNameView}>
        <Text style={styles.SearchPostUserName}>{fullName}</Text>
      </View>
    </View>
  );
}

export default SearchPostUser;
