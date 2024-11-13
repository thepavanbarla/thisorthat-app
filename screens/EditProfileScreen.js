import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Modal,
  Keyboard,
  BackHandler,
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';

import {screenStyles, buttonStyles, labelStyles} from '../styles/Common';
import LoadingModal from '../components/LoadingModal';
import {BlurView} from '@react-native-community/blur';
import ImageCropPicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSessionUserId} from '../services/SessionService';
import {getUser, uploadPictureService} from '../services/AccountService';
import {getUserByUserName, updateUserProfile} from '../services/UserService';
import {assetsUrl} from '../services/Constants';
import LoadingOverlay from '../components/LoadingOverlay';
import {getTiny, isValidUserName} from '../utils/ConversionUtils';
import {CheckCircle, XCircle} from 'react-native-feather';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';

const window = Dimensions.get('window');

const EditProfileScreen = ({navigation, route}) => {
  const windowWidth = Dimensions.get('window').width;
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [picture, setPicture] = React.useState(null);

  const [dataLoaded, setDataLoaded] = React.useState(true);
  const [showLoadingModal, setShowLoadingModal] = React.useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    (async () => {
      let varUserId = await getSessionUserId();
      setUserId(varUserId);
      getUser(varUserId)
        .then(response => response.json())
        .then(json => {
          setFullName(json.data.fullName);
          setUserName(json.data.userName);
          setPicture(json.data.profilePicture);
          setBio(json.data.bio);
          setWebsite(json.data.website);
          setIsLoading(false);
        })
        .catch(error => {
          console.log("User can't be fetched: " + JSON.stringify(error));
        });
    })();
  }, []);

  const handlePicker = () => {
    setModalVisible(true);
  };

  const handleCustomPicker = type => {
    if (type == 1) {
      handleGalleryPicker();
    } else {
      handleCameraPicker();
    }
  };

  const handleGalleryPicker = () => {
    ImageCropPicker.openPicker({
      width: 1080,
      height: 1080,
      cropping: true,
    }).then(image => {
      setImageLoading(true);
      setModalVisible(false);
      uploadImage(image);
    });
  };

  const handleCameraPicker = () => {
    ImageCropPicker.openCamera({
      width: 1080,
      height: 1080,
      cropping: true,
    }).then(image => {
      setImageLoading(true);
      setModalVisible(false);
      uploadImage(image);
    });
  };

  const uploadImage = image => {
    uploadPictureService(image, userId)
      .then(response => response.json())
      .then(json => {
        setPicture(json.data);
        setImageLoading(false);
        setChangesMade(true);
      })
      .catch(error => {
        console.log('Error while uploading image', error);
      });
  };

  const saveUserDetails = async () => {
    let userDetails = {
      userId: userId,
      userName: userName,
      fullName: fullName,
      profilePicture: picture,
      website: website,
      bio: bio,
    };

    await updateUserProfile(userDetails);
    route.params.onGoBack();
  };

  const discardModalizeRef = useRef();

  const cancelChanges = () => {
    Keyboard.dismiss();
    if (changesMade) {
      discardModalizeRef.current?.open();
    } else {
      navigation.goBack();
    }
    return true;
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View style={{marginLeft: 16}}>
            <Pressable activeOpacity={0.8} onPress={cancelChanges}>
              <Ionicons name="close" size={28} color={'#121212'} />
            </Pressable>
          </View>
        );
      },
      headerRight: () => {
        return (
          <>
            {changesMade && (
              <Pressable
                activeOpacity={0.8}
                style={{marginRight: 16}}
                disabled={!userNameValid}
                onPress={async () => {
                  Keyboard.dismiss();
                  setShowLoadingModal(true);
                  await saveUserDetails();
                  navigation.goBack();
                }}>
                <Text
                  style={{fontWeight: '600', color: '#4487F2', fontSize: 16}}>
                  SAVE
                </Text>
              </Pressable>
            )}
          </>
        );
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const [userNameValid, setUserNameValid] = useState(true);
  const [userNameError, setUserNameError] = useState('');

  const checkUserName = async varUserName => {
    if (varUserName.trim().length < 4) {
      setUserNameError('Username must be atleast 4 characters long');
      setUserNameValid(false);
    } else if (!isValidUserName(varUserName)) {
      setUserNameError('Username can only contain letters, numbers, . and _');
      setUserNameValid(false);
    } else {
      const response = await getUserByUserName(varUserName);
      const jsonResponse = await response.json();
      if (jsonResponse.data && jsonResponse.data.userId !== userId) {
        setUserNameError('User name already taken. Try a different one.');
        setUserNameValid(false);
      } else {
        setUserNameError('');
        setUserNameValid(true);
      }
    }
  };

  const onUsernameChange = text => {
    setUserName(text.toLowerCase().replace(/ /g, ''));
    checkUserName(text);
    setChangesMade(true);
  };

  const onNameChange = text => {
    setFullName(text);
    setChangesMade(true);
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', cancelChanges);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', cancelChanges);
    };
  });

  return (
    <>
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <ScrollView style={[screenStyles.generalScreens, {paddingTop: 24}]}>
          <Modal
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
                flexDirection: 'column',
                position: 'absolute',
                backgroundColor: '#FFFFFF',
                left: 0,
                right: 0,
                bottom: 0,
                paddingVertical: 20,
                borderTopWidth: 1,
                borderTopColor: '#EFEFEF',
                zIndex: 1000,
                alignContent: 'center',
              }}>
              <View
                style={{
                  paddingHorizontal: 40,
                  paddingVertical: 20,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <Pressable
                  style={{flexDirection: 'column', alignItems: 'center'}}
                  onPress={() => {
                    handleCustomPicker(2);
                  }}>
                  <Ionicons name="camera-outline" size={36} color="#232323" />
                  <Text style={{fontSize: 18, fontWeight: '500', marginTop: 8}}>
                    Camera
                  </Text>
                </Pressable>
                <Pressable
                  style={{flexDirection: 'column', alignItems: 'center'}}
                  onPress={() => {
                    handleCustomPicker(1);
                  }}>
                  <Ionicons name="images-outline" size={32} color="#232323" />
                  <Text
                    style={{fontSize: 18, fontWeight: '500', marginTop: 12}}>
                    Photos
                  </Text>
                </Pressable>
              </View>
              <Pressable
                activeOpacity={0.6}
                delayPressIn={0}
                onPress={() => {
                  setModalVisible(false);
                }}
                style={{
                  marginTop: 24,
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    buttonStyles.largeTextLinks,
                    {color: '#FF0000', fontSize: 18},
                  ]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </Modal>

          {!dataLoaded ? (
            <View style={{paddingTop: window.height / 2.5}}>
              <ActivityIndicator size="large" color="grey" />
            </View>
          ) : (
            <>
              <Pressable
                activeOpacity={0.6}
                delayPressIn={0}
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
                onPress={() => handlePicker()}>
                <ProgressiveFastImage
                  blurRadius={2}
                  useNativeDriver={true}
                  source={
                    picture == null
                      ? require('../assets/images/profile_picture_placeholder.png')
                      : {uri: assetsUrl + picture}
                  }
                  thumbnailSource={
                    picture == null
                      ? require('../assets/images/profile_picture_placeholder-thumb.png')
                      : {uri: assetsUrl + getTiny(picture)}
                  }
                  style={[
                    localStyles.userImage,
                    {opacity: imageLoading ? 0.5 : 1},
                  ]}
                />
                {imageLoading && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ActivityIndicator
                      style={{position: 'absolute'}}
                      size="large"
                      color="#EFEFEF"
                    />
                  </View>
                )}
              </Pressable>

              <View style={localStyles.linkEnclosingView}>
                <Pressable
                  activeOpacity={0.6}
                  delayPressIn={0}
                  onPress={() => handlePicker()}>
                  <Text style={buttonStyles.largeTextLinks}>
                    {picture == null ? <Text>Add </Text> : <Text>Change </Text>}
                    Profile Picture
                  </Text>
                </Pressable>
              </View>

              <View style={{position: 'relative', marginBottom: 24}}>
                <Text style={labelStyles.inputLabel}>Username</Text>
                <TextInput
                  style={[localStyles.textInput, {marginBottom: 0}]}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  onChangeText={onUsernameChange}
                  defaultValue={userName}
                  placeholder="Username"
                />
                {userNameValid ? (
                  <CheckCircle
                    stroke="#0b9e5f"
                    height={16}
                    width={16}
                    strokeWidth={2}
                    style={{position: 'absolute', right: 6, bottom: 6}}
                  />
                ) : (
                  <>
                    <XCircle
                      stroke="#AD030F"
                      height={16}
                      width={16}
                      strokeWidth={2}
                      style={{position: 'absolute', right: 6, bottom: 26}}
                    />
                    <Text
                      style={{lineHeight: 20, fontSize: 12, color: '#AD030F'}}>
                      {userNameError}
                    </Text>
                  </>
                )}
              </View>

              <Text style={labelStyles.inputLabel}>Name</Text>
              <TextInput
                style={localStyles.textInput}
                onChangeText={onNameChange}
                defaultValue={fullName}
                placeholder="Full Name"
              />

              {/* <Text style={labelStyles.inputLabel}>Website</Text>
              <TextInput
                style={localStyles.textInput}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                onChangeText={text => setWebsite(text.toLowerCase())}
                defaultValue={website}
                placeholder="Website"
              /> */}

              {/* <Pressable
                activeOpacity={0.6}
                delayPressIn={0}
                onPress={() =>
                  navigation.push('Change Bio', {bio: bio, setBio: setBio})
                }>
                <Text style={buttonStyles.largeTextLinks}>Change Bio</Text>
              </Pressable> */}
            </>
          )}
          <LoadingModal
            show={showLoadingModal}
            message="Saving changes to your profile..."
          />
          <Portal>
            <Modalize
              ref={discardModalizeRef}
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
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, lineHeight: 24}}>
                    If you go back, you will lose all the changes you've made.{' '}
                  </Text>

                  <Pressable
                    activeOpacity={0.6}
                    delayPressIn={0}
                    onPress={() => {
                      discardModalizeRef.current?.close();
                      navigation.goBack();
                    }}
                    style={{marginTop: 24}}>
                    <Text
                      style={[
                        buttonStyles.largeTextLinks,
                        {color: '#FF0000', fontSize: 18},
                      ]}>
                      Discard Changes
                    </Text>
                  </Pressable>

                  <Pressable
                    activeOpacity={0.6}
                    delayPressIn={0}
                    onPress={() => discardModalizeRef.current?.close()}
                    style={{marginTop: 24}}>
                    <Text style={[buttonStyles.largeTextLinks, {fontSize: 18}]}>
                      Continue Editing Profile
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modalize>
          </Portal>
        </ScrollView>
      )}
    </>
  );
};

const localStyles = StyleSheet.create({
  linkEnclosingView: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 24,
  },
  userImage: {
    height: 120,
    width: 120,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ABABAB',
  },
  textInput: {
    alignSelf: 'stretch',
    borderColor: '#ABABAB',
    borderBottomWidth: 0.5,
    marginBottom: 24,
    fontSize: 16,
    paddingHorizontal: 0,
    paddingBottom: 2,
    paddingTop: 0,
    fontWeight: '500',
    textTransform: 'none',
  },
});

export default EditProfileScreen;
