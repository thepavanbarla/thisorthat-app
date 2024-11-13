import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, LogBox, BackHandler} from 'react-native';
import BigActiveButton from '../components/BigActiveButton';

import styles from '../styles/Common';
import {screenStyles} from '../styles/Common';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InterestTag from '../components/InterestTag';
import {saveInterests} from '../services/AccountService';
import {getAllInterests} from '../services/UserService';
import LoadingOverlay from '../components/LoadingOverlay';

function InterestsScreen({navigation, route}) {
  const {userId} = route.params;
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    getInterests();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  const getInterests = async () => {
    getAllInterests()
      .then(response => {
        return response.json();
      })
      .then(json => {
        setInterests(json.data);
      })
      .catch(error => {
        console.log("All interests list can't be fetched: ", error);
      });
  };

  const handleFinish = async () => {
    await saveInterests({
      userId: userId,
      interests: selectedInterests,
    });

    navigation.navigate('Guide');
  };

  // let interests = [
  //   {text: 'Sports', value: 'sports'},
  //   {text: 'Food', value: 'food'},
  //   {text: 'Fashion', value: 'fashion'},
  //   {text: 'Games', value: 'games'},
  //   {text: 'Technology', value: 'technology'},
  //   {text: 'Cinema', value: 'cinema'},
  //   {text: 'Shoes', value: 'shoes'},
  // ];

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const onPress = (value, isActive) => {
    if (isActive) setSelectedInterests(prevState => [...prevState, value]);
    else {
      var array = [...selectedInterests];
      var index = array.indexOf(value);
      if (index !== -1) {
        array.splice(index, 1);
        setSelectedInterests(array);
      }
    }
  };

  return (
    <>
      {interests && interests.length > 0 ? (
        <KeyboardAwareScrollView
          keyboardOpeningTime={0}
          extraScrollHeight={0}
          keyboardShouldPersistTaps="handled"
          style={[screenStyles.generalScreens, localStyles.screenStyle]}
          contentContainerStyle={[
            screenStyles.authScreensContainer,
            {justifyContent: 'center'},
          ]}>
          <Text style={styles.sectionTitle}>Choose your Interests</Text>
          <Text style={styles.sectionDescription}>
            Your choices will help us show you the most relevant content.
          </Text>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignContent: 'flex-start',
              paddingVertical: 8,
              justifyContent: 'flex-start',
              alignSelf: 'stretch',
              marginTop: 16,
            }}>
            {interests.map(interest => (
              <InterestTag
                key={interest.interestTag}
                onPress={onPress}
                text={interest.interestName}
                value={interest.interestTag}
                isActive={false}
              />
            ))}
          </View>

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              padding: 10,
            }}>
            <Text style={[styles.sectionDescription, {textAlign: 'center'}]}>
              Pick atleast three.{' '}
            </Text>
          </View>

          <BigActiveButton
            disabled={selectedInterests.length < 3}
            title="Finish"
            onPress={handleFinish}
          />
        </KeyboardAwareScrollView>
      ) : (
        <LoadingOverlay />
      )}
    </>
  );
}

const localStyles = StyleSheet.create({
  screenStyle: {
    paddingBottom: 20,
  },
  linkEnclosingView: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 24,
  },
  userImage: {
    height: 400,
    width: 400,
    alignSelf: 'center',
    marginBottom: 20,
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
    fontFamily: 'Roboto-Regular',
  },
});

export default InterestsScreen;
