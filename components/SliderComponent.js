import React from 'react';
import {View, Text, Pressable, Image, StyleSheet, Platform} from 'react-native';

export const SliderComponent = ({
  style,
  item,
  imageKey,
  onPress,
  index,
  active,
  local,
}) => {
  return (
    <Pressable style={[styles.videoContainer]} onPress={() => {}}>
      <View style={[styles.imageContainer, styles.shadow]}>
        <Image
          style={[styles.videoPreview, active ? {} : {height: 120}]}
          source={{uri: item[imageKey]}}
        />
      </View>
      <Text style={styles.desc}>{item.desc}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: 275,
    paddingVertical: 28,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  videoPreview: {
    width: 275,
    height: 155,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  desc: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 18,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
