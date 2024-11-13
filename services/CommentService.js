import {baseUrl} from './Constants';
import {fetchGet, fetchPutWithBody, fetchPutWithoutBody} from './ServiceUtils';

const addComment = async comment => {
  return fetchPutWithBody(baseUrl + 'comment/add', comment);
};

const deleteComment = async commentId => {
  return fetchPutWithoutBody(baseUrl + 'comment/delete/' + commentId);
};

const getComments = async (postId, page, limit) => {
  return fetchGet(baseUrl + `comments/${postId}?skip=${page}&limit=${limit}`);
};

export {addComment, deleteComment, getComments};
