import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
} from 'react-native';
import * as _ from 'lodash';
import {getExplorePosts} from '../services/PostService';

import {explorePaginationItemCount} from '../services/Constants';
import {useScrollToTop} from '@react-navigation/native';
import {
  LeftHorizontal,
  NoHorizontal,
  RightHorizontal,
} from '../components/PostLayouts';
import {getInterests} from '../services/AccountService';
import Post from '../components/Post';

function ExploreScreen({navigation}) {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(0);
  const [endOfPosts, setEndOfPosts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(null);

  useEffect(() => {
    if (page >= 0) {
      loadExplorePosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadExplorePosts = async () => {
    console.log('loading posts for page', page);
    if (page === 0) {
      setRefreshing(true);
    }
    getExplorePosts(page, explorePaginationItemCount, selectedInterest)
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log('Exploringggg ', json);

        if (page === 0) {
          setPosts([]);
        }

        if (json.data.length < explorePaginationItemCount) {
          setEndOfPosts(true);
          setPage(-1);
        }
        if (page > 0) {
          setPosts(posts.concat(json.data));
        } else {
          setPosts(json.data);
        }
        setRefreshing(false);
        setLoadingMore(false);
      })
      .catch(error => {
        console.log("Explore posts can't be fetched: ", error);
        setRefreshing(false);
        setLoadingMore(false);
        if (page === 0) {
          setPage(-1);
        }
      });
  };

  const loadMorePosts = () => {
    console.log('loading more posts...');
    if (!loadingMore && !endOfPosts) {
      setLoadingMore(true);
      setPage(page + 1);
    }
  };

  // const openPost = item => {
  //   navigation.navigate('Post', {postId: item.post.postId});
  // };

  // const renderPost = ({item, index}) => {
  //   return (
  //     <>
  //       {index % 4 === 0 && <LeftHorizontal posts={item} openPost={openPost} />}
  //       {index % 4 === 1 && <NoHorizontal posts={item} openPost={openPost} />}
  //       {index % 4 === 2 && (
  //         <RightHorizontal posts={item} openPost={openPost} />
  //       )}
  //       {index % 4 === 3 && <NoHorizontal posts={item} openPost={openPost} />}
  //     </>
  //   );
  // };

  const renderPost = ({item, index}) => (
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
  );

  const keyExtractorFn = postAndDetails => postAndDetails.post.postId;

  const listRef = useRef(null);
  useScrollToTop(listRef);

  return (
    <>
      <FlatList
        contentContainerStyle={localStyles.list}
        ref={listRef}
        // data={_.chunk(posts, 3)}
        data={posts}
        renderItem={renderPost}
        onEndReachedThreshold={0.5}
        onEndReached={loadMorePosts}
        keyExtractor={keyExtractorFn}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setSelectedInterest(null);
              setEndOfPosts(false);
              setPage(0);
            }}
          />
        }
        ListFooterComponent={
          loadingMore &&
          page > 0 && (
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
        // ListHeaderComponent={
        //   <View style={{marginBottom: 12}}>
        //     {interests && interests.length > 0 && (
        //       <ScrollView
        //         showsHorizontalScrollIndicator={false}
        //         horizontal={true}
        //         style={{
        //           flexDirection: 'row',
        //           paddingVertical: 12,
        //           paddingLeft: 12,
        //           backgroundColor: '#FFFFFF',
        //         }}
        //         contentContainerStyle={{paddingRight: 12}}>
        //         {interests.map(i => (
        //           <InterestTile
        //             key={i.interestTag}
        //             interest={i}
        //             selectedInterest={selectedInterest}
        //             setSelectedInterest={setSelectedInterest}
        //           />
        //         ))}
        //       </ScrollView>
        //     )}
        //   </View>
        // }
      />
    </>
  );
}

const localStyles = StyleSheet.create({
  list: {
    paddingBottom: 0,
    marginTop: 0,
    backgroundColor: '#EFEFEF',
  },
});

export default ExploreScreen;
