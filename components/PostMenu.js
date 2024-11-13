import React, {useState} from 'react';
import {Pressable, View, Text, ActivityIndicator, Share} from 'react-native';
import {
  Slash,
  Flag,
  Link,
  Share2,
  CheckCircle,
  Trash2,
} from 'react-native-feather';
import Clipboard from '@react-native-clipboard/clipboard';
import {externalLinkBaseUrl} from '../services/Constants';
import Toast from 'react-native-root-toast';
import SmallActiveButton from './SmallActiveButton';
import {blockUser} from '../services/UserService';
import {reportPost} from '../services/PostService';

const PostMenu = props => {
  const [activeSection, setActiveSection] = useState('parent');
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const copyLink = () => {
    Clipboard.setString(`${externalLinkBaseUrl}p/${props.postId}`);
    Toast.show('Post link copied to clipboard', {dureation: 2000});
    props.close();
  };

  const deletePostConfirmation = () => {
    setActiveSection('delete');
  };

  const sharePost = async () => {
    try {
      const result = await Share.share({
        subject: 'Check out this post on This or That!',
        message:
          'Check out this post on This or That! ' +
          externalLinkBaseUrl +
          'p/' +
          props.postId,
        url: externalLinkBaseUrl + 'p/' + props.postId,
        title: 'Check out this post on This or That!',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      Toast.show(error.message, {duration: 1000});
    }
  };

  const submitReport = async type => {
    setShowLoadingModal(true);
    reportPost({
      reportEntity: 'post',
      reportedId: props.postId,
      reportType: type,
      reportedBy: props.sessionUserId,
      reportTime: new Date(),
    })
      .then(response => response.json())
      .then(json => {
        setActiveSection('reportSuccess');
        setShowLoadingModal(false);
      });
  };

  const block = async () => {
    setShowLoadingModal(true);
    blockUser(props.userId)
      .then(response => response.json())
      .then(json => {
        Toast.show('User blocked successfully', {duration: 2000});
        setShowLoadingModal(false);
        props.close();
      });
  };

  const deleteItem = () => {
    setShowLoadingModal(true);
    props.deletePost();
  };

  return (
    <View
      style={{
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
        paddingVertical: 36,
        paddingHorizontal: 30,
        zIndex: 1000,
        position: 'relative',
      }}>
      {showLoadingModal && (
        <View
          style={{
            zIndex: 10000,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            bottom: -15,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}>
          <ActivityIndicator size={'large'} />
        </View>
      )}

      {activeSection === 'parent' && (
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            display: 'flex',
            paddingHorizontal: 20,
          }}>
          {props.userId !== props.sessionUserId && (
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
                paddingBottom: 8,
              }}>
              <Pressable
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
                onPress={() => setActiveSection('block')}>
                <Slash stroke="#FF0000" />
                <Text style={{fontSize: 14, color: '#FF0000', marginTop: 8}}>
                  Block User
                </Text>
              </Pressable>
              <Pressable
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
                onPress={() => setActiveSection('report')}>
                <Flag stroke="#FF0000" />
                <Text style={{fontSize: 14, color: '#FF0000', marginTop: 8}}>
                  Report Post
                </Text>
              </Pressable>
            </View>
          )}

          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              paddingBottom: 8,
            }}>
            <Pressable
              onPress={copyLink}
              style={{
                flex: 1,
                flexDirection: 'column',
                paddingVertical: 12,
                alignItems: 'center',
              }}>
              <Link stroke="#4487F2" />
              <Text style={{fontSize: 14, color: '#4487F2', marginTop: 8}}>
                Copy Link
              </Text>
            </Pressable>
            <Pressable
              style={{
                flex: 1,
                flexDirection: 'column',
                paddingVertical: 12,
                alignItems: 'center',
              }}
              onPress={sharePost}>
              <Share2 stroke="#4487F2" />
              <Text style={{fontSize: 14, color: '#4487F2', marginTop: 8}}>
                Share
              </Text>
            </Pressable>
          </View>

          {props.userId === props.sessionUserId && (
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
              }}>
              <Pressable
                onPress={deletePostConfirmation}
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  paddingVertical: 12,
                  alignItems: 'center',
                }}>
                <Trash2 stroke="#FF0000" />
                <Text style={{fontSize: 14, color: '#FF0000', marginTop: 8}}>
                  Delete Post
                </Text>
              </Pressable>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  paddingVertical: 12,
                  alignItems: 'center',
                }}></View>
            </View>
          )}
        </View>
      )}

      {activeSection === 'report' && (
        <View style={{flexFirection: 'column', alignItems: 'flex-start'}}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 18,
              textAlign: 'center',
              width: '100%',
            }}>
            Report
          </Text>

          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              paddingVertical: 20,
            }}>
            <Text style={{fontWeight: '500', fontSize: 16}}>
              Why are you reporting this post?
            </Text>
            <Text
              style={{
                fontWeight: '400',
                fontSize: 13,
                marginTop: 8,
                color: '#555555',
                lineHeight: 18,
              }}>
              This action will be anonymous. If you think someone is in danger,
              please report to the local authorities! Dont wait.
            </Text>
          </View>

          <Pressable
            style={{paddingVertical: 12}}
            onPress={() => submitReport('spam')}>
            <Text style={{fontSize: 14, color: '#4487F2'}}>It's spam</Text>
          </Pressable>
          <Pressable
            style={{paddingVertical: 12}}
            onPress={() => submitReport('hate_speech')}>
            <Text style={{fontSize: 14, color: '#4487F2'}}>
              Hate speech or symbols
            </Text>
          </Pressable>
          <Pressable
            style={{paddingVertical: 12}}
            onPress={() => submitReport('false_information')}>
            <Text style={{fontSize: 14, color: '#4487F2'}}>
              False information
            </Text>
          </Pressable>
          <Pressable
            style={{paddingVertical: 12}}
            onPress={() => submitReport('harassmant')}>
            <Text style={{fontSize: 14, color: '#4487F2'}}>
              Bullying or Harassment
            </Text>
          </Pressable>
          <Pressable
            style={{paddingVertical: 12}}
            onPress={() => submitReport('violence')}>
            <Text style={{fontSize: 14, color: '#4487F2'}}>Violence</Text>
          </Pressable>
          <Pressable
            style={{paddingVertical: 12}}
            onPress={() => submitReport('self_harm')}>
            <Text style={{fontSize: 14, color: '#4487F2'}}>
              Suicide or self-injury
            </Text>
          </Pressable>
          <Pressable
            style={{paddingVertical: 12}}
            onPress={() => submitReport('illegal_commerce')}>
            <Text style={{fontSize: 14, color: '#4487F2'}}>
              Illegal buying or selling
            </Text>
          </Pressable>
          <Pressable
            style={{paddingVertical: 12}}
            onPress={() => submitReport('scam')}>
            <Text style={{fontSize: 14, color: '#4487F2'}}>
              Misleading content or scam
            </Text>
          </Pressable>
        </View>
      )}

      {activeSection === 'reportSuccess' && (
        <View style={{flexFirection: 'column', alignItems: 'flex-start'}}>
          <View
            style={{
              display: 'flex',
              flex: 1,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
            <CheckCircle
              height={54}
              width={54}
              strokeWidth={1.5}
              color="#BD0DA8"
            />
          </View>

          <Text
            style={{
              fontWeight: '600',
              fontSize: 18,
              textAlign: 'center',
              width: '100%',
            }}>
            Thanks for letting us know!
          </Text>

          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              paddingVertical: 30,
            }}>
            <Text style={{fontWeight: '500', fontSize: 16}}>
              What happens when you report content?{' '}
            </Text>
            <Text
              style={{
                fontWeight: '400',
                fontSize: 13,
                marginTop: 12,
                color: '#555555',
                lineHeight: 18,
              }}>
              We review your report and take any necessary actions against the
              content reported and also agsinst the content owner if required.
            </Text>
            <Text
              style={{
                fontWeight: '400',
                fontSize: 13,
                marginTop: 12,
                color: '#555555',
                lineHeight: 18,
              }}>
              We also use your reports to show less of this kind of content to
              you in the future.
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              paddingVertical: 16,
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '500', fontSize: 16}}>
              Further Actions
            </Text>
            <Pressable
              onPress={block}
              style={{
                flex: 1,
                flexDirection: 'column',
                paddingVertical: 24,
                paddingHorizontal: 16,
                alignItems: 'center',
                marginTop: 16,
                backgroundColor: '#EFEFEF',
                borderRadius: 16,
              }}>
              <Slash
                stroke="#FF0000"
                height={30}
                width={30}
                strokeWidth={1.4}
              />
              <Text style={{fontSize: 14, color: '#FF0000', marginTop: 8}}>
                Block {props.userName}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {activeSection === 'block' && (
        <View style={{flexFirection: 'column', alignItems: 'flex-start'}}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 18,
              textAlign: 'center',
              width: '100%',
            }}>
            Block {props.userName}?
          </Text>

          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              paddingVertical: 20,
            }}>
            <Text
              style={{
                fontWeight: '400',
                fontSize: 13,
                marginTop: 8,
                color: '#555555',
                lineHeight: 18,
              }}>
              They will not be able to find your profile or posts on This or
              That. They also won't be able to send you messages.
            </Text>
            <Text
              style={{
                fontWeight: '400',
                fontSize: 13,
                marginTop: 8,
                color: '#555555',
                lineHeight: 18,
              }}>
              They won't be notified that you blocked them.
            </Text>
            <Text
              style={{
                fontWeight: '400',
                fontSize: 13,
                marginTop: 8,
                color: '#555555',
                lineHeight: 18,
              }}>
              If you change your mind later, you can unblock them from the
              Settings.
            </Text>
          </View>

          <SmallActiveButton title="Block" onPress={block} />
          <Pressable
            style={{paddingVertical: 20, alignSelf: 'center'}}
            onPress={() => props.close()}>
            <Text style={{fontSize: 16, color: '#4487F2'}}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {activeSection === 'delete' && (
        <View style={{flexFirection: 'column', alignItems: 'flex-start'}}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 18,
              textAlign: 'center',
              width: '100%',
            }}>
            Delete Post?
          </Text>

          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              paddingVertical: 20,
            }}>
            <Text
              style={{
                fontWeight: '400',
                fontSize: 13,
                marginTop: 8,
                color: '#555555',
                lineHeight: 18,
              }}>
              This action is irreversible and the post will be permanently
              deleted.
            </Text>
            <Text
              style={{
                fontWeight: '400',
                fontSize: 13,
                marginTop: 8,
                color: '#555555',
                lineHeight: 18,
              }}>
              Are you sure you want to delete this post?
            </Text>
          </View>

          <SmallActiveButton title="Delete" onPress={deleteItem} />
          <Pressable
            style={{paddingVertical: 20, alignSelf: 'center'}}
            onPress={() => props.close()}>
            <Text style={{fontSize: 16, color: '#4487F2'}}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default PostMenu;
