import React from 'react';
import {Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/Common';

const ProfileSaveButton = props => {
  const handlePress = () => {
    props.saveFn();
  };

  return (
    <Pressable
      disabled={props.disabled}
      activeOpacity={0.6}
      delayPressIn={0}
      onPress={handlePress}
      style={styles.saveButton}>
      <Ionicons
        name={'checkmark'}
        size={32}
        color={props.disabled ? '#ABABAB' : '#4487f2'}
      />
    </Pressable>
  );
};

export default ProfileSaveButton;
