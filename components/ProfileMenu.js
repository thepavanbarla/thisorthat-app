import React, {useState} from 'react';
import {Pressable, View, Text, ActivityIndicator, Share} from 'react-native';
import {Slash, Flag, Link, Share2, CheckCircle} from 'react-native-feather';
import Clipboard from '@react-native-clipboard/clipboard';
import {externalLinkBaseUrl} from '../services/Constants';
import Toast from 'react-native-root-toast';
import SmallActiveButton from './SmallActiveButton';
import {blockUser, reportUser} from '../services/UserService';
import {getSessionUserId} from '../services/SessionService';

const ProfileMenu = props => {
  const [activeSection, setActiveSection] = useState('parent');
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const copyLink = () => {
    Clipboard.setString(`${externalLinkBaseUrl}u/${props.userName}`);
    Toast.show('Profile link copied to clipboard', {duration: 2000});
    props.close();
  };

  const sharePost = async () => {
    try {
      const result = await Share.share({
        subject: 'Check out this profile on This or That!',
        message:
          'Check out this profile on This or That! ' +
          externalLinkBaseUrl +
          'u/' +
          props.userName,
        url: externalLinkBaseUrl + 'u/' + props.userName,
        title: 'Check out this profile on This or That!',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {}
  };

  const submitReport = async type => {
    setShowLoadingModal(true);
    const sessionUserId = await getSessionUserId();
    reportUser({
      reportEntity: 'user',
      reportedId: props.userId,
      reportType: type,
      reportedBy: sessionUserId,
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
                Report User
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
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
                Share Profile
              </Text>
            </Pressable>
          </View>
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
              Why are you reporting this user?
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
            onPress={() => submitReport('impersonating')}>
            <Text style={{fontSize: 14, color: '#4487F2'}}>
              Pretending to be someone else
            </Text>
          </Pressable>
          <Pressable
            style={{paddingVertical: 12}}
            onPress={() => submitReport('improper_content')}>
            <Text style={{fontSize: 14, color: '#4487F2'}}>
              Posting content that shouldn't be here
            </Text>
          </Pressable>
          <Pressable
            style={{paddingVertical: 12}}
            onPress={() => submitReport('underage')}>
            <Text style={{fontSize: 14, color: '#4487F2'}}>
              User under the age of 13 years
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
                Block {props.fullName}
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
            Block {props.fullName}?
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
    </View>
  );
};

export default ProfileMenu;
