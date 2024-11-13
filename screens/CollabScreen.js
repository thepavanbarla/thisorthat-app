import React, {useEffect, useState, useRef} from 'react';
import {
  Dimensions,
  View,
  Text,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {assetsUrl, textPostColors} from '../services/Constants';
import Carousel from 'react-native-snap-carousel';
import {getCollabPosts, getPost, voteOnPost} from '../services/PostService';
import LoadingOverlay from '../components/LoadingOverlay';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  ChevronLeft,
  MessageSquare,
  PieChart,
  PlusCircle,
} from 'react-native-feather';
import {
  getSessionUserId,
  retrieveSessionUser,
} from '../services/SessionService';
import {getMedium} from '../utils/ConversionUtils';
import FastImage from 'react-native-fast-image';

const CollabScreen = ({route, navigation}) => {
  const plusOne = require('../assets/images/heartbeat.png');
  const [draftPostId, setDraftPostId] = useState(route.params.draftPostId);
  const [draftPost, setDraftPost] = useState(null);
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const [thisVoteCount, setThisVoteCount] = useState(null);
  const [focusPostId, setFocusPostId] = useState(null);
  const [focusPost, setFocusPost] = useState(null);

  const [collabPosts, setCollabPosts] = useState([]);
  const [sessionUserId, setSessionUserId] = useState(null);

  const [votedOption, setVotedOption] = useState(null);
  const [voteCounts, setVoteCounts] = useState([0, 0]);
  const [votes, setVotes] = useState([]);
  const [collabPostsLoading, setCollabPostsLoading] = useState(true);

  const vote = async i => {
    const sessionUser = await retrieveSessionUser();
    const varSessionUserId = sessionUser.userId;
    const sessionUserGender = sessionUser.gender;
    const sessionUserDob = sessionUser.dob;

    var voteObj = {
      userId: varSessionUserId,
      postId: focusPost.post.postId,
      option: focusPost.post.options[i],
      userDetails: {
        gender: sessionUserGender,
        dob: sessionUserDob,
      },
    };

    if (votedOption) {
      var lastVoteIndex = 0;
      setVotes(
        votes.map(varVote => {
          if (varVote.userId === voteObj.userId) {
            voteObj.voteId = varVote.voteId;
            if (varVote.option.id === focusPost.post.options[1].id) {
              lastVoteIndex = 1;
            }
            return voteObj;
          }
          return varVote;
        }),
      );
      if (i !== lastVoteIndex) {
        setThisVoteCount(voteCounts[0] + (i === 0 ? 1 : -1));
        setVoteCounts([
          voteCounts[0] + (i === 0 ? 1 : -1),
          voteCounts[1] + (i === 1 ? 1 : -1),
        ]);
      }
    } else {
      setVotes([...votes, voteObj]);
      setThisVoteCount(voteCounts[0] + (i === 0 ? 1 : 0));
      setVoteCounts([
        voteCounts[0] + (i === 0 ? 1 : 0),
        voteCounts[1] + (i === 1 ? 1 : 0),
      ]);
    }
    setVotedOption(focusPost.post.options[i].id);

    voteOnPost(voteObj)
      .then(response => response.json())
      .then(json => {
        console.log('Voted successfully');
        getPost(focusPostId)
          .then(response => response.json())
          .then(json1 => {
            var varNewPost = json1.data;
            setCollabPosts(
              collabPosts.map(varPost =>
                varPost.post.postId === varNewPost.post.postId
                  ? varNewPost
                  : varPost,
              ),
            );
          });
      });
  };

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

  useEffect(() => {
    loadSessionUser();
  }, []);

  const loadSessionUser = async () => {
    const varSessionUserId = await getSessionUserId();
    setSessionUserId(varSessionUserId);
  };

  useEffect(() => {
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftPostId]);

  const loadPost = async () => {
    getPost(draftPostId)
      .then(response => response.json())
      .then(json => {
        setDraftPost(json.data.post);
      });
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

  const listenDoubleClick1 = () => {
    if (clickCount2 > 0) {
      return;
    }

    clickCount1++;
    if (clickCount1 === 2) {
      if (collabPosts.length > 0) {
        setShowVoteAnimation1(true);
        clearTimeout(clickTimer1);
        doubleClick1();
        setTimeout(() => {
          vote(0);
        }, 1000);
      }
    } else {
      clickTimer1 = setTimeout(() => {
        clickCount1 = 0;
      }, 500);
    }
  };

  const listenDoubleClick2 = () => {
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
      }, 1000);
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
          toValue: 0 - windowWidth - 150,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.linear(Easing.cubic),
        }),
        Animated.timing(MoveY1, {
          toValue: windowWidth + 300,
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
    ]).start();
    setTimeout(() => {
      setShowVoteAnimation1(false);
    }, 1000);

    setTimeout(() => {
      setShowVoteAnimation1(true);
    }, 1001);
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
          toValue: windowWidth + 150,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.linear(Easing.cubic),
        }),
        Animated.timing(MoveY2, {
          toValue: 0 - windowWidth - 300,
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
      ]),
    ]).start();
    setTimeout(() => {
      setShowVoteAnimation2(false);
    }, 1000);

    setTimeout(() => {
      setShowVoteAnimation2(true);
    }, 1001);
  };

  useEffect(() => {
    if (draftPostId === null) {
      return;
    }
    getCollabPosts(draftPostId, 0, 30)
      .then(response => {
        return response.json();
      })
      .then(json => {
        setCollabPosts(json.data);
        setCollabPostsLoading(false);
        setThisVoteCount(
          json.data[0].postStats?.options[0]?.totalOptionCount || 0,
        );
        setFocusPostId(json.data[0].post.postId);
        setFocusPost(json.data[0]);
        setVotes(json.data[0]?.votes);
        setVotedOption(json.data[0].sessionUserVote?.option?.id);
        setVoteCounts([
          json.data[0]?.postStats?.options[0]?.totalOptionCount,
          json.data[0]?.postStats?.options[1]?.totalOptionCount,
        ]);
      })
      .catch(error => {
        console.log('Could not fetch collab posst for draft', error);
        setCollabPostsLoading(false);
      });
  }, [draftPostId]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const renderCarouselItem = ({item, index}) => {
    return (
      <View
        style={{
          width: windowHeight / 3,
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'visible',
        }}>
        <TouchableWithoutFeedback
          onPress={listenDoubleClick2}
          style={{
            height: windowHeight / 3 + 24,
            width: windowHeight / 3,
            position: 'relative',
            borderRadius: 0,
            paddingTop: 24,
            overflow: 'visible',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
                zIndex: 100,
              }}
              source={plusOne}
            />
          )}
          {draftPost.options[0].picture ? (
            <FastImage
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 0,
                backgroundColor: '#DADADA',
              }}
              source={{
                uri: assetsUrl + getMedium(item.post.options[1].picture),
              }}
            />
          ) : (
            <View
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: textPostColors[index % textPostColors.length],
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
                    getNumberOfLines(item.post.options[1].title) > 2
                      ? 'left'
                      : 'center',
                }}
                adjustsFontSizeToFit={true}
                numberOfLines={getNumberOfLines(item.post.options[1].title)}
                minimumFontScale={1}>
                {item.post.options[1].title}
              </Text>
            </View>
          )}
          <LinearGradient
            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
            style={{
              bottom: 0,
              left: 0,
              right: 0,
              padding: 10,
              paddingTop: 20,
              position: 'absolute',
              flexDirection: 'row',
              overflow: 'visible',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {draftPost.options[0].picture && (
              <Text style={{color: '#FFFFFF', fontSize: 14, fontWeight: '600'}}>
                {item.post.options[1].title}
              </Text>
            )}
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: '300',
                fontStyle: 'italic',
              }}>
              by {item.post.userDetails.userName}
            </Text>
          </LinearGradient>

          <View
            style={{
              opacity: currentSlideIndex === index ? 1 : 0,
              height: 60,
              width: 60,
              borderRadius: 30,
              backgroundColor:
                votedOption && votedOption === focusPost.post.options[1].id
                  ? '#FF0000'
                  : '#232323',
              position: 'absolute',
              top: 0,
              right: 10,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 101,
            }}>
            <Text style={{fontSize: 20, color: '#EFEFEF', fontWeight: '400'}}>
              {item.postStats?.options[1]?.totalOptionCount || 0}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };
  const carouselRef = useRef(null);

  const onChange = index => {
    setThisVoteCount(
      collabPosts[index].postStats?.options[0]?.totalOptionCount || 0,
    );
    setFocusPostId(collabPosts[index]?.post?.postId);
    setFocusPost(collabPosts[index]);
    setVotes(collabPosts[index]?.votes);
    setVotedOption(collabPosts[index].sessionUserVote?.option?.id);
    setVoteCounts([
      collabPosts[index]?.postStats?.options[0]?.totalOptionCount,
      collabPosts[index]?.postStats?.options[1]?.totalOptionCount,
    ]);
    setCurrentSlideIndex(index);
  };

  const collaborateOnPost = () => {
    navigation.navigate('CreateNav', {
      screen: 'Create New Post',
      params: {
        draftPost: draftPost,
        draftPostId: draftPost.postId,
      },
    });
  };

  return (
    <>
      {draftPost === null ? (
        <LoadingOverlay />
      ) : (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: '#EFEFEF',
          }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingTop: Platform.OS === 'ios' ? windowHeight / 12 - 30 : 0,
              overflow: 'visible',
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                backgroundColor: '100%',
                paddingVertical: 8,
                alignItems: 'center',
                position: 'relative',
                justifyContent: 'center',
                marginBottom: 8,
              }}>
              <Pressable
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
                style={{
                  left: 8,
                  padding: 8,
                  marginRight: 8,
                  zIndex: 1000,
                }}>
                <ChevronLeft stroke="#121212" height={30} width={30} />
              </Pressable>
              <Text
                numberOfLines={2}
                style={{
                  fontWeight: '600',
                  fontSize: 16,
                  textAlign: 'left',
                  flex: 1,
                  paddingRight: 16,
                }}>
                {draftPost.context}
              </Text>
            </View>

            <TouchableWithoutFeedback
              onPress={listenDoubleClick1}
              style={{
                height: windowHeight / 3 + 24,
                width: windowHeight / 3,
                position: 'relative',
                paddingBottom: 24,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'visible',
              }}>
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
                    zIndex: 100,
                  }}
                  source={plusOne}
                />
              )}
              {draftPost.options[0].picture ? (
                <FastImage
                  style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: '#DADADA',
                  }}
                  source={{
                    uri: assetsUrl + getMedium(draftPost.options[0].picture),
                  }}
                />
              ) : (
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: '#95AFC0',
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
                        getNumberOfLines(draftPost.options[0].title) > 2
                          ? 'left'
                          : 'center',
                    }}
                    adjustsFontSizeToFit={true}
                    numberOfLines={getNumberOfLines(draftPost.options[0].title)}
                    minimumFontScale={1}>
                    {draftPost.options[0].title}
                  </Text>
                </View>
              )}
              <LinearGradient
                colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  paddingBottom: 20,
                  padding: 10,
                  position: 'absolute',
                  flexDirection: 'row',
                  overflow: 'visible',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {draftPost.options[0].picture && (
                  <Text
                    style={{color: '#FFFFFF', fontSize: 14, fontWeight: '600'}}>
                    {draftPost.options[0].title}
                  </Text>
                )}
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: '300',
                    fontStyle: 'italic',
                  }}>
                  by {draftPost.userDetails.userName}
                </Text>
              </LinearGradient>
              {collabPosts.length > 0 && (
                <View
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    backgroundColor:
                      votedOption &&
                      votedOption === focusPost.post.options[0].id
                        ? '#FF0000'
                        : '#232323',
                    position: 'absolute',
                    bottom: 0,
                    left: 10,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 101,
                  }}>
                  <Text
                    style={{fontSize: 20, color: '#EFEFEF', fontWeight: '400'}}>
                    {thisVoteCount}
                  </Text>
                </View>
              )}
            </TouchableWithoutFeedback>

            {collabPostsLoading ? (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: windowHeight / 3,
                  width: windowHeight / 3,
                  justifyContent: 'center',
                }}>
                <ActivityIndicator size={'large'} />
              </View>
            ) : collabPosts.length > 0 ? (
              <Carousel
                layout={'default'}
                contentContainerCustomStyle={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                enableMomentum={true}
                decelerationRate={0.9}
                removeClippedSubviews={false}
                activeAnimationType={'spring'}
                enableSnap={true}
                loopClonesPerSide={3}
                ref={carouselRef}
                data={collabPosts}
                renderItem={renderCarouselItem}
                sliderWidth={windowWidth}
                itemWidth={windowHeight / 3}
                onSnapToItem={onChange}
              />
            ) : draftPost.userId !== sessionUserId ? (
              <Pressable
                activeOpacity={0.8}
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: windowHeight / 3,
                  width: windowHeight / 3,
                  justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                }}
                onPress={collaborateOnPost}>
                <Ionicons name="add-circle" size={28} color="#787878" />
                <Text
                  style={{
                    color: '#787878',
                    fontWeight: '700',
                    fontSize: 18,
                    marginTop: 6,
                  }}>
                  Collaborate Now
                </Text>
              </Pressable>
            ) : (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: windowHeight / 3,
                  width: windowHeight / 3,
                  justifyContent: 'center',
                  backgroundColor: '#DADADA',
                }}>
                <Text
                  style={{
                    color: '#787878',
                    fontWeight: '700',
                    fontSize: 18,
                    marginTop: 6,
                  }}>
                  Others can Collaborate
                </Text>
              </View>
            )}

            {collabPosts.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 12,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: windowHeight / 3,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('Analyze Results', {
                        postId: focusPostId,
                      })
                    }
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      padding: 12,
                      borderRadius: 30,
                      backgroundColor: '#FFFFFF',
                      marginRight: 8,
                    }}>
                    <PieChart
                      stroke="#000000"
                      strokeWidth={1.8}
                      height={24}
                      width={24}
                    />
                  </Pressable>
                  <Pressable
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('Post', {postId: focusPostId})
                    }
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      padding: 12,
                      borderRadius: 30,
                      backgroundColor: '#FFFFFF',
                      marginRight: 8,
                    }}>
                    <MessageSquare
                      stroke="#000000"
                      strokeWidth={1.8}
                      height={24}
                      width={24}
                    />
                  </Pressable>
                </View>
                {draftPost.userId !== sessionUserId && (
                  <Pressable
                    activeOpacity={0.8}
                    onPress={collaborateOnPost}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      padding: 12,
                      borderRadius: 30,
                      backgroundColor: '#FFFFFF',
                    }}>
                    <PlusCircle
                      stroke="#000000"
                      strokeWidth={1.8}
                      height={24}
                      width={24}
                    />
                  </Pressable>
                )}
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export default CollabScreen;
