/* eslint-disable react-hooks/exhaustive-deps */
import React, {memo, useEffect, useState} from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import PostUser from './PostUser';
import {assetsUrl} from '../services/Constants';
import {Heart} from 'react-native-feather';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import {getMedium, getTiny, getTwoRandomColors} from '../utils/ConversionUtils';
import LinearGradient from 'react-native-linear-gradient';
import TextWithTags from './TextWithTags';
import {getSessionUserId} from '../services/SessionService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

function PostMain(props) {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;
  const plusOne = require('../assets/images/heartbeat.png');

  const [sessionUserId, setSessionUserId] = useState(null);
  const [textPostBackgroundColors, setTextPostBackgroundColors] = useState(
    getTwoRandomColors(),
  );

  useEffect(() => {
    loadSessionUser();
  }, []);

  const getNumberOfLines = text => {
    if (text) {
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
    }
    return 1;
  };

  const loadSessionUser = async () => {
    const varSessionUserId = await getSessionUserId();
    setSessionUserId(varSessionUserId);
  };

  const [showVoteAnimation1, setShowVoteAnimation1] = React.useState(true);
  let Fade1 = new Animated.Value(0);
  let Scale1 = new Animated.Value(0);
  let MoveX1 = new Animated.Value(0);
  let MoveY1 = new Animated.Value(0);
  const ScaleValue1 = Scale1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const [showVoteAnimation2, setShowVoteAnimation2] = React.useState(true);
  let Fade2 = new Animated.Value(0);
  let Scale2 = new Animated.Value(0);
  let MoveX2 = new Animated.Value(0);
  let MoveY2 = new Animated.Value(0);
  const ScaleValue2 = Scale2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  let clickCount1 = 0;
  let clickTimer1 = null;
  let clickCount2 = 0;
  let clickTimer2 = null;

  const {votedOption, vote, voteCounts} = props;

  const [contextPresent, setContextPresent] = useState(false);

  useEffect(() => {
    if (props.post.context) {
      setContextPresent(true);
    } else {
      setContextPresent(false);
    }
  }, []);

  const listenDoubleClick1 = () => {
    if (props.post.type === 'draft') {
      return;
    }

    if (clickCount2 > 0) {
      return;
    }

    clickCount1++;
    if (clickCount1 === 2) {
      setShowVoteAnimation1(true);
      clearTimeout(clickTimer1);
      doubleClick1();
      setTimeout(() => {
        vote(0);
      }, 900);
    } else {
      clickTimer1 = setTimeout(() => {
        clickCount1 = 0;
      }, 500);
    }
  };

  const listenDoubleClick2 = () => {
    if (props.post.type === 'draft') {
      return;
    }

    if (clickCount1 > 0) {
      return;
    }

    clickCount2++;
    if (clickCount2 === 2) {
      setShowVoteAnimation2(true);
      clearTimeout(clickTimer2);
      doubleClick2();
      setTimeout(() => {
        vote(1);
      }, 900);
    } else {
      clickTimer2 = setTimeout(() => {
        clickCount2 = 0;
      }, 500);
    }
  };

  const doubleClick1 = async () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(Fade1, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(Scale1, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(Scale1, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(Fade1, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(Scale1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(Fade1, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(MoveX1, {
          toValue: 0 - windowWidth,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.linear(Easing.cubic),
        }),
        Animated.timing(MoveY1, {
          toValue: windowWidth + 100,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.linear(Easing.cubic),
        }),
        Animated.timing(Scale1, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(MoveX1, {
          toValue: 0,
          duration: 10,
          useNativeDriver: true,
        }),
        Animated.timing(MoveY1, {
          toValue: 0,
          duration: 10,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setShowVoteAnimation1(false);
    });

    setTimeout(() => {
      setShowVoteAnimation1(true);
    }, 1200);
  };

  const doubleClick2 = async () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(Fade2, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(Scale2, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(Scale2, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(Fade2, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(Scale2, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(Fade2, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(MoveX2, {
          toValue: 0 - windowWidth,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.linear(Easing.cubic),
        }),
        Animated.timing(MoveY2, {
          toValue: windowWidth + 100,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.linear(Easing.cubic),
        }),
        Animated.timing(Scale2, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(MoveX2, {
          toValue: 0,
          duration: 10,
          useNativeDriver: true,
        }),
        Animated.timing(MoveY2, {
          toValue: 0,
          duration: 10,
          useNativeDriver: true,
        }),
        Animated.timing(Fade2, {
          toValue: 0,
          duration: 10,
          useNativeDriver: true,
        }),
        Animated.timing(Scale2, {
          toValue: 0,
          duration: 10,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setShowVoteAnimation2(false);
    });

    setTimeout(() => {
      setShowVoteAnimation2(true);
    }, 1200);
  };

  const longPress1 = () => {
    props.zoomOption(props.post.options[0], 0);
  };

  const longPress2 = () => {
    props.zoomOption(props.post.options[1], 1);
  };

  const collaborateOnPost = () => {
    if (props.post.userId === sessionUserId) {
      return;
    }
    navigation.navigate('CreateNav', {
      screen: 'Create New Post',
      params: {
        draftPost: props.post,
        draftPostId: props.post.postId,
      },
    });
  };

  return (
    <>
      <PostUser
        userName={props.userName}
        fullName={props.fullName}
        userId={props.userId}
        profilePicture={props.profilePicture}
        openMenu={props.openMenu}
        post={props.post}
      />
      {contextPresent && (
        <TextWithTags
          style={{
            fontSize: 14,
            marginTop: 8,
            lineHeight: 20,
            color: '#121212',
            paddingHorizontal: 16,
          }}
          text={props.post.context.trim()}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
        }}>
        <View style={{flex: 1, paddingRight: 1, flexDirection: 'column'}}>
          <TouchableWithoutFeedback
            style={{height: windowWidth / 2 - 1}}
            onPress={listenDoubleClick1}
            delayLongPress={400}
            onLongPress={longPress1}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}>
              {props.post.options[0].picture !== null &&
              props.post.options[0].picture !== undefined ? (
                <ProgressiveFastImage
                  blurRadius={2}
                  source={{
                    uri: assetsUrl + getMedium(props.post.options[0].picture),
                  }}
                  thumbnailSource={{
                    uri: assetsUrl + getTiny(props.post.options[0].picture),
                  }}
                  useNativeDriver={true}
                  loadingImageComponent={
                    <View
                      style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        position: 'absolute',
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        zIndex: -2,
                        backgroundColor: '#EFEFEF',
                      }}
                    />
                  }
                  resizeMode="cover"
                  style={{
                    height: windowWidth / 2 - 1,
                    width: windowWidth / 2 - 1,
                    opacity:
                      votedOption && votedOption == props.post.options[0].id
                        ? 1
                        : votedOption
                        ? 0.75
                        : 1,
                    zIndex: -1,
                  }}
                />
              ) : (
                <View
                  style={{
                    height: windowWidth / 2 - 1,
                    width: windowWidth / 2 - 1,
                    backgroundColor: textPostBackgroundColors[0],
                    padding: 16,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'stretch',
                    }}>
                    <Text
                      style={{
                        fontWeight: '800',
                        width: '100%',
                        fontSize: 20,
                        color: '#121212',
                        textAlign:
                          getNumberOfLines(props.post.options[0].title) > 2
                            ? 'left'
                            : 'center',
                        paddingBottom: props.post.type !== 'draft' ? 12 : 0,
                      }}
                      adjustsFontSizeToFit={true}
                      numberOfLines={getNumberOfLines(
                        props.post.options[0].title,
                      )}
                      minimumFontScale={1}>
                      {props.post.options[0].title}
                    </Text>
                  </View>
                </View>
              )}

              {showVoteAnimation1 && (
                <Animated.Image
                  style={{
                    opacity: Fade1,
                    transform: [
                      {
                        scale: ScaleValue1,
                      },
                      {
                        translateX: MoveX1,
                      },
                      {
                        translateY: MoveY1,
                      },
                    ],
                    resizeMode: 'contain',
                    width: windowWidth / 8,
                    height: windowWidth / 8,
                    position: 'absolute',
                  }}
                  source={plusOne}
                />
              )}
              {(votedOption || props.userId === sessionUserId) &&
                props.post.type !== 'draft' && (
                  <LinearGradient
                    colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.9)']}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      paddingLeft: 16,
                      paddingTop: 20,
                      paddingBottom: 10,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      paddingHorizontal: 8,
                    }}>
                    <Text
                      style={{
                        fontWeight: '500',
                        lineHeight: 14,
                        fontSize: 14,
                        color: '#FFFFFF',
                        alignItems: 'center',
                      }}>
                      {voteCounts[0]}
                      <View style={{width: 2}}></View>
                      <Heart
                        style={{display: 'flex', position: 'relative'}}
                        height={11.5}
                        width={11.5}
                        stroke={
                          votedOption &&
                          votedOption === props.post.options[0].id
                            ? '#FF0000'
                            : '#FFFFFF'
                        }
                        strokeWidth={3}
                        fill={
                          votedOption &&
                          votedOption === props.post.options[0].id
                            ? '#FF0000'
                            : 'transparent'
                        }
                      />
                    </Text>
                  </LinearGradient>
                )}
            </TouchableOpacity>
          </TouchableWithoutFeedback>
        </View>

        <View style={{flex: 1, paddingLeft: 1, flexDirection: 'column'}}>
          <TouchableWithoutFeedback
            style={{height: windowWidth / 2 - 1}}
            onPress={
              props.post.type === 'draft'
                ? collaborateOnPost
                : listenDoubleClick2
            }
            delayLongPress={400}
            onLongPress={longPress2}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}>
              {props.post.options[1]?.picture !== null &&
              props.post.options[1]?.picture !== undefined ? (
                <ProgressiveFastImage
                  blurRadius={2}
                  source={{
                    uri: assetsUrl + getMedium(props.post.options[1].picture),
                  }}
                  thumbnailSource={{
                    uri: assetsUrl + getTiny(props.post.options[1].picture),
                  }}
                  useNativeDriver={true}
                  loadingImageComponent={
                    <View
                      style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        position: 'absolute',
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        zIndex: -2,
                        backgroundColor: '#EFEFEF',
                      }}
                    />
                  }
                  resizeMode="cover"
                  style={{
                    height: windowWidth / 2 - 1,
                    width: windowWidth / 2 - 1,
                    opacity:
                      votedOption && votedOption == props.post.options[1].id
                        ? 1
                        : votedOption
                        ? 0.75
                        : 1,
                    zIndex: -1,
                  }}
                />
              ) : (
                <>
                  {props.post.type === 'draft' ? (
                    <View
                      style={{
                        height: windowWidth / 2 - 1,
                        width: windowWidth / 2 - 1,
                        backgroundColor: '#DADADA',
                        padding: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {props.post.userId === sessionUserId ? (
                        <Text
                          style={{
                            color: '#787878',
                            fontSize: 18,
                            fontWeight: '800',
                            marginTop: 4,
                            textAlign: 'center',
                            lineHeight: 28,
                          }}>
                          Others Add That
                        </Text>
                      ) : (
                        <View
                          activeOpacity={0.8}
                          style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                          }}>
                          <Ionicons
                            name="add-circle"
                            size={28}
                            color="#787878"
                          />
                          <Text
                            style={{
                              color: '#787878',
                              fontSize: 18,
                              fontWeight: '800',
                              marginTop: 4,
                              textAlign: 'center',
                              lineHeight: 28,
                            }}>
                            Collaborate
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View
                      style={{
                        height: windowWidth / 2 - 1,
                        width: windowWidth / 2 - 1,
                        backgroundColor: textPostBackgroundColors[1],
                        padding: 16,
                      }}>
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'stretch',
                        }}>
                        <Text
                          style={{
                            fontWeight: '800',
                            width: '100%',
                            fontSize: 20,
                            color: '#121212',
                            textAlign:
                              getNumberOfLines(props.post.options[1]?.title) > 2
                                ? 'left'
                                : 'center',
                            paddingBottom: props.post.type !== 'draft' ? 12 : 0,
                          }}
                          adjustsFontSizeToFit={true}
                          numberOfLines={getNumberOfLines(
                            props.post.options[1]?.title,
                          )}
                          minimumFontScale={1}>
                          {props.post.options[1]?.title}
                        </Text>
                      </View>
                    </View>
                  )}
                </>
              )}
              {showVoteAnimation2 && (
                <Animated.Image
                  style={{
                    opacity: Fade2,
                    transform: [
                      {
                        scale: ScaleValue2,
                      },
                      {
                        translateX: MoveX2,
                      },
                      {
                        translateY: MoveY2,
                      },
                    ],
                    resizeMode: 'contain',
                    width: windowWidth / 8,
                    height: windowWidth / 8,
                    position: 'absolute',
                  }}
                  source={plusOne}
                />
              )}
              {(votedOption || props.userId === sessionUserId) &&
                props.post.type !== 'draft' && (
                  <LinearGradient
                    colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.9)']}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      paddingLeft: 16,
                      paddingTop: 20,
                      paddingBottom: 10,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      paddingHorizontal: 8,
                    }}>
                    <Text
                      style={{
                        fontWeight: '500',
                        lineHeight: 14,
                        fontSize: 14,
                        color: '#FFFFFF',
                        alignItems: 'center',
                      }}>
                      {voteCounts[1]}
                      <View style={{width: 2}}></View>
                      <Heart
                        style={{display: 'flex', position: 'relative'}}
                        height={11.5}
                        width={11.5}
                        stroke={
                          votedOption &&
                          votedOption === props.post.options[1].id
                            ? '#FF0000'
                            : '#FFFFFF'
                        }
                        strokeWidth={3}
                        fill={
                          votedOption &&
                          votedOption === props.post.options[1].id
                            ? '#FF0000'
                            : 'transparent'
                        }
                      />
                    </Text>
                  </LinearGradient>
                )}
            </TouchableOpacity>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <View style={{flexDirection: 'row', paddingHorizontal: 0}}>
        {props.post.options[0].title !== null &&
          props.post.options[0].title !== undefined &&
          props.post.options[0].title.trim() !== '' &&
          props.post.options[0].picture !== null &&
          props.post.options[0].picture !== undefined && (
            <View style={{paddingRight: 1, flex: 1}}>
              <View
                style={{
                  flex: 1,
                  paddingLeft: 16,
                  paddingRight: 4,
                  paddingTop: 0,
                  paddingBottom: 9,
                  flexDirection: 'column',
                  backgroundColor:
                    votedOption && votedOption == props.post.options[0].id
                      ? 'rgba(102, 49, 247, 0.4)'
                      : '#ebf1f7',
                }}>
                {props.post.options[0].title != null &&
                  props.post.options[0].title != undefined &&
                  props.post.options[0].title.trim() != '' && (
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 14,
                        fontWeight: '500',
                        marginTop: 8,
                      }}>
                      {props.post.options[0].title.trim()}
                    </Text>
                  )}
              </View>
            </View>
          )}
        {props.post.options[1]?.title != null &&
          props.post.options[1]?.title != undefined &&
          props.post.options[1]?.title.trim() != '' &&
          props.post.options[1]?.picture !== null &&
          props.post.options[1]?.picture !== undefined && (
            <View style={{paddingLeft: 1, flex: 1}}>
              <View
                style={{
                  flex: 1,
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 0,
                  paddingBottom: 9,
                  flexDirection: 'column',
                  backgroundColor:
                    votedOption && votedOption == props.post.options[1].id
                      ? 'rgba(102, 49, 247, 0.4)'
                      : '#ebf1f7',
                }}>
                {props.post.options[1].title != null &&
                  props.post.options[1].title != undefined &&
                  props.post.options[1].title.trim() != '' && (
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 14,
                        fontWeight: '500',
                        marginTop: 8,
                      }}>
                      {props.post.options[1].title.trim()}
                    </Text>
                  )}
              </View>
            </View>
          )}
      </View>
    </>
  );
}

export default memo(PostMain);
