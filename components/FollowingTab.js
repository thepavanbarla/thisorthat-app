import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  View,
} from 'react-native';
import {usersListPaginationItemCount} from '../services/Constants';
import {getFollowing} from '../services/UserService';
import EmptyView from './EmptyView';
import LoadingView from './LoadingView';

import SearchUser from './SearchUser';

const FollowingTab = ({route}) => {
  const {userId} = route.params;
  const [following, setFollowing] = React.useState([]);
  const [followingDataLoaded, setFollowingDataLoaded] = React.useState(false);

  const [page, setPage] = useState(0);
  const [endOfUsers, setEndOfUsers] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    getFollowing(userId, page, usersListPaginationItemCount)
      .then(response => response.json())
      .then(json => {
        if (page === 0) {
          setFollowing([]);
          setFollowing(json.data);
        } else {
          setFollowing(setFollowing.concat(json.data));
        }

        if (json.data.length < usersListPaginationItemCount)
          setEndOfUsers(true);

        setFollowingDataLoaded(true);
        setLoadingMore(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, userId]);

  const loadMorePosts = () => {
    if (!loadingMore && !endOfUsers) {
      setLoadingMore(true);
      setPage(page + 1);
    }
  };

  const renderFollowingItem = ({item}) => <SearchUser user={item} />;

  return (
    <>
      {followingDataLoaded ? (
        following.length === 0 ? (
          <EmptyView message="You are not following anyone" />
        ) : (
          <SafeAreaView style={localStyles.view}>
            <FlatList
              style={localStyles.list}
              data={following}
              renderItem={renderFollowingItem}
              keyExtractor={user => user.userId}
              onEndReachedThreshold={0.2}
              onEndReached={loadMorePosts}
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
          </SafeAreaView>
        )
      ) : (
        <LoadingView />
      )}
    </>
  );
};

const localStyles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  list: {
    paddingHorizontal: 8,
  },
});

export default FollowingTab;
