
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Music as MusicIcon, Download, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

// Solo Leveling OST and inspired tracks
const SOLO_LEVELING_TRACKS = [
  {
    id: 1,
    title: "E-Rank Hunter",
    artist: "Hiroyuki Sawano",
    album: "Solo Leveling OST",
    duration: "3:45",
    url: "https://www.soundjay.com/misc/bell-ringing-05.wav", // Placeholder
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
  },
  {
    id: 2,
    title: "System Awakening",
    artist: "Hiroyuki Sawano",
    album: "Solo Leveling OST",
    duration: "4:12",
    url: "https://www.soundjay.com/misc/bell-ringing-05.wav", // Placeholder
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Shadow Army",
    artist: "Hiroyuki Sawano",
    album: "Solo Leveling OST",
    duration: "5:23",
    url: "https://www.soundjay.com/misc/bell-ringing-05.wav", // Placeholder
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Arise",
    artist: "Hiroyuki Sawano",
    album: "Solo Leveling OST",
    duration: "4:56",
    url: "https://www.soundjay.com/misc/bell-ringing-05.wav", // Placeholder
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Monarch's Power",
    artist: "Hiroyuki Sawano",
    album: "Solo Leveling OST",
    duration: "6:14",
    url: "https://www.soundjay.com/misc/bell-ringing-05.wav", // Placeholder
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop"
  },
  {
    id: 6,
    title: "Red Gate",
    artist: "Hiroyuki Sawano", 
    album: "Solo Leveling OST",
    duration: "3:33",
    url: "https://www.soundjay.com/misc/bell-ringing-05.wav", // Placeholder
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop"
  }
];

const Music = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = SOLO_LEVELING_TRACKS[currentTrack];

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
  }, [currentTrack, isRepeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * SOLO_LEVELING_TRACKS.length);
      setCurrentTrack(randomIndex);
    } else {
      setCurrentTrack((prev) => (prev + 1) % SOLO_LEVELING_TRACKS.length);
    }
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + SOLO_LEVELING_TRACKS.length) % SOLO_LEVELING_TRACKS.length);
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
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFavorite = (trackId: number) => {
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

  return (
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <audio ref={audioRef} src={track.url} />
      
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-sl-blue/20 to-sl-purple/20 border border-sl-blue/30 text-sl-blue text-sm mb-4">
          <MusicIcon className="w-4 h-4 inline mr-2" />
          Solo Leveling Music Player
        </div>
        <h1 className="sl-heading mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Soundtrack Collection
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Immerse yourself in the epic Solo Leveling soundtrack. Experience the power and emotion of Sung Jin-Woo's journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Now Playing */}
        <div className="space-y-6">
          <Card className="sl-card">
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
                <Badge variant="outline" className="text-sl-blue border-sl-blue">
                  {track.album}
                </Badge>
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
                  <span>{track.duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={isShuffle ? 'text-sl-blue' : 'text-slate-400'}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevTrack}
                  className="text-white hover:text-sl-blue"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>

                <Button
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-full bg-sl-blue hover:bg-sl-blue-dark text-white"
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
                  className="text-white hover:text-sl-blue"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={isRepeat ? 'text-sl-blue' : 'text-slate-400'}
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
          <Card className="sl-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MusicIcon className="w-5 h-5 mr-2 text-sl-purple" />
                Playlist ({SOLO_LEVELING_TRACKS.length} tracks)
              </CardTitle>
              <CardDescription className="text-slate-400">
                Complete Solo Leveling soundtrack collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {SOLO_LEVELING_TRACKS.map((trackItem, index) => (
                  <div
                    key={trackItem.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      index === currentTrack
                        ? 'bg-sl-blue/20 border border-sl-blue/50'
                        : 'hover:bg-sl-grey-dark/30 border border-transparent'
                    }`}
                    onClick={() => selectTrack(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-md bg-gradient-to-br from-sl-blue/20 to-sl-purple/20 flex items-center justify-center">
                        {index === currentTrack && isPlaying ? (
                          <Pause className="w-5 h-5 text-sl-blue" />
                        ) : (
                          <Play className="w-5 h-5 text-sl-blue" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">
                          {trackItem.title}
                        </h4>
                        <p className="text-sm text-slate-400 truncate">
                          {trackItem.artist}
                        </p>
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

          {/* Quick Actions */}
          <Card className="sl-card">
            <CardHeader>
              <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="border-sl-blue/50 text-sl-blue hover:bg-sl-blue/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  className="border-sl-purple/50 text-sl-purple hover:bg-sl-purple/10"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites ({favorites.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Music;
