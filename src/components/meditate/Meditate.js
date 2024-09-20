import React, { useState, useRef } from 'react';
import './meditate.css'; 
import { GrResume,GrCaretNext,GrCaretPrevious,GrStop,GrPause } from "react-icons/gr";



const Meditate = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Track index
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null); // Ref to persist the audio object

  // Track list 
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

  const playTrack = (trackIndex) => {
    const trackFile = tracks[trackIndex].file;

    // Stop the current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Play the selected track
    audioRef.current = new Audio(trackFile);
    audioRef.current.play();
    setIsPlaying(true);
    setCurrentTrackIndex(trackIndex);

    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTrackIndex(null);
    });
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset to start
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(nextIndex);
  };

  const previousTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(prevIndex);
  };

  return (
    <div className="meditate-section">
      <h2>Meditate</h2>
      <div className="music-selection">
        <h3>Select a Track</h3>
        {tracks.map((track, index) => (
          <button key={index} onClick={() => playTrack(index)}>
            {track.title}
          </button>
        ))}
      </div>
      <div className="music-controls">
        {isPlaying ? (
          <div>
            <p>Now Playing: {tracks[currentTrackIndex]?.title}</p>
            <div className="controls">
              <button onClick={pauseTrack}><GrPause size={30}/></button>
              <button onClick={nextTrack}><GrCaretNext size={30}/></button>
              <button onClick={previousTrack}><GrCaretPrevious size={30}/></button>
              <button onClick={stopTrack}><GrStop size={30}/></button>
            </div>
           
          </div>
        ) : (
          currentTrackIndex !== null && (
            <div>
              <p>Paused: {tracks[currentTrackIndex]?.title}</p>
              <div className="controls">
                <button onClick={resumeTrack}><GrResume size={30}/></button>
                <button onClick={nextTrack}><GrCaretNext size={30}/></button>
                <button onClick={previousTrack}><GrCaretPrevious size={30}/></button>
                <button onClick={stopTrack}><GrStop size={30}/></button>
              </div>
             
            </div>
          )
        )}
      </div>

      
    </div>
  );
};

export default Meditate;
