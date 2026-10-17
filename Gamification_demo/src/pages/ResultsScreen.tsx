import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBigFiveStore } from '../psychology/BigFiveEngine';
import { useCyberRiskStore } from '../cyber/CyberRiskEngine';
import { useQuestStore } from '../quests/QuestManager';
import { useGamePhaseStore } from '../store/GamePhaseStore';
import { useInventoryStore } from '../store/InventoryStore';
import { useAvatarStore } from '../characters/AvatarStore';
import telemetryService from '../analytics/TelemetryService';
import audioManager from '../audio/AudioManager';
import RadarChart from '../components/ui/RadarChart';

// ─── Neon bar component ────────────────────────────────────────────────────────
interface NeonBarProps {
  label: string;
  sublabel: string;
  value: number;     // 0-100 for risk, 1-5 for Big5
  maxValue: number;
  color: string;
  delay: number;
  isRisk?: boolean;
}

const NeonBar: React.FC<NeonBarProps> = ({ label, sublabel, value, maxValue, color, delay, isRisk }) => {
  const pct = (value / maxValue) * 100;
  const riskLevel = isRisk
    ? value >= 70 ? 'HIGH' : value >= 40 ? 'MED' : 'LOW'
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col gap-1"
    >
      <div className="flex justify-between items-end text-xs font-bold uppercase tracking-wide">
        <div>
          <span className="text-slate-200">{label}</span>
          <span className="ml-2 text-[10px] text-slate-500 normal-case font-normal">{sublabel}</span>
        </div>
        <div className="flex items-center gap-2">
          {riskLevel && (
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
              riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400' :
              riskLevel === 'MED'  ? 'bg-amber-500/20 text-amber-400' :
                                     'bg-emerald-500/20 text-emerald-400'
            }`}>{riskLevel}</span>
          )}
          <span style={{ color }}>{isRisk ? `${value.toFixed(1)}%` : `${value.toFixed(2)} / 5`}</span>
        </div>
      </div>
      <div className="w-full h-2.5 bg-slate-800/70 rounded-full overflow-hidden border border-slate-700/40">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.1, duration: 1.0, ease: 'easeOut' }}
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}66` }}
          className="h-full rounded-full"
        />
      </div>
    </motion.div>
  );
};

// ─── Main Results Screen ───────────────────────────────────────────────────────
export const ResultsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { traits } = useBigFiveStore();
  const { profile } = useCyberRiskStore();
  const resetPhase = useGamePhaseStore((s) => s.resetPhase);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!hasPlayed.current) {
      hasPlayed.current = true;
      audioManager.stopAll();
      // Short celebratory chime
      setTimeout(() => audioManager.playSFX('quest_complete'), 400);
    }
  }, []);

  const playerName = telemetryService.getPlayerName();
  const sessionSeconds = telemetryService.getSessionDuration();
  const durationMin = Math.floor(sessionSeconds / 60);
  const durationSec = sessionSeconds % 60;

  // Derive a personality archetype from Big Five scores
  const getArchetype = () => {
    const { conscientiousness, agreeableness, openness } = traits;
    if (conscientiousness >= 3.8) return { title: 'Security Champion', icon: '🛡️', desc: 'You follow protocols rigorously and prioritise security at every step.' };
    if (agreeableness >= 3.8 && conscientiousness < 3.0) return { title: 'Social Engineer Target', icon: '⚠️', desc: 'Your cooperative nature may make you vulnerable to social engineering attacks.' };
    if (openness >= 3.8) return { title: 'Curious Explorer', icon: '🔭', desc: 'You explore new ideas freely — balance curiosity with caution online.' };
    return { title: 'Balanced Analyst', icon: '⚖️', desc: 'You show a balanced profile across security dimensions.' };
  };

  // Overall cyber risk score (average)
  const overallRisk = (
    (profile.phishingSusceptibility + profile.passwordHygiene + profile.socialEngineeringRisk +
     profile.deviceSecurityRisk + profile.softwareSafetyRisk) / 5
  );
  const riskGrade = overallRisk >= 70 ? 'D' : overallRisk >= 55 ? 'C' : overallRisk >= 40 ? 'B' : 'A';
  const gradeColor = riskGrade === 'A' ? '#22c55e' : riskGrade === 'B' ? '#f59e0b' : riskGrade === 'C' ? '#f97316' : '#ef4444';

  const archetype = getArchetype();

  const bigFiveItems = [
    { key: 'openness'          as const, label: 'Openness',           sub: 'Curiosity & imagination',           color: '#a78bfa' },
    { key: 'conscientiousness' as const, label: 'Conscientiousness',  sub: 'Rule adherence & diligence',        color: '#00f0ff' },
    { key: 'extraversion'      as const, label: 'Extraversion',       sub: 'Outward engagement',                color: '#f59e0b' },
    { key: 'agreeableness'     as const, label: 'Agreeableness',      sub: 'Cooperativeness & trust',           color: '#34d399' },
    { key: 'neuroticism'       as const, label: 'Neuroticism',        sub: 'Stress & compliance under pressure', color: '#f87171' },
  ];

  const cyberItems = [
    { key: 'phishingSusceptibility'  as const, label: 'Phishing Susceptibility',     sub: 'Untrusted links & emails',          color: '#f43f5e' },
    { key: 'passwordHygiene'         as const, label: 'Password Hygiene',             sub: 'Credential strength',               color: '#fb923c' },
    { key: 'socialEngineeringRisk'   as const, label: 'Social Engineering Risk',     sub: 'Credential sharing & tailgating',   color: '#facc15' },
    { key: 'deviceSecurityRisk'      as const, label: 'Device Security Risk',        sub: 'Unknown USB / lock-screen habits',  color: '#a78bfa' },
    { key: 'softwareSafetyRisk'      as const, label: 'Shadow IT Risk',              sub: 'Unapproved software installs',      color: '#38bdf8' },
  ];

  const bigFiveRadarData = [
    { label: 'Openness', value: traits.openness },
    { label: 'Conscientious.', value: traits.conscientiousness },
    { label: 'Extraversion', value: traits.extraversion },
    { label: 'Agreeable.', value: traits.agreeableness },
    { label: 'Neuroticism', value: traits.neuroticism },
  ];

  const cyberRadarData = [
    { label: 'Phishing', value: profile.phishingSusceptibility },
    { label: 'Password', value: profile.passwordHygiene },
    { label: 'Social Eng.', value: profile.socialEngineeringRisk },
    { label: 'Device Sec.', value: profile.deviceSecurityRisk },
    { label: 'Shadow IT', value: profile.softwareSafetyRisk },
  ];

  const handlePlayAgain = () => {
    audioManager.playSFX('button_click');
    telemetryService.resetSession();
    useQuestStore.getState().resetQuests();
    useInventoryStore.getState().resetInventory();
    useAvatarStore.setState({ isCustomized: false });
    resetPhase();
    navigate('/');
  };

  const handleReturnHome = () => {
    audioManager.playSFX('button_click');
    telemetryService.resetSession();
    useQuestStore.getState().resetQuests();
    useInventoryStore.getState().resetInventory();
    resetPhase();
    navigate('/');
  };

  return (
    <div className="relative w-screen min-h-screen bg-[#0a0718] text-white overflow-y-auto">
      {/* Background glow blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-cyan-900/15 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1a3a_1px,transparent_1px),linear-gradient(to_bottom,#1f1a3a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <p className="text-[#00f0ff] text-xs font-black uppercase tracking-[0.4em] mb-2">CyberQuest · Assessment Complete</p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight mb-2">
            Your <span className="text-[#ff00ff]" style={{ textShadow: '0 0 20px #ff00ff88' }}>Results</span>
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center text-xs md:text-sm text-slate-400 font-bold uppercase tracking-wide">
            <span className="text-[#00f0ff]">Player: {playerName}</span>
            <span className="text-slate-600">|</span>
            <span className="text-[#ff00ff]">Duration: {durationMin}m {durationSec}s</span>
          </div>
        </motion.div>

        {/* ── Archetype + Grade card ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Archetype */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
            className="bg-slate-900/60 border border-indigo-500/25 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-2 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Personality Archetype</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-4xl">{archetype.icon}</span>
              <div>
                <h2 className="text-xl font-black text-white">{archetype.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{archetype.desc}</p>
              </div>
            </div>
          </motion.div>

          {/* Cyber Risk Grade */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}
            className="bg-slate-900/60 border border-[#ff00ff]/20 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-2 shadow-[0_0_20px_rgba(255,0,255,0.08)]">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Overall Cyber Risk Grade</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-5xl font-black" style={{ color: gradeColor, textShadow: `0 0 20px ${gradeColor}88` }}>
                {riskGrade}
              </span>
              <div>
                <p className="text-sm font-bold text-white">{overallRisk.toFixed(1)}% average risk score</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {riskGrade === 'A' ? 'Excellent security awareness!' :
                   riskGrade === 'B' ? 'Good, with some areas to improve.' :
                   riskGrade === 'C' ? 'Moderate risk — review your choices.' :
                                       'High risk detected — training recommended.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Completion Message ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-5 text-center text-slate-300 text-sm leading-relaxed"
        >
          Congratulations! You have completed the CyberQuest Campus Assessment and Onboarding. Review your personality traits and cybersecurity risk posture above, and download your comprehensive telemetry workbook below.
        </motion.div>

        {/* ── Radar Charts Side-by-Side ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col items-center justify-center p-6 bg-slate-900/40 border border-[#00f0ff]/10 rounded-2xl"
          >
            <h3 className="text-xs font-black uppercase tracking-widest text-[#00f0ff] mb-4">Big Five Personality Map</h3>
            <RadarChart data={bigFiveRadarData} maxValue={5} color="#00f0ff" glowColor="cyan" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center p-6 bg-slate-900/40 border border-[#ff00ff]/10 rounded-2xl"
          >
            <h3 className="text-xs font-black uppercase tracking-widest text-[#ff00ff] mb-4">Cyber Risk Map</h3>
            <RadarChart data={cyberRadarData} maxValue={100} color="#ff00ff" glowColor="magenta" />
          </motion.div>
        </div>

        {/* ── Score panels ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Big Five Panel */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="bg-slate-900/50 border border-[#00f0ff]/15 rounded-2xl p-6 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#00f0ff] border-b border-[#00f0ff]/10 pb-2">Big Five Personality Details</h2>
            {bigFiveItems.map((t, i) => (
              <NeonBar key={t.key} label={t.label} sublabel={t.sub} value={traits[t.key]} maxValue={5} color={t.color} delay={0.5 + i * 0.08} />
            ))}
          </motion.div>

          {/* Cyber Risk Panel */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-slate-900/50 border border-[#ff00ff]/15 rounded-2xl p-6 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#ff00ff] border-b border-[#ff00ff]/10 pb-2">Cybersecurity Risk Details</h2>
            {cyberItems.map((r, i) => (
              <NeonBar key={r.key} label={r.label} sublabel={r.sub} value={profile[r.key]} maxValue={100} color={r.color} delay={0.55 + i * 0.08} isRisk />
            ))}
          </motion.div>
        </div>

        {/* ── Action buttons ───────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-2 pb-6">
          <button
            id="download-report-btn"
            onClick={() => { audioManager.playSFX('button_click'); telemetryService.triggerExcelDownload(); }}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest bg-gradient-to-r from-[#ff00ff] to-indigo-500 text-white shadow-[0_0_20px_rgba(255,0,255,0.4)] hover:shadow-[0_0_30px_rgba(255,0,255,0.6)] hover:scale-[1.02] transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            Download Excel Report
          </button>

          <button
            id="play-again-btn"
            onClick={handlePlayAgain}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]/70 hover:scale-[1.02] transition-all active:scale-[0.98] cursor-pointer"
          >
            Play Again
          </button>

          <button
            id="return-home-btn"
            onClick={handleReturnHome}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white hover:scale-[1.02] transition-all active:scale-[0.98] cursor-pointer"
          >
            Return Home
          </button>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-700 pb-4">
          CyberQuest · University Gamified Cyber Risk Assessment · Academic Capstone 2026
        </p>
      </div>
    </div>
  );
};

export default ResultsScreen;
