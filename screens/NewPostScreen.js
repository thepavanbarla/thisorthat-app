import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

const NewPostScren = ({route, navigation}) => {
  const screenHeight = Dimensions.get('window').height - 88;
  const [bottomHeight, setBottomHeight] = useState(screenHeight / 2 + 24);
  const [isDividerClicked, setIsDividerClicked] = useState(false);
  const [panResponder, setPanResponder] = useState(null);

  useEffect(() => {
    setPanResponder(
      PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,

        // Initially, set the Y position offset when touch start
        onPanResponderGrant: (e, gestureState) => {
          // setOffset(e.nativeEvent.pageY);
          setIsDividerClicked(true);
        },

        // When we drag the divider, set the bottomHeight (component state) again.
        onPanResponderMove: (e, gestureState) => {
          setBottomHeight(
            gestureState.moveY > screenHeight - 60
              ? 60
              : screenHeight - gestureState.moveY + 40,
          );
          // setOffset(e.nativeEvent.pageY);
        },

        onPanResponderRelease: (e, gestureState) => {
          // Do something here for the touch end event
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          setBottomHeight(
            gestureState.moveY > (screenHeight * 3) / 5
              ? 60
              : gestureState.moveY < (screenHeight * 2) / 5
              ? screenHeight - 60
              : screenHeight / 2 + 24,
          );
          // setOffset(e.nativeEvent.pageY);
          setIsDividerClicked(false);
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      {panResponder && (
        <View style={styles.content}>
          {/* Top View */}
          <Animated.View
            style={[
              {backgroundColor: 'blue', minHeight: 100, flex: 1},
            ]}></Animated.View>

          {/* Divider */}
          <View
            style={[
              {
                maxHeight: 0,
                overflow: 'visible',
                zIndex: 100,
              },
              {
                flexDirection: 'row',
                backgroundColor: 'rgba(255, 255, 255, 0)',
                alignItems: 'center',
              },
            ]}
            {...panResponder.panHandlers}>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}></View>
            <View
              style={{
                flex: 2,
                backgroundColor: 'rgba(255, 255, 255, 0)',
                height: 48,
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 10,
                  borderWidth: 0,
                  height: 8,
                }}></View>
            </View>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}></View>
          </View>

          {/* Bottom View */}
          <Animated.View
            style={[
              {backgroundColor: 'green', minHeight: 100},
              {height: bottomHeight},
            ]}></Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default NewPostScren;
