
import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const MusicPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [userTracks, setUserTracks] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const defaultTracks = [
    {
      title: "Shadow Monarch Theme",
      artist: "Solo Leveling OST",
      duration: "3:45",
      mood: "Epic"
    },
    {
      title: "Arise",
      artist: "Solo Leveling OST", 
      duration: "4:12",
      mood: "Intense"
    },
    {
      title: "Hunter's Awakening",
      artist: "Solo Leveling OST",
      duration: "3:30",
      mood: "Triumphant"
    }
  ];

  const allTracks = [...defaultTracks, ...userTracks];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const newTrack = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Uploaded Track",
        duration: "Unknown",
        mood: "Custom",
        url: url
      };
      setUserTracks(prev => [...prev, newTrack]);
    });

    toast({
      title: "Music Added",
      description: `${files.length} track(s) uploaded successfully!`
    });
  };

  return (
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-sl-blue/20 to-sl-purple/20 border border-sl-blue/30 text-sl-blue text-sm mb-4">
          <Music className="w-4 h-4 inline mr-2" />
          Hunter's Soundtrack
        </div>
        <h1 className="sl-heading mb-4">Solo Leveling Music</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Upload your own Solo Leveling soundtracks and create the perfect hunting atmosphere.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Music Player */}
        <Card className="sl-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Music className="w-5 h-5 mr-2 text-sl-blue" />
              Now Playing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl text-white mb-2">
                {allTracks[currentTrack]?.title || "No Track Selected"}
              </h3>
              <p className="text-slate-400">{allTracks[currentTrack]?.artist}</p>
              <Badge className="bg-sl-purple/20 text-sl-purple mt-2">
                {allTracks[currentTrack]?.mood}
              </Badge>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Button variant="outline" size="sm" className="border-sl-blue/50 text-sl-blue">
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={handlePlayPause}
                className="bg-sl-blue hover:bg-sl-blue-dark text-white w-12 h-12 rounded-full"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <Button variant="outline" size="sm" className="border-sl-blue/50 text-sl-blue">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-sl-blue h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>1:23</span>
                <span>{allTracks[currentTrack]?.duration || "0:00"}</span>
              </div>
            </div>

            <label className="flex items-center justify-center px-4 py-2 bg-sl-blue/20 border border-sl-blue/30 text-sl-blue rounded-lg cursor-pointer hover:bg-sl-blue/30 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Upload Music
              <input
                type="file"
                multiple
                accept="audio/*"
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>
          </CardContent>
        </Card>

        {/* Playlist */}
        <Card className="sl-card">
          <CardHeader>
            <CardTitle className="text-white">Playlist</CardTitle>
            <CardDescription>Solo Leveling Soundtrack Collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {allTracks.map((track, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    index === currentTrack
                      ? 'border-sl-blue bg-sl-blue/10'
                      : 'border-sl-grey-dark hover:border-sl-blue/50'
                  }`}
                  onClick={() => setCurrentTrack(index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{track.title}</p>
                      <p className="text-slate-400 text-sm">{track.artist}</p>
                    </div>
                    <div className="text-slate-400 text-sm">{track.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <audio ref={audioRef} />
    </div>
  );
};

export default MusicPage;
