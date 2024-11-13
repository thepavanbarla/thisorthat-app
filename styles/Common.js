import {StyleSheet} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  headerTitleInitialPageContainerStyle: {},
  headerTitleStackedPageContainerStyle: {},
  saveButton: {
    marginRight: 4,
    padding: 8,
  },
  searchButton: {
    padding: 6,
    marginRight: 8,
  },
  backButton: {
    padding: 6,
    marginLeft: 8,
  },
  FeedPost: {
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  FeedPostUser: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 2,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  FeedPostUserImage: {
    height: 36,
    width: 36,
    borderRadius: 6,
    backgroundColor: '#DEDEDE',
  },
  FeedUserNameView: {
    paddingHorizontal: 10,
    flexDirection: 'column',
  },
  FeedPostUserName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: '#121212',
  },
  FeedPostTime: {
    fontSize: 11,
    lineHeight: 18,
    fontWeight: '400',
    color: '#676767',
  },
  FeedPostMoreOptions: {
    position: 'absolute',
    right: 4,
    padding: 8,
  },
  SearchPostUserImage: {
    height: 40,
    width: 40,
    borderRadius: 16,
  },
  SearchUserNameView: {
    paddingLeft: 10,
    flexDirection: 'column',
  },
  SearchPostUserName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  FeedStoryTitle: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
    color: 'black',
    textTransform: 'capitalize',
  },
  FeedStoryBigTitle: {
    fontSize: 16,
    lineHeight: 26,
    color: 'black',
    paddingBottom: 8,
    marginTop: -6,
    textTransform: 'capitalize',
  },
  FeedPostInteractions: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 12,
    alignItems: 'flex-start',
  },
  FeedStoryStat: {
    color: '#676767',
    fontSize: 12,
    width: 48,
    paddingLeft: 3,
  },
  FeedSmallStoryStat: {
    color: '#676767',
    fontSize: 12,
    width: 44,
    paddingLeft: 3,
  },
  GridRow: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  UserProfileScreen: {
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  spacingView8: {
    marginTop: 8,
    alignSelf: 'stretch',
  },
  bigButtonWhiteText: {
    fontSize: 17,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 1,
  },
  smallButtonWhiteText: {
    fontSize: 15,
    textTransform: 'capitalize',
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0,
  },
  smallPassiveButtonText: {
    fontSize: 15,
    textTransform: 'capitalize',
    color: '#232323',
    fontWeight: '600',
    letterSpacing: 0,
  },
  smallInactiveButtonText: {
    fontSize: 15,
    textTransform: 'capitalize',
    color: '#676767',
    fontWeight: '500',
    letterSpacing: 0,
  },
  simpleTextLinkText: {
    fontSize: 16,
    color: 'rgba(102, 49, 247, 1)',
    fontWeight: '700',
  },
  simpleDisabledTextLinkText: {
    fontSize: 16,
    color: '#676767',
    fontWeight: '700',
  },
  bigButtonBlackText: {
    fontSize: 14,
    color: 'black',
  },
});

const buttonStyles = StyleSheet.create({
  bigButtonStyle: {
    display: 'flex',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(102, 49, 247, 1)',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'column',
    alignItems: 'center',
  },
  bigInactiveButtonStyle: {
    display: 'flex',
    alignSelf: 'stretch',
    backgroundColor: '#ABABAB',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'column',
    alignItems: 'center',
  },
  smallButtonStyle: {
    display: 'flex',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(102, 49, 247, 1)',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  smallPassiveButtonStyle: {
    display: 'flex',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(102, 49, 247, 0.4)',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  smallInactiveButtonStyle: {
    display: 'flex',
    alignSelf: 'stretch',
    backgroundColor: '#DEDEDE',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  simpleTextLinkStyle: {
    display: 'flex',
    alignSelf: 'stretch',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  largeTextLinks: {
    color: '#4487F2',
    fontSize: 16,
  },
});

const inputStyles = StyleSheet.create({
  authInputStyle: {
    alignSelf: 'stretch',
    borderColor: '#ababab',
    borderWidth: 1.2,
    borderRadius: 3,
    fontSize: 14,
    height: 44,
    paddingHorizontal: 12,
  },
});

const screenStyles = StyleSheet.create({
  generalScreens: {
    paddingHorizontal: 16,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',

    // flexGrow: 1,
  },
  authScreensContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
});

const labelStyles = StyleSheet.create({
  inputLabel: {
    color: '#565656',
    fontSize: 14,
    lineHeight: 32,
  },
});

export default styles;
export {screenStyles, inputStyles, buttonStyles, labelStyles};
