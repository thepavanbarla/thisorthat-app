import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Modal,
  View,
  TextInput,
  Pressable,
  LogBox,
  ActivityIndicator,
  BackHandler,
  Platform,
  Keyboard,
} from 'react-native';
import BigActiveButton from '../components/BigActiveButton';

import styles, {buttonStyles} from '../styles/Common';
import {screenStyles} from '../styles/Common';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImageCropPicker from 'react-native-image-crop-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import {BlurView} from '@react-native-community/blur';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  createUser,
  getUser,
  updateUser,
  uploadPictureService,
} from '../services/AccountService';
import {updateSessionUserDetails} from '../services/SessionService';
import LoadingOverlay from '../components/LoadingOverlay';
import {assetsUrl} from '../services/Constants';
import messaging from '@react-native-firebase/messaging';
import {addUserDevice, getUserByUserName} from '../services/UserService';
import {CheckCircle, XCircle} from 'react-native-feather';
import {isValidUserName} from '../utils/ConversionUtils';
import FastImage from 'react-native-fast-image';

function ProfileSetupScreen({navigation, route}) {
  const {firebaseUser} = route.params;

  const [pageTitle, setPageTitle] = useState('Create Account');
  const [pageDesc, setPageDesc] = useState(
    "Add your basic details, this won't take long!",
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  const [selectedGender, setSelectedGender] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [picture, setPicture] = React.useState(null);
  const [fullName, setFullName] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState(new Date('2000-01-01'));
  const [open, setOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [isNewUser, setIsNewUser] = useState(true);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(true);

  const [userNameValid, setUserNameValid] = useState(false);
  const [userNameError, setUserNameError] = useState('');

  const [dobValid, setDobValid] = useState(true);

  const requestUserPermission = async () => {
    const authorizationStatus = await messaging()
      .requestPermission({
        sound: true,
        announcement: false,
        alert: true,
        badge: true,
      })
      .catch(err => {
        console.log('Can not get notification permissions', err);
      });
    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }
    await registerFCMToken();
  };

  const registerFCMToken = async () => {
    const token = await messaging().getToken();
    addUserDevice(token).catch(error => {
      console.log("Can't register device. ", error);
    });
  };

  useEffect(() => {
    requestUserPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowLoadingOverlay(true);
    getUser(firebaseUser.uid)
      .then(response => response.json())
      .then(json => {
        // TODO set user details
        setPageTitle('Welcome!');
        setPageDesc('Verify your details before you proceed. ');
        setFullName(json.data.fullName);
        setUserName(json.data.userName);
        if (json.data.userName && json.data.userName.length > 0) {
          setUserNameValid(true);
        }
        setPicture(json.data.profilePicture);
        setSelectedGender(json.data.gender);
        setDateOfBirth(new Date(json.data.dob.toString()));
        setIsNewUser(false);
        setShowLoadingOverlay(false);
      })
      .catch(error => {
        console.log("User can't be fetched: " + error);
        setShowLoadingOverlay(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    setShowLoadingOverlay(true);
    let apiResponse;
    let setupUser = {
      fullName: fullName,
      userName: userName,
      profilePicture: picture,
      dateOfBirth: dateOfBirth,
      gender: selectedGender,
    };

    if (isNewUser) {
      apiResponse = createUser(firebaseUser, setupUser);
    } else {
      apiResponse = updateUser(firebaseUser, setupUser);
    }

    apiResponse
      .then(response => response.json())
      .then(json => {
        updateSessionUserDetails(selectedGender, dateOfBirth);
      })
      .catch(err => {
        console.log('Can not save user details ', err);
      });
    setShowLoadingOverlay(false);
    if (isNewUser) {
      navigation.navigate('Interests', {
        userId: firebaseUser.uid,
        userName: userName,
        fullname: fullName,
      });
    } else {
      navigation.navigate('Guide');
    }
  };

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
    uploadPictureService(image, firebaseUser.uid)
      .then(response => response.json())
      .then(json => {
        setPicture(json.data);
        setImageLoading(false);
      });
  };

  const checkUserName = async varUserName => {
    if (varUserName.trim().length < 4) {
      setUserNameError('Username must be atleast 4 characters long');
      setUserNameValid(false);
    } else if (!isValidUserName(varUserName)) {
      setUserNameError('Username must be atleast 4 characters long');
      setUserNameValid(false);
    } else {
      const response = await getUserByUserName(varUserName);
      const jsonResponse = await response.json();
      if (jsonResponse.data && jsonResponse.data.userId !== firebaseUser.uid) {
        setUserNameError('User name already taken. Try a different one.');
        setUserNameValid(false);
      } else {
        setUserNameError('');
        setUserNameValid(true);
      }
    }
  };

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const onChangeUserName = text => {
    let varUserName = text.toLowerCase().replace(/ /g, '');
    setUserName(varUserName);
    checkUserName(varUserName);
  };

  const validateDob = date => {
    var ageDifMs = Date.now() - date;
    var ageDate = new Date(ageDifMs);
    var ageInYears = Math.abs(ageDate.getUTCFullYear() - 1970);
    setDobValid(ageInYears >= 12);
  };

  const setGenderDropdownState = state => {
    setIsDropdownOpen(state);
    Keyboard.dismiss();
  };

  const setGenderDropdownValue = val => {
    setSelectedGender(val);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {showLoadingOverlay && <LoadingOverlay />}
      <KeyboardAwareScrollView
        nestedScrollEnabled={true}
        keyboardOpeningTime={0}
        extraScrollHeight={0}
        keyboardShouldPersistTaps="handled"
        style={[screenStyles.generalScreens, localStyles.screenStyle]}
        contentContainerStyle={[
          screenStyles.authScreensContainer,
          {justifyContent: 'center', position: 'relative'},
        ]}>
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
            reducedTransparencyFallbackColor="#FFFFFF"
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
                <Text style={{fontSize: 18, fontWeight: '500', marginTop: 12}}>
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
                  {color: '#AD030F', fontSize: 18},
                ]}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </Modal>

        <View style={{paddingHorizontal: 16}}>
          <Text style={styles.sectionTitle}>{pageTitle}</Text>
          <Text style={styles.sectionDescription}>{pageDesc} </Text>

          <Pressable
            activeOpacity={0.6}
            delayPressIn={0}
            onPress={() => handlePicker()}
            style={{
              alignSelf: 'center',
              marginVertical: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // borderRadius: 120,
              overflow: 'hidden',
            }}>
            <FastImage
              source={
                picture == null
                  ? require('../assets/images/profile_picture_placeholder.png')
                  : {uri: assetsUrl + picture}
              }
              style={[localStyles.userImage, {opacity: imageLoading ? 0.5 : 1}]}
            />
            {/* <Text blurRadius={200} style={{position: 'absolute', bottom: 0, fontWeight: '500', fontSize: 17, width: '100%', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', paddingVertical: 20, paddingBottom: 30 }}>
            {(picture == null) ? 'Add Photo' : 'Change Photo' }
            </Text> */}
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

          <TextInput
            style={{
              alignSelf: 'stretch',
              marginBottom: 14,
              borderWidth: 1,
              borderRadius: 5,
              padding: 12,
              borderColor: '#787878',
              fontSize: 16,
            }}
            placeholder="Your Full Name"
            value={fullName}
            onChangeText={text => setFullName(text)}
            onFocus={() => setIsDropdownOpen(false)}
          />
          <View
            style={{
              position: 'relative',
              flexDirection: 'column',
              justifyContent: 'center',
              marginBottom: 14,
            }}>
            <TextInput
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              style={{
                alignSelf: 'stretch',
                borderWidth: 1,
                borderRadius: 5,
                padding: 12,
                borderColor: '#787878',
                fontSize: 16,
              }}
              placeholder="Choose UserName"
              defaultValue={userName}
              onChangeText={onChangeUserName}
              onFocus={() => setIsDropdownOpen(false)}
            />
            {userNameValid ? (
              <CheckCircle
                stroke="#0b9e5f"
                strokeWidth={1.5}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: Platform.OS === 'ios' ? 11 : 16,
                }}
              />
            ) : (
              <>
                <XCircle
                  stroke="#AD030F"
                  strokeWidth={1.5}
                  style={{position: 'absolute', right: 12, top: 15}}
                />
                <Text style={{lineHeight: 20, fontSize: 12, color: '#AD030F'}}>
                  {userNameError}
                </Text>
              </>
            )}
          </View>

          <DropDownPicker
            listMode="SCROLLVIEW"
            style={{
              alignSelf: 'stretch',
              marginBottom: 14,
              borderWidth: 1,
              borderRadius: 5,
              padding: 15,
              borderColor: '#787878',
              zIndex: 90,
            }}
            open={isDropdownOpen}
            value={selectedGender}
            items={[
              {label: 'Male', value: 'male'},
              {label: 'Female', value: 'female'},
            ]}
            setOpen={setGenderDropdownState}
            setValue={setGenderDropdownValue}
            placeholder="Your Gender"
            textStyle={{fontSize: 16}}
            placeholderStyle={{color: '#BCBCBC'}}
          />

          <View style={{flexDirection: 'column', marginBottom: 14}}>
            <Pressable
              style={{
                alignSelf: 'stretch',
                borderWidth: 1,
                borderRadius: 5,
                padding: 15,
                borderColor: '#787878',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              onPress={() => setOpen(true)}>
              <Text style={{fontSize: 16, fontWeight: '600'}}>
                Date of Birth
              </Text>
              <Text style={{fontSize: 16}}>{dateOfBirth.toDateString()}</Text>
            </Pressable>
            {!dobValid && (
              <Text style={{lineHeight: 20, fontSize: 12, color: '#AD030F'}}>
                You must be aged 12+ to use this app
              </Text>
            )}
          </View>

          <DatePicker
            mode="date"
            modal
            open={open}
            date={dateOfBirth}
            onConfirm={date => {
              setOpen(false);
              validateDob(date);
              setDateOfBirth(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />

          <BigActiveButton
            disabled={!userNameValid || !dobValid}
            title="Continue"
            onPress={handleContinue}
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}

const localStyles = StyleSheet.create({
  screenStyle: {
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
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
    backgroundColor: '#EFEFEF',
    borderWidth: 1,
    borderColor: '#ABABAB',
  },
  textInput: {
    alignSelf: 'stretch',
    borderColor: '#ababab',
    borderBottomWidth: 0.5,
    marginBottom: 24,
    fontSize: 16,
    paddingHorizontal: 0,
    paddingBottom: 2,
    paddingTop: 0,
    fontWeight: '500',
  },
});

export default ProfileSetupScreen;
