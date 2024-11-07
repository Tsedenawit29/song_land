/** @jsxImportSource @emotion/react */
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';

const Favorites = () => {
  const favorites = useSelector((state) => state.songs.favorites) || [];
  const songs = useSelector((state) => state.songs.songs) || [];

  // Loading state
  if (!songs.length) {
    return <p>Loading songs...</p>;
  }

  const favoriteSongs = songs.filter((song) => favorites.includes(song.id));

  return (
    <div css={styles.container}>
      <h1>Your Favorite Songs</h1>
      <div css={styles.favoritesList}>
        {favoriteSongs.length > 0 ? (
          favoriteSongs.map((song) => (
            <Link to={`/player/${song.id}`} key={song.id} css={styles.link}>
              <div css={styles.favoriteSongItem}>
                <img
                  src={song.poster}
                  alt={`${song.name} by ${song.artist}`}
                  css={styles.favoriteSongPoster}
                />
                <h2>{song.name}</h2>
                <p>{song.artist}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No favorite songs yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: css`
    padding: 20px;
    background-color: #000;
    min-height: 100vh;
    margin-top: 20px;
    margin-left: 160px;

    @media (max-width: 768px) {
      margin-left: 70px; 
      font-size: 0.8rem;
    }
  `,
  favoritesList: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    padding: 20px;
    color: pink;

    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr; 
    /* Two columns for smaller screens */
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr; /* One column for very small screens */
    }
  `,
  favoriteSongItem: css`
    background: #222;
    border: 1px solid pink;
    border-radius: 5px;
    padding: 15px;
    text-align: center;
    transition: box-shadow 0.3s, transform 0.2s;

    &:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      transform: scale(1.05);
    }
  `,
  favoriteSongPoster: css`
    width: 100%;
    height: auto;
    border-radius: 5px;
  
  `,
  link: css`
    text-decoration: none;
    color: inherit; /* Inherit color from parent */
  `,
};

export default Favorites;
