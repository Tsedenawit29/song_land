import { configureStore } from '@reduxjs/toolkit';
import songsReducer from './SongSlice';

const store = configureStore({
  reducer: {
    songs: songsReducer,
  },
});

export default store;
