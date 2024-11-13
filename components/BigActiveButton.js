import React from 'react';
import {Pressable, Text} from 'react-native';
import styles, {buttonStyles} from '../styles/Common';

const BigActiveButton = props => {
  const handlePress = () => {
    props.onPress();
  };
  return (
    <Pressable
      activeOpacity={0.6}
      delayPressIn={0}
      disabled={props.disabled}
      onPress={handlePress}
      style={[
        props.disabled
          ? buttonStyles.bigInactiveButtonStyle
          : buttonStyles.bigButtonStyle,
      ]}>
      <Text style={styles.bigButtonWhiteText}>{props.title}</Text>
    </Pressable>
  );
};

export default BigActiveButton;
