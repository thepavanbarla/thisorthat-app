import {baseUrl} from './Constants';
import {
  fetchGet,
  fetchPostWithFormData,
  fetchPutWithBody,
} from './ServiceUtils';

const getUser = async userId => {
  return fetchGet(baseUrl + 'user/' + userId);
};

const createUser = async (firebaseUser, setupUser) => {
  return fetchPutWithBody(baseUrl + 'user/create', {
    userId: firebaseUser.uid,
    phoneNumber: firebaseUser.providerData[0].phoneNumber,
    userName: setupUser.userName,
    fullName: setupUser.fullName,
    profilePicture: setupUser.profilePicture,
    dob: setupUser.dateOfBirth,
    gender: setupUser.gender,
  });
};

const updateUser = async (firebaseUser, setupUser) => {
  return fetchPutWithBody(baseUrl + 'user/update', {
    userId: firebaseUser.uid,
    phoneNumber: firebaseUser.providerData[0].phoneNumber,
    userName: setupUser.userName,
    fullName: setupUser.fullName,
    profilePicture: setupUser.profilePicture,
    dob: setupUser.dateOfBirth,
    gender: setupUser.gender,
  });
};

const uploadPictureService = async (image, userId) => {
  var formData = new FormData();
  formData.append('file', {
    uri: image.path,
    type: image.mime,
    name: image.path.split('/').pop(),
  });
  return fetchPostWithFormData(baseUrl + 'user/upload_picture', formData);
};

const saveInterests = async interests => {
  return fetchPutWithBody(baseUrl + 'interests/save', interests);
};

const getInterests = async () => {
  return fetchGet(baseUrl + 'interests');
};

export {
  getUser,
  createUser,
  updateUser,
  uploadPictureService,
  saveInterests,
  getInterests,
};
