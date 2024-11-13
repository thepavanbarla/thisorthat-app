import React from 'react';
import {View} from 'react-native';

import HorizontalTeaser from '../components/HorizontalTeaser';
import VerticalTeaser from '../components/VerticalTeaser';

const NoHorizontal = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 12,
        marginBottom: 12,
        justifyContent: 'space-between',
      }}>
      <VerticalTeaser
        postAndDetails={props.posts[0]}
        openPost={props.openPost}
      />
      <VerticalTeaser
        postAndDetails={props.posts[1]}
        openPost={props.openPost}
      />
      <VerticalTeaser
        postAndDetails={props.posts[2]}
        openPost={props.openPost}
      />
    </View>
  );
};

const LeftHorizontal = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 12,
        marginBottom: 12,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'flex-start',
          display: 'flex',
        }}>
        <HorizontalTeaser
          postAndDetails={props.posts[0]}
          openPost={props.openPost}
        />
        <View style={{height: 12}}></View>
        <HorizontalTeaser
          postAndDetails={props.posts[1]}
          openPost={props.openPost}
        />
      </View>
      <VerticalTeaser
        postAndDetails={props.posts[2]}
        openPost={props.openPost}
      />
    </View>
  );
};

const RightHorizontal = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 12,
        marginBottom: 12,
        justifyContent: 'space-between',
        display: 'flex',
      }}>
      <VerticalTeaser
        postAndDetails={props.posts[0]}
        openPost={props.openPost}
      />
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          marginLeft: 12,
          display: 'flex',
        }}>
        <HorizontalTeaser
          postAndDetails={props.posts[1]}
          openPost={props.openPost}
        />
        <HorizontalTeaser
          postAndDetails={props.posts[2]}
          openPost={props.openPost}
        />
      </View>
    </View>
  );
};

export {NoHorizontal, LeftHorizontal, RightHorizontal};
