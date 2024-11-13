import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import CurationTile from './CurationTile';
import {useNavigation} from '@react-navigation/native';

const CuratedContent = () => {
  const navigation = useNavigation();

  // const [interests, setInterests] = useState([]);

  // useEffect(() => {
  //   getInterests();
  // }, []);

  // const getInterests = async () => {
  //   getAllInterests()
  //     .then(response => {
  //       return response.json();
  //     })
  //     .then(json => {
  //       setInterests(json.data);
  //     })
  //     .catch(error => {
  //       console.log("All interests list can't be fetched: ", error);
  //     });
  // };

  const openTag = tagName => {
    navigation.navigate('Tag Results', {tag: tagName});
  };

  return (
    <ScrollView
      style={{
        backgroundColor: '#EFEFEF',
        width: '100%',
        height: '100%',
        zIndex: 100000,
        padding: 16,
      }}>
      <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 8}}>
        Trending Now
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: 12,
          marginTop: 6,
        }}>
        <CurationTile
          title="Hollywood"
          image="trends/hollywood.jpg"
          action={() => openTag('hollywood')}
        />
        <CurationTile
          title="Soccer Worldcup"
          image="trends/worldcup.jpg"
          action={() => openTag('worldcup')}
        />
        <CurationTile
          title="Movies"
          image="trends/movies.jpg"
          action={() => openTag('movies')}
        />
        <CurationTile
          title="Winter"
          image="trends/winter.jpg"
          action={() => openTag('winter')}
        />
        <CurationTile
          title="Fashion"
          image="trends/fashion.jpg"
          action={() => openTag('fashion')}
        />
        <CurationTile
          title="Sport"
          image="trends/sports.jpg"
          action={() => openTag('sport')}
        />
        <CurationTile
          title="Euphoria"
          image="trends/euphoria.jpg"
          action={() => openTag('euphoria')}
        />
        <CurationTile
          title="Entertainment"
          image="trends/entertainment.jpg"
          action={() => openTag('entertainment')}
        />
        <CurationTile
          title="Food"
          image="trends/food.jpg"
          action={() => openTag('food')}
        />
        <CurationTile
          title="Friends"
          image="trends/friends.jpg"
          action={() => openTag('friends')}
        />
        <CurationTile
          title="Marvel"
          image="trends/marvel.jpg"
          action={() => openTag('marvel')}
        />
        <CurationTile
          title="Boxing"
          image="trends/boxing.jpg"
          action={() => openTag('boxing')}
        />
      </View>
      {/* <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 8}}>
        Top Categories
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: 12,
          marginTop: 6,
        }}>
        <CurationTile
          title="Hollywood"
          image="trends/hollywood.jpg"
          action={() => openTag('hollywood')}
        />
        <CurationTile title="Soccer Worldcup" image="trends/worldcup.jpg" />
        <CurationTile title="Movies" image="trends/movies.jpg" />
        <CurationTile title="Winter" image="trends/winter.jpg" />
      </View> */}
    </ScrollView>
  );
};

export default CuratedContent;
