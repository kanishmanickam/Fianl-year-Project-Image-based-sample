import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import audioManager from '../audio/AudioManager';
import { CAMPUS_COORDS } from '../characters/NPCDatabase';

interface WorldMapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorldMapOverlay: React.FC<WorldMapOverlayProps> = ({ isOpen, onClose }) => {
  const [playerPos, setPlayerPos] = useState<{ x: number; z: number }>({ x: 0, z: 10 });
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  // Poll player mesh coordinates in the background for real-time tracking
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const mesh = (window as any).playerMesh;
      if (mesh) {
        setPlayerPos({ x: mesh.position.x, z: mesh.position.z });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClose = () => {
    audioManager.playSFX('click');
    onClose();
  };

  // Convert 3D coordinates (X, Z) to SVG coordinate space
  // Map dimensions: 600x600. Center [0, 0] at [300, 300].
  // Campus is ~120m bounds in our procedural representation. Scale factor = 6.0
  const mapCoords = (x: number, z: number) => {
    const scale = 6.2;
    const svgX = 300 + x * scale;
    const svgY = 300 + z * scale; // Map Z coordinate to SVG vertical Y
    return { x: svgX, y: svgY };
  };

  const pSvg = mapCoords(playerPos.x, playerPos.z);

  const buildings = [
    { name: 'Central Plaza', coords: CAMPUS_COORDS.Plaza, desc: 'Central hub of the Aether campus, featuring the digital fountain.', color: '#00f0ff' },
    { name: 'Administration', coords: CAMPUS_COORDS.Administration, desc: 'Faculty offices, registrar desks, and dean headquarters.', color: '#6366f1' },
    { name: 'Cybersecurity Lab', coords: CAMPUS_COORDS.CyberLab, desc: 'High-security server racks and network simulation terminals.', color: '#ef4444' },
    { name: 'Digital Library', coords: CAMPUS_COORDS.Library, desc: 'Archives of cryptography papers and quiet study zones.', color: '#f59e0b' },
    { name: 'Innovation Lab', coords: CAMPUS_COORDS.InnovationLab, desc: 'Robotics workbenches and automated 3D printing equipment.', color: '#10b981' },
    { name: 'Art Studio', coords: CAMPUS_COORDS.ArtStudio, desc: 'Creative zone filled with cyber-physical abstract sculptures.', color: '#ec4899' },
    { name: 'Botanical Garden', coords: CAMPUS_COORDS.BotanicalGarden, desc: 'Enclosed environmental dome featuring exotic flora.', color: '#22c55e' },
    { name: 'Student Cafeteria', coords: CAMPUS_COORDS.Cafeteria, desc: 'Lounge tables and high-capacity coffee makers.', color: '#8b5cf6' },
    { name: 'Student Center', coords: CAMPUS_COORDS.StudentCenter, desc: 'Recreational facilities and social clubs.', color: '#06b6d4' },
    { name: 'Dormitory', coords: CAMPUS_COORDS.Dormitory, desc: 'Student housing units and private quarters.', color: '#64748b' },
    { name: 'VR Lab', coords: CAMPUS_COORDS.VRLab, desc: 'Virtual reality simulation pods and graphics workstations.', color: '#10b981' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 font-sans">
          {/* Main Map Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-5xl h-[85vh] bg-slate-900/90 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Map Frame Grid */}
            <div className="flex-1 bg-[#020617] relative flex items-center justify-center border-r border-slate-800 p-4 select-none">
              {/* Decorative Blueprint grid background */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,240,255,0.06)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

              <svg width="100%" height="100%" viewBox="0 0 600 600" className="max-w-[550px] max-h-[550px]">
                {/* Dotted axes lines */}
                <line x1="0" y1="300" x2="600" y2="300" stroke="rgba(0, 240, 255, 0.15)" strokeDasharray="4 4" />
                <line x1="300" y1="0" x2="300" y2="600" stroke="rgba(0, 240, 255, 0.15)" strokeDasharray="4 4" />

                {/* Draw roads/paths outlines */}
                <rect x="275" y="100" width="50" height="400" fill="rgba(100, 116, 139, 0.08)" rx="4" />
                <rect x="100" y="275" width="400" height="50" fill="rgba(100, 116, 139, 0.08)" rx="4" />
                <circle cx="300" cy="300" r="45" fill="none" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="8" />

                {/* Render Buildings */}
                {buildings.map((b) => {
                  const svgPt = mapCoords(b.coords[0], b.coords[2]);
                  const isHovered = hoveredBuilding === b.name;
                  return (
                    <g key={b.name} className="cursor-pointer"
                       onMouseEnter={() => {
                         setHoveredBuilding(b.name);
                         audioManager.playSFX('hover');
                       }}
                       onMouseLeave={() => setHoveredBuilding(null)}
                    >
                      {/* Outer pulse */}
                      <circle
                        cx={svgPt.x}
                        cy={svgPt.y}
                        r={isHovered ? 18 : 12}
                        fill="none"
                        stroke={b.color}
                        strokeWidth="2"
                        className="transition-all duration-300"
                        opacity={isHovered ? 0.8 : 0.4}
                      />
                      {/* Inner solid */}
                      <circle
                        cx={svgPt.x}
                        cy={svgPt.y}
                        r={6}
                        fill={b.color}
                      />
                      {/* Name Label */}
                      <text
                        x={svgPt.x}
                        y={svgPt.y - 20}
                        textAnchor="middle"
                        fill={isHovered ? '#ffffff' : '#94a3b8'}
                        fontSize={isHovered ? '11px' : '9px'}
                        fontWeight="bold"
                        className="transition-all pointer-events-none fill-current select-none"
                      >
                        {b.name}
                      </text>
                    </g>
                  );
                })}

                {/* Render live player marker */}
                <g>
                  <circle
                    cx={pSvg.x}
                    cy={pSvg.y}
                    r="10"
                    fill="none"
                    stroke="#00ffff"
                    strokeWidth="2.5"
                    className="animate-ping"
                  />
                  <circle
                    cx={pSvg.x}
                    cy={pSvg.y}
                    r="5"
                    fill="#00ffff"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={pSvg.x}
                    y={pSvg.y + 18}
                    textAnchor="middle"
                    fill="#00ffff"
                    fontSize="9px"
                    fontWeight="black"
                    letterSpacing="1px"
                  >
                    YOU
                  </text>
                </g>
              </svg>
            </div>

            {/* Right Panel details / Legend */}
            <div className="w-full md:w-80 bg-slate-950/65 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[#00f0ff] font-bold text-xs tracking-widest block uppercase">AETHER ARCHITECTURE</span>
                <h3 className="text-white text-2xl font-black mt-1">MAP REGISTRY</h3>

                <div className="border-t border-slate-800 my-4 pt-4">
                  {hoveredBuilding ? (
                    <motion.div
                      key={hoveredBuilding}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <h4 className="text-white font-black text-sm">{hoveredBuilding}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed font-medium">
                        {buildings.find((b) => b.name === hoveredBuilding)?.desc}
                      </p>
                      <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg">
                        <span className="text-[9px] text-[#00f0ff] font-bold tracking-widest block">FAST TRAVEL GATE</span>
                        <span className="text-slate-500 font-semibold text-[10px] uppercase block mt-0.5">LOCKED (EXPLORE FIRST)</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-slate-500 text-xs font-medium leading-relaxed">
                      Hover over any node coordinates on the map to audit building descriptions and sub-coordinates.
                    </div>
                  )}
                </div>
              </div>

              {/* Legend & Close */}
              <div className="space-y-4">
                <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-xl space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">LEGEND</span>
                  <div className="flex items-center gap-2 text-xs text-slate-350">
                    <circle className="w-2.5 h-2.5 rounded-full bg-[#00ffff] block" />
                    <span>Active Student Node</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-350">
                    <circle className="w-2.5 h-2.5 rounded-full bg-[#ef4444] block" />
                    <span>Academic Facility</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-purple-500/40 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all duration-300"
                >
                  DISMISS MAP [ESC/M]
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WorldMapOverlay;
