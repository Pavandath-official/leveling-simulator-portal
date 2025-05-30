import React, { useState, useRef, useEffect } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Upload, Music as MusicIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  isLocal: boolean;
}

const Music = () => {
  const [songs, setSongs] = useState<Song[]>([
    {
      id: "1",
      title: "Rise from the Shadows",
      artist: "System Interface",
      duration: 218,
      url: "https://www.soundjay.com/misc/sounds/magic-chime-02.mp3",
      isLocal: false,
    },
    {
      id: "2",
      title: "Hunter's Awakening", 
      artist: "E Rank",
      duration: 185,
      url: "https://www.soundjay.com/misc/sounds/magic-chime-01.mp3",
      isLocal: false,
    },
    {
      id: "3",
      title: "Shadow Monarch's Theme",
      artist: "Sung Jin-Woo",
      duration: 203,
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
      isLocal: false,
    },
    {
      id: "4",
      title: "Arise",
      artist: "Shadow Army",
      duration: 195,
      url: "https://www.soundjay.com/misc/sounds/page-flip-01a.mp3",
      isLocal: false,
    },
    {
      id: "5",
      title: "System Notification",
      artist: "Solo Leveling OST",
      duration: 178,
      url: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.mp3",
      isLocal: false,
    },
    {
      id: "6",
      title: "Gate Opening",
      artist: "Dungeon Break",
      duration: 205,
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
      isLocal: false,
    },
    {
      id: "7",
      title: "Battle Theme",
      artist: "Raid Boss",
      duration: 192,
      url: "https://www.soundjay.com/misc/sounds/magic-chime-02.mp3",
      isLocal: false,
    },
    {
      id: "8",
      title: "Leveling Up",
      artist: "System",
      duration: 156,
      url: "https://www.soundjay.com/misc/sounds/magic-chime-01.mp3",
      isLocal: false,
    },
    {
      id: "9",
      title: "Shadow Extraction",
      artist: "Necromancer",
      duration: 234,
      url: "https://www.soundjay.com/misc/sounds/page-flip-01a.mp3",
      isLocal: false,
    },
    {
      id: "10",
      title: "Final Boss",
      artist: "Monarch",
      duration: 267,
      url: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.mp3",
      isLocal: false,
    },
    {
      id: "11",
      title: "Iron Body Training",
      artist: "Physical Enhancement",
      duration: 198,
      url: "https://www.soundjay.com/misc/sounds/magic-chime-02.mp3",
      isLocal: false,
    },
    {
      id: "12",
      title: "Mana Circulation",
      artist: "Magic Training",
      duration: 212,
      url: "https://www.soundjay.com/misc/sounds/magic-chime-01.mp3",
      isLocal: false,
    },
    {
      id: "13",
      title: "Speed Enhancement",
      artist: "Agility Boost",
      duration: 189,
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
      isLocal: false,
    },
    {
      id: "14",
      title: "Shadow Step",
      artist: "Stealth Mode",
      duration: 176,
      url: "https://www.soundjay.com/misc/sounds/page-flip-01a.mp3",
      isLocal: false,
    },
    {
      id: "15",
      title: "Guild War March",
      artist: "Battle Anthem",
      duration: 245,
      url: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.mp3",
      isLocal: false,
    },
  ]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);
  const { toast } = useToast();

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Load new song when currentSongIndex changes
  useEffect(() => {
    if (currentSongIndex !== null && audioRef.current) {
      const audio = audioRef.current;
      const currentSong = songs[currentSongIndex];
      
      setIsLoading(true);
      
      // Clear existing progress interval
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      // Reset state
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      
      // Set new source
      audio.src = currentSong.url;
      audio.load();
      
      console.log('Loading song:', currentSong.title);
    }
  }, [currentSongIndex]);

  // Handle play/pause changes
  useEffect(() => {
    if (audioRef.current && currentSongIndex !== null && !isLoading) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          toast({
            title: "Playback Error",
            description: "Failed to play the audio file",
            variant: "destructive",
          });
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isLoading]);

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    if (currentSongIndex === null && songs.length > 0) {
      setCurrentSongIndex(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentSongIndex === null || songs.length === 0) return;
    
    const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(newIndex);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (currentSongIndex === null || songs.length === 0) return;
    
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
    setIsPlaying(true);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && duration > 0) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(value[0]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newSongs: Song[] = [];

    Array.from(files).forEach((file) => {
      const fileURL = URL.createObjectURL(file);
      
      let title = file.name.replace(/\.[^/.]+$/, "");
      let artist = "Unknown Artist";
      
      const nameParts = title.split(' - ');
      if (nameParts.length > 1) {
        artist = nameParts[0];
        title = nameParts.slice(1).join(' - ');
      }

      newSongs.push({
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        artist,
        duration: 0,
        url: fileURL,
        isLocal: true,
      });
    });

    setSongs([...songs, ...newSongs]);
    toast({
      title: "Songs Added",
      description: `${newSongs.length} songs have been added to your library.`,
    });

    if (currentSongIndex === null) {
      setCurrentSongIndex(songs.length);
      setIsPlaying(true);
    }
  };

  // Audio event handlers
  const handleCanPlayThrough = () => {
    if (audioRef.current && currentSongIndex !== null) {
      const audio = audioRef.current;
      const actualDuration = audio.duration;
      
      console.log('Audio ready to play:', songs[currentSongIndex].title, 'Duration:', actualDuration);
      
      setDuration(actualDuration);
      setIsLoading(false);
      
      // Update song duration if it was unknown
      if (songs[currentSongIndex].duration === 0 || songs[currentSongIndex].duration !== actualDuration) {
        const updatedSongs = [...songs];
        updatedSongs[currentSongIndex].duration = actualDuration;
        setSongs(updatedSongs);
      }
      
      // Start progress tracking
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      progressInterval.current = window.setInterval(() => {
        if (audio && !audio.paused && !audio.ended) {
          const current = audio.currentTime;
          const total = audio.duration;
          
          if (isFinite(current) && isFinite(total) && total > 0) {
            setCurrentTime(current);
            setProgress((current / total) * 100);
          }
        }
      }, 500);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      
      if (isFinite(current) && isFinite(total) && total > 0) {
        setCurrentTime(current);
        setProgress((current / total) * 100);
      }
    }
  };

  const handleAudioEnded = () => {
    console.log('Song ended, playing next');
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    handleNext();
  };

  const handleError = () => {
    console.error('Audio error occurred');
    setIsLoading(false);
    setIsPlaying(false);
    toast({
      title: "Audio Error",
      description: "Failed to load or play the audio file",
      variant: "destructive",
    });
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="sl-container mx-auto px-4 py-8 sl-page-transition">
      <h1 className="sl-heading mb-8 flex items-center gap-3 text-white">
        <MusicIcon className="text-sl-blue" />
        Music System
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="sl-card bg-sl-dark/80 border-sl-grey-dark">
            <div className="flex flex-col items-center">
              <div className="w-full h-60 bg-sl-darker rounded-lg flex items-center justify-center mb-6 border border-sl-grey-dark animate-pulse-glow">
                {currentSongIndex !== null ? (
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-white">
                      {songs[currentSongIndex].title}
                    </h2>
                    <p className="text-sl-blue mt-2">{songs[currentSongIndex].artist}</p>
                    {isLoading && <p className="text-sl-text-muted mt-2">Loading...</p>}
                  </div>
                ) : (
                  <MusicIcon className="w-24 h-24 text-sl-blue/30" />
                )}
              </div>
              
              <div className="w-full mb-4">
                <div className="flex justify-between text-sm text-slate-200 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  onValueChange={handleProgressChange}
                  className="w-full"
                  disabled={isLoading || duration === 0}
                />
              </div>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Button
                  onClick={handlePrevious}
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-sl-blue hover:bg-sl-darker"
                  disabled={currentSongIndex === null || isLoading}
                >
                  <SkipBack className="h-6 w-6" />
                </Button>
                
                <Button
                  onClick={handlePlayPause}
                  variant="outline"
                  size="icon"
                  className="bg-sl-dark border-sl-blue text-sl-blue hover:bg-sl-blue hover:text-sl-darker rounded-full h-14 w-14"
                  disabled={songs.length === 0 || isLoading}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                
                <Button
                  onClick={handleNext}
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-sl-blue hover:bg-sl-darker"
                  disabled={currentSongIndex === null || isLoading}
                >
                  <SkipForward className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-sl-blue hover:bg-sl-darker"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-32"
                  disabled={isMuted}
                />
              </div>
              
              <div className="w-full">
                <label
                  htmlFor="music-upload"
                  className="flex items-center justify-center px-4 py-2 bg-sl-dark border border-sl-grey-dark text-slate-300 rounded-md cursor-pointer hover:bg-sl-grey-dark hover:text-white transition-colors"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  <span>Upload Music</span>
                  <input
                    id="music-upload"
                    type="file"
                    multiple
                    accept="audio/*"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sl-card h-full max-h-[600px] overflow-y-auto bg-sl-dark/80 border-sl-grey-dark">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <MusicIcon className="mr-2 h-5 w-5 text-sl-blue" />
              Your Playlist
            </h2>
            
            {songs.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <MusicIcon className="mx-auto h-12 w-12 mb-3 text-sl-grey" />
                <p className="text-slate-200">No songs in your playlist</p>
                <p className="text-sm mt-2 text-slate-300">Upload some music to get started</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {songs.map((song, index) => (
                  <li
                    key={song.id}
                    className={`px-3 py-2 rounded-md transition-all cursor-pointer ${
                      currentSongIndex === index
                        ? "bg-sl-blue/10 border border-sl-blue/30"
                        : "hover:bg-sl-darker"
                    }`}
                    onClick={() => selectSong(index)}
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-sl-darker flex items-center justify-center mr-3">
                        {currentSongIndex === index && isPlaying ? (
                          <div className="w-4 h-4 flex items-center justify-center">
                            <div className="w-[2px] h-3 bg-sl-blue mx-[1px] animate-pulse"></div>
                            <div className="w-[2px] h-4 bg-sl-blue mx-[1px] animate-pulse"></div>
                            <div className="w-[2px] h-2 bg-sl-blue mx-[1px] animate-pulse"></div>
                          </div>
                        ) : (
                          <Play className="h-3 w-3 text-sl-blue" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium text-white">
                          {song.title}
                        </div>
                        <div className="truncate text-sm text-slate-300">
                          {song.artist}
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-400 ml-2">
                        {song.duration > 0
                          ? formatTime(song.duration)
                          : "--:--"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      <audio
        ref={audioRef}
        onCanPlayThrough={handleCanPlayThrough}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        onError={handleError}
        preload="metadata"
      />
    </div>
  );
};

export default Music;
