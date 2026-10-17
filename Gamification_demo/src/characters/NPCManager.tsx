import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { npcDatabase } from './NPCDatabase';
import type { NPCProfile, NPCSchedule } from './NPCDatabase';
import { useDialogueStore } from '../dialogue/DialogueEngine';
import useInput from '../hooks/useInput';

interface NPCManagerProps {
  timeOfDay?: number; // 0 to 24
}

export const NPCManager: React.FC<NPCManagerProps> = ({ timeOfDay = 9.0 }) => {
  const inputRef = useInput();
  const dialogueStore = useDialogueStore();
  const [nearestNPCId, setNearestNPCId] = useState<string | null>(null);

  // Create an array of references for all NPC positions
  const npcRefs = useRef<THREE.Group[]>([]);
  const npcTargets = useRef<THREE.Vector3[]>([]);

  // 1. Get the current schedule phase
  const getSchedulePhase = (hour: number): keyof NPCSchedule => {
    if (hour >= 6 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 14) return 'lunch';
    if (hour >= 14 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  const currentPhase = getSchedulePhase(timeOfDay);

  const backgroundNPCs = useMemo(() => {
    return npcDatabase.filter((npc) => npc.id.startsWith('npc_bg_'));
  }, []);

  // Initialize targets and references list
  useMemo(() => {
    npcRefs.current = [];
    npcTargets.current = backgroundNPCs.map((npc) => {
      const dest = npc.schedule[currentPhase].coords;
      return new THREE.Vector3(...dest);
    });
  }, [currentPhase, backgroundNPCs]);

  useFrame((state, delta) => {
    const player = state.scene.getObjectByName('player');
    if (!player) return;

    const playerPos = new THREE.Vector3();
    player.getWorldPosition(playerPos);

    let nearestNPC: NPCProfile | null = null;
    let minDistance = 2.5; // Interaction distance threshold

    backgroundNPCs.forEach((npc, idx) => {
      const mesh = npcRefs.current[idx];
      if (!mesh) return;

      // 1. Route/move NPC towards target coordinate
      const targetPos = npcTargets.current[idx];
      const currentPos = mesh.position;

      // Update target coordinate if schedule changed
      const currentScheduledCoords = npc.schedule[currentPhase].coords;
      targetPos.set(currentScheduledCoords[0], currentScheduledCoords[1], currentScheduledCoords[2]);

      const distToTarget = currentPos.distanceTo(targetPos);

      if (distToTarget > 0.1 && npc.speed > 0) {
        // Move towards target
        const dir = new THREE.Vector3().subVectors(targetPos, currentPos).normalize();
        currentPos.addScaledVector(dir, npc.speed * delta);
        
        // Orient towards walking direction
        const targetAngle = Math.atan2(dir.x, dir.z);
        mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetAngle, delta * 8);
      } else {
        // Subtle micro idle breathing rotation
        mesh.rotation.y += Math.sin(state.clock.getElapsedTime() + idx) * 0.005;
      }

      // 2. Check proximity with Player
      const distToPlayer = currentPos.distanceTo(playerPos);
      if (distToPlayer < minDistance) {
        minDistance = distToPlayer;
        nearestNPC = npc;
      }
    });

    // Handle interactive trigger on the nearest NPC
    if (nearestNPC && !dialogueStore.isOpen) {
      const npcNode = nearestNPC as NPCProfile;
      if (nearestNPCId !== npcNode.id) {
        setNearestNPCId(npcNode.id);
      }
      
      // Listen for E interaction
      if (inputRef.current.interact) {
        inputRef.current.interact = false;
        
        // Load generic dialogue from NPC database
        const dialogueList = [
          {
            id: `${npcNode.id}_start`,
            speaker: npcNode.name,
            lines: [
              ...npcNode.dialogue,
              `I'm currently heading to the ${npcNode.schedule[currentPhase].locationName} for ${npcNode.schedule[currentPhase].action}.`,
            ],
            nextNodeId: null,
          },
        ];
        
        dialogueStore.startDialogue(dialogueList, `${npcNode.id}_start`);
      }
    } else {
      if (nearestNPCId !== null) {
        setNearestNPCId(null);
      }
    }
  });

  return (
    <group>
      {backgroundNPCs.map((npc, idx) => (
        <group
          key={npc.id}
          ref={(el) => {
            if (el) npcRefs.current[idx] = el;
          }}
          // Spawn them near their current scheduled start position
          position={[
            npc.schedule[currentPhase].coords[0],
            npc.schedule[currentPhase].coords[1],
            npc.schedule[currentPhase].coords[2],
          ]}
        >
          {/* Capsule Mesh represent */}
          <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
            <capsuleGeometry args={[0.35, 0.9, 4, 8]} />
            <meshStandardMaterial color={npc.color} roughness={0.6} />
          </mesh>
          {/* Face plate */}
          <mesh position={[0, 1.25, 0.28]}>
            <boxGeometry args={[0.5, 0.1, 0.1]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.1} />
          </mesh>

          {/* HTML Billboard Name/Role tags */}
          <Html distanceFactor={8.5} position={[0, 2.1, 0]} center>
            <div className="flex flex-col items-center select-none pointer-events-none text-center font-sans">
              {/* Dynamic Emote for crowd activity */}
              {(() => {
                const emote = (idx % 11 === 0 ? 'idea' : (idx % 17 === 0 ? 'dialogue' : null));
                if (!emote) return null;
                const color = emote === 'idea' ? '#eab308' : '#3b82f6';
                return (
                  <div
                    style={{ borderColor: color, boxShadow: `0 0 8px ${color}50` }}
                    className="bg-slate-950/90 border text-[11px] w-6 h-6 flex items-center justify-center rounded-full mb-1 animate-bounce"
                  >
                    {emote === 'idea' ? '💡' : '💬'}
                  </div>
                );
              })()}
              
              <div className="bg-slate-950/95 border border-slate-800/80 px-2.5 py-1 rounded-lg shadow-md backdrop-blur-md min-w-[110px]">
                <div className="text-white font-bold text-[10px] leading-tight whitespace-nowrap">{npc.name}</div>
                <div className="text-[#00f0ff] text-[7.5px] font-semibold tracking-wider mt-0.5 uppercase whitespace-nowrap">
                  {npc.role}
                </div>
              </div>

              {/* If nearest, show interactive overlay */}
              {nearestNPCId === npc.id && !dialogueStore.isOpen && (
                <div className="mt-1 bg-[#00f0ff] text-slate-950 text-[9px] font-black tracking-widest px-2 py-0.5 rounded shadow-[0_0_12px_rgba(0,240,255,0.5)]">
                  [E] INTERACT
                </div>
              )}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

export default NPCManager;
