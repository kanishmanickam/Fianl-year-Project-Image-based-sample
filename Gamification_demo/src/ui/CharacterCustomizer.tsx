import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAvatarStore } from '../characters/AvatarStore';
import telemetryService from '../analytics/TelemetryService';
import audioManager from '../audio/AudioManager';

const SKIN_TONES = ['#fbcfe8', '#fed7aa', '#fde047', '#ca8a04', '#78350f', '#451a03'];
const HAIR_COLORS = ['#1e293b', '#eab308', '#c2410c', '#ec4899', '#3b82f6', '#10b981'];
const EYE_COLORS = ['#3b82f6', '#78350f', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'];
const CLOTHING_COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

export const CharacterCustomizer: React.FC = () => {
  const avatar = useAvatarStore();
  const [nameInput, setNameInput] = useState('Campus_Candidate_01');

  const handleSelect = (sfx = 'click') => {
    audioManager.playSFX(sfx);
  };

  if (avatar.isCustomized) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-md p-8 md:p-16">
      {/* Visual Title Header */}
      <div className="absolute left-8 top-8 md:left-16 md:top-16 text-white max-w-sm pointer-events-none">
        <span className="text-xs tracking-widest text-[#00f0ff] font-bold uppercase">AETHER ACADEMY REGISTRATION</span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
          CREATE YOUR<br />AVATAR
        </h1>
        <p className="text-slate-400 text-sm mt-4 leading-relaxed">
          Customize your credentials. Every student registry requires authentication parameters. Live adjustments are updated in the background viewport.
        </p>
      </div>

      {/* Main Glass Panel */}
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        className="w-full max-w-md bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between max-h-[85vh] overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Section: Student Name */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">STUDENT REGISTRY NAME</h3>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value.replace(/[^a-zA-Z0-9_ ]/g, '').slice(0, 24))}
              className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all font-mono"
              placeholder="Enter name..."
            />
          </div>

          {/* Section: Identity */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">IDENTITY</h3>
            <div className="grid grid-cols-2 gap-3">
              {(['male', 'female'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => {
                    avatar.setAvatar({ gender });
                    handleSelect();
                  }}
                  className={`py-2.5 rounded-lg border text-sm font-semibold tracking-wide capitalize transition-all duration-300 ${
                    avatar.gender === gender
                      ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-white shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Skin Tone */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">SKIN TONE</h3>
            <div className="flex gap-2.5 flex-wrap">
              {SKIN_TONES.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    avatar.setAvatar({ skinColor: color });
                    handleSelect('menu_select');
                  }}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform duration-250 ${
                    avatar.skinColor === color
                      ? 'border-white scale-120 ring-2 ring-[#00f0ff]'
                      : 'border-slate-800 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Section: Hairstyle */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">HAIRSTYLE</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['spiky', 'long', 'bun', 'bald'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => {
                    avatar.setAvatar({ hairStyle: style });
                    handleSelect();
                  }}
                  className={`py-2 rounded-lg border text-xs font-medium capitalize transition-all duration-300 ${
                    avatar.hairStyle === style
                      ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/80'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Hair Color */}
          {avatar.hairStyle !== 'bald' && (
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">HAIR COLOR</h3>
              <div className="flex gap-2.5 flex-wrap">
                {HAIR_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      avatar.setAvatar({ hairColor: color });
                      handleSelect('menu_select');
                    }}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform duration-250 ${
                      avatar.hairColor === color
                        ? 'border-white scale-120 ring-2 ring-[#00f0ff]'
                        : 'border-slate-800 hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section: Eye Color */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">EYE COLOR</h3>
            <div className="flex gap-2.5 flex-wrap">
              {EYE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    avatar.setAvatar({ eyeColor: color });
                    handleSelect('menu_select');
                  }}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform duration-250 ${
                    avatar.eyeColor === color
                      ? 'border-white scale-120 ring-2 ring-[#00f0ff]'
                      : 'border-slate-800 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Section: Clothing Color */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">HOODIE COLOR</h3>
            <div className="flex gap-2.5 flex-wrap">
              {CLOTHING_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    avatar.setAvatar({ clothingColor: color });
                    handleSelect('menu_select');
                  }}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform duration-250 ${
                    avatar.clothingColor === color
                      ? 'border-white scale-120 ring-2 ring-purple-500'
                      : 'border-slate-800 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Section: Backpack Selection */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">BACKPACK</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['none', 'classic', 'cyberpack'] as const).map((bp) => (
                <button
                  key={bp}
                  onClick={() => {
                    avatar.setAvatar({ backpack: bp });
                    handleSelect();
                  }}
                  className={`py-2 rounded-lg border text-[11px] font-medium capitalize transition-all duration-300 ${
                    avatar.backpack === bp
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/80'
                  }`}
                >
                  {bp === 'none' ? 'None' : bp === 'classic' ? 'Standard' : 'Cyberpack'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Register Button */}
        <div className="mt-8 border-t border-slate-800 pt-6">
          <button
            onClick={() => {
              const finalName = nameInput.trim() || 'Campus_Candidate_01';
              telemetryService.setPlayerName(finalName);
              avatar.completeCustomization();
              audioManager.playSFX('quest_complete');
            }}
            className="w-full py-4 bg-gradient-to-r from-[#00f0ff] to-purple-600 hover:from-[#00f0ff] hover:to-purple-500 text-white rounded-xl font-bold tracking-widest text-sm shadow-[0_4px_20px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            AUTHORIZE & BEGIN JOURNEY
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CharacterCustomizer;
