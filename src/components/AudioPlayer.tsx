
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Default tracks - these are placeholder URLs that will work
  const tracks = [
    {
      title: "Shadow Monarch Theme",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DwwG0gBSuBzvLZiTYIF2Wz7eWLMwgWabrq5pZOEghN+/LZiTYIF2Wz7eOQOAgXabru5pJNEgNO+e/dlUYLDWK47ePEfSIGgYWKhWxdX3SYr6yQYTY1YKHt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DwwG0gBSuBzvLZiTYIF2Wz7eWLMwgWabrq5pZOEghN+/LZiTYIF2Wz7eOQOAgXabru5pJNEgNO+e/dlUYLDWK47ePEfSIGgYWKhWxdX3SYr6yQYTY1YKHt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DwwG0gBSuBzvLZiTYIF2Wz7eWLMwgWabrq5pZOEghN+/LZiTYIF2Wz7eOQOAgXabru5pJNEgNO+e/dlUYLDWK47ePEfSIGgYWKhWxdX3SYr6yQYTY1YKHt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DwwG0gBSuBzvLZiTYIF2Wz7eWLMwgWabrq5pZOEghN+/LZiTYIF2Wz7eOQOAgXabru5pJNEgNO+e/dlUYLDWK47ePEfSIG"
    },
    {
      title: "Arise Theme",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DwwG0gBSuBzvLZiTYIF2Wz7eWLMwgWabrq5pZOEghN+/LZiTYIF2Wz7eOQOAgXabru5pJNEgNO+e/dlUYLDWK47ePEfSIGgYWKhWxdX3SYr6yQYTY1YKHt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DwwG0gBSuBzvLZiTYIF2Wz7eWLMwgWabrq5pZOEghN+/LZiTYIF2Wz7eOQOAgXabru5pJNEgNO+e/dlUYLDWK47ePEfSIG"
    }
  ];

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Fallback for when audio can't be played
          console.log('Audio playback not available');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.load(); // Reload the new track
    }
  }, [currentTrack, volume]);

  return (
    <motion.div 
      className={`bg-sl-dark/90 backdrop-blur-sm border border-sl-grey-dark rounded-lg p-3 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <audio
        ref={audioRef}
        src={tracks[currentTrack].url}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        loop
      />
      
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
    </motion.div>
  );
};

export default AudioPlayer;
