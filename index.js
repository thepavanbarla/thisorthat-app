/**
 * @format
 */

import {AppRegistry, Platform, TouchableOpacity} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Navigation} from 'react-native-navigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => App);
Navigation.registerComponent('com.pickthisorthat.WelcomeScreen', () =>
  gestureHandlerRootHOC(App),
);

if (Platform.OS === 'android') {
  Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setDefaultOptions({});
    Navigation.setRoot({
      root: {
        component: {
          name: 'com.pickthisorthat.WelcomeScreen',
        },
      },
    });
  });
}
