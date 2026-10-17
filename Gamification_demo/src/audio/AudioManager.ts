import { Howl } from 'howler';

export type AudioCategory = 'master' | 'music' | 'ambient' | 'sfx' | 'ui';

class AudioManager {
  private musicTracks: Record<string, Howl> = {};
  private ambientTracks: Record<string, Howl> = {};
  private sfxTracks: Record<string, Howl> = {};

  private currentMusic: string | null = null;
  private currentAmbient: string | null = null;

  // Volume settings (0.0 to 1.0)
  private volumes: Record<AudioCategory, number> = {
    master: 0.8,
    music: 0.5,
    ambient: 0.6,
    sfx: 0.7,
    ui: 0.6,
  };

  // Web Audio Context for Synth Fallback
  private audioCtx: AudioContext | null = null;
  private reverbNode: ConvolverNode | null = null;
  private isReverbActive = false;

  constructor() {
    this.loadSettings();
    this.initAudioContext();
  }

  private initAudioContext() {
    if (typeof window !== 'undefined') {
      const initContext = () => {
        try {
          this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          window.removeEventListener('click', initContext);
          window.removeEventListener('keydown', initContext);
        } catch (e) {
          console.warn('Web Audio API not supported', e);
        }
      };
      window.addEventListener('click', initContext);
      window.addEventListener('keydown', initContext);
    }
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem('cyberquest_audio_settings');
      if (saved) {
        this.volumes = { ...this.volumes, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore
    }
  }

  public saveSettings() {
    try {
      localStorage.setItem('cyberquest_audio_settings', JSON.stringify(this.volumes));
    } catch {
      // Ignore
    }
  }

  public setVolume(category: AudioCategory, value: number) {
    this.volumes[category] = Math.max(0.0, Math.min(1.0, value));
    this.saveSettings();

    // Update active BGM volume
    if (category === 'master' || category === 'music') {
      if (this.currentMusic && this.musicTracks[this.currentMusic]) {
        this.musicTracks[this.currentMusic].volume(this.volumes.music * this.volumes.master);
      }
    }
    // Update active Ambient volume
    if (category === 'master' || category === 'ambient') {
      if (this.currentAmbient && this.ambientTracks[this.currentAmbient]) {
        this.ambientTracks[this.currentAmbient].volume(this.volumes.ambient * this.volumes.master);
      }
    }
  }

  public getVolume(category: AudioCategory): number {
    return this.volumes[category];
  }

  public setReverbActive(active: boolean) {
    this.isReverbActive = active;
    if (active && !this.reverbNode && this.audioCtx) {
      try {
        const rate = this.audioCtx.sampleRate;
        const seconds = 1.6;
        const len = rate * seconds;
        const impulse = this.audioCtx.createBuffer(2, len, rate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);

        for (let i = 0; i < len; i++) {
          const decay = Math.exp(-i / (rate * 0.38));
          left[i] = (Math.random() * 2 - 1) * decay;
          right[i] = (Math.random() * 2 - 1) * decay;
        }

        this.reverbNode = this.audioCtx.createConvolver();
        this.reverbNode.buffer = impulse;
        this.reverbNode.connect(this.audioCtx.destination);
      } catch (e) {
        console.warn('Failed to construct convolver reverb', e);
      }
    }
  }

  // Web Audio API Synthesizer Fallbacks
  private playSynthSound(type: string) {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.connect(gain);
    if (this.isReverbActive && this.reverbNode) {
      gain.connect(this.reverbNode);
    } else {
      gain.connect(this.audioCtx.destination);
    }

    const now = this.audioCtx.currentTime;
    const vol = this.volumes.sfx * this.volumes.master;

    if (type === 'button_click' || type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(vol * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'button_hover' || type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      gain.gain.setValueAtTime(vol * 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'dialogue_click' || type === 'blip') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, now);
      gain.gain.setValueAtTime(vol * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'typing') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800 + Math.random() * 400, now);
      gain.gain.setValueAtTime(vol * 0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.015);
      osc.start(now);
      osc.stop(now + 0.015);
    } else if (type === 'quest_accept') {
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, idx) => {
        const noteOsc = this.audioCtx!.createOscillator();
        const noteGain = this.audioCtx!.createGain();
        noteOsc.connect(noteGain);
        noteGain.connect(this.audioCtx!.destination);
        noteOsc.type = 'sine';
        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.06);
        noteGain.gain.setValueAtTime(vol * 0.15, now + idx * 0.06);
        noteGain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.06 + 0.12);
        noteOsc.start(now + idx * 0.06);
        noteOsc.stop(now + idx * 0.06 + 0.12);
      });
    } else if (type === 'quest_complete') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const noteOsc = this.audioCtx!.createOscillator();
        const noteGain = this.audioCtx!.createGain();
        noteOsc.connect(noteGain);
        noteGain.connect(this.audioCtx!.destination);
        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.05);
        noteGain.gain.setValueAtTime(vol * 0.2, now + idx * 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.05 + 0.3);
        noteOsc.start(now + idx * 0.05);
        noteOsc.stop(now + idx * 0.05 + 0.3);
      });
    } else if (type === 'door_open') {
      // Ascending filter noise mock
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(250, now + 0.3);
      gain.gain.setValueAtTime(vol * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type.startsWith('footstep_')) {
      const surface = type.split('_')[1] || 'grass';
      osc.type = 'sine';
      if (surface === 'grass') {
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.05);
        gain.gain.setValueAtTime(vol * 0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (surface === 'stone') {
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
        gain.gain.setValueAtTime(vol * 0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (surface === 'wood') {
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);
        gain.gain.setValueAtTime(vol * 0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (surface === 'tile') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.035);
        gain.gain.setValueAtTime(vol * 0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.035);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (surface === 'metal') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
        gain.gain.setValueAtTime(vol * 0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        // Add a secondary resonance
        const res = this.audioCtx!.createOscillator();
        const resGain = this.audioCtx!.createGain();
        res.connect(resGain);
        if (this.isReverbActive && this.reverbNode) {
          resGain.connect(this.reverbNode);
        } else {
          resGain.connect(this.audioCtx!.destination);
        }
        res.frequency.setValueAtTime(1200, now);
        res.frequency.exponentialRampToValueAtTime(600, now + 0.06);
        resGain.gain.setValueAtTime(vol * 0.03, now);
        resGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        res.start(now);
        res.stop(now + 0.06);

        osc.start(now);
        osc.stop(now + 0.08);
      } else if (surface === 'water') {
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(650, now + 0.08);
        gain.gain.setValueAtTime(vol * 0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    }
  }

  public playSFX(sfxName: string) {
    if (this.sfxTracks[sfxName]) {
      this.sfxTracks[sfxName].play();
    } else {
      this.playSynthSound(sfxName);
    }
  }

  // Crossfade Background Music Tracks
  public playMusic(musicName: string, fadeDurationMs = 1500) {
    if (this.currentMusic === musicName) return;

    const oldMusic = this.currentMusic;
    this.currentMusic = musicName;

    console.log(`[Music Crossfade] ${oldMusic || 'None'} -> ${musicName}`);

    // Fade Out old track
    if (oldMusic && this.musicTracks[oldMusic]) {
      const prevTrack = this.musicTracks[oldMusic];
      prevTrack.fade(prevTrack.volume(), 0, fadeDurationMs);
      setTimeout(() => {
        if (this.currentMusic !== oldMusic) {
          prevTrack.stop();
        }
      }, fadeDurationMs);
    }

    // Fade In new track
    if (this.musicTracks[musicName]) {
      const nextTrack = this.musicTracks[musicName];
      nextTrack.volume(0);
      nextTrack.play();
      nextTrack.fade(0, this.volumes.music * this.volumes.master, fadeDurationMs);
    }
  }

  // Crossfade Ambient Tracks
  public playAmbient(ambientName: string, fadeDurationMs = 1500) {
    if (this.currentAmbient === ambientName) return;

    const oldAmbient = this.currentAmbient;
    this.currentAmbient = ambientName;

    console.log(`[Ambient Crossfade] ${oldAmbient || 'None'} -> ${ambientName}`);

    // Fade Out old ambient
    if (oldAmbient && this.ambientTracks[oldAmbient]) {
      const prevTrack = this.ambientTracks[oldAmbient];
      prevTrack.fade(prevTrack.volume(), 0, fadeDurationMs);
      setTimeout(() => {
        if (this.currentAmbient !== oldAmbient) {
          prevTrack.stop();
        }
      }, fadeDurationMs);
    }

    // Fade In new ambient
    if (this.ambientTracks[ambientName]) {
      const nextTrack = this.ambientTracks[ambientName];
      nextTrack.volume(0);
      nextTrack.play();
      nextTrack.fade(0, this.volumes.ambient * this.volumes.master, fadeDurationMs);
    }
  }

  public fadeOut(fadeDurationMs = 1500) {
    if (this.currentMusic && this.musicTracks[this.currentMusic]) {
      const track = this.musicTracks[this.currentMusic];
      track.fade(track.volume(), 0, fadeDurationMs);
      setTimeout(() => {
        track.stop();
      }, fadeDurationMs);
    }
    if (this.currentAmbient && this.ambientTracks[this.currentAmbient]) {
      const track = this.ambientTracks[this.currentAmbient];
      track.fade(track.volume(), 0, fadeDurationMs);
      setTimeout(() => {
        track.stop();
      }, fadeDurationMs);
    }
    this.currentMusic = null;
    this.currentAmbient = null;
  }

  public stopAll() {
    if (this.currentMusic && this.musicTracks[this.currentMusic]) {
      this.musicTracks[this.currentMusic].stop();
    }
    if (this.currentAmbient && this.ambientTracks[this.currentAmbient]) {
      this.ambientTracks[this.currentAmbient].stop();
    }
    this.currentMusic = null;
    this.currentAmbient = null;
  }
}

export const audioManager = new AudioManager();
export default audioManager;
