import {useEffect, useState} from 'react';
import {searchUsers} from '../services/UserService';

export const useSearchUsers = keyword => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadSearchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const loadSearchUsers = async () => {
    searchUsers(keyword)
      .then(response => response.json())
      .then(json => {
        setUsers(json.data);
      })
      .catch(error => {
        console.log("Search result users can't be fetched: " + error);
      });
  };

  return users;
};
