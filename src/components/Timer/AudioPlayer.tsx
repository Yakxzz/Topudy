import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '../../store';

const TRACKS = [
  { id: 'lofi', name: 'Lofi Chill', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' },
  { id: 'rain', name: 'Soft Rain', url: 'https://cdn.pixabay.com/audio/2021/08/09/audio_4db4378f7e.mp3' },
  { id: 'cafe', name: 'Cafe Ambience', url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_16503df7a7.mp3' },
  { id: 'piano', name: 'Peaceful Piano', url: 'https://cdn.pixabay.com/audio/2022/11/20/audio_550b07f8ee.mp3' },
];

export const AudioPlayer = () => {
  const { audioPlaying, audioTrack, audioVolume, setAudioState } = useAppStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const currentTrackUrl = TRACKS.find(t => t.id === audioTrack)?.url || TRACKS[0].url;

  useEffect(() => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioPlaying, audioTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : audioVolume;
    }
  }, [audioVolume, isMuted]);

  const togglePlay = () => setAudioState(!audioPlaying);

  return (
    <>
      <audio ref={audioRef} src={currentTrackUrl} loop />
      
      <div className="fixed bottom-32 right-8 z-40">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-16 right-0 glass-panel p-4 rounded-2xl shadow-xl w-64 border border-[var(--border)]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Focus Tunes</h3>
                <button onClick={togglePlay} className="text-[var(--accent)] hover:scale-110 transition-transform">
                  {audioPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
              </div>

              <div className="space-y-2 mb-4">
                {TRACKS.map(track => (
                  <button
                    key={track.id}
                    onClick={() => {
                      setAudioState(true, track.id);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex justify-between items-center ${
                      audioTrack === track.id 
                        ? 'bg-[var(--accent)] text-white font-medium shadow-md' 
                        : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <span>{track.name}</span>
                    {audioTrack === track.id && audioPlaying && (
                      <motion.div
                        animate={{ height: [4, 12, 4] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-1 bg-white rounded-full ml-2"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setIsMuted(!isMuted)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  {isMuted || audioVolume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={isMuted ? 0 : audioVolume}
                  onChange={(e) => {
                    setIsMuted(false);
                    setAudioState(audioPlaying, audioTrack, parseFloat(e.target.value));
                  }}
                  className="w-full h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`glass-panel p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center ${
            audioPlaying ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
          }`}
        >
          <Music size={24} />
          {audioPlaying && (
            <motion.span 
              className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--accent)] rounded-full border-2 border-[var(--bg-primary)]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </button>
      </div>
    </>
  );
};
