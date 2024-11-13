import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  ImageBackground,
  RefreshControl,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import EmptyView from '../components/EmptyView';
import LoadingOverlay from '../components/LoadingOverlay';
import OptionFocus from '../components/OptionFocus';
import Voter from '../components/Voter';
import VoterAndChoice from '../components/VoterAndChoice';
import {assetsUrl} from '../services/Constants';
import {getVotersForOption, getVotersForPost} from '../services/PostService';
import {getSmall} from '../utils/ConversionUtils';

function VoterListScreen({navigation, route}) {
  const {showChoices, option, postId, optionId} = route.params;
  const [voters, setVoters] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    loadVoterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createBg = require('../assets/images/create_bg.png');

  const loadVoterData = async () => {
    setRefreshing(true);
    if (optionId) {
      getVotersForOption(optionId)
        .then(resp => resp.json())
        .then(json => {
          setVoters(json.data);
          setRefreshing(false);
          setFirstLoad(false);
        });
    } else {
      getVotersForPost(postId)
        .then(resp => resp.json())
        .then(json => {
          setVoters(json.data);
          setRefreshing(false);
          setFirstLoad(false);
        });
    }
  };

  const [showOptionModal, setShowOptionModal] = useState(false);

  const navigateToProfile = userId => {
    navigation.push('Profile', {userId: userId});
  };

  const focusOptionFn = opt => {
    setFocusOption(opt);
    setShowOptionModal(true);
  };

  const renderVoter = ({item}) => (
    <>
      {showChoices ? (
        <VoterAndChoice
          vote={item}
          navigateToProfile={navigateToProfile}
          focusOptionFn={focusOptionFn}
        />
      ) : (
        <Voter vote={item} navigateToProfile={navigateToProfile} />
      )}
    </>
  );

  const [focusOption, setFocusOption] = useState(showChoices ? null : option);

  return (
    <>
      {firstLoad ? (
        <LoadingOverlay />
      ) : voters.length === 0 ? (
        <EmptyView
          message={showChoices ? 'No votes' : 'No votes for this option'}
        />
      ) : (
        <>
          <FlatList
            style={localStyles.list}
            stickyHeaderIndices={showChoices ? [] : [0]}
            ListHeaderComponent={
              !showChoices && (
                <View
                  style={{
                    paddingVertical: 24,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    backgroundColor: '#FFFFFF',
                  }}>
                  {option.picture && (
                    <Pressable
                      style={{height: 80, width: 80, marginRight: 16}}
                      activeOpacity={0.8}
                      onPress={() => setShowOptionModal(true)}>
                      <ImageBackground
                        source={{uri: assetsUrl + getSmall(option.picture)}}
                        imageStyle={{borderRadius: 8}}
                        resizeMode="cover"
                        style={{flex: 1, justifyContent: 'center'}}
                      />
                    </Pressable>
                  )}
                  {option.title !== null &&
                    option.title !== undefined &&
                    option.title.trim() !== '' && (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'column',
                        }}>
                        <Text style={{fontSize: 14, color: '#565656'}}>
                          All Voters for
                        </Text>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 17,
                            fontWeight: '700',
                            marginTop: 6,
                          }}>
                          {option.title}
                        </Text>
                      </View>
                    )}
                </View>
              )
            }
            data={voters}
            renderItem={renderVoter}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={loadVoterData}
              />
            }
            keyExtractor={voter => voter.voteId}
          />

          {focusOption && (
            <Modal
              onBackButtonPress={() => setShowOptionModal(false)}
              style={{
                flexDirection: 'column',
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'center',
              }}
              isVisible={showOptionModal}
              animationIn="zoomIn"
              onBackdropPress={() => setShowOptionModal(false)}
              backdropOpacity={0.9}
              animationInTiming={200}
              animationOutTiming={200}
              animationOut="zoomOut">
              <OptionFocus
                showOptionTitle={true}
                optionTitle={focusOption.title}
                optionImage={focusOption.picture}
              />
            </Modal>
          )}
        </>
      )}
    </>
  );
}

const localStyles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
});

export default VoterListScreen;
