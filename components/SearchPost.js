import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import styles from '../styles/Common';
import PostUser from './PostUser';

function SearchPost(props) {
  const plusOne = require('../assets/images/plus1.png');

  const Fade = new Animated.Value(0);
  const Scale = new Animated.Value(0);
  const ScaleValue = Scale.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  let clickCount1 = 0;
  let clickTimer1 = null;

  const showInteractions = () => {};

  const listenDoubleClick = () => {
    clickCount1++;
    if (clickCount1 == 2) {
      clearTimeout(this.backTimer);
      doubleClick();
    } else {
      clickTimer1 = setTimeout(() => {
        clickCount1 = 0;
      }, 3000);
    }
  };

  const doubleClick = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(Fade, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(Scale, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(Scale, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(Fade, {
          toValue: 0.9,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(Scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(Fade, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(Scale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const longPress = () => {
    Alert.alert('Long pressed!');
  };

  // const longPress = ({ reactTag }) => {
  //     Navigation.push(props.componentId, {
  //       component: {
  //         name: Settings,
  //         options: {
  //           preview: {
  //             reactTag,
  //             height: 300,
  //             width: 300,
  //             commit: true,
  //             actions: [{
  //               title: "Displayed Name",
  //               id: "actionId",
  //               style: 'default',
  //               actions: [/*define a submenu of actions with the same options*/]
  //             }]
  //           },
  //         },
  //       },
  //     });
  //   };

  return (
    <View style={styles.FeedPost}>
      <PostUser
        userName={props.post.userName}
        fullName={props.post.fullName}
        userImg={props.post.userImage}
      />
      <Text style={{fontSize: 17, marginTop: 8, lineHeight: 23}}>
        {props.post.content}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 16,
        }}>
        <View style={{flex: 1, paddingRight: 8, flexDirection: 'column'}}>
          <TouchableWithoutFeedback
            style={{height: 200}}
            onPress={listenDoubleClick}
            onLongPress={longPress}>
            <ImageBackground
              source={{uri: props.post.options[0].image}}
              imageStyle={{borderRadius: 8}}
              resizeMode="cover"
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Animated.Image
                style={{
                  opacity: Fade,
                  transform: [{scale: ScaleValue}],
                  width: '25%',
                  resizeMode: 'contain',
                  flex: 1,
                  position: 'relative',
                  right: 5,
                }}
                source={plusOne}
              />
            </ImageBackground>
          </TouchableWithoutFeedback>

          <Text
            style={{
              color: '#000000',
              fontSize: 17,
              fontWeight: '700',
              marginTop: 16,
            }}>
            {props.post.options[0].name}
          </Text>
          <Text
            style={{
              color: '#000000',
              fontSize: 14,
              fontWeight: '400',
              marginTop: 6,
            }}>
            {props.post.options[0].description}
          </Text>
        </View>

        <View style={{flex: 1, paddingLeft: 8, flexDirection: 'column'}}>
          <View style={{height: 200}}>
            <ImageBackground
              source={{uri: props.post.options[1].image}}
              imageStyle={{borderRadius: 8}}
              resizeMode="cover"
              style={{flex: 1, justifyContent: 'center'}}
            />
          </View>
          <Text
            style={{
              color: '#000000',
              fontSize: 17,
              fontWeight: '700',
              marginTop: 16,
            }}>
            {props.post.options[1].name}
          </Text>
          <Text
            style={{
              color: '#000000',
              fontSize: 14,
              fontWeight: '400',
              marginTop: 6,
            }}>
            {props.post.options[1].description}
          </Text>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  voterImages: {
    borderRadius: 12,
    width: 30,
    height: 30,
    borderWidth: 2,
    position: 'relative',
    borderColor: '#FFFFFF',
  },
  secondVoterImage: {
    left: -12,
  },
  thirdVoterImage: {
    left: -24,
  },
  interactionLinks: {
    letterSpacing: -0.2,
    fontSize: 13,
    color: '#676767',
    fontWeight: '600',
  },
  interactionButtonIcon: {
    position: 'relative',
    bottom: 3,
    marginRight: 4,
  },
  buttonColor: {
    color: '#232323',
  },
  interactionButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
});

export default SearchPost;
