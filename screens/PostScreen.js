import React, {useEffect, useState} from 'react';
import {RefreshControl} from 'react-native';
import PostComments from '../components/PostComments';
import Post from '../components/Post';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getPost} from '../services/PostService';
import LoadingOverlay from '../components/LoadingOverlay';

function PostScreen({route, navigation}) {
  const {postId} = route.params;
  const [postAndDetails, setPostAndDetails] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(JSON.stringify(new Date()));

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
            animate={false}
            postAndDetails={postAndDetails}
            userName={postAndDetails.post.userDetails.userName}
            fullName={postAndDetails.post.userDetails.fullName}
            profilePicture={postAndDetails.post.userDetails.profilePicture}
            showPostMeta={true}
            showVoteSummary={true}
            showCommentsLink={false}
            showAnalyticsLink={true}
            openResults={() => {
              navigation.navigate('Analyze Results', {
                postId: postAndDetails.post.postId,
              });
            }}
          />
          <PostComments post={postAndDetails.post} key={now} />
        </KeyboardAwareScrollView>
      ) : (
        <LoadingOverlay />
      )}
    </>
  );
}

export default PostScreen;
