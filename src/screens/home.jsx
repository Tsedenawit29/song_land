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
  const [newSong, setNewSong] = useState({ name: '', artist: '', album: '', poster: '', previewUrl: '' });
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
  const audioUrl = audioSrc === song.preview_url ? song.fullAudioUrl : song.previewUrl;
  
  setAudioSrc(audioSrc === audioUrl ? null : audioUrl);
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
