import React, { useState, useRef } from 'react';
import './meditate.css'; 

const Meditate = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null); // Use ref to persist the audio object

  // Track list with dynamically required audio files
  const tracks = [
    {
      title: 'MI-1 Fallout',
      file: require('../../assets/Fallout.mp3')
    },
    {
      title: 'Fitness Track',
      file: require('../../assets/Fitness.mp3')
    },
    {
      title: 'Prison Break',
      file: require('../../assets/Prisonbreak.mp3')
    },
    {
      title: 'Vikings Intro',
      file: require('../../assets/Vikings.mp3')
    },
  ];

  const playTrack = (trackFile) => {
    // Stop the current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Play the selected track
    audioRef.current = new Audio(trackFile);
    audioRef.current.play();
    setIsPlaying(true);
    setCurrentTrack(trackFile);

    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTrack(null);
    });
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset to start
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  return (
    <div className="meditate-section">
      <h2>Meditate</h2>
      <div className="music-controls">
        {isPlaying && (
          <div>
            <p>Now Playing: {tracks.find(track => track.file === currentTrack)?.title}</p>
            <button onClick={stopTrack}>Stop</button>
          </div>
        )}
      </div>
      <div className="music-selection">
        <h3>Select a Track</h3>
        {tracks.map((track, index) => (
          <button key={index} onClick={() => playTrack(track.file)}>
            {track.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Meditate;
