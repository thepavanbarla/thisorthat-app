import React from 'react';
import {View, Text, Dimensions, Pressable} from 'react-native';
import {assetsUrl} from '../services/Constants';
import FastImage from 'react-native-fast-image';

const windowWidth = Dimensions.get('window').width;

const CurationTile = props => {
  const tileWidth = (windowWidth - 44) / 2;
  return (
    <Pressable
      onPress={props.action}
      activeOpacity={0.8}
      style={{
        width: tileWidth,
        height: 100,
        borderRadius: 6,
        marginBottom: 12,
      }}>
      <FastImage
        source={{uri: assetsUrl + props.image}}
        resizeMode="cover"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 6,
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
          borderRadius: 6,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <Text
          style={{
            color: '#FFFFFF',
            fontWeight: '600',
            fontSize: 14,
            fontStyle: 'italic',
          }}>
          {props.title}
        </Text>
      </View>
    </Pressable>
  );
};

export default CurationTile;
