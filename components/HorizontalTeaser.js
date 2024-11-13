import React, {useState} from 'react';
import {Dimensions, View, Text, Pressable} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import {getSmall, getTiny, getTwoRandomColors} from '../utils/ConversionUtils';
import {assetsUrl} from '../services/Constants';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HorizontalTeaser = props => {
  const screenWidth = Dimensions.get('window').width;
  const postHeight = (screenWidth - 30) / 3;
  const postWidth = postHeight * 2;

  const hasTitle = post => {
    if (
      post.options[0].title !== null &&
      post.options[0].title !== undefined &&
      post.options[0].title.trim() !== ''
    ) {
      return true;
    }
    return false;
  };

  const getNumberOfLines = text => {
    if (!text) return 1;
    if (text.length > 40) {
      return 6;
    } else if (text.length > 32) {
      return 5;
    } else if (text.length > 24) {
      return 4;
    } else if (text.length > 16) {
      return 3;
    } else if (text.length > 8) {
      return 2;
    }
    return 1;
  };

  const [textPostBackgroundColors, setTextPostBackgroundColors] = useState(
    getTwoRandomColors(),
  );

  const openPost = () => props.openPost(props.postAndDetails);

  return (
    <>
      {props.postAndDetails && (
        <Pressable
          activeOpacity={0.5}
          onPress={openPost}
          style={{
            backgroundColor: '#CDCDCD',
            width: postWidth,
            height: postHeight - 6,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            borderWidth: 0.4,
            borderColor: '#CDCDCD',
            position: 'relative',
          }}>
          {hasTitle(props.postAndDetails.post) &&
            props.postAndDetails.post.options[0].picture !== null &&
            props.postAndDetails.post.options[0].picture !== undefined && (
              <LinearGradient
                colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.9)']}
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  right: 0,
                  zIndex: 100,
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                  paddingTop: 12,
                }}>
                <Text
                  style={{fontSize: 12.5, color: '#FFFFFF', fontWeight: '600'}}>
                  {props.postAndDetails.post.options[0].title}{' '}
                  {props.postAndDetails.post.options.length > 1 && (
                    <>
                      <Text style={{fontWeight: '400'}}>or</Text>{' '}
                      {props.postAndDetails.post.options[1].title}
                    </>
                  )}
                </Text>
              </LinearGradient>
            )}

          {props.postAndDetails.post.options[0].picture !== null &&
          props.postAndDetails.post.options[0].picture !== undefined ? (
            <ProgressiveFastImage
              blurRadius={2}
              source={{
                uri:
                  assetsUrl +
                  getSmall(props.postAndDetails.post.options[0].picture),
              }}
              thumbnailSource={{
                uri:
                  assetsUrl +
                  getTiny(props.postAndDetails.post.options[0].picture),
              }}
              resizeMode="cover"
              style={{
                height: postHeight,
                width: postWidth / 2,
                display: 'flex',
                flex: 1,
              }}
            />
          ) : (
            <View
              style={{
                height: postHeight,
                width: postWidth / 2,
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'stretch',
                backgroundColor: textPostBackgroundColors[0],
              }}>
              <Text
                style={{
                  fontWeight: '800',
                  width: '100%',
                  fontSize: 14,
                  paddingHorizontal: 8,
                  color: '#121212',
                  textAlign:
                    getNumberOfLines(
                      props.postAndDetails.post.options[0].title,
                    ) > 2
                      ? 'left'
                      : 'center',
                  paddingBottom: 8,
                }}
                adjustsFontSizeToFit={true}
                numberOfLines={getNumberOfLines(
                  props.postAndDetails.post.options[0].title,
                )}
                minimumFontScale={1}>
                {props.postAndDetails.post.options[0].title}
              </Text>
            </View>
          )}

          {props.postAndDetails.post.options[1]?.picture !== null &&
          props.postAndDetails.post.options[1]?.picture !== undefined ? (
            <ProgressiveFastImage
              blurRadius={2}
              source={{
                uri:
                  assetsUrl +
                  getSmall(props.postAndDetails.post.options[1].picture),
              }}
              thumbnailSource={{
                uri:
                  assetsUrl +
                  getTiny(props.postAndDetails.post.options[1].picture),
              }}
              resizeMode="cover"
              style={{
                height: postHeight,
                width: postWidth / 2,
                display: 'flex',
                flex: 1,
              }}
            />
          ) : (
            <View
              style={{
                height: postHeight,
                width: postWidth / 2,
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'stretch',
                backgroundColor: textPostBackgroundColors[1],
              }}>
              {props.postAndDetails.post.options.length > 1 ? (
                <Text
                  style={{
                    fontWeight: '800',
                    width: '100%',
                    fontSize: 14,
                    paddingHorizontal: 8,
                    color: '#121212',
                    textAlign:
                      getNumberOfLines(
                        props.postAndDetails.post.options[1]?.title,
                      ) > 2
                        ? 'left'
                        : 'center',
                    paddingBottom: 8,
                  }}
                  adjustsFontSizeToFit={true}
                  numberOfLines={getNumberOfLines(
                    props.postAndDetails.post.options[1]?.title,
                  )}
                  minimumFontScale={1}>
                  {props.postAndDetails.post.options[1]?.title}
                </Text>
              ) : (
                <View style={{alignItems: 'center', paddingBottom: 12}}>
                  <Ionicons name="add-circle" size={28} color="#898989" />
                </View>
              )}
            </View>
          )}
        </Pressable>
      )}
    </>
  );
};

export default HorizontalTeaser;
