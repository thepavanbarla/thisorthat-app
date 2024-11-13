import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {categorizeTagCount} from '../utils/ConversionUtils';

function SearchTag(props) {
  const goToTagFn = props.tagNavFn;

  return (
    <Pressable
      delayPressIn={0}
      activeOpacity={0.6}
      onPress={() => goToTagFn(props.tag.tag)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8,
      }}>
      <View
        style={{
          height: 36,
          width: 36,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 0.5,
          borderColor: '#CDCDCD',
          backgroundColor: '#EFEFEF',
        }}>
        <Text style={{color: 'black', fontWeight: '500', fontSize: 20}}>#</Text>
      </View>

      <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
        <Text
          style={{
            paddingLeft: 10,
            fontSize: 15,
            lineHeight: 20,
            fontWeight: '500',
          }}>
          #{props.tag.tag}
        </Text>
        <Text
          style={{
            paddingLeft: 10,
            fontSize: 13,
            lineHeight: 18,
            color: 'grey',
            fontWeight: '400',
          }}>
          {categorizeTagCount(props.tag.postCount)}
        </Text>
      </View>
    </Pressable>
  );
}

export default SearchTag;
