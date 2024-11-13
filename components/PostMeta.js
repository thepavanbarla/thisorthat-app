import React, {memo} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import PostVoteSummary from './PostVoteSummary';
import {MessageSquare, PlusCircle, Send} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import {getPost} from '../services/PostService';

function PostMeta(props) {
  const navigation = useNavigation();
  const {votes} = props;

  const sendPostFn = () => {
    props.sendPost();
  };

  const collaborateOnPost = async () => {
    const getDraftPostResponse = await getPost(props.post.draftPostId);
    const draftPostRes = await getDraftPostResponse.json();

    navigation.navigate('CreateNav', {
      screen: 'Create New Post',
      params: {
        draftPost: draftPostRes.data.post,
        draftPostId: props.post.draftPostId,
      },
    });
  };

  return (
    <View style={localStyles.metaView}>
      <View style={localStyles.actionsView}>
        {props.post.type !== 'draft' && props.showCommentsLink && (
          <Pressable
            onPress={props.openPost}
            style={localStyles.actionButton}
            unstable_pressDelay={0}>
            <MessageSquare
              stroke="#000000"
              strokeWidth={1.8}
              height={24}
              width={24}
            />
          </Pressable>
        )}

        <Pressable onPress={sendPostFn} style={localStyles.actionButton}>
          <Send stroke="#000000" strokeWidth={1.8} height={24} width={24} />
        </Pressable>

        {props.post.type !== 'draft' && props.post.draftPostId && (
          <Pressable
            onPress={collaborateOnPost}
            style={localStyles.actionButton}>
            <PlusCircle
              stroke="#000000"
              strokeWidth={1.8}
              height={25}
              width={25}
            />
          </Pressable>
        )}
      </View>
      {props.showVoteSummary && (
        <PostVoteSummary
          votes={votes}
          post={props.post}
          voteCounts={props.voteCounts}
          openResults={props.openResults}
        />
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  metaView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  actionsView: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 2,
    padding: 8,
  },
});

export default memo(PostMeta);
