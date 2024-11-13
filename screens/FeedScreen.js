/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Post from '../components/Post';
import {getFeedPosts} from '../services/PostService';
import {feedPaginationItemCount} from '../services/Constants';
import {useRoute, useScrollToTop} from '@react-navigation/native';
import {ReloadContext} from '../contexts/ReloadContext';

function FeedScreen({navigation}) {
  // const [reloadFeed, setReloadFeed] = useState(route.params?.reloadFeed);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [page, setPage] = useState(0);
  const [endOfPosts, setEndOfPosts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showEndOfScreenSection, setShowEndOfScreenSection] = useState(false);

  const listRef = useRef(null);

  const route = useRoute();

  const {reloadFeed, setReloadFeed} = React.useContext(ReloadContext);

  useEffect(() => {
    if (reloadFeed) {
      listRef.current.scrollToOffset({animated: false, offset: 0});
      if (page !== 0) {
        setPage(0);
      } else {
        loadFeedPosts();
      }
      setReloadFeed(false);
    }
  }, [route, reloadFeed]);

  useEffect(() => {
    if (page >= 0) {
      loadFeedPosts();
    }
  }, [page]);

  const refreshPage = () => {
    setPosts([]);
    setEndOfPosts(false);
    setShowEndOfScreenSection(false);
    let currentPage = page;
    if (currentPage === 0) {
      loadFeedPosts();
    } else {
      setPage(0);
    }
  };

  const loadFeedPosts = async () => {
    if (page === 0) {
      setRefreshing(true);
    }

    getFeedPosts(page, feedPaginationItemCount)
      .then(response => response.json())
      .then(json => {
        if (page > 0) {
          setPosts(posts.concat(json.data));
        } else {
          setPosts(json.data);
        }
        if (json.data.length < feedPaginationItemCount) {
          setEndOfPosts(true);
          setTimeout(() => setShowEndOfScreenSection(true), 2000);
          setPage(-1);
        }
        setRefreshing(false);
        setLoadingMore(false);
      })
      .catch(error => {
        console.log("Feed posts can't be fetched: " + error);
        setRefreshing(false);
        setLoadingMore(false);
        if (page === 0) {
          setPage(-1);
        }
      });
  };

  const loadMorePosts = () => {
    if (!loadingMore && !endOfPosts) {
      setLoadingMore(true);
      setPage(page + 1);
    }
  };

  const renderPost = useCallback(({item, index}) => (
    <Post
      index={index}
      postAndDetails={item}
      showPostMeta={true}
      showCommentsLink={true}
      showAnalyticsLink={true}
      showVoteSummary={true}
      openPost={() => {
        navigation.navigate('Post', {postId: item.post.postId});
      }}
      openResults={() => {
        navigation.navigate('Analyze Results', {postId: item.post.postId});
      }}
      userName={item.post.userDetails.userName}
      fullName={item.post.userDetails.fullName}
      profilePicture={item.post.userDetails.profilePicture}
    />
  ));

  const keyExtractorFn = useCallback(
    postAndDetails => postAndDetails.post.postId,
  );

  useScrollToTop(listRef);

  return (
    <>
      <FlatList
        contentContainerStyle={localStyles.list}
        ref={listRef}
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractorFn}
        removeClippedSubviews={true}
        windowSize={25}
        onEndReachedThreshold={1.5}
        onEndReached={loadMorePosts}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
        }
        ListFooterComponent={
          <View
            style={{
              flexDirection: 'column',
              height: 180,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {showEndOfScreenSection ? (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  backgroundColor: '#EFEFEF',
                  justifyContent: 'center',
                  alignSelf: 'stretch',
                }}>
                <Text
                  style={{fontWeight: '400', fontSize: 14, color: '#787878'}}>
                  There's nothing else here!
                </Text>
                <Pressable
                  onPress={() =>
                    navigation.navigate('ExploreNav', {screen: 'Search'})
                  }
                  style={{
                    marginTop: 12,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    paddingVertical: 8,
                    paddingBottom: 9,
                    backgroundColor: 'rgba(102, 49, 247, 0.4)',
                  }}>
                  <Text style={{fontWeight: '500'}}>See What's Trending</Text>
                </Pressable>
              </View>
            ) : loadingMore || posts > 0 ? (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'center',
                  alignSelf: 'stretch',
                }}>
                <ActivityIndicator
                  style={{position: 'absolute'}}
                  size="large"
                  color="grey"
                />
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'center',
                  alignSelf: 'stretch',
                }}></View>
            )}
          </View>
        }
      />
    </>
  );
}

const localStyles = StyleSheet.create({
  list: {
    paddingBottom: 0,
    minHeight: 1000,
    backgroundColor: '#FFFFFF',
  },
});

export default FeedScreen;
