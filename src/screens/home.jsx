/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongsRequest, searchSongsRequest, addSongToPlaylist, toggleFavorite } from '../components/SongSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const { songs, loading, error } = useSelector((state) => state.songs);
  const favorites = useSelector((state) => state.songs.favorites);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSong, setNewSong] = useState({ name: '', artist: '', album: '', poster: '', preview_url: '' });
  const [audioSrc, setAudioSrc] = useState(null); 

  useEffect(() => {
    dispatch(fetchSongsRequest());
  }, [dispatch]);

  const handleSearch = (event) => {
    event.preventDefault();
    dispatch(searchSongsRequest(searchTerm));
  };

  const handleToggleFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  const handleCreateSong = async (event) => {
    event.preventDefault();
    if (!newSong.name || !newSong.artist || !newSong.album || !newSong.poster || !newSong.preview_url) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('https://server-62ul.onrender.com/songs', newSong);

      if (response.status === 201) {
        dispatch(addSongToPlaylist(response.data));
        setNewSong({ name: '', artist: '', album: '', poster: '', preview_url: '' });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating song:', error.response ? error.response.data : error.message);
      alert('Failed to add song. Please try again.');
    }
  };
// Function to play preview or full audio
const handlePlayAudio = (song) => {
  const audioUrl = song.fullAudioUrl || song.previewUrl; // Prioritize the full audio URL if available
  setAudioSrc(audioSrc === audioUrl ? null : audioUrl); // Toggle playback
};


  return (
    <div css={styles.homeContainerStyle}>
      <form onSubmit={handleSearch} css={styles.searchFormStyle}>
        <input
          type="text"
          placeholder="Search for songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          css={styles.searchInputStyle}
        />
        <button type="submit" css={styles.searchButtonStyle}>Search</button>
      </form>

      <button onClick={() => setShowCreateForm(true)} css={styles.searchButtonStyle}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <span css={styles.addNewSongTextStyle}>Add New Song</span>

      {showCreateForm && (
        <div css={styles.modalOverlayStyle} onClick={() => setShowCreateForm(false)}>
          <div css={styles.modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowCreateForm(false)} css={styles.closeModalButtonStyle}>&times;</button>
            <form onSubmit={handleCreateSong}>
              <input
                type="text"
                placeholder="Song Name"
                value={newSong.name}
                onChange={(e) => setNewSong({ ...newSong, name: e.target.value })}
                required
                css={styles.inputStyle}
              />
              <input
                type="text"
                placeholder="Artist"
                value={newSong.artist}
                onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                required
                css={styles.inputStyle}
              />
              <input
                type="text"
                placeholder="Album"
                value={newSong.album}
                onChange={(e) => setNewSong({ ...newSong, album: e.target.value })}
                required
                css={styles.inputStyle}
              />
              <input
                type="text"
                placeholder="Poster URL"
                value={newSong.poster}
                onChange={(e) => setNewSong({ ...newSong, poster: e.target.value })}
                required
                css={styles.inputStyle}
              />
              <input
                type="text"
                placeholder="Preview URL"
                value={newSong.preview_url}
                onChange={(e) => setNewSong({ ...newSong, preview_url: e.target.value })}
                required
                css={styles.inputStyle}
              />
              <button type="submit" css={styles.addButtonStyle}>Add To Playlist</button>
            </form>
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Audio playback controls */}
      {audioSrc && (
        <div css={styles.audioContainerStyle}>
          <audio controls autoPlay src={audioSrc} onEnded={() => setAudioSrc(null)} css={styles.audioStyle} />
        </div>
      )}

      <div css={styles.songsListStyle}>
        {songs.slice(0, 10).map((song) => (
          <div key={song.id} css={styles.songItemStyle} onClick={() => handlePlayAudio(song)}>
            <img src={song.poster} alt={`${song.name} poster`} css={styles.songPosterStyle} />
            <h2>{song.name}</h2>
            <p>{song.artist}</p>
            <p>{song.album}</p>
            <div 
              css={styles.heartStyle} 
              className={favorites.includes(song.id) ? 'active' : ''} 
              onClick={(e) => {
                handleToggleFavorite(song.id);
              }}
            >
              <FontAwesomeIcon icon={faHeart} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
  // Styles
const styles = { 
  homeContainerStyle: css`
    padding: 20px;
    margin-left: 140px;
    margin-right: auto;
    max-width: 1200px;
    background-color: black;
    font-family: 'Arial', sans-serif;
    color: pink;

    @media (max-width: 768px) {
      padding: 15px;
      margin-right:40px;
    }

    @media (max-width: 480px) {
      padding: 10px;
    }
  `,

  searchFormStyle: css`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    flex-direction: row;
    align-items: center;

    @media (max-width: 480px) {
      flex-direction: row;
      gap:2px;
    }
  `,

  searchInputStyle: css`
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
    width: 300px;
    font-size: 1em;
    color: pink;
    background: #333;

    @media (max-width: 768px) {
      width: 250px;
      font-size: 0.9em;
    }

    @media (max-width: 480px) {
      width: 100%;
      margin-right: 0;
      margin-bottom: 10px;
    }
  `,

  searchButtonStyle: css`
    padding: 12px 25px;
    background-color: #2c3e50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
      background-color: #ff0066;
      transform: scale(1.05);
    }

    @media (max-width: 768px) {
      padding: 10px 20px;
      font-size: 0.6em;
    }

  `,

  addNewSongTextStyle: css`
    margin-left: 10px;
    font-size: 1em;
    color: lightgray;

    @media (max-width: 480px) {
      margin-top: 10px;
    }
  `,

  songsListStyle: css`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  `,

  songItemStyle: css`
    position: relative;
    border: 1px solid pink;
    border-radius: 5px;
    padding: 15px;
    margin: 10px 0;
    transition: box-shadow 0.3s, transform 0.2s;
    background: #222;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      transform: scale(1.05);
    }

    h2 {
      color: pink;
      font-size: 1.5em;
      margin: 10px 0;

      @media (max-width: 480px) {
        font-size: 1.2em;
      }
    }

    p {
      color: lightgray;
      font-size: 1em;
      margin: 5px 0;

      @media (max-width: 480px) {
        font-size: 0.9em;
      }
    }
  `,

  songPosterStyle: css`
    width: 100%;
    height: auto;
    border-radius: 5px;
  `,

  heartStyle: css`
    cursor: pointer;
    color: gray;
    transition: color 0.3s ease;
    position: absolute;
    top: 10px;
    right: 10px;

    &.active {
      color: #ff0066;
    }
  `,

  audioContainerStyle: css`
    margin: 20px 0;
    text-align: center;
    background: #000;
    border-radius: 5px;
    padding: 10px;

    @media (max-width: 768px) {
      padding: 5px;
    }
  `,

  audioStyle: css`
    width: 100%;
    background: #000; /* Change the color of the playback control */
  `,

  modalOverlayStyle: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `,

  modalContentStyle: css`
    background: #222;
    padding: 30px;
    border-radius: 10px;
    width: 400px;
    max-width: 90%;
    color: pink;
    position: relative;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  `,

  closeModalButtonStyle: css`
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    color: white;
    font-size: 1.5em;
    cursor: pointer;
  `,

  inputStyle: css`
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid pink;
    border-radius: 5px;
    background: #444;
    color: white;

    @media (max-width: 480px) {
      padding: 8px;
    }
  `,

  addButtonStyle: css`
    padding: 12px;
    background-color: #ff0066;
    color: pink;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    width: 100%;

    &:hover {
      background-color: #e60058;
      transform: scale(1.05);
    }

    @media (max-width: 480px) {
      padding: 10px;
    }
  `
};
export default Home;
