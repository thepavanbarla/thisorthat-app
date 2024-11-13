import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, RefreshControl, Pressable, Text, View} from 'react-native';
import PostAnalytics from '../components/PostAnalytics';
import Post from '../components/Post';
import {getPost} from '../services/PostService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LoadingOverlay from '../components/LoadingOverlay';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {buttonStyles} from '../styles/Common';

function AnalyticsScreen({route, navigation}) {
  const windowWidth = Dimensions.get('window').width;

  const {postId} = route.params;
  const [postAndDetails, setPostAndDetails] = useState(null);
  const [now, setNow] = useState(JSON.stringify(new Date()));
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const loadPost = async () => {
    getPost(postId)
      .then(response => response.json())
      .then(json => {
        setPostAndDetails(json.data);
        setNow(JSON.stringify(new Date()));
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPost();
  };

  const showVoters = (showChoices, option, varPostId, optionId) => {
    navigation.push('Voters', {
      showChoices: showChoices,
      option: option,
      postId: varPostId,
      optionId,
    });
  };

  const [modalText, setModalText] = useState('');
  const modalizeRef = useRef();

  return (
    <>
      {postAndDetails ? (
        <KeyboardAwareScrollView
          keyboardOpeningTime={0}
          extraScrollHeight={30}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Post
            postAndDetails={postAndDetails}
            userName={postAndDetails.post.userDetails.userName}
            fullName={postAndDetails.post.userDetails.fullName}
            profilePicture={postAndDetails.post.userDetails.profilePicture}
            showPostMeta={true}
            showCommentsLink={true}
            showAnalyticsLink={false}
            showVoteSummary={false}
            openPost={() => {
              navigation.navigate('Post', {postId: postAndDetails.post.postId});
            }}
            sendPost={text => {
              setModalText(text);
              modalizeRef.current?.open();
            }}
          />
          <PostAnalytics
            key={now}
            postAndDetails={postAndDetails}
            showVoters={showVoters}
          />
        </KeyboardAwareScrollView>
      ) : (
        <LoadingOverlay />
      )}
      <Portal>
        <Modalize
          ref={modalizeRef}
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
          <View
            style={{
              backgroundColor: '#FFFFFF',
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
              <Text style={{fontSize: 16, lineHeight: 24}}>{modalText}</Text>

              <Pressable
                activeOpacity={0.6}
                delayPressIn={0}
                onPress={() => modalizeRef.current?.close()}
                style={{marginTop: 24}}>
                <Text style={[buttonStyles.largeTextLinks, {fontSize: 18}]}>
                  Dismiss
                </Text>
              </Pressable>
            </View>
          </View>
        </Modalize>
      </Portal>
    </>
  );
}

export default AnalyticsScreen;
