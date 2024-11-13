import React, {useEffect} from 'react';
import {ScrollView, TextInput, StyleSheet, ToastAndroid} from 'react-native';

import {screenStyles} from '../styles/Common';
import ProfileSaveButton from '../components/ProfileSaveButton';
import LoadingModal from '../components/LoadingModal';

const ChangeBioScreen = ({route, navigation}) => {
  const [bio, setBio] = React.useState(route.params.bio);

  const setBioCallback = text => {
    setBio(text);
    route.params.setBio(text);
  };
  const [showLoadingModal, setShowLoadingModal] = React.useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <ProfileSaveButton
            saveFn={() => {
              setShowLoadingModal(true);
              navigation.goBack();
            }}
          />
        );
      },
    });
  });

  return (
    <ScrollView style={screenStyles.generalScreens}>
      <TextInput
        style={localStyles.bioTextInput}
        onChangeText={text => setBioCallback(text)}
        defaultValue={bio}
        placeholder="Your Bio"
        multiline={true}
      />
      <LoadingModal show={showLoadingModal} message="Saving your bio..." />
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  bioTextInput: {
    alignSelf: 'stretch',
    borderColor: '#ababab',
    borderBottomWidth: 0.5,
    marginTop: 20,
    marginBottom: 24,
    lineHeight: 22,
    fontSize: 15,
    paddingHorizontal: 0,
    paddingBottom: 6,
    paddingTop: 0,
    fontWeight: '500',
  },
});

export default ChangeBioScreen;
