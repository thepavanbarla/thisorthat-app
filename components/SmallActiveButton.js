import React from 'react';
import {Text, Pressable} from 'react-native';
import styles, {buttonStyles} from '../styles/Common';

const SmallActiveButton = props => {
  const handlePress = () => {
    props.onPress();
  };
  return (
    <Pressable
      activeOpacity={0.6}
      delayPressIn={0}
      disabled={props.disabled}
      onPress={handlePress}
      style={[buttonStyles.smallButtonStyle, props.style]}>
      <Text style={styles.smallButtonWhiteText}>{props.title}</Text>
    </Pressable>
  );
};

export default SmallActiveButton;
