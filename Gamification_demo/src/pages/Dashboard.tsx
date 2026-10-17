import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassContainer from '../components/ui/GlassContainer';
import Button from '../components/ui/Button';
import { useBigFiveStore } from '../psychology/BigFiveEngine';
import { useCyberRiskStore } from '../cyber/CyberRiskEngine';
import telemetryService from '../analytics/TelemetryService';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { traits, history: psychHistory } = useBigFiveStore();
  const { profile, incidents: cyberHistory } = useCyberRiskStore();

  const handleExport = () => {
    telemetryService.triggerExcelDownload();
  };

  const traitLabels = [
    { key: 'openness' as const, name: 'Openness to Experience', desc: 'Curiosity, imagination, and interest in campus activities.' },
    { key: 'conscientiousness' as const, name: 'Conscientiousness', desc: 'Risk aversion, system validation, and attention to rules.' },
    { key: 'extraversion' as const, name: 'Extraversion', desc: 'Outward socialization and assertiveness with campus members.' },
    { key: 'agreeableness' as const, name: 'Agreeableness', desc: 'Trust, cooperativeness, and willingness to assist NPCs.' },
    { key: 'neuroticism' as const, name: 'Neuroticism (Reactivity)', desc: 'Stress response and compliance under social pressure.' },
  ];

  const riskLabels = [
    { key: 'phishingSusceptibility' as const, name: 'Phishing Susceptibility', desc: 'Tendency to interact with unknown or suspicious links.' },
    { key: 'passwordHygiene' as const, name: 'Password Hygiene', desc: 'Adherence to strong credential creation guidelines.' },
    { key: 'socialEngineeringRisk' as const, name: 'Social Engineering Vulnerability', desc: 'Risk of sharing account credentials with third parties.' },
    { key: 'deviceSecurityRisk' as const, name: 'Workstation Security Risk', desc: 'Leaving terminals logged in or using unsafe storage.' },
    { key: 'softwareSafetyRisk' as const, name: 'Shadow IT & Unsafe Software', desc: 'Willingness to bypass systems or install unapproved tools.' },
  ];

  return (
    <div className="w-screen h-screen bg-[#0a0718] text-white flex flex-col p-6 md:p-8 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#00f0ff]/20 pb-4 mb-6">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-[#00f0ff] uppercase tracking-wider glow-text-cyan">
            Aether Telemetry Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
            Secret Psycho-Cyber Behavior Tracker (Active)
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="neutral" onClick={() => navigate('/')} className="px-4 py-2 text-xs">
            Main Menu
          </Button>
          <Button variant="magenta" onClick={handleExport} className="px-4 py-2 text-xs">
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Big Five Panel */}
        <GlassContainer variant="cyan" className="p-5 md:p-6 bg-black/60">
          <h2 className="font-display font-extrabold text-xl text-[#00f0ff] uppercase mb-4 border-b border-[#00f0ff]/10 pb-2">
            Big Five Personality Profile
          </h2>
          <div className="space-y-4">
            {traitLabels.map((trait) => {
              const val = traits[trait.key];
              const pct = ((val - 1) / 4) * 100; // Map 1-5 scale to 0-100%
              return (
                <div key={trait.key} className="flex flex-col gap-1 text-left">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
                    <span className="text-slate-300">{trait.name}</span>
                    <span className="text-[#00f0ff]">{val.toFixed(2)} / 5.00</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-3 bg-slate-800/60 rounded-full overflow-hidden border border-slate-700/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-[#00f0ff] rounded-full shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 italic mt-0.5">{trait.desc}</span>
                </div>
              );
            })}
          </div>
        </GlassContainer>

        {/* Cyber Risk Panel */}
        <GlassContainer variant="magenta" className="p-5 md:p-6 bg-black/60">
          <h2 className="font-display font-extrabold text-xl text-[#ff00ff] uppercase mb-4 border-b border-[#ff00ff]/10 pb-2">
            Cybersecurity Risk Behavior
          </h2>
          <div className="space-y-4">
            {riskLabels.map((risk) => {
              const val = profile[risk.key];
              return (
                <div key={risk.key} className="flex flex-col gap-1 text-left">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
                    <span className="text-slate-300">{risk.name}</span>
                    <span className="text-[#ff00ff] glow-text-magenta">{val.toFixed(1)}% Risk</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-3 bg-slate-800/60 rounded-full overflow-hidden border border-slate-700/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#ff00ff] to-red-500 rounded-full shadow-[0_0_8px_rgba(255,0,255,0.4)]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 italic mt-0.5">{risk.desc}</span>
                </div>
              );
            })}
          </div>
        </GlassContainer>
      </div>

      {/* Incident History Audit Log */}
      <GlassContainer variant="neutral" className="p-5 md:p-6 bg-black/50 flex-grow min-h-[300px] flex flex-col">
        <h2 className="font-display font-extrabold text-xl text-slate-200 uppercase mb-4 border-b border-white/10 pb-2 text-left">
          Action Audit Logs
        </h2>
        <div className="flex-grow overflow-y-auto max-h-[400px] space-y-2 pr-2 text-left">
          {psychHistory.length === 0 && cyberHistory.length === 0 ? (
            <p className="text-slate-500 text-sm italic mt-8 text-center">
              No actions recorded yet. Play the game and interact with campus objects to log telemetry.
            </p>
          ) : (
            <div className="space-y-2.5 font-mono text-xs">
              {/* Combine and sort logs chronologically */}
              {[
                ...psychHistory.map((h) => ({ ...h, type: 'psychology' as const })),
                ...cyberHistory.map((c) => ({ ...c, type: 'cyber' as const })),
              ]
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((log, idx) => (
                  <div
                    key={`log-${idx}`}
                    className={`p-2.5 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                      log.type === 'psychology'
                        ? 'bg-indigo-950/20 border-indigo-900/30'
                        : 'bg-fuchsia-950/20 border-fuchsia-900/30'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">
                          [{new Date(log.timestamp).toLocaleTimeString()}]
                        </span>
                        <span
                          className={`font-black uppercase text-[10px] px-1.5 py-0.5 rounded ${
                            log.type === 'psychology'
                              ? 'bg-indigo-500/20 text-[#00f0ff]'
                              : 'bg-fuchsia-500/20 text-[#ff00ff]'
                          }`}
                        >
                          {log.type}
                        </span>
                        <span className="text-slate-300 font-bold">
                          {'actionId' in log ? log.actionId : log.incidentId}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">
                        {log.description}
                      </p>
                    </div>

                    {/* Stats affected detail */}
                    <div className="text-right text-[10px] md:text-xs">
                      {log.type === 'psychology' && 'adjustments' in log && (
                        <div className="flex gap-1.5 justify-end">
                          {Object.entries(log.adjustments).map(([k, v]) => (
                            <span key={k} className="text-slate-400">
                              {k.slice(0, 3).toUpperCase()}: <b className={v! > 0 ? 'text-[#39ff14]' : 'text-red-400'}>{v! > 0 ? `+${v}` : v}</b>
                            </span>
                          ))}
                        </div>
                      )}
                      {log.type === 'cyber' && 'riskDelta' in log && (
                        <span>
                          RISK DELTA:{' '}
                          <b className={log.riskDelta > 0 ? 'text-red-400' : 'text-[#39ff14]'}>
                            {log.riskDelta > 0 ? `+${log.riskDelta}` : log.riskDelta}
                          </b>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </GlassContainer>
    </div>
  );
};

export default Dashboard;
