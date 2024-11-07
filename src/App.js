import React, { useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { fetchSongsRequest } from './components/SongSlice';
import Sidebar from './components/sidebar'; 
import Home from './screens/home'; 
import Favorites from './screens/favorites'; 
import Library from './screens/library'; 
import Playlist from './screens/Playlist'; 
import LoadingSpinner from './components/LoadingSpinner'; 
import ErrorComponent from './components/ErrorComponent'; 
import './App.css';
import Footer from './components/fotter';


export default function App() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.songs);

  useEffect(() => {
    dispatch(fetchSongsRequest());
  }, [dispatch]);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />

        <div className="main-content">
          {loading && <LoadingSpinner />} 
          {error && <ErrorComponent message={`Error loading songs: ${error}`} />} 

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/library" element={<Library />} />
            <Route path="/playlist" element={<Playlist />} />
           </Routes>
        </div>
      </div>
      <Footer/>
    </Router>
  );
}
