import React from 'react';
import {Text, Pressable} from 'react-native';
import styles, {buttonStyles} from '../styles/Common';

const TextLink = props => {
  const handlePress = () => {
    props.onPress();
  };
  return (
    <Pressable
      activeOpacity={0.6}
      delayPressIn={0}
      onPress={handlePress}
      style={[buttonStyles.simpleTextLinkStyle, props.style]}>
      <Text
        style={
          props.disabled
            ? styles.simpleDisabledTextLinkText
            : styles.simpleTextLinkText
        }>
        {props.title}
      </Text>
    </Pressable>
  );
};

export default TextLink;
