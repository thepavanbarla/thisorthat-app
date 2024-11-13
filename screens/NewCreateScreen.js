import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Text,
  View,
  Pressable,
  Dimensions,
  Switch,
  Platform,
  Keyboard,
  BackHandler,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BigActiveButton from '../components/BigActiveButton';
import {createPost} from '../services/PostService';
import {getSessionUserId} from '../services/SessionService';
import {screenStyles, buttonStyles} from '../styles/Common';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {uploadPostPictureService} from '../services/PostService';
import LoadingModal from '../components/LoadingModal';
import Toast from 'react-native-root-toast';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {
  MentionInput,
  replaceMentionValues,
} from 'react-native-controlled-mentions';
import {categorizeTagCount} from '../utils/ConversionUtils';
import {useSearchTags} from '../hooks/useSearchTags';
import {useSearchUsers} from '../hooks/useSearchUsers';
import {assetsUrl} from '../services/Constants';
import {useFocusEffect} from '@react-navigation/native';
import {Edit} from 'react-native-feather';
import FastImage from 'react-native-fast-image';

function NewCreateScreen({route, navigation}) {
  const windowWidth = Dimensions.get('window').width;
  const pictureWidth = (windowWidth - 44) / 2;

  const [draftPostId, setDraftPostId] = useState(null);
  const [draftPost, setDraftPost] = useState(null);
  const [thisTitle, setThisTitle] = useState('');
  const [thatTitle, setThatTitle] = useState('');

  const [postText, setPostText] = useState('');

  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const createBg = require('../assets/images/create_bg.png');

  const [thisSelectedImage, setThisSelectedImage] = useState(null);
  const [thatSelectedImage, setThatSelectedImage] = useState(null);

  const modalizeRef = useRef();
  const discardModalizeRef = useRef();

  useFocusEffect(
    React.useCallback(() => {
      setDraftPost(route.params.draftPost);
      setDraftPostId(route.params.draftPostId);
      setPostText(route.params.draftPost ? route.params.draftPost.context : '');
      setThisTitle(
        route.params.draftPost ? route.params.draftPost.options[0].title : '',
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route, navigation]),
  );

  const discardCreation = posted => {
    setThisTitle('');
    setThatTitle('');
    setPostText('');
    setThisSelectedImage(null);
    setThatSelectedImage(null);
    setIsCollabPost(false);
    // discardModalizeRef.current?.close();
    route.params.exitCreation(posted);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={{marginRight: 16}}>
            <Pressable onPress={cancelCreate}>
              <Ionicons name="close" size={28} color={'#121212'} />
            </Pressable>
          </View>
        );
      },
    });
  });

  const cancelCreate = () => {
    Keyboard.dismiss();
    if (
      thisTitle !== '' ||
      thatTitle !== '' ||
      postText !== '' ||
      thisSelectedImage !== null ||
      thatSelectedImage !== null
    ) {
      discardModalizeRef.current?.open();
    } else {
      route.params.exitCreation(false);
    }
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', cancelCreate);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', cancelCreate);
    };
  });

  const cleanPostText = value => {
    return replaceMentionValues(
      value,
      ({name, trigger}) => `${trigger}${name}`,
    );
  };

  const postThisOrThat = async () => {
    setShowLoadingModal(true);
    const thisResponse = thisSelectedImage
      ? await uploadImage(thisSelectedImage)
      : null;
    const thatResponse = thatSelectedImage
      ? await uploadImage(thatSelectedImage)
      : null;
    let userId = await getSessionUserId();

    let post = {
      userId: userId,
      context: cleanPostText(postText),
      options: isCollabPost
        ? [
            {
              title: thisTitle.trim(),
              description: '',
              picture: thisResponse,
            },
          ]
        : [
            {
              title: thisTitle.trim(),
              description: '',
              picture:
                draftPostId !== null && draftPostId !== undefined
                  ? draftPost?.options[0]?.picture
                  : thisResponse,
            },
            {
              title: thatTitle.trim(),
              description: '',
              picture: thatResponse,
            },
          ],
      categories: [],
      createdTime: new Date(),
      type: isCollabPost ? 'draft' : 'post',
      draftPostId: draftPostId,
      draftPostUserId: draftPost?.userId,
    };
    createPost(post)
      .then(response => response.json())
      .then(json => {
        Toast.show('Posted successfully', {duration: 2000});
        setShowLoadingModal(false);
        discardCreation(true);
      })
      .catch(error => {
        console.log('Error posting', error);
      });
  };

  const [uploadingOption, setUploadingOption] = useState(null);

  const handlePicker = option => {
    setUploadingOption(option);
    Keyboard.dismiss();
    modalizeRef.current?.open();
  };

  const handleCustomPicker = type => {
    if (type === 1) {
      handleGalleryPicker();
    } else {
      handleCameraPicker();
    }
  };

  const clearSelectedImage = () => {
    if (uploadingOption === 0) {
      setThisSelectedImage(null);
    } else {
      setThatSelectedImage(null);
    }
    modalizeRef.current?.close();
  };

  const handleGalleryPicker = () => {
    ImageCropPicker.openPicker({
      width: 1080,
      height: 1080,
      cropping: true,
    }).then(image => {
      if (uploadingOption === 0) {
        setThisSelectedImage(image);
      } else {
        setThatSelectedImage(image);
      }
      modalizeRef.current?.close();
    });
  };

  const handleCameraPicker = () => {
    ImageCropPicker.openCamera({
      width: 1080,
      height: 1080,
      cropping: true,
    }).then(image => {
      if (uploadingOption === 0) {
        setThisSelectedImage(image);
      } else {
        setThatSelectedImage(image);
      }
      modalizeRef.current?.close();
    });
  };

  const uploadImage = async image => {
    let userId = await getSessionUserId();
    return uploadPostPictureService(image, userId)
      .then(response => response.json())
      .then(json => {
        return json.data;
      });
  };

  const RenderTagSuggestions = ({keyword, onSuggestionPress}) => {
    let tags = useSearchTags(keyword);

    if (draftPostId) {
      return <></>;
    }

    return (
      <>
        {tags && tags.length > 0 && (
          <View
            style={{
              position: 'absolute',
              top: 86,
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              padding: 8,
              zIndex: 100,
              borderWidth: 0.5,
              borderColor: '#EFEFEF',
            }}>
            {tags
              .filter(one =>
                one.tag
                  .toLocaleLowerCase()
                  .includes(keyword?.toLocaleLowerCase()),
              )
              .map(one => (
                <View>
                  <Pressable
                    key={one.tag}
                    onPress={() =>
                      onSuggestionPress({id: one.tag, name: one.tag})
                    }
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#121212',
                        fontSize: 14,
                        fontWeight: '600',
                      }}>
                      #{one.tag}
                    </Text>
                    <Text
                      style={{
                        color: '#454545',
                        fontSize: 12,
                        fontWeight: '300',
                      }}>
                      {categorizeTagCount(one.postCount)}
                    </Text>
                  </Pressable>
                </View>
              ))}
          </View>
        )}
      </>
    );
  };

  const RenderUserSuggestions = ({keyword, onSuggestionPress}) => {
    let userSuggestions = useSearchUsers(keyword);

    if (draftPostId) {
      return <></>;
    }

    return (
      <>
        {userSuggestions && userSuggestions.length > 0 && (
          <View
            style={{
              position: 'absolute',
              top: 90,
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              padding: 8,
              zIndex: 100,
              borderWidth: 0.5,
              borderColor: '#EFEFEF',
            }}>
            {userSuggestions
              .filter(
                one =>
                  one.userName
                    .toLocaleLowerCase()
                    .includes(keyword?.toLocaleLowerCase()) ||
                  one.fullName
                    .toLocaleLowerCase()
                    .includes(keyword?.toLocaleLowerCase()),
              )
              .map(one => (
                // <View>
                <Pressable
                  onPress={() =>
                    onSuggestionPress({id: one.userName, name: one.userName})
                  }
                  activeOpacity={0.6}
                  delayPressIn={0}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 8,
                    }}>
                    <FastImage
                      source={
                        one.profilePicture == null
                          ? require('../assets/images/profile_picture_placeholder-thumb.png')
                          : {uri: assetsUrl + one.profilePicture}
                      }
                      style={{
                        height: 36,
                        width: 36,
                        borderRadius: 12,
                        borderColor: '#CDCDCD',
                        borderWidth: 1,
                      }}
                    />
                    <View
                      style={{
                        paddingLeft: 10,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          lineHeight: 20,
                          fontWeight: '500',
                        }}>
                        {one.userName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          lineHeight: 18,
                          color: 'grey',
                          fontWeight: '400',
                        }}>
                        {one.fullName}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
          </View>
        )}
      </>
    );
  };

  const [isCollabPost, setIsCollabPost] = useState(false);

  const [thatTitleSaved, setThatTitleSaved] = useState('');
  const [thatImageSaved, setThatImageSaved] = useState(null);

  const updateIsCollab = async varIsCollab => {
    setIsCollabPost(varIsCollab);
    if (varIsCollab) {
      setThatTitleSaved(thatTitle);
      setThatImageSaved(thatSelectedImage);
      setThatSelectedImage(null);
      setThatTitle('');
    } else {
      setThatTitleSaved('');
      setThatImageSaved(null);
      setThatSelectedImage(thatImageSaved);
      setThatTitle(thatTitleSaved);
    }
  };

  const xnor = (a, b) => {
    return (a && b) || (!a && !b);
  };

  const [isPostDisabled, setIsPostDisabled] = useState(false);

  useEffect(() => {
    if (isCollabPost) {
      if (
        (thisSelectedImage != null || thisTitle.length > 0) &&
        postText.length > 0
      ) {
        setIsPostDisabled(false);
      } else {
        setIsPostDisabled(true);
      }
    } else if (draftPostId === null || draftPostId === undefined) {
      if (
        xnor(thisTitle.length > 0, thatTitle.length > 0) &&
        xnor(thisSelectedImage !== null, thatSelectedImage !== null) &&
        (thisTitle.length > 0 || thisSelectedImage !== null)
      ) {
        setIsPostDisabled(false);
      } else {
        setIsPostDisabled(true);
      }
    } else {
      if (
        xnor(draftPost.options[0].title.length > 0, thatTitle.length > 0) &&
        xnor(
          draftPost.options[0]?.picture?.length > 0,
          thatSelectedImage !== null,
        ) &&
        (thatTitle.length > 0 || thatSelectedImage !== null)
      ) {
        setIsPostDisabled(false);
      } else {
        setIsPostDisabled(true);
      }
    }
  }, [
    draftPost,
    draftPostId,
    isCollabPost,
    postText,
    thatSelectedImage,
    thatTitle,
    thisSelectedImage,
    thisTitle,
  ]);

  return (
    <>
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
              paddingVertical: 24,
              borderTopWidth: 1,
              borderTopColor: '#EFEFEF',
              zIndex: 1000,
            }}>
            {uploadingOption === 0 && thisSelectedImage !== null && (
              <View
                style={{
                  height: windowWidth,
                  width: windowWidth,
                  marginBottom: 16,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <ImageBackground
                  source={{uri: thisSelectedImage.path}}
                  style={{width: '100%', height: '100%'}}
                />
              </View>
            )}
            {uploadingOption === 1 && thatSelectedImage !== null && (
              <View
                style={{
                  height: windowWidth,
                  width: windowWidth,
                  marginBottom: 16,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <ImageBackground
                  source={{uri: thatSelectedImage.path}}
                  style={{width: '100%', height: '100%'}}
                />
              </View>
            )}

            <View
              style={{
                paddingHorizontal: 40,
                paddingVertical: 20,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'flex-end',
              }}>
              <Pressable
                style={{flexDirection: 'column', alignItems: 'center'}}
                onPress={() => {
                  handleCustomPicker(2);
                }}>
                <Ionicons name="camera-outline" size={36} color="#232323" />
                <Text style={{fontSize: 16, fontWeight: '500', marginTop: 6}}>
                  Camera
                </Text>
              </Pressable>
              <Pressable
                style={{flexDirection: 'column', alignItems: 'center'}}
                onPress={() => {
                  handleCustomPicker(1);
                }}>
                <Ionicons name="images-outline" size={32} color="#232323" />
                <Text style={{fontSize: 16, fontWeight: '500', marginTop: 10}}>
                  Photos
                </Text>
              </Pressable>
              {((uploadingOption === 0 && thisSelectedImage !== null) ||
                (uploadingOption === 1 && thatSelectedImage !== null)) && (
                <Pressable
                  style={{flexDirection: 'column', alignItems: 'center'}}
                  onPress={clearSelectedImage}>
                  <Ionicons name="trash-outline" size={30} color="#FF0000" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      marginTop: 10,
                      color: '#FF0000',
                    }}>
                    Remove
                  </Text>
                </Pressable>
              )}
            </View>
            <Pressable
              activeOpacity={0.6}
              delayPressIn={0}
              onPress={() => {
                modalizeRef.current?.close();
              }}
              style={{
                marginTop: 24,
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  buttonStyles.largeTextLinks,
                  {color: '#4487f2', fontSize: 18},
                ]}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </Modalize>
      </Portal>
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
                onPress={() => discardCreation(false)}
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
                  Continue Creating
                </Text>
              </Pressable>
            </View>
          </View>
        </Modalize>
      </Portal>
      <KeyboardAwareScrollView
        keyboardOpeningTime={0}
        extraScrollHeight={0}
        keyboardShouldPersistTaps="handled"
        style={
          ([screenStyles.generalScreens, localStyles.screenStyle],
          {paddingHorizontal: 0})
        }
        contentContainerStyle={[
          screenStyles.authScreensContainer,
          {
            justifyContent: 'flex-start',
            alignContent: 'stretch',
            paddingVertical: 16,
          },
        ]}>
        <MentionInput
          autoComplete="off"
          multiline
          editable={
            draftPostId === null || draftPostId === undefined ? true : false
          }
          selectTextOnFocus={
            draftPostId === null || draftPostId === undefined ? true : false
          }
          containerStyle={{
            marginHorizontal: 16,
            height: 75,
            alignSelf: 'stretch',
            marginBottom: 12,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingTop: Platform.OS === 'ios' ? 8 : 0,
            paddingBottom: 8,
            borderColor: '#787878',
            backgroundColor:
              draftPostId === null || draftPostId === undefined
                ? '#FFFFFF'
                : '#DADADA',
            textAlignVertical: 'top',
          }}
          style={{
            fontSize: 15,
            height: '100%',
            textAlignVertical: 'top',
          }}
          placeholder={'What is your comparison about? \n#trending @mention'}
          value={postText}
          onChange={setPostText}
          partTypes={[
            {
              trigger: '@', // Should be a single character like '@' or '#'
              renderSuggestions: RenderUserSuggestions,
              textStyle: {color: '#4487F2'}, // The mention style in the input
              isInsertSpaceAfterMention: true,
            },
            {
              trigger: '#', // Should be a single character like '@' or '#'
              renderSuggestions: RenderTagSuggestions,
              textStyle: {color: '#4487F2'}, // The mention style in the input
              isInsertSpaceAfterMention: true,
            },
          ]}
        />

        <View
          style={{
            marginBottom: 16,
            paddingHorizontal: 16,
            width: '100%',
            flexDirection: 'row',
            zIndex: -1,
          }}>
          <View
            style={{
              flex: 1,
              paddingRight: 6,
            }}>
            <TextInput
              autoComplete="off"
              multiline
              editable={
                draftPostId === null || draftPostId === undefined ? true : false
              }
              selectTextOnFocus={
                draftPostId === null || draftPostId === undefined ? true : false
              }
              style={{
                alignSelf: 'stretch',
                marginBottom: 12,
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingTop: 9,
                paddingBottom: 8,
                borderColor: '#787878',
                fontSize: 15,
                backgroundColor:
                  draftPostId === null || draftPostId === undefined
                    ? '#FFFFFF'
                    : '#DADADA',
              }}
              placeholder="What is This?"
              defaultValue={thisTitle}
              onChangeText={text => setThisTitle(text)}
            />
            {thisSelectedImage ? (
              <ImageBackground
                source={{uri: thisSelectedImage.path}}
                resizeMode="cover"
                style={{
                  justifyContent: 'flex-start',
                  height: pictureWidth,
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                <Pressable
                  activeOpacity={0.8}
                  onPress={() => handlePicker(0)}
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  }}>
                  <Edit
                    height={24}
                    width={24}
                    strokeWidth={1.2}
                    stroke="#EFEFEF"
                  />
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: '500',
                      marginTop: 4,
                      textAlign: 'center',
                    }}>
                    Change or Remove
                  </Text>
                </Pressable>
              </ImageBackground>
            ) : (
              <ImageBackground
                source={
                  draftPostId === null || draftPostId === undefined
                    ? createBg
                    : {uri: assetsUrl + draftPost.options[0].picture}
                }
                resizeMode="cover"
                style={{
                  height: pictureWidth,
                  justifyContent: 'flex-start',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {draftPostId === null || draftPostId === undefined ? (
                    <Pressable
                      onPress={() => handlePicker(0)}
                      style={{
                        width: '100%',
                        height: '100%',
                        padding: 30,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <>
                        <Ionicons name="add-circle" size={28} color="#EFEFEF" />
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 16,
                            fontWeight: '700',
                            marginTop: 4,
                            textAlign: 'center',
                          }}>
                          This Picture
                        </Text>
                      </>
                    </Pressable>
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor:
                          draftPostId !== null &&
                          draftPostId !== undefined &&
                          draftPost.options[0].picture
                            ? 'transparent'
                            : '#DADADA',
                      }}></View>
                  )}
                </View>
              </ImageBackground>
            )}
          </View>
          <View
            style={{
              flex: 1,
              paddingLeft: 6,
            }}>
            <TextInput
              autoComplete="off"
              editable={
                !(
                  isCollabPost ||
                  (draftPostId !== null &&
                    draftPostId !== undefined &&
                    draftPost.options[0].title.trim() === '')
                )
              }
              selectTextOnFocus={
                !(
                  isCollabPost ||
                  (draftPostId !== null &&
                    draftPostId !== undefined &&
                    draftPost.options[0].title.trim() === '')
                )
              }
              multiline
              style={{
                alignSelf: 'stretch',
                marginBottom: 12,
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingTop: 9,
                paddingBottom: 8,
                borderColor: '#787878',
                fontSize: 15,
                backgroundColor:
                  isCollabPost ||
                  (draftPostId !== null &&
                    draftPostId !== undefined &&
                    draftPost.options[0].title.trim() === '')
                    ? '#DADADA'
                    : '#FFFFFF',
              }}
              placeholder="What is That?"
              defaultValue={thatTitle}
              onChangeText={text => setThatTitle(text)}
            />
            {thatSelectedImage ? (
              <ImageBackground
                source={{uri: thatSelectedImage.path}}
                resizeMode="cover"
                style={{
                  justifyContent: 'flex-start',
                  height: pictureWidth,
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                <Pressable
                  activeOpacity={0.8}
                  disabled={isCollabPost}
                  onPress={() => handlePicker(1)}
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  }}>
                  <Edit
                    height={24}
                    width={24}
                    strokeWidth={1.2}
                    stroke="#EFEFEF"
                  />
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: '500',
                      marginTop: 4,
                      textAlign: 'center',
                    }}>
                    Change or Remove
                  </Text>
                </Pressable>
              </ImageBackground>
            ) : (
              <ImageBackground
                source={createBg}
                resizeMode="cover"
                style={{
                  height: pictureWidth,
                  justifyContent: 'flex-start',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isCollabPost ? '#DADADA' : 'rgba(0,0,0,0)',
                  }}>
                  <Pressable
                    disabled={isCollabPost}
                    onPress={() => handlePicker(1)}
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%',
                    }}>
                    {isCollabPost ? (
                      <Text
                        style={{
                          color: '#787878',
                          fontSize: 16,
                          fontWeight: '700',
                          marginTop: 4,
                          textAlign: 'center',
                          lineHeight: 26,
                        }}>
                        Others Add That
                      </Text>
                    ) : draftPostId === null || draftPostId === undefined ? (
                      <>
                        <Ionicons name="add-circle" size={28} color="#EFEFEF" />
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 16,
                            fontWeight: '700',
                            marginTop: 4,
                            textAlign: 'center',
                          }}>
                          That Picture
                        </Text>
                      </>
                    ) : draftPost.options[0].picture ? (
                      <>
                        <Ionicons name="add-circle" size={28} color="#EFEFEF" />
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 16,
                            fontWeight: '700',
                            marginTop: 4,
                            textAlign: 'center',
                          }}>
                          That Picture
                        </Text>
                      </>
                    ) : (
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#DADADA',
                        }}></View>
                    )}
                  </Pressable>
                </View>
              </ImageBackground>
            )}
          </View>
        </View>

        {(draftPostId === null || draftPostId === undefined) && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              paddingHorizontal: 16,
              paddingTop: 8,
              marginBottom: 16,
              zIndex: -1,
            }}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text style={{fontWeight: '500', fontSize: 16}}>
                Collaborate with Others
              </Text>
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: 12.5,
                  paddingTop: 6,
                  paddingRight: 12,
                  lineHeight: 17,
                }}>
                Enable this option if you want others to contribute the second
                option for this post.
              </Text>
            </View>
            <Switch
              style={{
                transform: [
                  {scaleX: Platform.OS === 'ios' ? 0.8 : 1.4},
                  {scaleY: Platform.OS === 'ios' ? 0.8 : 1.4},
                  {translateY: 4},
                ],
              }}
              trackColor={{
                false: switchColors.passiveTrackColor,
                true: switchColors.activeTrackColor,
              }}
              thumbColor={
                isCollabPost
                  ? switchColors.activeThumbColor
                  : switchColors.passiveThumbColor
              }
              ios_backgroundColor={switchColors.iosBackgroundColor}
              onValueChange={updateIsCollab}
              value={isCollabPost}
            />
          </View>
        )}

        <View style={{flex: 1}}></View>

        <View
          style={{
            paddingHorizontal: 16,
            display: 'flex',
            width: '100%',
            zIndex: -1,
          }}>
          <BigActiveButton
            disabled={isPostDisabled}
            title="Post"
            onPress={postThisOrThat}
          />
        </View>

        {/* <Text>{draftPostId}</Text>
        <Text>{JSON.stringify(draftPost)}</Text> */}

        <LoadingModal show={showLoadingModal} message="Creating your Post" />
      </KeyboardAwareScrollView>
    </>
  );
}

const localStyles = StyleSheet.create({
  list: {
    paddingBottom: 16,
  },
});

const switchColors = {
  passiveTrackColor: '#ababab',
  activeTrackColor: '#aec9f5',
  passiveThumbColor: '#dedede',
  activeThumbColor: '#4487f2',
  iosBackgroundColor: '#3e3e3e',
};

export default NewCreateScreen;
