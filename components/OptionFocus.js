import React from 'react';
import {View, Text} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import {assetsUrl} from '../services/Constants';
import {getTiny} from '../utils/ConversionUtils';
import Pinchable from 'react-native-pinchable';

const OptionFocus = props => {
  const {showOptionTitle, optionTitle, optionImage} = props;

  return (
    <View
      style={{
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}>
      {optionImage !== null && optionImage !== undefined && (
        <Pinchable
          minimumZoomScale={1}
          maximumZoomScale={3}
          style={{
            position: 'relative',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ProgressiveFastImage
            blurRadius={2}
            source={{uri: assetsUrl + optionImage}}
            thumbnailSource={{uri: assetsUrl + getTiny(optionImage)}}
            resizeMode="cover"
            style={{
              aspectRatio: 1 / 1,
              alignSelf: 'stretch',
              resizeMode: 'cover',
              overflow: 'hidden',
              width: '100%',
            }}
          />
        </Pinchable>
      )}

      {showOptionTitle && (
        <View style={{paddingHorizontal: 12, marginBottom: 8}}>
          {showOptionTitle && (
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 17,
                fontWeight: '700',
                marginTop: 10,
                marginBottom: 4,
              }}>
              {optionTitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default OptionFocus;
