import React from 'react';
import {Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EmptyView = props => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          marginBottom: 12,
          width: 70,
          height: 70,
          borderWidth: 1,
          borderRadius: 35,
          borderColor: '#DEDEDE',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}>
        <Ionicons
          name="american-football-outline"
          size={36}
          color={'#898989'}
        />
      </View>
      <Text style={{color: '#676767', fontWeight: '600', fontSize: 16}}>
        {props.message}
      </Text>
    </View>
  );
};

export default EmptyView;
