import {baseUrl} from './Constants';
import {
  fetchGet,
  fetchPost,
  fetchPostWithFormData,
  fetchPutWithBody,
  fetchPutWithoutBody,
} from './ServiceUtils';

const updateUserProfile = async userDetails => {
  return fetchPutWithBody(baseUrl + 'user/profile/update', userDetails);
};

const updateUserCover = async cover => {
  var formData = new FormData();
  formData.append('cover', cover);
  return fetchPostWithFormData(baseUrl + 'user/cover', formData);
};

const getUserStats = async userId => {
  return fetchGet(baseUrl + 'user/stats/' + userId);
};

const getFollowStatus = async (srcUserId, targetUserId) => {
  return fetchGet(baseUrl + 'follow/status/' + srcUserId + '/' + targetUserId);
};

const getFollowers = async (userId, page, limit) => {
  return fetchGet(baseUrl + `followers/${userId}?skip=${page}&limit=${limit}`);
};

const getFollowing = async (userId, page, limit) => {
  return fetchGet(baseUrl + `following/${userId}?skip=${page}&limit=${limit}`);
};

const follow = async targetUserId => {
  return fetchPutWithoutBody(baseUrl + 'follow/' + targetUserId);
};

const unfollow = async targetUserId => {
  return fetchPutWithoutBody(baseUrl + 'unfollow/' + targetUserId);
};

const respondToFollowRequest = async (targetUserId, action) => {
  return fetchPutWithoutBody(
    baseUrl + 'follow_respond/' + targetUserId + '/' + action,
  );
};

const updateAccountPrivacy = async isPrivate => {
  return fetchPutWithBody(baseUrl + 'user/update/privacy', {isPrivate});
};

const getNotificationPreferences = async () => {
  return fetchGet(baseUrl + 'user_preference');
};

const saveNotificationPreferences = async userPreferences => {
  return fetchPutWithBody(baseUrl + 'user_preference/update', userPreferences);
};

const addUserDevice = async deviceId => {
  return fetchPutWithoutBody(baseUrl + `user/add_device/${deviceId}`);
};

const removeUserDevice = async deviceId => {
  return fetchPutWithoutBody(baseUrl + `user/remove_device/${deviceId}`);
};

const reportUser = async report => {
  return fetchPutWithBody(baseUrl + 'report/user/save', report);
};

const blockUser = async userId => {
  return fetchPost(`${baseUrl}block/${userId}`);
};

const unblockUser = async userId => {
  return fetchPost(`${baseUrl}unblock/${userId}`);
};

const getBlockedUsers = async () => {
  return fetchGet(baseUrl + 'blocked');
};

const searchUsers = async searchInput => {
  return fetchGet(baseUrl + 'public/search/' + searchInput);
};

const getUserByUserName = async userName => {
  return fetchGet(baseUrl + 'user/username/' + userName);
};

const getUserByUserId = async userId => {
  return fetchGet(baseUrl + 'user/' + userId);
};

const getAllInterests = async () => {
  return fetchGet(baseUrl + 'public/interests');
};

export {
  updateUserProfile,
  updateUserCover,
  getUserStats,
  getFollowStatus,
  getFollowers,
  getFollowing,
  follow,
  unfollow,
  respondToFollowRequest,
  updateAccountPrivacy,
  getNotificationPreferences,
  saveNotificationPreferences,
  addUserDevice,
  removeUserDevice,
  reportUser,
  blockUser,
  unblockUser,
  getBlockedUsers,
  searchUsers,
  getUserByUserName,
  getUserByUserId,
  getAllInterests,
};
