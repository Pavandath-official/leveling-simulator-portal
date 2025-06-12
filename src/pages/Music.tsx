
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
  file?: File; // Keep reference to original file for playback
}

// Solo Leveling OST and inspired tracks
const SOLO_LEVELING_TRACKS: Track[] = [
  {
    id: "1",
    title: "E-Rank Hunter",
    artist: "Hiroyuki Sawano",
    album: "Solo Leveling OST",
    duration: "3:45",
    url: "", // Will be populated by user uploads
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    isUserUpload: false
  },
  {
    id: "2",
    title: "System Awakening",
    artist: "Hiroyuki Sawano",
    album: "Solo Leveling OST",
    duration: "4:12",
    url: "", // Will be populated by user uploads
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
    isUserUpload: false
  },
  {
    id: "3",
    title: "Shadow Army",
    artist: "Hiroyuki Sawano",
    album: "Solo Leveling OST",
    duration: "5:23",
    url: "", // Will be populated by user uploads
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
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
      const savedFiles = localStorage.getItem('userMusicFiles');
      
      if (savedTracks) {
        const tracks: Track[] = JSON.parse(savedTracks);
        setUserTracks(tracks);
        setAllTracks([...SOLO_LEVELING_TRACKS, ...tracks]);
      }
      
      // Note: Files can't be stored in localStorage, so we'll need to re-upload
      console.log('Loaded user tracks from localStorage');
    } catch (error) {
      console.error('Error loading user tracks:', error);
    }
  };

  // Save tracks to localStorage
  const saveUserTracks = (tracks: Track[]) => {
    try {
      // Don't save the file objects, just the track metadata
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
      // Create a URL for the file that will persist for this session
      const fileUrl = URL.createObjectURL(file);
      
      // Get actual duration from the audio file
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
          
          // Store file reference in memory
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
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove user uploaded track
  const removeTrack = (trackId: string) => {
    try {
      const trackToRemove = allTracks.find(t => t.id === trackId);
      
      // Clean up blob URL if it exists
      if (trackToRemove?.url) {
        URL.revokeObjectURL(trackToRemove.url);
      }
      
      // Remove from audio files map
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
      
      // If currently playing track is removed, stop and go to first track
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

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    console.log('Loading track:', track.title, 'URL:', track.url);
    
    if (track.url) {
      audio.src = track.url;
      audio.load();
    } else if (track.isUserUpload && audioFiles.has(track.id)) {
      // Create new blob URL for user uploaded files
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
        description: "Please upload an audio file to play",
        variant: "destructive",
      });
      return;
    }

    // For user uploaded tracks without URL, create one from the file
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
          description: "Failed to play audio file",
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

  // Clean up blob URLs on unmount
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
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <audio ref={audioRef} />
      
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-400 text-sm mb-4">
          <MusicIcon className="w-4 h-4 inline mr-2" />
          Solo Leveling Music Player
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Soundtrack Collection
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Upload and play your own music files. Experience the power and emotion of your favorite tracks.
        </p>
      </div>

      {/* File Upload Section */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-2 border-blue-400/30 shadow-2xl mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-400" />
            Upload Music
          </CardTitle>
          <CardDescription className="text-slate-400">
            Add your own audio files to the playlist
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isLoading ? 'Uploading...' : 'Choose Audio File'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Now Playing */}
        <div className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-2 border-purple-400/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">Now Playing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Album Art */}
              <div className="relative">
                <img 
                  src={track.cover} 
                  alt={track.title}
                  className="w-full aspect-square object-cover rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
              </div>

              {/* Track Info */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">{track.title}</h3>
                <p className="text-slate-400">{track.artist}</p>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {track.album}
                </Badge>
                {track.isUserUpload && (
                  <div className="text-xs text-green-400">
                    {track.url || audioFiles.has(track.id) ? 'Ready to play' : 'No audio source'}
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
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

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={isShuffle ? 'text-blue-400' : 'text-slate-400'}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevTrack}
                  className="text-white hover:text-blue-400"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>

                <Button
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTrack}
                  className="text-white hover:text-blue-400"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={isRepeat ? 'text-blue-400' : 'text-slate-400'}
                >
                  <Repeat className="w-4 h-4" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-white"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  className="flex-1"
                />
                <span className="text-sm text-slate-400 w-8">{volume}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Playlist */}
        <div className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-2 border-green-400/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MusicIcon className="w-5 h-5 mr-2 text-green-400" />
                Playlist ({allTracks.length} tracks)
              </CardTitle>
              <CardDescription className="text-slate-400">
                Your music collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allTracks.map((trackItem, index) => (
                  <div
                    key={trackItem.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      index === currentTrack
                        ? 'bg-blue-500/20 border border-blue-400/50'
                        : 'hover:bg-slate-700/30 border border-transparent'
                    }`}
                    onClick={() => selectTrack(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        {index === currentTrack && isPlaying ? (
                          <Pause className="w-5 h-5 text-blue-400" />
                        ) : (
                          <Play className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">
                          {trackItem.title}
                        </h4>
                        <p className="text-sm text-slate-400 truncate">
                          {trackItem.artist}
                        </p>
                        {trackItem.isUserUpload && (
                          <p className="text-xs text-green-400">
                            {trackItem.url || audioFiles.has(trackItem.id) ? 'Playable' : 'No source'}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(trackItem.id);
                          }}
                          className="p-1 h-auto"
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              favorites.includes(trackItem.id) 
                                ? 'text-red-500 fill-current' 
                                : 'text-slate-400'
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
                            className="p-1 h-auto text-red-400 hover:text-red-300"
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
  );
};

export default Music;
