import {extractTags} from '../utils/ConversionUtils';
import {baseUrl} from './Constants';
import {
  fetchGet,
  fetchPost,
  fetchPostWithFormData,
  fetchPutWithBody,
} from './ServiceUtils';

const createPost = async post => {
  post.tags = extractTags(post.context);
  return fetchPutWithBody(baseUrl + 'post/create', post);
};

const getPost = async postId => {
  return fetchGet(baseUrl + 'post/' + postId);
};

const uploadPostPictureService = async (image, userId) => {
  var formData = new FormData();
  formData.append('file', {
    uri: image.path,
    type: image.mime,
    name: image.path.split('/').pop(),
  });
  return fetchPostWithFormData(baseUrl + 'post/upload_picture', formData);
};

const getUserPosts = async (userId, page, limit) => {
  return fetchGet(baseUrl + `post/user/${userId}?skip=${page}&limit=${limit}`);
};

const getFeedPosts = async (page, limit) => {
  return fetchGet(baseUrl + `feed?skip=${page}&limit=${limit}`);
};

const getExplorePosts = async (page, limit, interest) => {
  return fetchGet(
    baseUrl + `feed/public?skip=${page}&limit=${limit}&interest=${interest}`,
  );
};

const getTagPosts = async (tag, page, limit) => {
  return fetchGet(
    baseUrl + `post/search/tags?tag=${tag}&skip=${page}&limit=${limit}`,
  );
};

const voteOnPost = async vote => {
  return fetchPutWithBody(baseUrl + 'vote/save', vote);
};

const getVotersForPost = async postId => {
  return fetchGet(baseUrl + 'vote/post/' + postId);
};

const getVotersForOption = async optionId => {
  return fetchGet(baseUrl + 'vote/id/' + optionId);
};

const getUserVoteOnPost = async (userId, postId) => {
  return fetchGet(baseUrl + 'vote/user_post/' + userId + '/' + postId);
};

const getPostStats = async postId => {
  return fetchGet(baseUrl + 'post/stats/' + postId);
};

const reportPost = async report => {
  return fetchPutWithBody(baseUrl + 'report/post/save', report);
};

const deletePost = async postId => {
  return fetchPost(baseUrl + `post/delete/${postId}`);
};

const searchTags = async input => {
  return fetchGet(baseUrl + 'tags/search/' + input);
};

const getCollabPosts = async (draftPostId, page, limit) => {
  return fetchGet(baseUrl + `fetchCollab/all/${draftPostId}`);
};

const getImageSuggestions = async (searchTerm, limit) => {
  return fetchGet(baseUrl + `image/urls?keywords=${searchTerm}&limit=${limit}`);
};

export {
  createPost,
  getPost,
  uploadPostPictureService,
  getUserPosts,
  getFeedPosts,
  getPostStats,
  getExplorePosts,
  getTagPosts,
  voteOnPost,
  getVotersForPost,
  getVotersForOption,
  getUserVoteOnPost,
  reportPost,
  deletePost,
  searchTags,
  getCollabPosts,
  getImageSuggestions,
};
