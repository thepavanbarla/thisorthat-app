import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {usersListPaginationItemCount} from '../services/Constants';
import {getFollowers} from '../services/UserService';
import EmptyView from './EmptyView';
import LoadingView from './LoadingView';

import SearchUser from './SearchUser';

const FollowersTab = ({route}) => {
  const {userId} = route.params;
  const [followers, setFollowers] = React.useState([]);
  const [followersDataLoaded, setFollowersDataLoaded] = React.useState(false);

  const [page, setPage] = useState(0);
  const [endOfUsers, setEndOfUsers] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    getFollowers(userId, page, usersListPaginationItemCount)
      .then(response => response.json())
      .then(json => {
        if (page === 0) {
          setFollowers([]);
          setFollowers(json.data);
        } else {
          setFollowers(followers.concat(json.data));
        }

        if (json.data.length < usersListPaginationItemCount)
          setEndOfUsers(true);

        setFollowersDataLoaded(true);
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

  const renderFollowerItem = ({item}) => <SearchUser user={item} />;

  return (
    <>
      {followersDataLoaded ? (
        followers.length === 0 ? (
          <EmptyView message="You have no followers" />
        ) : (
          <SafeAreaView style={localStyles.view}>
            <FlatList
              style={localStyles.list}
              data={followers}
              renderItem={renderFollowerItem}
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

export default FollowersTab;
