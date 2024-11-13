import React from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';

const WebviewScreen = props => {
  const {url} = props;
  return (
    <View style={localStyles.container}>
      <WebView source={{uri: url}} style={localStyles.webView} />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'yellow',
  },
  webView: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

export default WebviewScreen;
