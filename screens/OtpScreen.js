/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, ScrollView, View} from 'react-native';
import BigActiveButton from '../components/BigActiveButton';
import TextLink from '../components/TextLink';

import OTPInputView from '@twotalltotems/react-native-otp-input';

import styles from '../styles/Common';
import {screenStyles} from '../styles/Common';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {createSession} from '../services/SessionService';
import LoadingOverlay from '../components/LoadingOverlay';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-root-toast';

function OtpScreen({route, navigation}) {
  const [otp, setOtp] = useState('');
  const {phoneNumber} = route.params;
  const [showLoading, setShowLoading] = useState(false);

  const [confirm, setConfirm] = useState(route.params.confirmation);
  const [resendIn, setResendIn] = useState(30);
  const [resendActive, setResendActive] = useState(false);

  let interval;
  let timeout;

  useEffect(() => {
    clearInterval(interval);
    let time = 30;
    setResendIn(time);
    setResendActive(false);
    interval = setInterval(() => {
      setResendIn(--time);
    }, 1000);
    timeout = setTimeout(() => {
      clearInterval(interval);
      setResendActive(true);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [confirm]);

  const verify = async () => {
    setShowLoading(true);
    try {
      var result = await confirm.confirm(otp);
      console.log('OTP verification successful', JSON.stringify(result));

      if (result.user) {
        result.user.getIdToken().then(idToken => {
          createSession({userId: result.user.uid}, idToken);
          setShowLoading(false);
          navigation.navigate('Create Account', {firebaseUser: result.user});
        });
      }
    } catch (error) {
      Toast.show('OTP verification failed. Please try again!', {
        duration: 3000,
      });
      setOtp('');
      setShowLoading(false);
    }
  };

  const resendOtp = async () => {
    setShowLoading(true);
    try {
      setConfirm(confirm);
      Toast.show('OTP resent successfully', {duration: 3000});
      setShowLoading(false);
    } catch (error) {
      setShowLoading(false);
      Toast.show('Cannot process your request now. Please try again later. ');
    }
  };

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        console.log('Auto signed-in: ', user);
        user.getIdToken().then(idToken => {
          createSession({userId: user.uid}, idToken);
          setShowLoading(false);
          navigation.navigate('Create Account', {firebaseUser: user});
        });
      } else {
        console.log('Login not complete');
      }
    });
  }, []);

  return (
    <>
      {showLoading && <LoadingOverlay />}
      <KeyboardAwareScrollView
        keyboardOpeningTime={0}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        style={[screenStyles.generalScreens, localStyles.screenStyle]}
        contentContainerStyle={screenStyles.authScreensContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            paddingTop: 100,
          }}>
          <Text style={styles.sectionTitle}>Enter OTP</Text>
          <Text style={styles.sectionDescription}>
            Enter the OTP sent to your mobile number &nbsp;{' '}
            <Text style={{fontWeight: '700', color: '#121212'}}>
              {phoneNumber}
            </Text>
            .{' '}
          </Text>

          <OTPInputView
            style={{width: '100%', height: 72}}
            code={otp}
            onCodeChanged={code => setOtp(code)}
            pinCount={6}
            clearInputs={false}
            autoFocusOnLoad={false}
            codeInputFieldStyle={{
              backgroundColor: '#fff',
              color: '#000',
              fontSize: 20,
              borderColor: '#dedede',
            }}
            codeInputHighlightStyle={{
              backgroundColor: '#fff',
              color: '#000',
              borderColor: '#232323',
            }}
            onCodeFilled={() => {}}
          />

          <BigActiveButton
            disabled={false}
            title="Verify"
            onPress={verify}
            style={{alignSelf: 'stretch'}}
          />

          <TextLink
            style={{marginTop: 20}}
            disabled={!resendActive}
            title={
              resendActive
                ? `Re-send OTP`
                : `Re-send OTP in ${resendIn} seconds`
            }
            onPress={resendOtp}
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}

const localStyles = StyleSheet.create({
  screenStyle: {
    paddingBottom: 20,
  },
});

export default OtpScreen;
