 /** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  toggleFavorite } from '../components/SongSlice';
import { faEdit, faTrash, faHeart } from '@fortawesome/free-solid-svg-icons';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Playlist = ({customStyles, showAudio= true, redirectToPlaylist=false, showTitle = true}) => {
  const dispatch = useDispatch();
  const [songs, setSongs] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [editedSongName, setEditedSongName] = useState('');
  const [editedArtistName, setEditedArtistName] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [editedPosterFile, setEditedPosterFile] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [uploadedAudio, setUploadedAudio] = useState(null);
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.songs.favorites);
  const handleSongClick = () => {
    if (redirectToPlaylist) {
      navigate(`/playlist`);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);
  
  const fetchSongs = async () => {
    try {
      const response = await axios.get('https://server-62ul.onrender.com/songs');
      console.log('Fetched songs:', response.data); 
      const songsWithAudio = response.data.map(song => ({
        ...song,
        audioUrl: song.preview_url || 'default-audio.mp3', 
      }));
      setSongs(songsWithAudio);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };
  
  
  
  const handleDeleteSong = (song) => {
    setSongToDelete(song);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (songToDelete) {
      await axios.delete(`https://server-62ul.onrender.com/songs/${songToDelete.id}`);
      setShowDeleteConfirm(false);
      setSongToDelete(null);
      fetchSongs();
    }
  };

  const handleEditSong = (song) => {
    setEditingSong(song);
    setEditedSongName(song.name);
    setEditedArtistName(song.artist);
    setAudioUrl(song.audioUrl);
  };

const handleUpdateSong = async () => {
  if (editingSong) {
    const updatedSong = {
      name: editedSongName.trim() ? editedSongName : editingSong.name,
      artist: editedArtistName.trim() ? editedArtistName : editingSong.artist,
      poster: editedPosterFile ? editedPosterFile : editingSong.poster,
    };

    try {
      if (audioUrl && audioUrl !== editingSong.audioUrl) {
        updatedSong.preview_url = audioUrl;
      } else {
        updatedSong.preview_url = editingSong.audioUrl; 
      }

      // upload the audio file  to the server
      if (uploadedAudio) {
        const formData = new FormData();
        formData.append('audio', uploadedAudio);
        const audioUploadResponse = await axios.post('https://server-62ul.onrender.com/upload-audio', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        updatedSong.preview_url = audioUploadResponse.data.url;
      }

      // Update the song with new data
      const response = await axios.put(`https://server-62ul.onrender.com/songs/${editingSong.id}`, updatedSong);

      console.log('Update response:', response.data);

      resetEditingState();
      fetchSongs(); 
    } catch (error) {
      console.error('Error updating song:', error);
      alert(`Failed to update song: ${error.response?.data?.error || error.message}`);

    }
  } else {
    alert("No song is currently being edited.");
  }
};

 const resetEditingState = () => {
    setEditingSong(null);
    setEditedSongName('');
    setEditedArtistName('');
    setAudioUrl('');
    setUploadedAudio(null);
    setEditedPosterFile(null);
  };
  const handleToggleFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  return (
    <div css={styles.container}>
      { showTitle && <h1>Your Playlist</h1>}
      <div css={styles.songsContainer}>
  {songs.length > 0 ? (
    songs.map((song) => (
      <div css={styles.songItem} key={song.id} onClick={() => handleSongClick(song.id)}>
        <img css={styles.songPoster} src={song.poster} alt={song.name} />
        <div css={styles.songInfo}>
          <h2 css={styles.songName}>{song.name}</h2>
          <p css={styles.artist}>{song.artist}</p>
          {console.log('Audio URL:', song.audioUrl)}
          {showAudio && song.audioUrl ? (
  <audio controls src={song.audioUrl} type="audio/mp3">
    Your browser does not support the audio element.
  </audio>
) : ("")}
         <div css={styles.songActions}>
            <button css={styles.iconButton} onClick={() => handleEditSong(song)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button css={styles.iconButton} onClick={() => handleDeleteSong(song)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            
          </div>
           <div 
              css={styles.heartStyle} 
              className={favorites.includes(song.id) ? 'active' : ''} 
              onClick={(e) => {
                e.stopPropagation(); 
                handleToggleFavorite(song.id);
              }}
            >
              <FontAwesomeIcon icon={faHeart} />
            </div>
        </div>

      </div>
    ))
  ) : (
    <p>Your playlist is empty.</p>
  )}
</div>

      {editingSong && (
  <div css={styles.modalOverlay}>
    <div css={styles.modalContent}>
      <h2>Edit Song</h2>
      <input
        type="text"
        value={editedSongName}
        onChange={(e) => setEditedSongName(e.target.value)}
        placeholder="Song Name"
        css={styles.input}
      />
      <input
        type="text"
        value={editedArtistName}
        onChange={(e) => setEditedArtistName(e.target.value)}
        placeholder="Artist Name"
        css={styles.input}
      />
      <input
        type="text"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
        placeholder="Audio URL"
        css={styles.input}
      />
      <input
        type="text"
        value={editedPosterFile ? editedPosterFile : ''}
        onChange={(e) => setEditedPosterFile(e.target.value)}
        placeholder="Poster Image URL"
        css={styles.input}
      />
      <button css={styles.updateButton} onClick={handleUpdateSong}>Update</button>
      <button css={styles.cancelButton} onClick={resetEditingState}>Cancel</button>
    </div>
  </div>
)}
  {showDeleteConfirm && (
        <div css={styles.modalOverlay}>
          <div css={styles.modalContent}>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete "{songToDelete?.name}"?</p>
            <button css={styles.confirmButton} onClick={confirmDelete}>Yes, Delete</button>
            <button css={styles.cancelButton} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
const styles = {
  container: css`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    margin-left: 120px;
    color: pink;
    @media (max-width: 768px) {
      padding: 5px;
    }
  `,
  songsContainer: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
    margin-left:10pxpx;   @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-right:20px;
    }
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  `,
  songItem: css`
    position: relative;
    background: #000;
    border-radius: 8px;
    border: 1px solid pink;
    padding: 10px;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    @media (max-width: 480px) {
      padding: 8px;
    }
  `,
  songPoster: css`
    width: 100%;
    height: 200px;
    border-radius: 8px;
    object-fit: cover;
    @media (max-width: 480px) {
      height: 150px;
    }
  `,
  songInfo: css`
    text-align: center;
    margin-top: 10px;
  `,
  songActions: css`
    display: flex;
    gap: 20px;
    margin-top: 10px;
    justify-content: center;
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
  iconButton: css`
    background: none;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 1em;
    @media (max-width: 480px) {
      font-size: 0.9em;
    }
  `,
  modalOverlay: css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `,
  modalContent: css`
    background: pink;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    text-align: center;
    color: black;
    @media (max-width: 480px) {
      padding: 15px;
    }
  `,
  input: css`
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    @media (max-width: 480px) {
      padding: 6px;
      font-size: 0.9em;
    }
  `,
  updateButton: css`
    background: black;
    color: pink;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 5px;
    @media (max-width: 480px) {
      padding: 8px;
    }
  `,
  cancelButton: css`
    background: #333;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 5px;
    @media (max-width: 480px) {
      padding: 8px;
    }
  `,
  confirmButton: css`
    background: #ff0066;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 5px;
    @media (max-width: 480px) {
      padding: 8px;
    }
  `,
  songName: css`
    font-size: 1.2em;
    font-weight: bold;
    color: pink;
    @media (max-width: 480px) {
      font-size: 1em;
    }
  `,
  artist: css`
    color: #aaa;
    font-size: 0.9em;
  `,
};

export default Playlist;
