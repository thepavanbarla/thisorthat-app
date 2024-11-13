import React, {useRef, useState} from 'react';
import {ImageBackground, Text, Image, View} from 'react-native';

import Carousel from 'react-native-snap-carousel';
import BigActiveButton from '../components/BigActiveButton';
import {Dimensions} from 'react-native';
import TextLink from '../components/TextLink';
import FastImage from 'react-native-fast-image';

function UserGuideScreen({navigation, route}) {
  const {completeSetup} = route.params;

  const [buttonText, setButtonText] = useState('Next');
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = (windowWidth * 10) / 9;
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const [carouselItems, setCarouselItems] = useState([
    {
      title: 'Create Posts',
      subtitle:
        'Confused between 2 options? Create a post to know what your friends think! ',
      image: require('../assets/images/guide_post.png'),
    },
    {
      title: 'Double Tap to Vote',
      subtitle:
        "Help your friends pick the right option when they're not sure! ",
      image: require('../assets/images/guide_vote.png'),
    },
    {
      title: 'Build a Better World',
      subtitle:
        "You recommendations can have a direct impact on your friends' everyday lives. Be responsible!",
      image: require('../assets/images/guide_recommend.png'),
    },
  ]);

  const renderCarouselItem = ({item, index}) => {
    return (
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          flex: 1,
        }}>
        <Image
          source={item.image}
          style={{
            width: windowWidth,
            resizeMode: 'contain',
            height: windowHeight - (index === 0 ? 0 : 50),
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'column',
            padding: 16,
          }}>
          <Text
            style={{
              color: '#000000',
              fontSize: 32,
              fontWeight: '700',
              marginBottom: 8,
            }}>
            {item.title}
          </Text>
          <Text style={{color: '#000000', fontSize: 17, lineHeight: 24}}>
            {item.subtitle}
          </Text>
        </View>
      </View>
    );
  };
  const carouselRef = useRef(null);

  const nextScreen = () => {
    carouselRef.current.snapToNext();
    if (activeSlideIndex === 2) exitGuide();
  };

  const exitGuide = () => {
    completeSetup();
  };

  const onChange = index => {
    setActiveSlideIndex(index);
    if (index === 2) setButtonText("Let's Go!");
    else setButtonText('Next');
  };

  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <ImageBackground
        style={{
          flexDirection: 'column',
          flex: 1,
          paddingBottom: 40,
          justifyContent: 'flex-end',
        }}
        source={require('../assets/images/guide_bg.png')}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: 16,
            marginTop: 20,
          }}>
          <TextLink title="SKIP" onPress={exitGuide} />
        </View>

        <Carousel
          ref={carouselRef}
          style={{flex: 1, paddingHorizontal: 16}}
          data={carouselItems}
          renderItem={renderCarouselItem}
          sliderWidth={windowWidth}
          itemWidth={windowWidth}
          sliderHeight={300}
          onSnapToItem={onChange}
        />

        <View style={{flexDirection: 'column', padding: 16}}>
          <BigActiveButton title={buttonText} onPress={nextScreen} />
        </View>
      </ImageBackground>
    </View>
  );
}

export default UserGuideScreen;
