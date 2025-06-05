
import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);

  const tracks = [
    { title: "Shadow Monarch Theme", url: "" },
    { title: "Arise Theme", url: "" }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Note: No actual audio playback - just UI simulation
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  return (
    <motion.div 
      className={`bg-sl-dark/90 backdrop-blur-sm border border-sl-grey-dark rounded-lg p-3 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-2 mb-2">
        <button
          onClick={prevTrack}
          className="text-slate-400 hover:text-sl-blue transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        
        <button
          onClick={handlePlayPause}
          className="bg-sl-blue hover:bg-sl-blue-light text-sl-darker rounded-full p-2 transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        
        <button
          onClick={nextTrack}
          className="text-slate-400 hover:text-sl-blue transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
        
        <button
          onClick={toggleMute}
          className="text-slate-400 hover:text-sl-blue transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-16 accent-sl-blue"
        />
      </div>
      
      <div className="text-xs text-slate-300 truncate">
        {tracks[currentTrack].title}
      </div>
      
      <div className="text-xs text-slate-500 mt-1">
        Music Player (UI Only)
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
