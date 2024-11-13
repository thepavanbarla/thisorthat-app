import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Comment from './Comment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  addComment,
  deleteComment,
  getComments,
} from '../services/CommentService';
import {getSessionUserId} from '../services/SessionService';
import Toast from 'react-native-root-toast';
import {commentsPaginationItemCount} from '../services/Constants';

function PostComments(props) {
  const [commentText, setCommentText] = useState('');
  const [disableSend, setDisableSend] = useState(true);
  const [disableInput, setDisableInput] = useState(true);
  // const [now, setNow] = useState(props.now);

  const [comments, setComments] = useState([]);

  const [page, setPage] = useState(0);
  const [endOfComments, setEndOfComments] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  let isMounted = false;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    isMounted = true;
    loadPostComments();
    return () => {
      isMounted = false;
    };
  }, [page]);

  const inputRef = useRef();

  const loadPostComments = async () => {
    setLoadingMore(true);
    getComments(props.post.postId, page, commentsPaginationItemCount)
      .then(response => response.json())
      .then(json => {
        if (!isMounted) {
          return;
        }
        if (page === 0) {
          setComments([]);
        }
        if (json.data.length < commentsPaginationItemCount) {
          setEndOfComments(true);
        }
        if (page > 0) {
          setComments(comments.concat(json.data));
        } else {
          setComments(json.data);
        }
        setLoadingMore(false);
      })
      .catch(error => {
        setLoadingMore(false);
      });
  };

  const loadMoreComments = () => {
    if (!loadingMore && !endOfComments) {
      setPage(page + 1);
    }
  };

  const handleSend = async () => {
    // disable textinput field
    setDisableInput(true);
    let userId = await getSessionUserId();
    addComment({
      postId: props.post.postId,
      userId: userId,
      comment: commentText.trim(),
      createdTime: new Date(),
    })
      .then(response => response.json())
      .then(json => {
        setComments([json.data, ...comments]);
        setCommentText('');
        inputRef.current.setNativeProps({text: ''});
        setDisableInput(false);
        setDisableSend(true);
        Toast.show('Comment added.', {duration: 2000});
      });
  };

  const deletePostComment = commentId => {
    deleteComment(commentId)
      .then(response => response.json())
      .then(json => {
        loadPostComments();
      });
  };

  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        marginTop: 0,
      }}>
      {/* <Text style={{display: 'none'}}>{now}</Text> */}
      <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 8}}>
        Comments
      </Text>

      {loadingMore && (
        <View
          style={{
            flexDirection: 'column',
            height: 32,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            style={{position: 'absolute'}}
            size="small"
            color="grey"
          />
        </View>
      )}

      {!loadingMore && !endOfComments && (
        <Pressable
          onPress={loadMoreComments}
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingVertical: 16,
          }}>
          <Text
            style={{
              fontSize: 14,
              textTransform: 'uppercase',
              fontWeight: '600',
              color: '#0C7AF0',
            }}>
            Load Earlier Comments
          </Text>
        </Pressable>
      )}

      {comments.length > 0 ? (
        <View style={{flexDirection: 'column-reverse'}}>
          {comments.map(comment => (
            <View key={comment.commentId}>
              <Comment
                comment={comment}
                isReply={false}
                liked={false}
                deletePostComment={deletePostComment}
              />
              {comment.replies &&
                comment.replies.map(reply => (
                  <Comment
                    key={reply._id}
                    comment={reply}
                    isReply={true}
                    liked={true}
                    deletePostComment={deletePostComment}
                  />
                ))}
            </View>
          ))}
        </View>
      ) : !loadingMore ? (
        <Text style={{fontSize: 14, marginBottom: 6, marginTop: 8}}>
          Be the first to add a comment!
        </Text>
      ) : (
        <></>
      )}
      <View
        style={{flexDirection: 'row', alignItems: 'stretch', marginTop: 10}}>
        <TextInput
          ref={inputRef}
          disabled={disableInput}
          multiline={true}
          // value={commentText}
          onChangeText={text => {
            setCommentText(text);
            if (text) setDisableSend(false);
            else setDisableSend(true);
          }}
          placeholder="Add Comment"
          placeholderTextColor={'#898989'}
          style={{
            backgroundColor: '#FBFBFB',
            color: '#232323',
            fontSize: 14,
            borderRadius: 8,
            paddingTop: 7,
            paddingBottom: 8,
            paddingHorizontal: 12,
            flex: 1,
            lineHeight: 20,
            borderColor: '#676767',
            borderWidth: 1,
          }}
        />
        <Pressable
          disabled={disableSend}
          activeOpacity={0.6}
          delayPressIn={0}
          onPress={handleSend}
          style={
            disableSend ? localStyles.disabledButton : localStyles.activeButton
          }>
          <Ionicons
            name={'send'}
            size={14}
            color={'white'}
            style={{
              position: 'relative',
              left: 1,
            }}
          />
        </Pressable>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  activeButton: {
    height: 42,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(102, 49, 247, 1)',
    borderRadius: 8,
    marginLeft: 6,
  },
  disabledButton: {
    height: 42,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9a9a9a',
    borderRadius: 8,
    marginLeft: 6,
  },
});

export default PostComments;
