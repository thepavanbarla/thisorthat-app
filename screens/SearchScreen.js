import React, {useEffect, useState} from 'react';
import {ScrollView, View, TextInput, StyleSheet} from 'react-native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SearchUser from '../components/SearchUser';
import SearchTag from '../components/SearchTag';
import {searchUsers} from '../services/UserService';
import {getSessionUserId} from '../services/SessionService';
import {searchTags} from '../services/PostService';
import CuratedContent from '../components/CuratedContent';

const SearchTab = createMaterialTopTabNavigator();

function SearchScreen({navigation}) {
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [sessionUserId, setSessionUserId] = React.useState(null);

  useEffect(() => {
    loadSearchUsers();
    loadSearchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    (async () => {
      let varUserId = await getSessionUserId();
      setSessionUserId(varUserId);
    })();
  }, []);

  const onChangeSearchText = text => {
    setSearchText(text);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <View style={{marginLeft: 16}}>
            <TextInput
              placeholder="Search for a friend or a hashtag"
              style={localStyles.searchInput}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              onChangeText={onChangeSearchText}
            />
          </View>
        );
      },
    });
  });

  const loadSearchUsers = async () => {
    searchUsers(searchText.replace('@', ''))
      .then(response => response.json())
      .then(json => {
        setUsers(json.data);
      })
      .catch(error => {
        console.log("Search result users can't be fetched: " + error);
      });
  };

  const loadSearchTags = async () => {
    searchTags(searchText.replace('#', ''))
      .then(response => response.json())
      .then(json => {
        setTags(json.data);
      })
      .catch(error => {
        console.log("Search result tags can't be fetched: " + error);
      });
  };

  const navigateToProfile = userId => {
    navigation.push('Profile', {userId: userId});
  };

  const UsersTab = () => {
    return (
      <ScrollView
        keyboardShouldPersistTaps={true}
        nestedScrollEnabled={true}
        style={{backgroundColor: '#FFFFFF', padding: 8}}>
        {users &&
          users.length > 0 &&
          users
            .filter(user => sessionUserId !== user.userId)
            .map(user => (
              <SearchUser
                key={user.userId}
                user={user}
                navigateToProfile={navigateToProfile}
              />
            ))}
      </ScrollView>
    );
  };

  const TagsTab = ({navigation}) => {
    const goToTag = tagName => {
      navigation.navigate('Tag Results', {tag: tagName});
    };

    return (
      <ScrollView
        keyboardShouldPersistTaps={true}
        nestedScrollEnabled={true}
        style={{
          backgroundColor: '#FFFFFF',
          flexDirection: 'column',
          padding: 8,
        }}>
        {tags &&
          tags.length > 0 &&
          tags.map(tag => (
            <SearchTag key={tag.tag} tagNavFn={goToTag} tag={tag} />
          ))}
      </ScrollView>
    );
  };

  return (
    <>
      {!(searchText && searchText !== '') && <CuratedContent />}
      <SearchTab.Navigator
        screenOptions={{
          tabBarShowLabel: true,
          tabBarShowIcon: false,
          tabBarLabelStyle: {
            fontWeight: '600',
            fontSize: 16,
            textTransform: 'capitalize',
          },
          tabBarIndicatorStyle: {backgroundColor: '#343434', height: 1.6},
        }}
        style={{
          borderTopWidth: 0.3,
          borderTopColor: '#cdcdcd',
        }}>
        <SearchTab.Screen name="Users" component={UsersTab} />
        <SearchTab.Screen name="Hashtags" component={TagsTab} />
      </SearchTab.Navigator>
    </>
  );
}

const localStyles = StyleSheet.create({
  searchInput: {
    fontSize: 16,
    fontWeight: '400',
    minWidth: '100%',
    color: '#121212',
  },
});

export default SearchScreen;
