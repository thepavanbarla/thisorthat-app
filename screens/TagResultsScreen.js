import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  LeftHorizontal,
  NoHorizontal,
  RightHorizontal,
} from '../components/PostLayouts';
import {explorePaginationItemCount} from '../services/Constants';
import {getTagPosts} from '../services/PostService';
import * as _ from 'lodash';

function TagResultsScreen({route, navigation}) {
  const {tag} = route.params;

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(0);
  const [endOfPosts, setEndOfPosts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '#' + tag,
    });
  });

  useEffect(() => {
    if (page >= 0) {
      loadTagPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadTagPosts = async () => {
    if (page === 0) {
      setRefreshing(true);
    }

    getTagPosts(tag, page, explorePaginationItemCount)
      .then(response => {
        return response.json();
      })
      .then(json => {
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
        console.log("Tag posts can't be fetched: ", error);
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

  const openPost = item => {
    navigation.navigate('Post', {postId: item.post.postId});
  };

  const renderPost = ({item, index}) => {
    return (
      <>
        {index % 4 === 0 && <LeftHorizontal posts={item} openPost={openPost} />}
        {index % 4 === 1 && <NoHorizontal posts={item} openPost={openPost} />}
        {index % 4 === 2 && (
          <RightHorizontal posts={item} openPost={openPost} />
        )}
        {index % 4 === 3 && <NoHorizontal posts={item} openPost={openPost} />}
      </>
    );
  };

  return (
    <>
      <FlatList
        contentContainerStyle={localStyles.list}
        data={_.chunk(posts, 3)}
        renderItem={renderPost}
        onEndReachedThreshold={0.2}
        onEndReached={loadMorePosts}
        keyExtractor={arr => arr[0].post.postId}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
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
      />
    </>
  );
}

const localStyles = StyleSheet.create({
  list: {
    paddingBottom: 4,
    paddingTop: 12,
    backgroundColor: '#EFEFEF',
  },
});

export default TagResultsScreen;
