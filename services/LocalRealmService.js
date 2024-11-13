import realm from '../config/RealmConfig';

const createSession = session => {
  realm.write(() => {});
};

const loadSession = callbackFn => {
  const session = realm.objects('Session')[0];
  callbackFn(session);
};

export {createSession, loadSession};
