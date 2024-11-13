import {baseUrl} from './Constants';
import {fetchGet, fetchPutWithBody, fetchPutWithoutBody} from './ServiceUtils';

const getAllNotifications = async (page, limit) => {
  return fetchGet(
    baseUrl +
      `notification/2022-01-01T01:00:00.000Z/false?skip=${page}&limit=${limit}`,
  );
};

const invalidateNotification = async notificationId => {
  return fetchPutWithoutBody(
    baseUrl + 'notifications/invalidate/' + notificationId,
  );
};

const updateNotification = async notification => {
  return fetchPutWithBody(baseUrl + 'notifications/update', notification);
};

export {getAllNotifications, invalidateNotification, updateNotification};
