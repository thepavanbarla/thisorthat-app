/* eslint-disable no-shadow */
import React, {useEffect, useRef, useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  RefreshControl,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SmallPassiveButton from '../components/SmallPassiveButton';
import Post from '../components/Post';
import {getUser} from '../services/AccountService';
import {getSessionUserId} from '../services/SessionService';
import {getUserPosts} from '../services/PostService';
import {
  follow,
  getFollowStatus,
  getUserByUserName,
  getUserStats,
  respondToFollowRequest,
  unfollow,
} from '../services/UserService';
import SmallInactiveButton from '../components/SmallInactiveButton';
import {useScrollToTop} from '@react-navigation/native';
import {BlurView} from '@react-native-community/blur';
import {buttonStyles} from '../styles/Common';
import {assetsUrl, profilePaginationItemCount} from '../services/Constants';
import LoadingOverlay from '../components/LoadingOverlay';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import {getTiny} from '../utils/ConversionUtils';
import {MoreVertical} from 'react-native-feather';
import {Modalize} from 'react-native-modalize';
import {Dimensions} from 'react-native';
import {Portal} from 'react-native-portalize';
import ProfileMenu from '../components/ProfileMenu';
import SmallActiveButton from '../components/SmallActiveButton';

const windowWidth = Dimensions.get('window').width;

function ProfileScreen({route, navigation}) {
  const [userId, setUserId] = useState(null);

  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [picture, setPicture] = useState(null);

  const [postsCount, setPostsCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [refreshing, setRefreshing] = useState(true);

  const [sessionUserId, setSessionUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [posts, setPosts] = useState([]);

  const [page, setPage] = useState(0);
  const [endOfPosts, setEndOfPosts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [modalText, setModalText] = useState('');

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSessionUserId().then(setSessionUserId);
  }, []);

  const loadAll = async () => {
    await loadUserData();
    await loadUserStats();
    await loadActions();
    await loadUserPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    if (page > 0) {
      loadUserPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadUserData = async () => {
    let varUserId;
    if (route.params && route.params.userId) {
      varUserId = route.params.userId;
    } else if (route.params && route.params.userName) {
      var userResponse = await getUserByUserName(route.params.userName);
      var jsonResponse = await userResponse.json();
      varUserId = jsonResponse.data.userId;
    } else {
      varUserId = await getSessionUserId();
    }
    setUserId(varUserId);

    getUser(varUserId)
      .then(response => response.json())
      .then(json => {
        setFullName(json.data.fullName);
        setUserName(json.data.userName);
        setPicture(json.data.profilePicture);
        setIsPrivate(json.data.isPrivate);
      })
      .catch(error => {
        console.log("User can't be fetched: " + JSON.stringify(error));
      });
  };

  const loadUserPosts = async () => {
    setLoadingMore(true);

    let varUserId;
    if (route.params && route.params.userId) {
      varUserId = route.params.userId;
    } else if (route.params && route.params.userName) {
      var userResponse = await getUserByUserName(route.params.userName);
      var jsonResponse = await userResponse.json();
      varUserId = jsonResponse.data.userId;
    } else {
      varUserId = await getSessionUserId();
    }

    getUserPosts(varUserId, page, profilePaginationItemCount)
      .then(response => response.json())
      .then(json => {
        console.log('User posts: ', json.data);
        if (page === 0) {
          setPosts([]);
        }
        if (json.data.length < profilePaginationItemCount) {
          setEndOfPosts(true);
        }
        if (page > 0) {
          setPosts(posts.concat(json.data));
        } else {
          setPosts(json.data);
        }
        setLoadingMore(false);
      })
      .catch(error => {
        console.log("User posts can't be fetched: ", error);
        setLoadingMore(false);
      });
  };

  const loadMorePosts = () => {
    if (!loadingMore && !endOfPosts) {
      setPage(page + 1);
    }
  };

  const loadUserStats = async () => {
    let varUserId;
    if (route.params && route.params.userId) {
      varUserId = route.params.userId;
    } else if (route.params && route.params.userName) {
      var userResponse = await getUserByUserName(route.params.userName);
      var jsonResponse = await userResponse.json();
      varUserId = jsonResponse.data.userId;
    } else {
      varUserId = await getSessionUserId();
    }

    getUserStats(varUserId)
      .then(response => response.json())
      .then(json => {
        setPostsCount(json.data.postsCount);
        setFollowerCount(json.data.followerCount);
        setFollowingCount(json.data.followingCount);
      })
      .catch(error => {
        console.log("User stats can't be fetched: " + JSON.stringify(error));
      });
  };

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showUnfollow, setShowUnfollow] = useState(false);
  const [showFollow, setShowFollow] = useState(false);
  const [showFollowBack, setShowFollowBack] = useState(false);
  const [showRequested, setShowRequested] = useState(false);
  const [showCancelRequest, setShowCancelRequest] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const resetActions = () => {
    setShowEditProfile(false);
    setShowFollowing(false);
    setShowUnfollow(false);
    setShowFollow(false);
    setShowFollowBack(false);
    setShowRequested(false);
    setShowCancelRequest(false);
    setIsFollowing(false);
  };

  const loadActions = async () => {
    let varUserId;
    if (route.params && route.params.userId) {
      varUserId = route.params.userId;
    } else if (route.params && route.params.userName) {
      var userResponse = await getUserByUserName(route.params.userName);
      var jsonResponse = await userResponse.json();
      varUserId = jsonResponse.data.userId;
    } else {
      varUserId = await getSessionUserId();
    }
    let sessionUserId = await getSessionUserId();

    resetActions();
    if (sessionUserId === varUserId) {
      setShowEditProfile(true);
      setIsFollowing(true);
    } else {
      getFollowStatus(sessionUserId, varUserId)
        .then(response => response.json())
        .then(json => {
          if (json.data) {
            if (json.data.accepted) {
              setShowFollowing(true);
              setShowUnfollow(true);
              setIsFollowing(true);
            } else {
              setShowRequested(true);
              setShowCancelRequest(true);
              setIsFollowing(false);
            }
          } else {
            setShowFollow(true);
          }
        });
    }
  };

  const renderPost = ({item}) => (
    <Post
      postAndDetails={item}
      openPost={() => {
        navigation.navigate('Post', {postId: item.post.postId});
      }}
      openResults={() => {
        navigation.navigate('Analyze Results', {postId: item.post.postId});
      }}
      userName={userName}
      showPostMeta={true}
      showCommentsLink={true}
      showAnalyticsLink={true}
      showVoteSummary={true}
      fullName={fullName}
      profilePicture={picture}
    />
  );

  const showFollowersFn = () => {
    navigation.push('Follow Management', {
      screen: 'Followers',
      userId: userId,
      followerCount,
      followingCount,
    });
  };

  const showFollowingFn = () => {
    navigation.push('Follow Management', {
      screen: 'Following',
      userId: userId,
      followerCount,
      followingCount,
    });
  };

  const flatListRef = useRef(null);
  const showStoriesFn = () => {
    // if (postsCount > 0) {
    //   flatListRef.scrollToIndex({animated: true, index: 0, viewOffset: 30});
    // }
  };

  const followUser = async () => {
    follow(userId)
      .then(response => response.json())
      .then(() => {
        loadActions();
        loadUserStats();
      });
  };

  const unfollowUser = async () => {
    unfollow(userId)
      .then(response => response.json())
      .then(() => {
        loadActions();
        loadUserStats();
      });
  };

  const [showFollowRequest, setShowFollowRequest] = useState(false);

  useEffect(() => {
    loadFollowRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFollowRequest = async () => {
    let sessionUserId = await getSessionUserId();
    getFollowStatus(userId, sessionUserId)
      .then(response => response.json())
      .then(json => {
        if (json.data) {
          if (!json.data.accepted) {
            setShowFollowRequest(true);
          }
        }
      });
  };

  const respondToRequest = async action => {
    let sessionUserId = await getSessionUserId();
    if (userId == null || sessionUserId === userId) {
      return;
    }
    respondToFollowRequest(userId, action)
      .then(response => response.json())
      .then(json => {
        setShowFollowRequest(false);
        loadUserStats();
      });
  };

  const profileMenuRef = useRef();

  const closePostMenu = () => {
    profileMenuRef.current?.close();
  };

  useScrollToTop(flatListRef);

  const openEditProfile = () => {
    navigation.push('Edit Profile', {
      onGoBack: loadUserData,
    });
  };

  return (
    <SafeAreaView style={{backgroundColor: '#FFFFFF'}}>
      {refreshing ? (
        <LoadingOverlay />
      ) : (
        <>
          <Portal>
            <Modalize
              ref={profileMenuRef}
              adjustToContentHeight={true}
              handleStyle={{
                height: 5,
                width: windowWidth / 4,
                top: 26,
                backgroundColor: '#ABABAB',
              }}
              rootStyle={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                zIndex: 10000,
              }}>
              <ProfileMenu
                userId={userId}
                close={closePostMenu}
                userName={userName}
                fullName={fullName}
              />
            </Modalize>
          </Portal>

          <FlatList
            data={!isPrivate || isFollowing ? posts : []}
            contentContainerStyle={localStyles.list}
            showsHorizontalScrollIndicator={false}
            ref={flatListRef}
            renderItem={renderPost}
            keyExtractor={postAndDetails => postAndDetails.post.postId}
            onEndReachedThreshold={0.2}
            onEndReached={loadMorePosts}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={loadAll} />
            }
            ListFooterComponent={
              loadingMore && (
                <View
                  style={{
                    flexDirection: 'column',
                    height: 120,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator
                    style={{position: 'absolute'}}
                    size="large"
                    color="grey"
                  />
                </View>
              )
            }
            ListHeaderComponent={
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  paddingTop: 80,
                  paddingBottom: 12,
                }}>
                {route?.params?.userId || route?.params?.userName ? (
                  <>
                    <View
                      style={{
                        position: 'absolute',
                        flexDirection: 'row',
                        left: 8,
                        top: Platform.OS === 'ios' ? 8 : 16,
                      }}>
                      <Pressable
                        style={{
                          position: 'relative',
                          top: Platform.OS === 'ios' ? 0 : -2,
                        }}
                        onPress={() => {
                          navigation.goBack();
                        }}>
                        <Ionicons
                          name="chevron-back-outline"
                          size={30}
                          color={'#121212'}
                        />
                      </Pressable>
                      <Text
                        style={{
                          fontSize: Platform.OS === 'ios' ? 17 : 20,
                          lineHeight: Platform.OS === 'ios' ? 28 : 25,
                          fontWeight: Platform.OS === 'ios' ? '600' : '500',
                          color: '#000000',
                        }}>
                        {userName}
                      </Text>
                    </View>
                    {userId !== sessionUserId && (
                      <View
                        style={{
                          position: 'absolute',
                          right: 16,
                          top: Platform.OS === 'ios' ? 8 : 16,
                        }}>
                        <Pressable
                          style={{paddingLeft: 12}}
                          onPress={() => {
                            profileMenuRef.current.open();
                          }}>
                          <MoreVertical
                            style={{marginTop: 4}}
                            color="#000000"
                          />
                        </Pressable>
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        position: 'absolute',
                        right: 16,
                        top: Platform.OS === 'ios' ? 8 : 16,
                      }}>
                      <Pressable
                        onPress={() => {
                          navigation.push('Settings', {
                            isPrivate,
                            setProfilePrivacy: setIsPrivate,
                          });
                        }}>
                        <Ionicons
                          name="cog-outline"
                          size={30}
                          color={'#121212'}
                        />
                      </Pressable>
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        flexDirection: 'row',
                        left: 16,
                        top: Platform.OS === 'ios' ? 8 : 16,
                      }}>
                      <Text
                        style={{
                          fontSize: Platform.OS === 'ios' ? 17 : 20,
                          lineHeight: Platform.OS === 'ios' ? 28 : 25,
                          fontWeight: Platform.OS === 'ios' ? '600' : '500',
                          color: '#000000',
                        }}>
                        {userName}
                      </Text>
                    </View>
                  </>
                )}
                <View style={localStyles.profileDetails}>
                  <ProgressiveFastImage
                    style={localStyles.profilePicture}
                    source={
                      picture == null
                        ? require('../assets/images/profile_picture_placeholder.png')
                        : {uri: assetsUrl + picture}
                    }
                    thumbnailSource={
                      picture == null
                        ? require('../assets/images/profile_picture_placeholder-thumb.png')
                        : {uri: assetsUrl + getTiny(picture)}
                    }
                  />

                  <Text style={localStyles.name}>{fullName}</Text>
                  <Text
                    style={{
                      display: 'flex',
                      paddingBottom: 10,
                      paddingHorizontal: 40,
                    }}></Text>
                  <View style={localStyles.statsContainer}>
                    <Pressable
                      disabled={!isFollowing && isPrivate}
                      activeOpacity={0.6}
                      delayPressIn={0}
                      onPress={showStoriesFn}
                      style={localStyles.statView}>
                      <Text style={localStyles.statNumber}>{postsCount}</Text>
                      <Text style={localStyles.statDescription}>Posts</Text>
                    </Pressable>
                    <Pressable
                      disabled={!isFollowing && isPrivate}
                      activeOpacity={0.6}
                      delayPressIn={0}
                      onPress={showFollowersFn}
                      style={localStyles.statView}>
                      <Text style={localStyles.statNumber}>
                        {followerCount}
                      </Text>
                      <Text style={localStyles.statDescription}>Followers</Text>
                    </Pressable>
                    <Pressable
                      disabled={!isFollowing && isPrivate}
                      activeOpacity={0.6}
                      delayPressIn={0}
                      onPress={showFollowingFn}
                      style={[localStyles.statView, {borderRightWidth: 0}]}>
                      <Text style={localStyles.statNumber}>
                        {followingCount}
                      </Text>
                      <Text style={localStyles.statDescription}>Following</Text>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignSelf: 'stretch',
                      justifyContent: 'space-between',
                      marginHorizontal: -6,
                      minHeight: 40,
                    }}>
                    {showEditProfile && (
                      <SmallPassiveButton
                        style={{flex: 1, marginHorizontal: 6}}
                        title="Edit Profile"
                        onPress={openEditProfile}
                      />
                    )}
                    {showFollowing && (
                      <SmallInactiveButton
                        disabled={true}
                        style={{flex: 1, marginHorizontal: 6}}
                        title="Following"
                        onPress={() => {}}
                      />
                    )}
                    {showUnfollow && (
                      <SmallActiveButton
                        style={{flex: 1, marginHorizontal: 6}}
                        title="Unfollow"
                        onPress={unfollowUser}
                      />
                    )}
                    {showFollow && (
                      <SmallActiveButton
                        style={{flex: 1, marginHorizontal: 6}}
                        title="Follow"
                        onPress={followUser}
                      />
                    )}
                    {showFollowBack && (
                      <SmallActiveButton
                        style={{flex: 1, marginHorizontal: 6}}
                        title="Follow Back"
                        onPress={followUser}
                      />
                    )}
                    {showRequested && (
                      <SmallInactiveButton
                        style={{flex: 1, marginHorizontal: 6}}
                        title="Requested"
                        onPress={openEditProfile}
                      />
                    )}
                    {showCancelRequest && (
                      <SmallPassiveButton
                        style={{flex: 1, marginHorizontal: 6}}
                        title="Cancel Request"
                        onPress={unfollowUser}
                      />
                    )}
                  </View>
                </View>
                {showFollowRequest && (
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingTop: 16,
                      alignSelf: 'stretch',
                      flexDirection: 'column',
                      backgroundColor: '#FFFFFF',
                    }}>
                    <View
                      style={{
                        padding: 16,
                        borderRadius: 4,
                        borderColor: '#E3E3E3',
                        borderWidth: 1,
                        backgroundColor: '#EFEFEF',
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          marginBottom: 10,
                          fontWeight: '500',
                        }}>
                        {fullName} has requested to follow you.{' '}
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Pressable
                          onPress={() => respondToRequest('accept')}
                          style={{
                            borderRadius: 4,
                            backgroundColor: 'rgba(102, 49, 247, 1)',
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            marginRight: 10,
                          }}>
                          <Text
                            style={{
                              fontWeight: '700',
                              fontSize: 12,
                              color: '#FFFFFF',
                            }}>
                            Accept
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => respondToRequest('reject')}
                          style={{
                            borderRadius: 4,
                            backgroundColor: 'rgba(102, 49, 247, 0.4)',
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            marginRight: 10,
                          }}>
                          <Text
                            style={{
                              fontWeight: '600',
                              fontSize: 12,
                              color: '#121212',
                            }}>
                            Reject
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}
                {/* </ImageBackground> */}
                {!isFollowing && isPrivate && (
                  <View
                    style={{
                      height: 300,
                      flexDirection: 'column',
                      alignItems: 'center',
                      paddingVertical: 50,
                    }}>
                    <View
                      style={{
                        marginBottom: 12,
                        width: 70,
                        height: 70,
                        borderWidth: 2,
                        borderRadius: 35,
                        borderColor: '#DEDEDE',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#FFFFFF',
                      }}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={36}
                        color={'#898989'}
                      />
                    </View>
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 16,
                        marginBottom: 6,
                      }}>
                      This Account is Private
                    </Text>
                    <Text>Follow {fullName} to see their posts</Text>
                  </View>
                )}
                {postsCount === 0 &&
                  !loadingMore &&
                  (isFollowing || !isPrivate || sessionUserId === userId) && (
                    <View
                      style={{
                        height: 300,
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingVertical: 50,
                      }}>
                      <View
                        style={{
                          marginBottom: 12,
                          width: 70,
                          height: 70,
                          borderWidth: 1,
                          borderRadius: 35,
                          borderColor: '#DEDEDE',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#FFFFFF',
                        }}>
                        <Ionicons
                          name="american-football-outline"
                          size={36}
                          color={'#898989'}
                        />
                      </View>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 16,
                          marginBottom: 6,
                        }}>
                        No Posts
                      </Text>

                      {/* Uncomment when navigation bug is fixed */}
                      {/* { sessionUserId == userId && 
                                    <SmallPassiveButton style={{marginHorizontal: 6, alignSelf: 'center', borderWidth: 0, backgroundColor: 'transparent',}} title="Create New Post" onPress={navigateToCreate}/>
                                } */}
                    </View>
                  )}
              </View>
            }
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <BlurView
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                zIndex: 100,
              }}
              blurType="dark"
              blurAmount={4}
              reducedTransparencyFallbackColor="#232323"
            />
            <View
              style={{
                position: 'absolute',
                backgroundColor: '#FFFFFF',
                left: 0,
                right: 0,
                bottom: 0,
                paddingVertical: 28,
                borderTopWidth: 1,
                borderTopColor: '#EFEFEF',
                zIndex: 1000,
              }}>
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 18, lineHeight: 24}}>{modalText}</Text>

                <Pressable
                  activeOpacity={0.6}
                  delayPressIn={0}
                  onPress={() => setModalVisible(false)}
                  style={{marginTop: 24}}>
                  <Text style={[buttonStyles.largeTextLinks, {fontSize: 20}]}>
                    Dismiss
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  background: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 100 : 68,
    position: 'relative',
  },
  child: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  name: {
    fontWeight: '700',
    fontSize: 20,
    marginTop: 12,
    marginBottom: 12,
  },
  handleContainer: {
    marginBottom: 16,
    backgroundColor: '#565656',
    borderRadius: 8,
  },
  handle: {
    fontSize: 13,
    color: '#EFEFEF',
    letterSpacing: 0.5,
    paddingVertical: 6,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  bio: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,

    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingRight: 24,
    marginBottom: 16,
    marginLeft: 24,
  },
  statView: {
    flex: 1,
    width: 100,
    flexDirection: 'column',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#DEDEDE',
    marginBottom: 2,
    paddingVertical: 8,
  },
  statNumber: {
    fontWeight: '800',
    fontSize: 20,
    lineHeight: 28,
    color: '#343434',
  },
  statDescription: {
    fontWeight: '400',
    color: '#898989',
    fontSize: 12,
    lineHeight: 18,
  },
  profileDetails: {
    padding: 16,
    paddingBottom: 0,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  list: {
    paddingBottom: 0,
  },
});

export default ProfileScreen;
