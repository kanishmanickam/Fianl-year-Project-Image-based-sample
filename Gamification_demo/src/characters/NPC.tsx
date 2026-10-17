import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useDialogueStore } from '../dialogue/DialogueEngine';
import type { DialogueNode } from '../dialogue/DialogueEngine';
import { useQuestStore } from '../quests/QuestManager';
import useInput from '../hooks/useInput';
import toast from 'react-hot-toast';

export type EmoteType = 'quest' | 'dialogue' | 'question' | 'complete' | 'friendly' | 'worried' | 'idea';

interface NPCProps {
  id: string;
  name: string;
  role?: string;
  emote?: EmoteType | null;
  position: [number, number, number];
  color?: string;
  dialogueNodes: DialogueNode[];
  startNodeId: string;
  onDialogueComplete?: () => void;
}

const getEmoteSymbol = (type: EmoteType): string => {
  switch (type) {
    case 'quest': return '❗';
    case 'dialogue': return '💬';
    case 'question': return '❓';
    case 'complete': return '✔';
    case 'friendly': return '😊';
    case 'worried': return '😟';
    case 'idea': return '💡';
    default: return '';
  }
};

const getEmoteColor = (type: EmoteType): string => {
  switch (type) {
    case 'quest': return '#eab308'; // Amber
    case 'dialogue': return '#3b82f6'; // Blue
    case 'question': return '#10b981'; // Emerald
    case 'complete': return '#22c55e'; // Green
    case 'friendly': return '#ec4899'; // Pink
    case 'worried': return '#f97316'; // Orange
    case 'idea': return '#eab308'; // Gold
    default: return '#ffffff';
  }
};

const isNpcInteractable = (npcId: string, activeQuests: Record<string, any>): boolean => {
  const activeIds = Object.keys(activeQuests);
  if (activeIds.length === 0) return false;

  for (const qId of activeIds) {
    const quest = activeQuests[qId];
    
    if (qId === 'quest_1_orion') {
      if (npcId === 'npc_orion') return true;
    }
    
    if (qId === 'quest_2_explore') {
      const visitsDone = quest.objectives
        .filter((o: any) => o.id !== 'report_orion')
        .every((o: any) => o.isCompleted);
      if (visitsDone && npcId === 'npc_orion') return true;
    }
    
    if (qId === 'quest_3_students') {
      const studentsToMeet = ['meet_emma', 'meet_kai', 'meet_sophia', 'meet_lucas', 'meet_mia'];
      const unmet = studentsToMeet.filter(id => {
        const obj = quest.objectives.find((o: any) => o.id === id);
        return obj && !obj.isCompleted;
      });

      if (unmet.length > 0) {
        const npcMap: Record<string, string> = {
          meet_emma: 'npc_emma',
          meet_kai: 'npc_kai',
          meet_sophia: 'npc_sophia',
          meet_lucas: 'npc_lucas',
          meet_mia: 'npc_mia'
        };
        const allowedNPCs = unmet.map(id => npcMap[id]);
        if (allowedNPCs.includes(npcId)) return true;
      } else {
        if (npcId === 'npc_orion') return true;
      }
    }
    
    if (qId === 'quest_4_help') {
      const surveysObj = quest.objectives.find((o: any) => o.id === 'help_mia_surveys');
      if (surveysObj && !surveysObj.isCompleted && npcId === 'npc_mia') {
        return true;
      }

      const othersDone = quest.objectives
        .filter((o: any) => o.id !== 'report_orion_help')
        .every((o: any) => o.isCompleted);
      if (othersDone && npcId === 'npc_orion') return true;
    }
    
    if (qId === 'quest_5_cyber') {
      const enterObj = quest.objectives.find((o: any) => o.id === 'enter_cyber');
      if (enterObj && enterObj.isCompleted && npcId === 'npc_kai') {
        return true;
      }
    }
  }

  return false;
};

export const NPC: React.FC<NPCProps> = ({
  id,
  name,
  role = 'Researcher',
  emote = null,
  position,
  color = '#ec4899',
  dialogueNodes,
  startNodeId,
  onDialogueComplete,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);
  const inputRef = useInput();
  const dialogueStore = useDialogueStore();

  const [isNear, setIsNear] = useState(false);
  const playerObjectRef = useRef<THREE.Object3D | null>(null);
  const activeQuests = useQuestStore((s) => s.activeQuests);
  const isInteractable = isNpcInteractable(id, activeQuests);

  // Idle Animation parameters
  const idleRotation = useRef(0);
  const lastIdleChange = useRef(0);
  const isCheckingPhone = useRef(false);
  const lastGestureTime = useRef(0);

  // Proximity & face target logic
  useFrame((state, delta) => {
    if (!meshRef.current || !visorRef.current) return;

    if (!playerObjectRef.current) {
      playerObjectRef.current = state.scene.getObjectByName('player') || null;
    }

    const time = state.clock.getElapsedTime();

    if (playerObjectRef.current) {
      const playerPos = new THREE.Vector3();
      playerObjectRef.current.getWorldPosition(playerPos);

      const npcPos = new THREE.Vector3();
      meshRef.current.getWorldPosition(npcPos);

      const distance = playerPos.distanceTo(npcPos);
      const interactiveRange = 2.4;

      if (distance < interactiveRange) {
        if (!isNear) {
          setIsNear(true);
        }

        // Face the player smoothly
        const targetAngle = Math.atan2(playerPos.x - npcPos.x, playerPos.z - npcPos.z);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetAngle, delta * 5);

        // Reset check phone when player interacts
        isCheckingPhone.current = false;

        // Interaction key
        if (inputRef.current.interact && !dialogueStore.isOpen) {
          inputRef.current.interact = false;
          if (isInteractable) {
            dialogueStore.startDialogue(dialogueNodes, startNodeId, onDialogueComplete);
          } else {
            toast("I should focus on my current task.", { id: 'npc_blocked' });
          }
        }
      } else {
        if (isNear) {
          setIsNear(false);
        }

        // Standard Idle look-around rotation
        if (time - lastIdleChange.current > 7.5) {
          lastIdleChange.current = time;
          if (Math.random() < 0.4) {
            idleRotation.current = (Math.random() - 0.5) * Math.PI * 1.5;
          }
        }
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, idleRotation.current, delta * 2.5);

        // Check phone gesture triggers
        if (time - lastGestureTime.current > 11) {
          lastGestureTime.current = time;
          isCheckingPhone.current = Math.random() < 0.45;
        }
      }
    }

    // Breathing scale animation
    const breathing = 1.0 + Math.sin(time * 1.5 + (id.charCodeAt(0) % 5)) * 0.015;
    meshRef.current.scale.set(1.0, breathing, 1.0);

    // Visor/Phone check tilt animation
    const targetVisorY = isCheckingPhone.current ? 1.1 : 1.25;
    const targetVisorZ = isCheckingPhone.current ? 0.3 : 0.33;
    visorRef.current.position.y = THREE.MathUtils.lerp(visorRef.current.position.y, targetVisorY, delta * 4);
    visorRef.current.position.z = THREE.MathUtils.lerp(visorRef.current.position.z, targetVisorZ, delta * 4);
  });

  return (
    <RigidBody type="fixed" colliders="hull" position={position}>
      <group ref={meshRef} name={name} userData={{ id }}>
        {/* NPC Mesh */}
        <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
          <capsuleGeometry args={[0.38, 0.9, 4, 8]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>

        {/* Visor (Bobs with phone checks) */}
        <mesh ref={visorRef} position={[0, 1.25, 0.33]}>
          <boxGeometry args={[0.52, 0.12, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>

        {/* HTML Billboard Name, Role, & Emote Tag */}
        <Html distanceFactor={7.5} position={[0, 2.1, 0]} center>
          <div className="flex flex-col items-center select-none pointer-events-none text-center font-sans">
            {/* Animated Floating Emote Bubble */}
            {emote && (
              <div
                style={{
                  borderColor: getEmoteColor(emote),
                  boxShadow: `0 0 10px ${getEmoteColor(emote)}50`,
                }}
                className="bg-slate-950/90 border text-sm w-7 h-7 flex items-center justify-center rounded-full mb-1.5 animate-bounce shadow-xl"
              >
                {getEmoteSymbol(emote)}
              </div>
            )}
            
            {/* Profile Tag */}
            <div className="bg-slate-950/95 border border-slate-800/80 px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md min-w-[130px]">
              <div className="text-white font-bold text-[11px] leading-tight whitespace-nowrap">{name}</div>
              <div className="text-[#00f0ff] text-[8px] font-semibold tracking-wider mt-0.5 uppercase whitespace-nowrap">
                {role}
              </div>
            </div>

            {/* Interaction prompt */}
            {isNear && isInteractable && !dialogueStore.isOpen && (
              <div className="mt-1 bg-[#00f0ff] text-slate-950 text-[9px] font-black tracking-widest px-2 py-0.5 rounded shadow-[0_0_12px_rgba(0,240,255,0.5)] animate-pulse">
                [E] INTERACT
              </div>
            )}
          </div>
        </Html>
      </group>
    </RigidBody>
  );
};

export default NPC;
