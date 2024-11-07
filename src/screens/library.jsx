/** @jsxImportSource @emotion/react */
import React, { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongsRequest, toggleFavorite } from '../components/SongSlice';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import Playlist from './Playlist';

const Library = () => {
  const dispatch = useDispatch();
  const { songs = [], loading, error } = useSelector((state) => state.songs || {});
  const favorites = useSelector((state) => state.songs?.favorites || []);
  const recentlyAdded = songs.slice(-5); // Display the last 5 songs

  useEffect(() => {
    dispatch(fetchSongsRequest());
  }, [dispatch]);

  const handleToggleFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  return (
    <div css={styles.container}>
      <h1 css={styles.pageTitle}>Your Music Library</h1>

      {loading && <p>Loading songs...</p>}
      {error && <p>Error loading songs: {error}</p>}

      {!loading && !error && (
        <>
          <Section title="Recently Added" songs={recentlyAdded} favorites={favorites} handleToggleFavorite={handleToggleFavorite} />
          <Section title="Your Playlist">
            <Playlist showAudio={false} showTitle={false} redirectToPlaylist={true} />
          </Section>
          <FavoritesSection songs={songs} favorites={favorites} handleToggleFavorite={handleToggleFavorite} />
          <Section title="All Songs" songs={songs} favorites={favorites} handleToggleFavorite={handleToggleFavorite} />
        </>
      )}
    </div>
  );
};

const Section = ({ title, songs, favorites, handleToggleFavorite, children }) => (
  <section css={styles.section}>
    <h2 css={styles.sectionTitle}>{title}</h2>
    {children ? (
      <div css={styles.customPlaylistContainer}>{children}</div>
    ) : (
      <div css={styles.songsList}>
        {songs.length > 0 ? songs.map((song) => (
          <SongItem key={song.id} song={song} favorites={favorites} handleToggleFavorite={handleToggleFavorite} />
        )) : (
          <p>No songs available.</p>
        )}
      </div>
    )}
  </section>
);

const FavoritesSection = ({ songs, favorites, handleToggleFavorite }) => (
  <section css={styles.section}>
    <h2 css={styles.sectionTitle}>Favorites</h2>
    <div css={styles.songsList}>
      {favorites.length > 0 ? (
        favorites.map((favId) => {
          const favoriteSong = songs.find((song) => song.id === favId);
          return favoriteSong && (
            <SongItem key={favoriteSong.id} song={favoriteSong} favorites={favorites} handleToggleFavorite={handleToggleFavorite} />
          );
        })
      ) : (
        <p>No favorite songs.</p>
      )}
    </div>
  </section>
);

const SongItem = memo(({ song, favorites, handleToggleFavorite }) => (
  <div css={styles.songItem}>
    <div className="favorite" onClick={() => handleToggleFavorite(song.id)} aria-label="Toggle favorite">
      <FontAwesomeIcon
        icon={solidHeart}
        className={`heart ${favorites.includes(song.id) ? 'active' : ''}`}
      />
    </div>
    <Link to={`/player/${song.id}`} css={styles.link}>
      <img src={song.poster} alt={song.name} css={styles.songPoster} />
      <h3>{song.name}</h3>
      <p>{song.artist}</p>
    </Link>
  </div>
));

const styles = {
  container: css`
    padding: 20px;
    margin-left: 200px;
    background-color: black;
    font-family: 'Arial', sans-serif;
    color: pink;

    @media (max-width: 768px) {
      margin-left: 80px;
      padding: 10px;
    }
  `,
  customPlaylistContainer: css`
    background-color: #000;
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr; /* Two columns for smaller screens */
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr; /* One column for very small screens */
    }
  `,
  pageTitle: css`
    font-size: 2rem;
    text-align: center;
    color: pink;
    margin-bottom: 30px;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  `,
  section: css`
    margin-bottom: 40px;
    margin-left: 2px;
  `,
  sectionTitle: css`
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #fff;
    border-bottom: 2px solid #ff0066;
    padding-bottom: 5px;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  `,
  songsList: css`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 20px;
    background-color: #000;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr); /* Two columns on smaller screens */
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr; /* One column for very small screens */
    }
  `,
  songItem: css`
    text-align: center;
    border: 1px solid #ddd;
    background-color: black;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    padding: 10px;
    position: relative;

    &:hover {
      transform: scale(1.05);
    }

    .favorite {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }

    .heart.active {
      color: #e63946;
    }
  `,
  songPoster: css`
    width: 100%;
    height: auto;
    border-radius: 5px;
    margin-bottom: 10px;
  `,
  link: css`
    text-decoration: none;
    color: inherit;
  `,
};

export default Library;
