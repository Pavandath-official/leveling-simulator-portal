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
      title: "Crossing Field",
      artist: "LiSA",
      duration: 240,
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      isLocal: false,
    },
    {
      id: "2",
      title: "My War",
      artist: "Shinsei Kamattechan",
      duration: 225,
      url: "https://www.soundjay.com/misc/sounds/wind-chimes-06.wav",
      isLocal: false,
    },
    {
      id: "3",
      title: "Red Swan",
      artist: "YOSHIKI feat. HYDE",
      duration: 280,
      url: "https://www.soundjay.com/misc/sounds/temple-bell-01.wav",
      isLocal: false,
    }
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

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (currentSongIndex !== null && audioRef.current) {
      const audio = audioRef.current;
      const currentSong = songs[currentSongIndex];
      
      setIsLoading(true);
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      
      audio.src = currentSong.url;
      audio.load();
      
      console.log('Loading song:', currentSong.title, 'URL:', currentSong.url);
    }
  }, [currentSongIndex]);

  useEffect(() => {
    if (audioRef.current && currentSongIndex !== null && !isLoading) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
            toast({
              title: "Playback Error",
              description: "Unable to play this audio file. Try uploading your own music files.",
              variant: "destructive",
            });
          });
        }
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

  const handleCanPlayThrough = () => {
    if (audioRef.current && currentSongIndex !== null) {
      const audio = audioRef.current;
      const actualDuration = audio.duration;
      
      console.log('Audio ready to play:', songs[currentSongIndex].title, 'Duration:', actualDuration);
      
      setDuration(actualDuration);
      setIsLoading(false);
      
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

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('Audio error occurred');
    setIsLoading(false);
    setIsPlaying(false);
    toast({
      title: "Audio Error",
      description: "This demo audio is not accessible. Please upload your own music files to enjoy the full experience!",
      variant: "destructive",
    });
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="sl-container mx-auto px-4 py-8 sl-page-transition">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-sl-dark border border-sl-blue/30 text-sl-blue text-sm mb-3">
          Music System
        </div>
        <h1 className="sl-heading mb-2 flex items-center gap-3 text-white">
          <MusicIcon className="text-sl-blue" />
          Solo Leveling OST
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Upload your own Solo Leveling soundtracks and anime music to create the perfect hunting atmosphere.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="sl-card bg-gradient-to-br from-sl-dark/90 to-sl-grey-dark/50 border-sl-blue/20">
            <div className="flex flex-col items-center">
              <div className="w-full h-60 bg-gradient-to-br from-sl-blue/10 to-sl-purple/10 rounded-lg flex items-center justify-center mb-6 border border-sl-blue/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-sl-blue/5 to-sl-purple/5"></div>
                {currentSongIndex !== null ? (
                  <div className="text-center z-10">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {songs[currentSongIndex].title}
                    </h2>
                    <p className="text-sl-blue text-lg font-medium">{songs[currentSongIndex].artist}</p>
                    {isLoading && (
                      <div className="mt-4">
                        <div className="animate-pulse text-sl-text-muted">Loading...</div>
                        <div className="w-8 h-1 bg-sl-blue rounded-full animate-pulse mx-auto mt-2"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center z-10">
                    <MusicIcon className="w-24 h-24 text-sl-blue/40 mx-auto mb-4" />
                    <p className="text-slate-400">Upload music to get started</p>
                  </div>
                )}
              </div>
              
              <div className="w-full mb-6">
                <div className="flex justify-between text-sm text-slate-200 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  onValueChange={handleProgressChange}
                  className="w-full [&>*]:bg-sl-blue"
                  disabled={isLoading || duration === 0}
                />
              </div>
              
              <div className="flex items-center justify-center space-x-6 mb-6">
                <Button
                  onClick={handlePrevious}
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-sl-blue hover:bg-sl-blue/10 rounded-full h-12 w-12"
                  disabled={currentSongIndex === null || isLoading}
                >
                  <SkipBack className="h-6 w-6" />
                </Button>
                
                <Button
                  onClick={handlePlayPause}
                  variant="outline"
                  size="icon"
                  className="bg-gradient-to-r from-sl-blue to-sl-purple border-sl-blue text-white hover:from-sl-blue-dark hover:to-sl-purple-dark rounded-full h-16 w-16 shadow-lg shadow-sl-blue/20"
                  disabled={songs.length === 0 || isLoading}
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                </Button>
                
                <Button
                  onClick={handleNext}
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-sl-blue hover:bg-sl-blue/10 rounded-full h-12 w-12"
                  disabled={currentSongIndex === null || isLoading}
                >
                  <SkipForward className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-sl-blue hover:bg-sl-blue/10"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-32 [&>*]:bg-sl-blue"
                  disabled={isMuted}
                />
              </div>
              
              <div className="w-full">
                <label
                  htmlFor="music-upload"
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-sl-blue/20 to-sl-purple/20 border border-sl-blue/30 text-sl-blue rounded-lg cursor-pointer hover:from-sl-blue/30 hover:to-sl-purple/30 transition-all duration-300"
                >
                  <Upload className="mr-3 h-5 w-5" />
                  <span className="font-medium">Upload Solo Leveling Music</span>
                  <input
                    id="music-upload"
                    type="file"
                    multiple
                    accept="audio/*"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="text-center text-slate-500 text-sm mt-2">
                  MP3, WAV, OGG files supported
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sl-card h-full max-h-[600px] overflow-y-auto bg-gradient-to-br from-sl-dark/90 to-sl-grey-dark/50 border-sl-purple/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <MusicIcon className="mr-3 h-5 w-5 text-sl-purple" />
              Playlist
              <span className="ml-auto text-sm text-slate-400">({songs.length})</span>
            </h2>
            
            {songs.length === 0 ? (
              <div className="text-center text-slate-400 py-12">
                <MusicIcon className="mx-auto h-16 w-16 mb-4 text-sl-grey opacity-50" />
                <p className="text-slate-200 font-medium mb-2">No music uploaded</p>
                <p className="text-sm text-slate-400">Upload your favorite Solo Leveling tracks</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {songs.map((song, index) => (
                  <li
                    key={song.id}
                    className={`px-4 py-3 rounded-lg transition-all cursor-pointer group ${
                      currentSongIndex === index
                        ? "bg-gradient-to-r from-sl-blue/20 to-sl-purple/20 border border-sl-blue/40"
                        : "hover:bg-sl-grey-dark/40 border border-transparent"
                    }`}
                    onClick={() => selectSong(index)}
                  >
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                        currentSongIndex === index
                          ? "bg-gradient-to-r from-sl-blue to-sl-purple"
                          : "bg-sl-grey-dark group-hover:bg-sl-blue/20"
                      }`}>
                        {currentSongIndex === index && isPlaying ? (
                          <div className="w-4 h-4 flex items-center justify-center">
                            <div className="w-[2px] h-3 bg-white mx-[1px] animate-pulse"></div>
                            <div className="w-[2px] h-4 bg-white mx-[1px] animate-pulse"></div>
                            <div className="w-[2px] h-2 bg-white mx-[1px] animate-pulse"></div>
                          </div>
                        ) : (
                          <Play className={`h-4 w-4 ${currentSongIndex === index ? "text-white" : "text-sl-blue"}`} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={`truncate font-medium ${
                          currentSongIndex === index ? "text-white" : "text-slate-200"
                        }`}>
                          {song.title}
                        </div>
                        <div className={`truncate text-sm ${
                          currentSongIndex === index ? "text-sl-blue" : "text-slate-400"
                        }`}>
                          {song.artist}
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-400 ml-3">
                        {song.duration > 0 ? formatTime(song.duration) : "--:--"}
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
