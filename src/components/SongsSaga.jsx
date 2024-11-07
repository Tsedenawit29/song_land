import { call, put, takeLatest,all } from 'redux-saga/effects';
import axios from 'axios';
import { 
  fetchSongsRequest, 
  fetchSongsSuccess, 
  fetchSongsFailure,
  searchSongsRequest, 
  searchSongsSuccess, 
  searchSongsFailure 
} from './songsSlice';

// Fetch all songs
function* fetchSongs() {
  try {
    const response = yield call(axios.get, 'https://api.spotify.com/v1/me/top/tracks'); // Adjust URL
    const songs = response.data.map(post => ({
      id: post.id,
      name: post.title, 
      artist: "Unknown Artist", 
      poster: "https://via.placeholder.com/150",
    }));
    yield put(fetchSongsSuccess(songs));
  } catch (error) {
    yield put(fetchSongsFailure(error.message));
  }
}

// Search for songs
function* searchSongs(action) {
  try {
    const response = yield call(axios.get, `https://api.spotify.com/v1/search?q=${action.payload}&type=track&market=US&limit=10`, {
      headers: {
        Authorization: `Bearer YOUR_ACCESS_TOKEN`, 
      },
    });
    const songs = response.data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      poster: track.album.images[0]?.url || "https://via.placeholder.com/150", // Placeholder if no image is available
    }));
    yield put(searchSongsSuccess(songs)); // Dispatch success action with songs
  } catch (error) {
    yield put(searchSongsFailure(error.message)); // Dispatch failure action
  }
}

// Watch for fetch songs action
export function* watchFetchSongs() {
  yield takeLatest(fetchSongsRequest.type, fetchSongs);
}

// Watch for search songs action
export function* watchSearchSongs() {
  yield takeLatest(searchSongsRequest.type, searchSongs);
}


export default function* rootSaga() {
  yield all([
    watchFetchSongs(),
    watchSearchSongs(), // Add the watch for search songs
  ]);
}
