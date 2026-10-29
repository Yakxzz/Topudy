import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store';
import { sounds } from '../../utils/soundEffects';

const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Gentle Rain', desc: 'Pink noise & rain drops', icon: '🌧️' },
  { id: 'focus', name: 'Binaural Focus', desc: 'Alpha wave 432Hz hum', icon: '🧘' },
  { id: 'cafe', name: 'Warm Cafe', desc: 'Soft espresso study hum', icon: '☕' },
  { id: 'lofi', name: 'Lofi Chords', desc: 'Gentle synth warm tones', icon: '🎵' },
];

export const AudioPlayer = () => {
  const { audioPlaying, audioTrack, audioVolume, setAudioState } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioPlaying) {
      sounds.startAmbient(audioTrack, isMuted ? 0 : audioVolume);
    } else {
      sounds.stopAmbient();
    }
    return () => {
      // Don't stop on unmount if playing across tabs
    };
  }, [audioPlaying, audioTrack]);

  useEffect(() => {
    sounds.setAmbientVolume(isMuted ? 0 : audioVolume);
  }, [audioVolume, isMuted]);

  const togglePlay = () => {
    const nextState = !audioPlaying;
    setAudioState({ audioPlaying: nextState });
    if (nextState) {
      sounds.startAmbient(audioTrack, isMuted ? 0 : audioVolume);
    } else {
      sounds.stopAmbient();
    }
  };

  const handleSelectTrack = (trackId: string) => {
    setAudioState({ audioTrack: trackId, audioPlaying: true });
    sounds.startAmbient(trackId, isMuted ? 0 : audioVolume);
  };

  return (
    <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 glass-panel p-5 rounded-3xl shadow-2xl w-72 border border-[var(--border)]"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[var(--accent)]" />
                <h3 className="text-sm font-serif font-bold text-[var(--text-primary)]">Focus Ambience</h3>
              </div>
              <button 
                onClick={togglePlay} 
                className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md"
                title={audioPlaying ? 'Pause sound' : 'Play sound'}
              >
                {audioPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {AMBIENT_SOUNDS.map(sound => (
                <button
                  key={sound.id}
                  onClick={() => handleSelectTrack(sound.id)}
                  className={`w-full text-left p-2.5 rounded-2xl text-xs transition-all flex items-center justify-between ${
                    audioTrack === sound.id && audioPlaying
                      ? 'bg-[var(--accent)] text-white font-medium shadow-md' 
                      : audioTrack === sound.id
                      ? 'bg-[var(--bg-secondary)] border border-[var(--accent)] text-[var(--text-primary)] font-semibold'
                      : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{sound.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{sound.name}</span>
                      <span className={`text-[10px] ${audioTrack === sound.id && audioPlaying ? 'text-white/80' : 'text-[var(--text-secondary)] opacity-70'}`}>
                        {sound.desc}
                      </span>
                    </div>
                  </div>
                  {audioTrack === sound.id && audioPlaying && (
                    <div className="flex items-end gap-0.5 h-3">
                      <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-white rounded-full" />
                      <motion.span animate={{ height: [8, 4, 12] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-white rounded-full" />
                      <motion.span animate={{ height: [4, 10, 6] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
              >
                {isMuted || audioVolume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={isMuted ? 0 : audioVolume}
                onChange={(e) => {
                  setIsMuted(false);
                  setAudioState({ audioVolume: parseFloat(e.target.value) });
                }}
                className="w-full h-1.5 bg-[var(--border)] rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`glass-panel p-3.5 sm:p-4 rounded-full shadow-xl transition-all hover:scale-105 flex items-center justify-center border border-[var(--border)] ${
          audioPlaying ? 'text-[var(--accent)] ring-2 ring-[var(--accent)]/40 shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
        title="Ambient Study Sounds"
      >
        <Headphones size={20} className={audioPlaying ? 'animate-pulse' : ''} />
        {audioPlaying && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[var(--accent)] rounded-full border-2 border-[var(--bg-primary)] flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
          </span>
        )}
      </button>
    </div>
  );
};
