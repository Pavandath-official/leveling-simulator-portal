import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Music as MusicIcon, Upload, Heart, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Track interface
interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  url: string;
  cover: string;
  isUserUpload: boolean;
  file?: File;
}

// Solo Leveling Music Collection with working audio sources
const SOLO_LEVELING_TRACKS: Track[] = [
  {
    id: "1",
    title: "LEveL",
    artist: "SawanoHiroyuki[nZk]:mizuki",
    album: "Solo Leveling Opening",
    duration: "3:45",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    isUserUpload: false
  },
  {
    id: "2", 
    title: "Epic Battle Theme",
    artist: "Solo Leveling OST",
    album: "Solo Leveling Soundtrack",
    duration: "4:12",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=300&fit=crop",
    isUserUpload: false
  },
  {
    id: "3",
    title: "Shadow Extraction",
    artist: "Solo Leveling OST",
    album: "Solo Leveling Soundtrack", 
    duration: "2:58",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop",
    isUserUpload: false
  }
];

const Music = () => {
  const { toast } = useToast();
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userTracks, setUserTracks] = useState<Track[]>([]);
  const [allTracks, setAllTracks] = useState<Track[]>(SOLO_LEVELING_TRACKS);
  const [isLoading, setIsLoading] = useState(false);
  const [audioFiles, setAudioFiles] = useState<Map<string, File>>(new Map());
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const track = allTracks[currentTrack];

  // Load saved tracks from localStorage on component mount
  useEffect(() => {
    loadUserTracks();
  }, []);

  const loadUserTracks = () => {
    try {
      const savedTracks = localStorage.getItem('userMusicTracks');
      
      if (savedTracks) {
        const tracks: Track[] = JSON.parse(savedTracks);
        setUserTracks(tracks);
        setAllTracks([...SOLO_LEVELING_TRACKS, ...tracks]);
      }
      
      console.log('Loaded user tracks from localStorage');
    } catch (error) {
      console.error('Error loading user tracks:', error);
    }
  };

  // Save tracks to localStorage
  const saveUserTracks = (tracks: Track[]) => {
    try {
      const tracksToSave = tracks.map(track => {
        const { file, ...trackWithoutFile } = track;
        return trackWithoutFile;
      });
      localStorage.setItem('userMusicTracks', JSON.stringify(tracksToSave));
      console.log('Saved user tracks to localStorage');
    } catch (error) {
      console.error('Error saving user tracks:', error);
    }
  };

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid File",
        description: "Please select an audio file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const fileUrl = URL.createObjectURL(file);
      const audio = new Audio(fileUrl);
      
      await new Promise((resolve, reject) => {
        audio.addEventListener('loadedmetadata', () => {
          const minutes = Math.floor(audio.duration / 60);
          const seconds = Math.floor(audio.duration % 60);
          const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          const newTrack: Track = {
            id: Date.now().toString(),
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Unknown Artist",
            album: "User Upload",
            duration: durationStr,
            url: fileUrl,
            cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            isUserUpload: true,
            file: file
          };

          const updatedUserTracks = [...userTracks, newTrack];
          const updatedAllTracks = [...allTracks, newTrack];
          
          setAudioFiles(prev => new Map(prev).set(newTrack.id, file));
          setUserTracks(updatedUserTracks);
          setAllTracks(updatedAllTracks);
          saveUserTracks(updatedUserTracks);
          
          toast({
            title: "Track Added!",
            description: `${newTrack.title} has been uploaded successfully`,
            variant: "default",
          });
          
          resolve(newTrack);
        });
        
        audio.addEventListener('error', () => {
          reject(new Error('Failed to load audio file'));
        });
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload music file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove user uploaded track
  const removeTrack = (trackId: string) => {
    try {
      const trackToRemove = allTracks.find(t => t.id === trackId);
      
      if (trackToRemove?.url) {
        URL.revokeObjectURL(trackToRemove.url);
      }
      
      setAudioFiles(prev => {
        const newMap = new Map(prev);
        newMap.delete(trackId);
        return newMap;
      });
      
      const updatedUserTracks = userTracks.filter(t => t.id !== trackId);
      const updatedAllTracks = allTracks.filter(t => t.id !== trackId);
      
      setUserTracks(updatedUserTracks);
      setAllTracks(updatedAllTracks);
      saveUserTracks(updatedUserTracks);
      
      if (allTracks[currentTrack]?.id === trackId) {
        setIsPlaying(false);
        setCurrentTrack(0);
      }
      
      toast({
        title: "Track Removed",
        description: "Track has been deleted from your playlist",
        variant: "default",
      });

    } catch (error) {
      console.error('Error removing track:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to remove track",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, isRepeat, track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    console.log('Loading track:', track.title, 'URL:', track.url);
    
    if (track.url) {
      audio.src = track.url;
      audio.load();
    } else if (track.isUserUpload && audioFiles.has(track.id)) {
      const file = audioFiles.get(track.id);
      if (file) {
        const url = URL.createObjectURL(file);
        audio.src = url;
        audio.load();
        console.log('Created new blob URL for track:', track.title);
      }
    }
  }, [currentTrack, track, audioFiles]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !track) {
      toast({
        title: "No Audio",
        description: "Please select a track to play",
        variant: "destructive",
      });
      return;
    }

    if (track.isUserUpload && !track.url && audioFiles.has(track.id)) {
      const file = audioFiles.get(track.id);
      if (file) {
        const url = URL.createObjectURL(file);
        audio.src = url;
        audio.load();
      }
    }

    if (!audio.src || audio.src === window.location.href) {
      toast({
        title: "No Audio Source",
        description: "This track doesn't have a valid audio source",
        variant: "destructive",
      });
      return;
    }

    console.log('Toggling playback for:', track.title, 'Audio src:', audio.src);

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Playback failed:', error);
        toast({
          title: "Playback Error",
          description: "Failed to play audio file. The audio source may not be available.",
          variant: "destructive",
        });
      });
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * allTracks.length);
      setCurrentTrack(randomIndex);
    } else {
      setCurrentTrack((prev) => (prev + 1) % allTracks.length);
    }
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + allTracks.length) % allTracks.length);
    setIsPlaying(true);
  };

  const seekTo = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const seekTime = (value[0] / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    return () => {
      allTracks.forEach(track => {
        if (track.url && track.url.startsWith('blob:')) {
          URL.revokeObjectURL(track.url);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background for Music Page */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 5, 30, 0.9), rgba(8, 2, 15, 0.95)),
            url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Music Note Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute text-purple-400/20 text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            ♪
          </div>
        ))}
      </div>

      <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition relative z-10">
        <audio ref={audioRef} />
        
        <div className="mt-8 mb-12 text-center">
          <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-400 text-sm mb-6">
            <MusicIcon className="w-5 h-5 inline mr-2" />
            Solo Leveling Music Collection
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-orbitron">
            Soundtrack Collection
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto text-xl">
            Immerse yourself in the epic soundtracks of Solo Leveling and upload your own music files.
          </p>
        </div>

        {/* File Upload Section */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-purple-400/30 shadow-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-xl">
              <Upload className="w-6 h-6 mr-2 text-purple-400" />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Upload Your Music
              </span>
            </CardTitle>
            <CardDescription className="text-slate-300 text-base">
              Add your own audio files to create your personal playlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-medium shadow-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              {isLoading ? 'Uploading...' : 'Choose Audio File'}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Now Playing - Enhanced */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-pink-400/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Now Playing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Album Art */}
                <div className="relative">
                  <img 
                    src={track.cover} 
                    alt={track.title}
                    className="w-full aspect-square object-cover rounded-xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
                  {isPlaying && (
                    <div className="absolute inset-0 rounded-xl animate-pulse border-2 border-purple-400/50"></div>
                  )}
                </div>

                {/* Track Info */}
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-white">{track.title}</h3>
                  <p className="text-slate-300 text-lg">{track.artist}</p>
                  <Badge variant="outline" className="text-purple-400 border-purple-400 px-3 py-1">
                    {track.album}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <Slider
                    value={[duration ? (currentTime / duration) * 100 : 0]}
                    onValueChange={seekTo}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{duration ? formatTime(duration) : track.duration}</span>
                  </div>
                </div>

                {/* Enhanced Controls */}
                <div className="flex items-center justify-center space-x-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`${isShuffle ? 'text-purple-400' : 'text-slate-400'} hover:text-purple-300`}
                  >
                    <Shuffle className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevTrack}
                    className="text-white hover:text-purple-400 p-3"
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>

                  <Button
                    onClick={togglePlayPause}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextTrack}
                    className="text-white hover:text-purple-400 p-3"
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`${isRepeat ? 'text-purple-400' : 'text-slate-400'} hover:text-purple-300`}
                  >
                    <Repeat className="w-5 h-5" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-400 hover:text-white"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                  <Slider
                    value={[volume]}
                    onValueChange={(value) => setVolume(value[0])}
                    max={100}
                    className="flex-1"
                  />
                  <span className="text-sm text-slate-400 w-12 text-center">{volume}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Playlist */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-blue-400/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <MusicIcon className="w-6 h-6 mr-2 text-blue-400" />
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Playlist ({allTracks.length} tracks)
                  </span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Your complete music collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {allTracks.map((trackItem, index) => (
                    <div
                      key={trackItem.id}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                        index === currentTrack
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 shadow-lg'
                          : 'hover:bg-slate-700/40 border-slate-600/50 hover:border-slate-500/70'
                      }`}
                      onClick={() => selectTrack(index)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          index === currentTrack 
                            ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30' 
                            : 'bg-slate-700/50'
                        }`}>
                          {index === currentTrack && isPlaying ? (
                            <Pause className="w-5 h-5 text-purple-400" />
                          ) : (
                            <Play className="w-5 h-5 text-purple-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white truncate text-base">
                            {trackItem.title}
                          </h4>
                          <p className="text-sm text-slate-400 truncate">
                            {trackItem.artist}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(trackItem.id);
                            }}
                            className="p-2 h-auto"
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                favorites.includes(trackItem.id) 
                                  ? 'text-red-500 fill-current' 
                                  : 'text-slate-400 hover:text-red-400'
                              }`} 
                            />
                          </Button>
                          {trackItem.isUserUpload && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTrack(trackItem.id);
                              }}
                              className="p-2 h-auto text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                          <span className="text-sm text-slate-400 w-12 text-right">
                            {trackItem.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(5deg); }
          66% { transform: translateY(-5px) rotate(-5deg); }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(71, 85, 105, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(147, 51, 234, 0.7), rgba(219, 39, 119, 0.7));
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(147, 51, 234, 0.9), rgba(219, 39, 119, 0.9));
        }
      `}</style>
    </div>
  );
};

export default Music;
