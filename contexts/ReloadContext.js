import React from 'react';

export const ReloadContext = React.createContext({
  reloadFeed: false,
  setReloadFeed: () => {},
});
