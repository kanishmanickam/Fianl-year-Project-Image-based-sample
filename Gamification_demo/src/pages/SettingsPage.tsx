import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassContainer from '../components/ui/GlassContainer';
import Button from '../components/ui/Button';
import audioManager from '../audio/AudioManager';
import type { AudioCategory } from '../audio/AudioManager';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  // Local state to bind audio sliders
  const [masterVol, setMasterVol] = useState(0.8);
  const [musicVol, setMusicVol] = useState(0.5);
  const [sfxVol, setSfxVol] = useState(0.7);
  const [dialogueSpeed, setDialogueSpeed] = useState(1);

  // Graphics configurations state
  const [graphicsQuality, setGraphicsQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [bloomEnabled, setBloomEnabled] = useState(true);
  const [aaEnabled, setAaEnabled] = useState(true);

  useEffect(() => {
    // Load current volume levels from audioManager
    setMasterVol(audioManager.getVolume('master'));
    setMusicVol(audioManager.getVolume('music'));
    setSfxVol(audioManager.getVolume('sfx'));

    const savedSettings = localStorage.getItem('cyberquest_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setDialogueSpeed(parsed.dialogueSpeed ?? 1);
      setGraphicsQuality(parsed.graphicsQuality ?? 'high');
      setBloomEnabled(parsed.bloomEnabled ?? true);
      setAaEnabled(parsed.aaEnabled ?? true);
    }
  }, []);

  const handleVolumeChange = (category: AudioCategory, val: number) => {
    if (category === 'master') setMasterVol(val);
    if (category === 'music') setMusicVol(val);
    if (category === 'sfx') setSfxVol(val);
    audioManager.setVolume(category, val);
  };

  const handleSave = () => {
    const settings = {
      masterVolume: masterVol,
      musicVolume: musicVol,
      sfxVolume: sfxVol,
      dialogueSpeed,
      graphicsQuality,
      bloomEnabled,
      aaEnabled,
    };
    localStorage.setItem('cyberquest_settings', JSON.stringify(settings));
    audioManager.playSFX('button_click');
    navigate('/');
  };

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-[#0a0718] overflow-hidden select-none font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1a3a_1px,transparent_1px),linear-gradient(to_bottom,#1f1a3a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-2xl px-4 py-8 max-h-[95vh] overflow-y-auto"
      >
        <GlassContainer variant="cyan" className="p-6 md:p-8 bg-black/85 border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <h2 className="font-display font-black text-2xl md:text-3xl text-[#00f0ff] uppercase tracking-wide glow-text-cyan border-b border-[#00f0ff]/20 pb-3 mb-6 text-center">
            System Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
            {/* LEFT COLUMN: AUDIO SETTINGS */}
            <div className="space-y-5 border-b md:border-b-0 md:border-r border-slate-800/80 pb-5 md:pb-0 md:pr-6">
              <span className="text-[10px] text-[#00f0ff] font-bold tracking-widest block uppercase mb-1">AUDIO TRANSCEIVERS</span>

              {/* Master Volume */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Master Volume</span>
                  <span className="text-[#00f0ff]">{Math.round(masterVol * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={masterVol}
                  onChange={(e) => handleVolumeChange('master', parseFloat(e.target.value))}
                  onMouseUp={() => audioManager.playSFX('button_click')}
                  className="w-full h-1.5 bg-[#1e1145] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                />
              </div>

              {/* Music Volume */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Music Volume</span>
                  <span className="text-[#00f0ff]">{Math.round(musicVol * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVol}
                  onChange={(e) => handleVolumeChange('music', parseFloat(e.target.value))}
                  onMouseUp={() => audioManager.playSFX('button_click')}
                  className="w-full h-1.5 bg-[#1e1145] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                />
              </div>

              {/* SFX Volume */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Sound Effects</span>
                  <span className="text-[#00f0ff]">{Math.round(sfxVol * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVol}
                  onChange={(e) => handleVolumeChange('sfx', parseFloat(e.target.value))}
                  onMouseUp={() => audioManager.playSFX('button_click')}
                  className="w-full h-1.5 bg-[#1e1145] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                />
              </div>

              {/* Dialogue Speed */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Dialogue Speed</span>
                  <span className="text-[#ff00ff] glow-text-magenta">
                    {dialogueSpeed === 2 ? 'Fast' : dialogueSpeed === 0 ? 'Instant' : 'Normal'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Normal', val: 1 },
                    { label: 'Fast', val: 2 },
                    { label: 'Instant', val: 0 },
                  ].map((speed) => (
                    <button
                      key={speed.val}
                      onClick={() => {
                        setDialogueSpeed(speed.val);
                        audioManager.playSFX('button_click');
                      }}
                      className={`text-[10px] py-1.5 px-2 rounded-lg border font-bold uppercase transition-all duration-200 cursor-pointer ${
                        dialogueSpeed === speed.val
                          ? 'bg-[#ff00ff]/20 border-[#ff00ff] text-[#ff00ff]'
                          : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: GRAPHICS & ACCESSIBILITY */}
            <div className="space-y-5">
              <span className="text-[10px] text-[#ff00ff] font-bold tracking-widest block uppercase mb-1">GRAPHICAL RESOLUTION</span>

              {/* Graphics Quality */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Renderer Quality</span>
                  <span className="text-[#ff00ff] uppercase">{graphicsQuality}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setGraphicsQuality(q);
                        audioManager.playSFX('button_click');
                      }}
                      className={`text-[10px] py-1.5 px-2 rounded-lg border font-bold uppercase transition-all duration-200 cursor-pointer ${
                        graphicsQuality === q
                          ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]'
                          : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bloom Post Processing toggle */}
              <div className="flex justify-between items-center bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block">Neon Bloom Glow</span>
                  <span className="text-[9px] text-slate-500 font-medium mt-0.5 block">Simulates futuristic energy lighting</span>
                </div>
                <input
                  type="checkbox"
                  checked={bloomEnabled}
                  onChange={(e) => {
                    setBloomEnabled(e.target.checked);
                    audioManager.playSFX('click');
                  }}
                  className="w-5 h-5 accent-[#00f0ff] cursor-pointer"
                />
              </div>

              {/* Anti Aliasing toggle */}
              <div className="flex justify-between items-center bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block">Anti-Aliasing (AA)</span>
                  <span className="text-[9px] text-slate-500 font-medium mt-0.5 block">Smooths jagged edges on 3D meshes</span>
                </div>
                <input
                  type="checkbox"
                  checked={aaEnabled}
                  onChange={(e) => {
                    setAaEnabled(e.target.checked);
                    audioManager.playSFX('click');
                  }}
                  className="w-5 h-5 accent-[#00f0ff] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#00f0ff]/10 pt-4">
            <Button variant="neutral" onClick={() => navigate('/')} className="px-4 py-2 text-xs">
              Cancel
            </Button>
            <Button variant="cyan" onClick={handleSave} className="px-5 py-2 text-xs">
              Apply Settings
            </Button>
          </div>
        </GlassContainer>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
