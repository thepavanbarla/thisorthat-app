import * as Keychain from 'react-native-keychain';
import auth from '@react-native-firebase/auth';

const createSession = async (userDetails, token) => {
  const userDetailsStr = JSON.stringify(userDetails);
  await Keychain.setGenericPassword(userDetailsStr, token);
};

const retrieveSession = async () => {
  const session = await Keychain.getGenericPassword();
  return session;
};

const retrieveSessionUser = async () => {
  const session = await retrieveSession();
  if (session) {
    return JSON.parse(session.username);
  } else {
    return null;
  }
};

const retrieveSessionToken = async () => {
  const session = await retrieveSession();
  if (session) {
    return session.password;
  } else {
    return null;
  }
};

const getSessionUserId = async () => {
  const userDetails = await retrieveSessionUser();
  if (userDetails) {
    return userDetails.userId;
  } else {
    return null;
  }
};

const getRefreshToken = async () => {
  const userDetails = await retrieveSessionUser();
  if (userDetails) {
    return userDetails.refreshToken;
  } else {
    return null;
  }
};

const destroySession = async () => {
  await Keychain.resetGenericPassword();
};

const refreshIdToken = async () => {
  console.log('Token has expired');
  const newIdToken = await auth().currentUser.getIdToken(true);
  console.log('New token is: ' + newIdToken);
  let sessionUser = await retrieveSessionUser();
  await createSession(sessionUser, newIdToken);
};

const updateSessionUserDetails = async (genderVal, dobVal) => {
  let sessionUser = await retrieveSessionUser();
  const sessionToken = await retrieveSessionToken();
  sessionUser.gender = genderVal;
  sessionUser.dob = dobVal;
  await createSession(sessionUser, sessionToken);
};

export {
  createSession,
  retrieveSessionUser,
  retrieveSessionToken,
  getSessionUserId,
  getRefreshToken,
  destroySession,
  refreshIdToken,
  updateSessionUserDetails,
};
