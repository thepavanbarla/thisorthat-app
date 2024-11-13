import 'react-native-gesture-handler';
import React, {useContext} from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import styles from '../styles/Common';
import NewCreateScreen from '../screens/NewCreateScreen';
import {ReloadContext} from '../contexts/ReloadContext';

const CreateStack = createStackNavigator();

const CreateNavigator = ({navigation}) => {
  const {setReloadFeed} = useContext(ReloadContext);

  const exitCreation = posted => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Create New Post',
          params: {draftPostId: null, draftPost: null},
        },
      ],
      key: null,
    });
    if (posted) {
      setReloadFeed(true);
      navigation.navigate('FeedNav', {
        screen: 'TOT',
        params: {screen: 'Following'},
      });
    } else {
      navigation.goBack();
    }
  };

  const createScreenOptionsBuilder = (navigation, route) => {
    return {
      title: route.name,
      headerTitleAlign: 'left',
      headerTitleContainerStyle: styles.headerTitleInitialPageContainerStyle,
      headerLeftContainerStyle: {position: 'relative', left: 8},
      headerBackTitleVisible: false,
    };
  };

  return (
    <CreateStack.Navigator
      initialRouteName="Create New Post"
      screenOptions={{
        animationEnabled: false,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerTitleContainerStyle: styles.headerTitleStackedPageContainerStyle,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <CreateStack.Screen
        name="Create New Post"
        component={NewCreateScreen}
        options={({navigation, route}) =>
          createScreenOptionsBuilder(navigation, route)
        }
        initialParams={{
          exitCreation,
        }}
      />
    </CreateStack.Navigator>
  );
};

export default CreateNavigator;
