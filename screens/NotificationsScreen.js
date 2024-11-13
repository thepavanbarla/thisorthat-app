import React, {useEffect, useRef, useState} from 'react';
import {
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  View,
  FlatList,
} from 'react-native';
import Notification from '../components/Notification';
import {notificationsPaginationItemCount} from '../services/Constants';
import {getAllNotifications} from '../services/NotificationService';
import {useScrollToTop} from '@react-navigation/native';
import LoadingOverlay from '../components/LoadingOverlay';
import EmptyView from '../components/EmptyView';

function NotificationsScreen({navigation}) {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [page, setPage] = useState(0);
  const [endOfNotifications, setEndOfNotifications] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (page >= 0) {
      loadNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadNotifications = async () => {
    if (page === 0) {
      setRefreshing(true);
    }

    getAllNotifications(page, notificationsPaginationItemCount)
      .then(response => response.json())
      .then(json => {
        if (page === 0) {
          setNotifications([]);
        }
        if (json.data.length < notificationsPaginationItemCount) {
          setEndOfNotifications(true);
          setPage(-1);
        }
        if (page > 0) {
          setNotifications(notifications.concat(json.data));
        } else {
          setNotifications(json.data);
        }
        setFirstLoad(false);
        setRefreshing(false);
        setLoadingMore(false);
      })
      .catch(error => {
        console.log('Error fetching notifications', JSON.stringify(error));
        setFirstLoad(false);
        setRefreshing(false);
        setLoadingMore(false);
        if (page === 0) {
          setPage(-1);
        }
      });
  };

  const renderNotification = ({item}) => <Notification notification={item} />;

  const loadMoreNotifications = () => {
    if (!loadingMore && !endOfNotifications) {
      setLoadingMore(true);
      setPage(page + 1);
    }
  };

  const listRef = useRef(null);
  useScrollToTop(listRef);

  return (
    <>
      {firstLoad ? (
        <LoadingOverlay />
      ) : notifications.length === 0 ? (
        <EmptyView message="You have no notifications" />
      ) : (
        <FlatList
          style={localStyles.list}
          ref={listRef}
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={notification => notification.notificationId}
          onEndReachedThreshold={0.5}
          onEndReached={loadMoreNotifications}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setEndOfNotifications(false);
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
      )}
    </>
  );
}

const localStyles = StyleSheet.create({
  list: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
});

export default NotificationsScreen;
