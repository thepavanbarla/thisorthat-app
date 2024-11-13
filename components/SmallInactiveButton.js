import React from 'react';
import {Text, Pressable} from 'react-native';
import styles, {buttonStyles} from '../styles/Common';

const SmallInactiveButton = props => {
  const handlePress = () => {
    props.onPress();
  };
  return (
    <Pressable
      activeOpacity={0.6}
      delayPressIn={0}
      disabled={props.disabled}
      onPress={handlePress}
      style={[props.style, buttonStyles.smallInactiveButtonStyle]}>
      <Text style={styles.smallInactiveButtonText}>{props.title}</Text>
    </Pressable>
  );
};

export default SmallInactiveButton;
