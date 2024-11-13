import React from 'react';
import {Text, StyleSheet, Pressable} from 'react-native';
import {Check, Plus} from 'react-native-feather';

const InterestTag = props => {
  const [isActive, setIsActive] = React.useState(props.isActive);

  const handlePress = () => {
    props.onPress(props.value, !isActive);
    setIsActive(!isActive);
  };

  return (
    <Pressable
      activeOpacity={0.8}
      delayPressIn={0}
      onPress={handlePress}
      style={[
        localStyles.tagStyle,
        isActive ? localStyles.activeTagStyle : localStyles.inactiveTagStyle,
      ]}>
      <Text
        style={[
          localStyles.tagTextStyle,
          isActive
            ? localStyles.activeTagTextStyle
            : localStyles.inactiveTagTextStyle,
        ]}>
        {props.text}
      </Text>
      {isActive ? (
        <Check height={16} width={16} stroke="#3EA832" strokeWidth={4} />
      ) : (
        <Plus height={16} width={16} stroke="#898989" strokeWidth={3.6} />
      )}
    </Pressable>
  );
};

const localStyles = StyleSheet.create({
  tagStyle: {
    display: 'flex',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 3,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inactiveTagStyle: {
    borderColor: '#BCBCBC',
  },
  activeTagStyle: {
    borderColor: '#121212',
    backgroundColor: '#121212',
  },
  tagTextStyle: {
    fontSize: 15,
    fontWeight: '500',
    marginRight: 4,
  },
  activeTagTextStyle: {
    color: '#EFEFEF',
  },
  inactiveTagTextStyle: {
    color: '#898989',
  },
});

export default InterestTag;
