import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { FaSearch} from '@fortawesome/free-solid-svg-icons';
import { fetchSongsBySearch } from './path/to/your/api';

const searchContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 20px;
  margin-bottom: 20px;
`;

const searchInputStyle = css`
  padding: 10px;
  font-size: 16px;
  border: 3px solid #00004d;
  border-radius: 30px;
  width: 70%;
  max-width: 400px;
  margin-right: 10px;

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const searchButtonStyle = css`
  padding: 10px 20px;
  background-color: #00004d;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #333366;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const searchIconStyle = css`
  font-size: 24px;
  color: #00004d;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin-left: 10px;
  }
`;

const SearchBar = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      try {
        const songs = await fetchSongsBySearch(searchTerm);
        dispatch({ type: 'SEARCH_SONGS_SUCCESS', payload: songs });
        setSearchTerm('');
      } catch (error) {
        console.error('Error fetching songs:', error);
        dispatch({ type: 'SEARCH_SONGS_FAILURE', payload: error.message });
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(event);
    }
  };

  return (
    <div css={searchContainerStyle}>
      <input
        type="text"
        placeholder="Search for a song..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        css={searchInputStyle}
      />
      <button onClick={handleSearch} css={searchButtonStyle}>Search</button>
      <FaSearch onClick={handleSearch} css={searchIconStyle} />
    </div>
  );
};

export default SearchBar;
