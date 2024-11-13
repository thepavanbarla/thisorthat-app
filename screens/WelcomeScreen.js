import React, {useRef, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import BigActiveButton from '../components/BigActiveButton';
import TextLink from '../components/TextLink';

import styles from '../styles/Common';
import {screenStyles} from '../styles/Common';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import LoadingOverlay from '../components/LoadingOverlay';
import Toast from 'react-native-root-toast';

function WelcomeScreen({navigation}) {
  const phoneInput = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const proceed = confirm => {
    setShowLoading(false);
    navigation.navigate('Verify OTP', {
      confirmation: confirm,
      phoneNumber: phoneNumber,
    });
  };

  const getHelp = () => {};

  const signInWithPhoneNumber = async () => {
    setShowLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      proceed(confirmation);
    } catch (error) {
      console.log('Error is ', error.message);
      setShowLoading(false);
      Toast.show('Cannot process your request now. Please try again later. ');
    }
  };

  return (
    <>
      {showLoading && <LoadingOverlay />}
      <KeyboardAwareScrollView
        keyboardOpeningTime={0}
        extraScrollHeight={30}
        keyboardShouldPersistTaps="handled"
        style={[screenStyles.generalScreens]}
        contentContainerStyle={[
          screenStyles.authScreensContainer,
          {
            flexDirection: 'column',
            justifyContent: 'flex-end',
          },
        ]}>
        <Text style={styles.sectionTitle}>Welcome</Text>
        <Text style={styles.sectionDescription}>
          Enter your mobile number to create an account or login to your
          existing account.
        </Text>
        <PhoneInput
          ref={phoneInput}
          style={{width: '100%'}}
          defaultCode="IN"
          onChangeFormattedText={text => {
            setPhoneNumber(text);
          }}
          containerStyle={{
            width: '100%',
            borderRadius: 5,
            marginVertical: 15,
            backgroundColor: '#efefef',
          }}
          textContainerStyle={{
            paddingVertical: 0,
            borderRadius: 5,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          textInputStyle={{fontSize: 20, paddingVertical: 15}}
          codeTextStyle={{fontSize: 20, paddingVertical: 15, paddingRight: 12}}
        />

        <BigActiveButton title="Proceed" onPress={signInWithPhoneNumber} />

        <Text
          style={{
            marginTop: 150,
            textAlign: 'center',
            alignSelf: 'stretch',
            lineHeight: 18,
            fontSize: 13,
            paddingBottom: Platform.OS === 'ios' ? 80 : 24,
          }}>
          By signing up, you agree to This or That's{' '}
          <Text
            style={{
              fontSize: 13,
              color: 'rgba(102, 49, 247, 1)',
              fontWeight: '600',
            }}
            onPress={() => navigation.navigate('Terms of Use')}>
            Terms of Use
          </Text>{' '}
          and acknowledge that our{' '}
          <Text
            style={{
              fontSize: 13,
              color: 'rgba(102, 49, 247, 1)',
              fontWeight: '600',
            }}
            onPress={() => navigation.navigate('Privacy Policy')}>
            Privacy Policy
          </Text>{' '}
          applies to you.
        </Text>

        {/* <TextLink style={{marginTop: '50%'}} title="" onPress={getHelp} /> */}
      </KeyboardAwareScrollView>
    </>
  );
}

export default WelcomeScreen;
