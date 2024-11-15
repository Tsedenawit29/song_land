import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSongs, fetchSongsBySearch, deleteSong, createSong, updateSong } from '../autenticaton/auth'; // Ensure the path is correct

// Async actions for fetching, searching, deleting, creating, and updating songs
export const fetchSongsRequest = createAsyncThunk('songs/fetchSongs', async () => {
  return await fetchSongs(); 
});

export const searchSongsRequest = createAsyncThunk('songs/searchSongs', async (searchTerm) => {
  return await fetchSongsBySearch(searchTerm); 
});

export const deleteSongRequest = createAsyncThunk('songs/deleteSong', async (id) => {
  await deleteSong(id); 
  return id; 
});

export const createSongRequest = createAsyncThunk('songs/createSong', async (newSong) => {
  return await createSong(newSong); 
});

export const updateSongRequest = createAsyncThunk('songs/updateSong', async (updatedSong) => {
  return await updateSong(updatedSong); 
});
const songsSlice = createSlice({
  name: 'songs',
  initialState: {
    songs: [], // Initialize songs array
    loading: false,
    error: null,
    selectedSong: null,
    favorites: [],
    playlists: [],
    audioState: {
      isPlaying: false,
      currentSong: null,
      currentSongUrl: null,
    },
    history: [],
  },
  reducers: {
    addSongToPlaylist: (state, action) => {
      const { songId, playlistId } = action.payload;
      const playlist = state.playlists.find(playlist => playlist.id === playlistId);
      if (playlist) {
        if (!playlist.songs.includes(songId)) {
          playlist.songs.push(songId);
        }
      } else {
        // Create a new playlist 
        state.playlists.push({ id: playlistId, songs: [songId] });
      }
    },
    
    addToHistory: (state, action) => {
      const songId = action.payload;
      if (!state.history.includes(songId)) {
        state.history.push(songId); // Add song to history
      }
    },
    
    setSelectedSong: (state, action) => {
      state.selectedSong = action.payload; // Set the selected song
    },

    setAudioState: (state, action) => {
      state.audioState = { ...state.audioState, ...action.payload }; // Update audio state
    },

    clearHistory: (state) => {
      state.history = []; // Clear the history
    },

    toggleFavorite: (state, action) => {
      const songId = action.payload;
      if (state.favorites.includes(songId)) {
        state.favorites = state.favorites.filter(id => id !== songId); // Remove from favorites
      } else {
        state.favorites.push(songId); // Add to favorites
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongsRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongsRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = action.payload; // Set the fetched songs
      })
      .addCase(fetchSongsRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; 
        console.error('Error fetching songs:', action.error.message);
      })
      .addCase(searchSongsRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSongsRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = action.payload; // Set searched songs
      })
      .addCase(searchSongsRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; 
        console.error('Error searching songs:', action.error.message);
      })
      .addCase(deleteSongRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSongRequest.fulfilled, (state, action) => {
        const songId = action.payload;
        state.songs = state.songs.filter(song => song.id !== songId); // Remove the deleted song
        state.loading = false; // End loading state
      })
      .addCase(deleteSongRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; 
        console.error('Error deleting song:', action.error.message); 
      })
      .addCase(createSongRequest.fulfilled, (state, action) => {
        state.songs.push(action.payload); // Add the newly created song
      })
      .addCase(createSongRequest.rejected, (state, action) => {
        state.error = action.error.message; 
        console.error('Error creating song:', action.error.message); 
      })
      .addCase(updateSongRequest.fulfilled, (state, action) => {
        const updatedSong = action.payload;
        const index = state.songs.findIndex(song => song.id === updatedSong.id);
        if (index !== -1) {
          state.songs[index] = updatedSong; // Update the song in the songs array
        }
      });
  },
});

// Export the actions
export const { 
  setSelectedSong, 
  toggleFavorite, 
  addToHistory, 
  clearHistory, 
  setAudioState, 
  addSongToPlaylist 
} = songsSlice.actions;

export default songsSlice.reducer;
