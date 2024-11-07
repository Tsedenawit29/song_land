import axios from 'axios';

const CLIENT_ID = '7473a8c5b191463d8af1a224e4f1b369';
const CLIENT_SECRET = 'fbeb1e871d1244569a883480ad567653';

let accessToken;
let tokenExpirationTime;

// Function to get the access token
const getAccessToken = async () => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
      }
    );

    accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in;
    tokenExpirationTime = Date.now() + expiresIn * 1000;
    return accessToken;
  } catch (error) {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to check if the access token is expired
const isAccessTokenExpired = () => {
  return !accessToken || Date.now() >= tokenExpirationTime;
};

// Fetch songs from a specific playlist
export const fetchSongs = async () => {
  if (isAccessTokenExpired()) {
    await getAccessToken();
  }

  try {
    const playlist_id = '37i9dQZF1DWZEBR5Lu37rb'; // Your playlist ID
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.items.map((item) => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists[0]?.name || 'Unknown Artist',
      previewUrl: item.track.preview_url,
      album: item.track.album.name,
      poster: item.track.album.images[0]?.url || '',
    })) || [];
  } catch (error) {
    console.error('Error fetching songs:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Search for songs based on a search term
export const fetchSongsBySearch = async (searchTerm) => {
  if (isAccessTokenExpired()) {
    await getAccessToken();
  }

  try {
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: searchTerm,
        type: 'track',
        limit: 10,
      },
    });

    return response.data.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name || 'Unknown Artist',
      previewUrl: track.preview_url,
      album: track.album.name,
      poster: track.album.images[0]?.url || '',
    })) || [];
  } catch (error) {
    console.error('Error fetching songs by search:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Delete a song from a playlist
export const deleteSong = async (playlistId, songId) => {
  if (isAccessTokenExpired()) {
    await getAccessToken();
  }

  try {
    const response = await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        tracks: [{ uri: `spotify:track:${songId}` }],
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting song:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Create a song (add to a playlist)
export const createSong = async (playlistId, songUri) => {
  if (isAccessTokenExpired()) {
    await getAccessToken();
  }

  try {
    const response = await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      uris: [songUri], // Spotify track URI
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data; // Return the response from Spotify
  } catch (error) {
    console.error('Error creating song:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Update a song (this is a placeholder as Spotify does not support updating song metadata directly)
export const updateSong = async (playlistId, songId, newSongData) => {
  console.error('Update song is not supported directly by the Spotify API.'); // Inform that updating is not directly possible
  return Promise.reject(new Error('Updating song metadata is not supported by the Spotify API.'));
};
