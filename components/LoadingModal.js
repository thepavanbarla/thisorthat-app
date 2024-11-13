import React from 'react';
import {View, StyleSheet, Modal, ActivityIndicator, Text} from 'react-native';

const LoadingModal = props => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      style={localStyles.modal}
      visible={props.show}
      onRequestClose={props.closeModal}>
      <View
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'stretch',
          paddingHorizontal: 32,
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 6,
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
            padding: 24,
          }}>
          <ActivityIndicator size="small" color="grey" />
          <Text style={{marginLeft: 12}}>{props.message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  modal: {
    backgroundColor: 'black',
  },
});

export default LoadingModal;
