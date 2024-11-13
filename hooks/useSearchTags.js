import {useEffect, useState} from 'react';
import {searchTags} from '../services/PostService';

export const useSearchTags = keyword => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    loadSearchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const loadSearchTags = async () => {
    searchTags(keyword)
      .then(response => response.json())
      .then(json => {
        setTags(json.data);
      })
      .catch(error => {
        console.log("Search result tags can't be fetched: " + error);
      });
  };

  return tags;
};
