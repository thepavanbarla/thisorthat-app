/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  Switch,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {buttonStyles} from '../styles/Common';
import {
  getNotificationPreferences,
  removeUserDevice,
  saveNotificationPreferences,
  updateAccountPrivacy,
} from '../services/UserService';
import LoadingModal from '../components/LoadingModal';
import Toast from 'react-native-root-toast';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import LoadingOverlay from '../components/LoadingOverlay';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import FastImage from 'react-native-fast-image';

const windowWidth = Dimensions.get('window').width;

function SettingsScreen({navigation, route}) {
  const {logoutFn} = route.params;
  const [isPrivate, setIsPrivate] = useState(route.params.isPrivate);

  const [notificationsActive, setNotificationsActive] = useState(true);
  const [likesNotificationsActive, setLikesNotificationsActive] =
    useState(true);
  const [followNotificationsActive, setFollowNotificationsActive] =
    useState(true);

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingModalText, setLoadingModalText] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const modalizeRef = useRef();

  const logout = async () => {
    setShowLoadingModal(true);
    const token = await messaging().getToken();
    auth()
      .signOut()
      .then(() => {
        removeUserDevice(token)
          .then(() => {
            logoutFn();
          })
          .catch(error => {
            console.log('Not able to de-register device. ', error);
          });
      })
      .catch(error => {
        logoutFn();
      });
  };

  const updatePrivacy = async isPrivate => {
    setLoadingModalText('Updating your privacy...');
    setShowLoadingModal(true);
    setIsPrivate(isPrivate);
    route.params.setProfilePrivacy(isPrivate);

    updateAccountPrivacy(isPrivate)
      .then(response => response.json())
      .then(json => {
        Toast.show(`Your account is now ${isPrivate ? 'private' : 'public'}`, {
          duration: 2000,
        });
        setShowLoadingModal(false);
      })
      .catch(error => {
        console('Could not update your privacy: ', error);
      });
  };

  useEffect(() => {
    getNotificationPreferences()
      .then(response => response.json())
      .then(json => {
        if (json.data) {
          setNotificationsActive(json.data.allowNotifications);
          setLikesNotificationsActive(json.data.allowPostNotifications);
          setFollowNotificationsActive(json.data.allowFollowNotifications);
        }
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    savePreferences();
    setFollowNotificationsActive(notificationsActive);
    setLikesNotificationsActive(notificationsActive);
  }, [notificationsActive]);

  useEffect(() => {
    savePreferences();
  }, [likesNotificationsActive, followNotificationsActive]);

  const savePreferences = async () => {
    if (isLoading) {
      return;
    }

    const userPreferences = {
      allowNotifications: notificationsActive,
      allowPostNotifications: likesNotificationsActive,
      allowFollowNotifications: followNotificationsActive,
    };

    saveNotificationPreferences(userPreferences)
      .then(response => response.json())
      .then(json => {
        if (json.data == 'success') {
          Toast.show('Your preferences have been saved', {duration: 2000});
        }
      })
      .catch(error => {
        console('Could not update your preferences: ', error);
      });
  };

  return (
    <>
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <>
          <ScrollView style={localStyles.settingsView}>
            {/* <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <BlurView
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: 0,
                  zIndex: 100,
                }}
                blurType="dark"
                blurAmount={4}
                reducedTransparencyFallbackColor="#232323"
              />
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: '#FFFFFF',
                  left: 0,
                  right: 0,
                  bottom: 0,
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
                  <Text style={{fontSize: 18, lineHeight: 24}}>
                    Are you sure you want to logout of your account?{' '}
                  </Text>

                  <Pressable
                    activeOpacity={0.6}
                    delayPressIn={0}
                    onPress={logout}
                    style={{marginTop: 24}}>
                    <Text
                      style={[
                        buttonStyles.largeTextLinks,
                        {color: '#FF0000', fontSize: 20},
                      ]}>
                      Logout
                    </Text>
                  </Pressable>

                  <Pressable
                    activeOpacity={0.6}
                    delayPressIn={0}
                    onPress={() => setModalVisible(false)}
                    style={{marginTop: 24}}>
                    <Text style={[buttonStyles.largeTextLinks, {fontSize: 20}]}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal> */}

            <View style={localStyles.header}></View>

            <Text style={localStyles.heading}>Account</Text>

            <View style={localStyles.settingsOption}>
              <Ionicons
                name={'lock-closed-outline'}
                size={22}
                color={'black'}
              />
              <Text style={localStyles.settingsOptionText}>
                Private Account
              </Text>
              <Switch
                style={localStyles.switchPositioning}
                trackColor={{
                  false: switchColors.passiveTrackColor,
                  true: switchColors.activeTrackColor,
                }}
                thumbColor={
                  isPrivate
                    ? switchColors.activeThumbColor
                    : switchColors.passiveThumbColor
                }
                ios_backgroundColor={switchColors.iosBackgroundColor}
                onValueChange={updatePrivacy}
                value={isPrivate}
              />
            </View>

            {/* Uncomment when phone number change is implemented */}
            {/* <View style={localStyles.settingsOption}>
                        <Ionicons name={'mail-outline'} size={22} color={'black'} />
                        <Pressable style={{ flex: 1 }} activeOpacity={0.6} delayPressIn={0} onPress={() => navigation.push('ChangeEmail')} >
                            <Text style={localStyles.settingsOptionText}>Change Phone Number</Text>
                        </Pressable>
                    </View> */}

            <Text style={localStyles.heading}>Notifications</Text>

            <View style={localStyles.settingsOption}>
              <Ionicons
                name={'notifications-outline'}
                size={22}
                color={'black'}
              />
              <Text style={localStyles.settingsOptionText}>
                Enable Notifications
              </Text>
              <Switch
                style={localStyles.switchPositioning}
                trackColor={{
                  false: switchColors.passiveTrackColor,
                  true: switchColors.activeTrackColor,
                }}
                thumbColor={
                  notificationsActive
                    ? switchColors.activeThumbColor
                    : switchColors.passiveThumbColor
                }
                ios_backgroundColor={switchColors.iosBackgroundColor}
                onValueChange={() =>
                  setNotificationsActive(previousState => !previousState)
                }
                value={notificationsActive}
              />
            </View>

            <View style={localStyles.settingsOption}>
              <Ionicons name={'heart-outline'} size={22} color={'black'} />
              <Text style={localStyles.settingsOptionText}>
                Votes & Comments
              </Text>
              <Switch
                disabled={!notificationsActive}
                style={localStyles.switchPositioning}
                trackColor={{
                  false: switchColors.passiveTrackColor,
                  true: switchColors.activeTrackColor,
                }}
                thumbColor={
                  likesNotificationsActive
                    ? switchColors.activeThumbColor
                    : switchColors.passiveThumbColor
                }
                ios_backgroundColor={switchColors.iosBackgroundColor}
                onValueChange={() =>
                  setLikesNotificationsActive(previousState => !previousState)
                }
                value={likesNotificationsActive}
              />
            </View>

            <View style={localStyles.settingsOption}>
              <Ionicons name={'people-outline'} size={22} color={'black'} />
              <Text style={localStyles.settingsOptionText}>
                Followers & Following
              </Text>
              <Switch
                disabled={!notificationsActive}
                style={localStyles.switchPositioning}
                trackColor={{
                  false: switchColors.passiveTrackColor,
                  true: switchColors.activeTrackColor,
                }}
                thumbColor={
                  followNotificationsActive
                    ? switchColors.activeThumbColor
                    : switchColors.passiveThumbColor
                }
                ios_backgroundColor={switchColors.iosBackgroundColor}
                onValueChange={() =>
                  setFollowNotificationsActive(previousState => !previousState)
                }
                value={followNotificationsActive}
              />
            </View>

            <Text style={localStyles.heading}>Other</Text>

            {/* Implement unblocking and blocked list to uncomment */}
            {/* <View style={localStyles.settingsOption}>
              <Slash
                height={20}
                width={20}
                stroke="#000000"
                strokeWidth={1.8}
              />
              <Pressable
                style={{flex: 1}}
                activeOpacity={0.6}
                delayPressIn={0}
                onPress={() => setModalVisible(true)}>
                <Text style={localStyles.settingsOptionText}>
                  Blocked Accounts
                </Text>
              </Pressable>
            </View> */}

            {/* Uncomment when about page is implemented */}
            {/* <View style={localStyles.settingsOption}>
                        <Ionicons name={'information-circle-outline'} size={22} color={'black'} />
                        <Pressable style={{ flex: 1 }} activeOpacity={0.6} delayPressIn={0} onPress={() => {}} >
                            <Text style={{ fontSize: 16, fontWeight: '500', paddingLeft: 8 }}>About</Text>
                        </Pressable>
                    </View> */}

            <View style={localStyles.settingsOption}>
              <Ionicons
                name={'shield-checkmark-outline'}
                size={22}
                color={'black'}
              />
              <Pressable
                style={{flex: 1}}
                activeOpacity={0.6}
                delayPressIn={0}
                onPress={() => navigation.navigate('Privacy Policy')}>
                <Text style={localStyles.settingsOptionText}>
                  Privacy Policy
                </Text>
              </Pressable>
            </View>
            <View style={localStyles.settingsOption}>
              <Ionicons
                name={'document-text-outline'}
                size={22}
                color={'black'}
              />
              <Pressable
                style={{flex: 1}}
                activeOpacity={0.6}
                delayPressIn={0}
                onPress={() => navigation.navigate('Terms of Use')}>
                <Text style={localStyles.settingsOptionText}>Terms of Use</Text>
              </Pressable>
            </View>
            <View style={localStyles.settingsOption}>
              <Ionicons name={'log-out-outline'} size={22} color={'#4487f2'} />
              <Pressable
                style={{flex: 1}}
                activeOpacity={0.6}
                delayPressIn={0}
                onPress={() => modalizeRef.current?.open()}>
                <Text style={localStyles.logoutOptionText}>Logout</Text>
              </Pressable>
            </View>

            <LoadingModal show={showLoadingModal} message={loadingModalText} />
          </ScrollView>

          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
            }}>
            <Image
              source={require('../assets/images/this_or_that.png')}
              style={{width: 100, resizeMode: 'contain'}}
            />
          </View>
        </>
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
              <Text style={{fontSize: 16, lineHeight: 24}}>
                Are you sure you want to logout of your account?{' '}
              </Text>

              <Pressable
                activeOpacity={0.6}
                delayPressIn={0}
                onPress={logout}
                style={{marginTop: 24}}>
                <Text
                  style={[
                    buttonStyles.largeTextLinks,
                    {color: '#FF0000', fontSize: 18},
                  ]}>
                  Logout
                </Text>
              </Pressable>

              <Pressable
                activeOpacity={0.6}
                delayPressIn={0}
                onPress={() => modalizeRef.current?.close()}
                style={{marginTop: 24}}>
                <Text style={[buttonStyles.largeTextLinks, {fontSize: 18}]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </Modalize>
      </Portal>
    </>
  );
}

const localStyles = StyleSheet.create({
  settingsView: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 420,
    backgroundColor: '#fff',
  },
  heading: {
    alignSelf: 'stretch',
    fontWeight: '700',
    fontSize: 18,
    paddingBottom: 8,
    paddingTop: 24,
  },
  settingsOption: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  settingsOptionText: {
    fontSize: 16,
    fontWeight: '500',
    paddingLeft: 8,
  },
  logoutOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4487f2',
    paddingLeft: 8,
  },
  switchPositioning: {
    position: 'absolute',
    right: 0,
  },
});

const switchColors = {
  passiveTrackColor: '#ababab',
  activeTrackColor: '#aec9f5',
  passiveThumbColor: '#dedede',
  activeThumbColor: '#4487f2',
  iosBackgroundColor: '#3e3e3e',
};

export default SettingsScreen;
