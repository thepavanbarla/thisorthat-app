import React from 'react';
import {Dimensions, View, Text, Pressable} from 'react-native';
import {assetsUrl} from '../services/Constants';
import FastImage from 'react-native-fast-image';

const InterestTile = props => {
  const windowWidth = Dimensions.get('window').width;
  const tileWidth = windowWidth * 0.4;
  const tileHeight = windowWidth * 0.15;
  const {interest, selectedInterest, setSelectedInterest} = props;

  const selectInterest = () => setSelectedInterest(interest.interestTag);

  return (
    <Pressable
      onPress={selectInterest}
      activeOpacity={0.75}
      style={{
        marginRight: 12,
        width: tileWidth,
        height: tileHeight,
        display: 'flex',
        borderRadius: 4,
        borderColor: 'rgba(102, 49, 247, 1)',
        borderWidth: selectedInterest === interest.interestTag ? 2 : 0,
        position: 'relative',
        overflow: 'hidden',
      }}>
      <FastImage
        source={{uri: assetsUrl + interest.picture}}
        resizeMode="cover"
        style={{
          width: tileWidth,
          height: tileHeight,
          alignSelf: 'stretch',
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            selectedInterest === interest.interestTag
              ? 'rgba(225, 225, 225, 0.8)'
              : 'rgba(30, 30, 30, 0.4)',
        }}>
        <Text
          style={{
            color:
              selectedInterest === interest.interestTag
                ? 'rgba(102, 49, 247, 1)'
                : '#FFFFFF',
            fontWeight: '700',
            fontSize: 14,
            fontStyle: 'italic',
          }}>
          {interest.interestName}
        </Text>
      </View>
    </Pressable>
  );
};

export default InterestTile;
