import {refreshIdToken, retrieveSessionToken} from './SessionService';

const fetchPutWithBody = async (url, requestBody) => {
  const token = await retrieveSessionToken();
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(requestBody),
  });
  if (response.status === 403) {
    await refreshIdToken();
    return await fetchPutWithBody(url, requestBody);
  } else {
    return response;
  }
};

const fetchPostWithFormData = async (url, formData) => {
  const token = await retrieveSessionToken();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: token,
    },
    body: formData,
  });
  if (response.status === 403) {
    await refreshIdToken();
    return await fetchPostWithFormData(url, formData);
  } else {
    return response;
  }
};

const fetchPutWithoutBody = async url => {
  const token = await retrieveSessionToken();
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  if (response.status === 403) {
    await refreshIdToken();
    return await fetchPutWithoutBody(url);
  } else {
    return response;
  }
};

const fetchGet = async url => {
  const token = await retrieveSessionToken();
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  if (response.status === 403) {
    await refreshIdToken();
    return await fetchGet(url);
  } else {
    return response;
  }
};

const fetchPost = async url => {
  const token = await retrieveSessionToken();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  if (response.status === 403) {
    await refreshIdToken();
    return await fetchGet(url);
  } else {
    return response;
  }
};

export {
  fetchGet,
  fetchPutWithBody,
  fetchPutWithoutBody,
  fetchPostWithFormData,
  fetchPost,
};
