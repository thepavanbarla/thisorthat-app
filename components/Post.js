import React, {useEffect, useRef, useState} from 'react';
import {Animated, View, Text, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import styles, {buttonStyles} from '../styles/Common';
import PostMeta from './PostMeta';
import PostMain from './PostMain';
import {deletePost, voteOnPost} from '../services/PostService';
import {
  getSessionUserId,
  retrieveSessionUser,
} from '../services/SessionService';
import {Modalize} from 'react-native-modalize';
import {Dimensions} from 'react-native';
import {Portal} from 'react-native-portalize';
import PostMenu from '../components/PostMenu';
import OptionFocus from './OptionFocus';
import Toast from 'react-native-root-toast';
import {EyeOff, Trash2} from 'react-native-feather';
import {memo} from 'react';
import {getUserByUserId} from '../services/UserService';
import {useNavigation} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

function Post(props) {
  const navigation = useNavigation();
  const {postAndDetails} = props;
  const [votes, setVotes] = useState(postAndDetails?.votes);
  const [now, setNow] = useState(JSON.stringify(new Date()));
  const [votedOption, setVotedOption] = React.useState(
    postAndDetails.sessionUserVote?.option?.id,
  );

  const postMenuRef = useRef();

  const [sessionUserId, setSessionUserId] = useState(null);
  const [sessionUser, setSessionUser] = useState(null);

  let isMounted = false;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    isMounted = true;
    loadSessionUser();
    return () => (isMounted = false);
  }, []);

  const loadSessionUser = async () => {
    const varSessionUserId = await getSessionUserId();
    setSessionUserId(varSessionUserId);
    getUserByUserId(varSessionUserId)
      .then(response => response.json())
      .then(json => {
        if (isMounted) {
          setSessionUser(json.data);
        }
      });
  };

  const [voteCounts, setVoteCounts] = useState([
    postAndDetails?.postStats?.options[0]?.totalOptionCount,
    postAndDetails?.postStats?.options[1]?.totalOptionCount,
  ]);

  const openPostMenu = () => {
    postMenuRef.current?.open();
  };

  const closePostMenu = () => {
    postMenuRef.current?.close();
  };

  const zoomOption = (option, index) => {
    if (!option || !option.picture) {
      return;
    }
    setShowOptionTitle(
      option.title !== null &&
        option.title !== undefined &&
        option.title.trim() !== '',
    );
    setOptionImage(option.picture);
    setOptionTitle(option.title);
    setShowOptionModal(true);
  };

  const [showOptionTitle, setShowOptionTitle] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [optionTitle, setOptionTitle] = useState(null);
  const [optionImage, setOptionImage] = useState(null);

  const vote = async i => {
    const localSessionUser = await retrieveSessionUser();
    const varSessionUserId = localSessionUser.userId;
    const sessionUserGender = localSessionUser.gender;
    const sessionUserDob = localSessionUser.dob;

    var voteObj = {
      userId: varSessionUserId,
      postId: props.postAndDetails.post.postId,
      option: props.postAndDetails.post.options[i],
      userDetails: {
        gender: sessionUserGender,
        dob: sessionUserDob,
        profilePicture: sessionUser.profilePicture,
        userName: sessionUser.userName,
        fullName: sessionUser.fullName,
      },
    };

    if (votedOption) {
      var lastVoteIndex = 0;
      setVotes(
        votes.map(varVote => {
          if (varVote.userId === voteObj.userId) {
            voteObj.voteId = varVote.voteId;
            voteObj.userDetails = varVote.userDetails;
            if (varVote.option.id === props.postAndDetails.post.options[1].id) {
              lastVoteIndex = 1;
            }
            return voteObj;
          }
          return varVote;
        }),
      );
      if (i !== lastVoteIndex) {
        setVoteCounts([
          voteCounts[0] + (i === 0 ? 1 : -1),
          voteCounts[1] + (i === 1 ? 1 : -1),
        ]);
      }
    } else {
      setVotes([...votes, voteObj]);
      setVoteCounts([
        voteCounts[0] + (i === 0 ? 1 : 0),
        voteCounts[1] + (i === 1 ? 1 : 0),
      ]);
    }
    setVotedOption(props.postAndDetails.post.options[i].id);

    voteOnPost(voteObj)
      .then(response => response.json())
      .then(json => {});
  };

  const [isDeleted, setIsDeleted] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const deleteThis = () => {
    deletePost(props.postAndDetails.post.postId)
      .then(response => response.json())
      .then(json => {
        setIsDeleted(true);
        Toast.show('Post has been deleted. ', {duration: 1000});
        postMenuRef.current.close();
      })
      .catch(error => {
        Toast.show('Post could not be deleted. Try again later.', {
          duration: 1000,
        });
        postMenuRef.current.close();
      });
  };

  const showVoters = (showChoices, option, varPostId, optionId) => {
    navigation.push('Voters', {
      showChoices: showChoices,
      option: option,
      postId: varPostId,
      optionId,
    });
  };

  const modalizeRef = useRef();

  const hideDeletedPost = () => setIsHidden(true);
  const modalBackPress = () => setShowOptionModal(false);
  const dismissModalRef = () => modalizeRef.current?.close();

  return (
    <>
      {!isHidden && (
        <Animated.View
          style={[
            styles.FeedPost,
            {
              position: 'relative',
            },
          ]}>
          {isDeleted && (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(10,10,10,0.9)',
                zIndex: 100000,
                flex: 1,
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Trash2
                height={36}
                width={36}
                stroke="#ABABAB"
                strokeWidth={1.2}
              />
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 15,
                  fontWeight: '500',
                  color: '#ABABAB',
                }}>
                Post deleted!
              </Text>
              <Pressable style={{marginTop: 12}} onPress={hideDeletedPost}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 4,
                    backgroundColor: 'rgba(240, 240, 240, 0.3)',
                  }}>
                  <EyeOff
                    height={12}
                    width={12}
                    stroke="#4487F2"
                    strokeWidth={3}
                  />
                  <Text
                    style={{
                      color: '#4487F2',
                      fontSize: 14,
                      fontWeight: '600',
                      marginLeft: 4,
                    }}>
                    Hide
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
          <PostMain
            post={props.postAndDetails.post}
            openMenu={openPostMenu}
            userId={props.postAndDetails.post.userId}
            userName={props.userName}
            fullName={props.fullName}
            profilePicture={props.profilePicture}
            votedOption={votedOption}
            voteCounts={voteCounts}
            zoomOption={zoomOption}
            vote={vote}
            closeOption={() => setShowOptionModal(false)}
          />
          {props.showPostMeta && (
            <PostMeta
              votes={votes}
              post={props.postAndDetails.post}
              openPost={props.openPost}
              openResults={props.openResults}
              sendPost={() => modalizeRef.current?.open()}
              showAnalyticsLink={props.showAnalyticsLink}
              showCommentsLink={props.showCommentsLink}
              showVoteSummary={props.showVoteSummary}
              voteCounts={voteCounts}
            />
          )}
        </Animated.View>
      )}
      <Modal
        onBackButtonPress={modalBackPress}
        style={{
          flexDirection: 'column',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
        isVisible={showOptionModal}
        animationIn="zoomIn"
        onBackdropPress={() => setShowOptionModal(false)}
        backdropOpacity={0.9}
        animationInTiming={200}
        animationOutTiming={200}
        animationOut="zoomOut">
        <OptionFocus
          showOptionTitle={showOptionTitle}
          optionTitle={optionTitle}
          optionImage={optionImage}
        />
      </Modal>
      <Portal>
        <Modalize
          ref={postMenuRef}
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
          <PostMenu
            postId={props.postAndDetails.post.postId}
            userId={props.postAndDetails.post.userId}
            type={props.postAndDetails.post.type}
            sessionUserId={sessionUserId}
            deletePost={deleteThis}
            close={closePostMenu}
            fullName={props.fullName}
          />
        </Modalize>
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
              paddingVertical: 16,
              borderTopWidth: 1,
              borderTopColor: '#EFEFEF',
              zIndex: 1000,
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}>
            {/* <PostComments post={props.postAndDetails.post} key={now} /> */}
            {/* <PostAnalytics
              key={now}
              postAndDetails={props.postAndDetails}
              showVoters={showVoters}
            /> */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16, lineHeight: 24}}>
                You'll soon be able to send posts to your friends, asking for
                them to vote.
              </Text>

              <Pressable
                activeOpacity={0.6}
                delayPressIn={0}
                onPress={dismissModalRef}
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

export default memo(Post);
