import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import Foliage from './Foliage';
import WeatherSystem from './WeatherSystem';
import ParticleSystem from './ParticleSystem';
import Lighting from './Lighting';
import AudioZone from './AudioZone';
import audioManager from '../audio/AudioManager';
import { CAMPUS_COORDS } from '../characters/NPCDatabase';
import toast from 'react-hot-toast';
import { InteractiveProp } from './InteractiveProp';
import { useQuestStore } from '../quests/QuestManager';
import { useInventoryStore } from '../store/InventoryStore';
import { AdministrationBuilding } from './buildings/AdministrationBuilding';
import { InnovationLabBuilding } from './buildings/InnovationLabBuilding';
import { CyberLabBuilding } from './buildings/CyberLabBuilding';
import { LibraryBuilding } from './buildings/LibraryBuilding';
import { CafeBuilding } from './buildings/CafeBuilding';


export const Campus: React.FC = () => {
  const activeQuests = useQuestStore((s) => s.activeQuests);
  const { addItem, removeItem, hasItem } = useInventoryStore();

  const [wateredBeds, setWateredBeds] = useState<Record<string, boolean>>({
    bed1: false,
    bed2: false,
    bed3: false,
  });

  const checkAllWatered = (beds: Record<string, boolean>) => {
    if (beds.bed1 && beds.bed2 && beds.bed3) {
      removeItem('item_watering_can');
      useQuestStore.getState().updateObjective('quest_4_help', 'water_flowers', true);
      toast.success("All flower beds watered! Botanical Duty Complete.");
    }
  };

  // 1. Interior Occlusion State (render interior models only when inside)
  const [activeInterior, setActiveInterior] = useState<string | null>(null);

  // 2. Exploration badges collected state
  const [badgesCollected, setBadgesCollected] = useState<Record<string, boolean>>({
    badge_plaza: false,
    badge_garden: false,
    badge_tunnel: false,
    badge_rooftop: false,
    badge_library: false,
  });

  const badgePositions: Record<string, [number, number, number]> = {
    badge_plaza: [0, 0.5, 0], // Center of fountain
    badge_garden: [0, 0.5, 45], // Near Gazebo
    badge_tunnel: [-38, 0.2, -38], // Hidden corner/tunnel entrance
    badge_rooftop: [2, 8.5, -40], // Admin building roof
    badge_library: [-32, 0.8, 14], // Behind study desks
  };

  const badgeRotationRef = useRef<number>(0);

  // Proximity check for interiors and badges
  useFrame((state, delta) => {
    badgeRotationRef.current += delta * 2;

    const player = state.scene.getObjectByName('player');
    if (!player) return;

    const playerPos = new THREE.Vector3();
    player.getWorldPosition(playerPos);

    // 1. Detect which building the player is inside
    let currentBuilding: string | null = null;
    const buildingThresholds: Record<string, { center: [number, number, number]; bounds: [number, number] }> = {
      administration: { center: CAMPUS_COORDS.Administration, bounds: [10, 8] },
      cyber: { center: CAMPUS_COORDS.CyberLab, bounds: [8, 8] },
      library: { center: CAMPUS_COORDS.Library, bounds: [8, 10] },
      innovation: { center: CAMPUS_COORDS.InnovationLab, bounds: [8, 8] },
      art: { center: CAMPUS_COORDS.ArtStudio, bounds: [7, 7] },
      vr: { center: CAMPUS_COORDS.VRLab, bounds: [8, 8] },
      cafeteria: { center: CAMPUS_COORDS.Cafeteria, bounds: [8, 8] },
      student_center: { center: CAMPUS_COORDS.StudentCenter, bounds: [9, 9] },
      dormitory: { center: CAMPUS_COORDS.Dormitory, bounds: [8, 8] },
      garden: { center: CAMPUS_COORDS.BotanicalGarden, bounds: [6, 6] },
    };

    Object.entries(buildingThresholds).forEach(([name, th]) => {
      const dist = Math.sqrt(
        Math.pow(playerPos.x - th.center[0], 2) + Math.pow(playerPos.z - th.center[2], 2)
      );
      if (dist < th.bounds[0]) {
        currentBuilding = name;
      }
    });

    if (currentBuilding !== activeInterior) {
      setActiveInterior(currentBuilding);
      if (currentBuilding) {
        audioManager.playSFX('door_open');
        
        // Update orientation quest objectives if active
        const activeQuestsState = useQuestStore.getState().activeQuests;
        if (activeQuestsState['quest_2_explore']) {
          if (currentBuilding === 'library') {
            useQuestStore.getState().updateObjective('quest_2_explore', 'visit_library', true);
          } else if (currentBuilding === 'innovation') {
            useQuestStore.getState().updateObjective('quest_2_explore', 'visit_innovation', true);
          } else if (currentBuilding === 'cafeteria') {
            useQuestStore.getState().updateObjective('quest_2_explore', 'visit_cafe', true);
          } else if (currentBuilding === 'garden') {
            useQuestStore.getState().updateObjective('quest_2_explore', 'visit_garden', true);
          }
        }
        if (activeQuestsState['quest_5_cyber']) {
          if (currentBuilding === 'cyber') {
            useQuestStore.getState().updateObjective('quest_5_cyber', 'enter_cyber', true);
          }
        }
      }
    }

    // 2. Detect Collectible badge touch checks
    Object.entries(badgePositions).forEach(([badgeId, coords]) => {
      if (badgesCollected[badgeId]) return;

      const badgePos = new THREE.Vector3(...coords);
      const dist = playerPos.distanceTo(badgePos);

      if (dist < 1.5) {
        // Collect Badge!
        setBadgesCollected((prev) => ({ ...prev, [badgeId]: true }));
        audioManager.playSFX('quest_complete');
        
        const friendlyName = badgeId.replace('badge_', '').toUpperCase();
        toast(`Collected Badge: ${friendlyName}!`, {
          icon: '🏅',
          style: {
            background: 'rgba(25, 10, 45, 0.95)',
            color: '#ff00ff',
            border: '1px solid rgba(255, 0, 255, 0.4)',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
          },
        });
      }
    });
  });

  return (
    <group>
      {/* 1. Global Time, Weather System and Lighting */}
      <WeatherSystem />
      <ParticleSystem />
      <Lighting />

      {/* 2. Audio Spatial Zones */}
      <AudioZone name="Main Entrance" position={[0, 0, -48]} size={[25, 8, 12]} musicTrack="campus_morning" ambientTrack="birds_wind_ambient" />
      <AudioZone name="Central Plaza" position={[0, 0, 0]} size={[35, 8, 35]} musicTrack="campus_morning" ambientTrack="birds_wind_ambient" />
      <AudioZone name="Administration" position={CAMPUS_COORDS.Administration} size={[20, 8, 20]} musicTrack="administration_piano" ambientTrack="ac_hum_loop" />
      <AudioZone name="Cybersecurity Center" position={CAMPUS_COORDS.CyberLab} size={[18, 8, 18]} musicTrack="cyber_lab_synth" ambientTrack="server_hum_loop" />
      <AudioZone name="Digital Library" position={CAMPUS_COORDS.Library} size={[20, 8, 25]} musicTrack="library_classical" ambientTrack="silent_ambience" />
      <AudioZone name="Botanical Garden" position={CAMPUS_COORDS.BotanicalGarden} size={[20, 8, 20]} musicTrack="garden_relaxing" ambientTrack="birds_wind_ambient" />

      {/* 3. Physical Terrain Floor (Large 600m equivalent representation) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.1, 0]}>
          <planeGeometry args={[180, 180]} />
          <meshStandardMaterial color="#2d4231" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Roads and pathways radiating from central plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[8, 150]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[150, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      {/* Circle Center Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}>
        <ringGeometry args={[0, 12, 32]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>

      {/* 4. Center Plaza fountain structure */}
      <RigidBody type="fixed" colliders="trimesh">
        <group position={[0, 0.4, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[5, 5.2, 0.8, 24]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[4.8, 4.8, 0.1, 24]} />
            <meshStandardMaterial color="#0284c7" transparent opacity={0.75} roughness={0.1} metalness={0.9} />
          </mesh>
        </group>
      </RigidBody>

      {/* 5. 10 Campus Buildings Structure */}

      {/* 1. ADMINISTRATION BUILDING */}
      <AdministrationBuilding />
      {activeInterior === 'administration' && (
        <group position={CAMPUS_COORDS.Administration}>
          <InteractiveProp id="admin_coffee" type="coffee_machine" position={[2.5, 0, 1.5]} name="Staff Lounge Brewer" description="Serves dark roast blend." />
          <InteractiveProp id="admin_directory" type="map" position={[-2.5, 0, 4.0]} name="Registrar Information Board" description="Displays building blueprints." />
        </group>
      )}

      {/* 2. INNOVATION LAB */}
      {/* 2. INNOVATION LAB */}
      <InnovationLabBuilding />
      {activeInterior === 'innovation' && (
        <group position={CAMPUS_COORDS.InnovationLab}>
          <InteractiveProp id="innov_whiteboard" type="whiteboard" position={[0, 0, -3.5]} name="Robotics Brainstorm Board" description="Diagrams of quadcopter schematics." />
          <InteractiveProp id="innov_terminal" type="computer" position={[-3.5, 0, 3.5]} name="CAD Design Station" description="3D printing design console." />
        </group>
      )}

      {/* 3. CYBER SECURITY CENTER */}
      {/* 3. CYBER SECURITY CENTER */}
      <CyberLabBuilding />
      {activeInterior === 'cyber' && (
        <group position={CAMPUS_COORDS.CyberLab}>
          <InteractiveProp id="cyber_rack" type="server_terminal" position={[-3.5, 0, 1.5]} name="Academic Subnet Rack" description="Maintains domain authentication records." />
          <InteractiveProp id="cyber_pc" type="computer" position={[2.5, 0, -0.5]} name="Intrusion Detection Console" description="Logs active network packet flows." />
        </group>
      )}

      {/* 4. DIGITAL LIBRARY */}
      {/* 4. DIGITAL LIBRARY */}
      <LibraryBuilding />
      {activeInterior === 'library' && (
        <group position={CAMPUS_COORDS.Library}>
          <InteractiveProp id="lib_bench" type="bench" position={[0, 0, 2]} name="Silent Study Bench" description="Perfect for quiet reading." />
          <InteractiveProp id="lib_bookstack" type="book" position={[2.5, 0.4, -2]} name="Network Security Textbook" description="Covers port scanning and firewalls." />
        </group>
      )}

      {/* 5. ART STUDIO */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={CAMPUS_COORDS.ArtStudio}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[11, 6, 11]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
          {/* Skylight frame */}
          <mesh position={[0, 3.1, 0]}>
            <boxGeometry args={[6, 0.1, 6]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={0.1} />
          </mesh>

          {/* INTERIOR */}
          {activeInterior === 'art' && (
            <group position={[0, -2.5, 0]}>
              {/* Sculptures pedestals */}
              {[-2, 2].map((x, idx) => (
                <group key={`sculpt-${idx}`} position={[x, 0.5, 2]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.5, 0.5, 1.0, 8]} />
                    <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
                  </mesh>
                  {/* Sphere sculpture on top */}
                  <mesh position={[0, 0.8, 0]} castShadow>
                    <dodecahedronGeometry args={[0.4, 0]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.1} />
                  </mesh>
                </group>
              ))}
              <InteractiveProp id="art_statue" type="artwork" position={[0, 0, -2]} name="Cyber-Physical Sculpture" description="An abstract representation of human-machine boundaries." />
            </group>
          )}
        </group>
      </RigidBody>

      {/* 6. VR LAB */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={CAMPUS_COORDS.VRLab}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[13, 6, 13]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Green lighting stripes */}
          <mesh position={[0, 0, 6.55]}>
            <boxGeometry args={[10, 0.2, 0.1]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={2} />
          </mesh>

          {/* INTERIOR */}
          {activeInterior === 'vr' && (
            <group position={[0, -2.5, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <planeGeometry args={[12, 12]} />
                <meshStandardMaterial color="#020617" roughness={0.2} />
              </mesh>
              {/* VR Station headset hangers */}
              <mesh position={[0, 1.2, -4]} castShadow>
                <boxGeometry args={[8, 0.2, 0.6]} />
                <meshStandardMaterial color="#334155" roughness={0.5} />
              </mesh>
            </group>
          )}
        </group>
      </RigidBody>

      {/* 7. CAFETERIA */}
      <CafeBuilding />

      {/* 8. STUDENT CENTER */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={CAMPUS_COORDS.StudentCenter}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[15, 7, 15]} />
            <meshStandardMaterial color="#1e1b4b" metalness={0.5} roughness={0.3} />
          </mesh>

          {/* INTERIOR */}
          {activeInterior === 'student_center' && (
            <group position={[0, -3.0, 0]}>
              {/* Gaming Lounges */}
              <mesh position={[0, 0.1, 0]} castShadow>
                <boxGeometry args={[6, 0.2, 4]} />
                <meshStandardMaterial color="#311042" roughness={0.8} />
              </mesh>
            </group>
          )}
        </group>
      </RigidBody>

      {/* 9. DORMITORY */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={CAMPUS_COORDS.Dormitory}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[15, 9, 14]} />
            <meshStandardMaterial color="#475569" roughness={0.9} />
          </mesh>

          {/* INTERIOR */}
          {activeInterior === 'dormitory' && (
            <group position={[0, -4.0, 0]}>
              {/* Mail Room lockers */}
              <mesh position={[-5, 1.5, -4]} castShadow>
                <boxGeometry args={[3, 3, 0.8]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
              </mesh>
              {/* Player Dormitory Bed Save Point */}
              <group position={[4, 0.5, 3]}>
                <mesh castShadow>
                  <boxGeometry args={[2.5, 0.6, 1.5]} />
                  <meshStandardMaterial color="#4f46e5" roughness={0.8} />
                </mesh>
                <mesh position={[-0.8, 0.4, 0]} castShadow>
                  <boxGeometry args={[0.6, 0.2, 1.3]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.9} />
                </mesh>
              </group>
            </group>
          )}
        </group>
      </RigidBody>

      {/* 10. BOTANICAL GARDEN */}
      <group position={CAMPUS_COORDS.BotanicalGarden}>
        {/* Gazebo Dome frame */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <torusGeometry args={[3.2, 0.1, 8, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
        </mesh>
        <mesh position={[0, 3.2, 0]} castShadow>
          <sphereGeometry args={[3.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <meshStandardMaterial color="#0284c7" transparent opacity={0.35} roughness={0.1} />
        </mesh>
        {/* Plant beds */}
        {[-3.5, 3.5].map((x, idx) => (
          <mesh key={`plant-${idx}`} position={[x, 0.2, 0]} castShadow>
            <boxGeometry args={[1.5, 0.4, 4]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* 6. Static Campus foliage and trees */}
      <Foliage />

      {/* 7. Collectible Badges Render (Glowing rotating discs) */}
      {Object.entries(badgePositions).map(([badgeId, pos]) => {
        if (badgesCollected[badgeId]) return null;

        return (
          <mesh
            key={badgeId}
            position={pos}
            rotation={[0, badgeRotationRef.current, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.3, 0.3, 0.08, 8]} />
            <meshStandardMaterial
              color="#eab308" // Gold glow
              emissive="#eab308"
              emissiveIntensity={1.2}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        );
      })}

      {/* ─── QUEST INTERACTIVE PROPS ─── */}
      {activeQuests['quest_4_help'] && !hasItem('item_emma_books') && !hasItem('item_emma_delivered') && (
        <InteractiveProp
          id="emma_books_pile"
          type="book"
          position={[18, 0, 22]}
          name="Robotics Books"
          description="A heavy stack of manuals Emma needs help carrying."
          onInteract={() => {
            addItem({
              id: 'item_emma_books',
              name: 'Robotics Manuals Stack',
              category: 'quest',
              description: 'A heavy stack of textbook manuals about quadcopters and microcontrollers.',
              icon: '📚',
              rarity: 'common',
            });
            toast.success("Picked up Emma's Robotics Manuals!");
          }}
        />
      )}

      {activeInterior === 'library' && hasItem('item_emma_books') && (
        <InteractiveProp
          id="library_dropoff"
          type="whiteboard"
          position={[-32, 0, 4]}
          name="Study Table Drop-off"
          description="Drop off Emma's robotics manuals here."
          onInteract={() => {
            removeItem('item_emma_books');
            addItem({
              id: 'item_emma_delivered',
              name: 'Manuals Delivery Note',
              category: 'quest',
              description: 'A receipt showing the robotics manuals were safely delivered to the Library study desks.',
              icon: '📄',
              rarity: 'common',
            });
            toast.success("Placed books on the Library desk. Get back to Emma!");
          }}
        />
      )}

      {activeQuests['quest_4_help'] && !hasItem('item_lucas_notebook') && !useQuestStore.getState().completedQuests['side_lucas'] && (
        <InteractiveProp
          id="lucas_notebook_prop"
          type="book"
          position={[-22, 0.4, 23]}
          name="Lost Notebook"
          description="A blue notebook lying on the Cafe patio bench."
          onInteract={() => {
            addItem({
              id: 'item_lucas_notebook',
              name: "Lucas's ML Notebook",
              category: 'quest',
              description: "Lucas's lost data science notebook full of linear algebra formulas.",
              icon: '📓',
              rarity: 'common',
            });
            toast.success("Found Lucas's ML Notebook!");
          }}
        />
      )}

      {activeInterior === 'cafeteria' && activeQuests['quest_4_help'] && !hasItem('item_orion_coffee') && !useQuestStore.getState().completedQuests['side_orion'] && (
        <InteractiveProp
          id="cafe_coffee_maker"
          type="coffee_machine"
          position={[-21.5, 0.6, 18]}
          name="Espresso Machine"
          description="Brew a hot coffee for Professor Orion."
          onInteract={() => {
            addItem({
              id: 'item_orion_coffee',
              name: 'Hot Cafe Latte',
              category: 'quest',
              description: 'A warm cup of premium dark roast coffee from the Cafe.',
              icon: '☕',
              rarity: 'common',
            });
            toast.success("Brewed a fresh Hot Latte for Professor Orion!");
          }}
        />
      )}

      {activeQuests['quest_4_help'] && !hasItem('item_lost_id') && !useQuestStore.getState().completedQuests['side_id'] && (
        <InteractiveProp
          id="lost_student_id"
          type="quest_item"
          position={[2, 0.15, -24]}
          name="Lost Student ID"
          description="A high-tech ID card dropped on the pavement."
          onInteract={() => {
            addItem({
              id: 'item_lost_id',
              name: "Sophia's Student ID",
              category: 'quest',
              description: "Sophia's misplaced campus access card, lost near Administration.",
              icon: '🪪',
              rarity: 'rare',
            });
            toast.success("Picked up Sophia's lost Student ID!");
          }}
        />
      )}

      {activeQuests['quest_4_help'] && !hasItem('item_watering_can') && !useQuestStore.getState().completedQuests['side_garden'] && (
        <InteractiveProp
          id="garden_watering_can"
          type="quest_item"
          position={[-4, 0.2, 26]}
          name="Watering Can"
          description="A gardening watering can filled with fresh water."
          onInteract={() => {
            addItem({
              id: 'item_watering_can',
              name: 'Garden Watering Can',
              category: 'quest',
              description: 'A standard green watering can, useful for nurturing campus flora.',
              icon: '💧',
              rarity: 'common',
            });
            toast.success("Picked up the Watering Can!");
          }}
        />
      )}

      {activeQuests['quest_4_help'] && (
        <group position={CAMPUS_COORDS.BotanicalGarden}>
          {!wateredBeds.bed1 && (
            <InteractiveProp
              id="flower_bed_1"
              type="artwork"
              position={[-2, 0.2, 4]}
              name="Dry Hydrangeas"
              description={hasItem('item_watering_can') ? "Use Watering Can to water flowers." : "Need a watering can."}
              onInteract={() => {
                if (hasItem('item_watering_can')) {
                  const next = { ...wateredBeds, bed1: true };
                  setWateredBeds(next);
                  checkAllWatered(next);
                  toast.success("Watered the Hydrangeas!");
                } else {
                  toast("Find the Watering Can near the Gazebo first!", { icon: '💧' });
                }
              }}
            />
          )}
          {!wateredBeds.bed2 && (
            <InteractiveProp
              id="flower_bed_2"
              type="artwork"
              position={[2, 0.2, 5]}
              name="Dry Tulips"
              description={hasItem('item_watering_can') ? "Use Watering Can to water flowers." : "Need a watering can."}
              onInteract={() => {
                if (hasItem('item_watering_can')) {
                  const next = { ...wateredBeds, bed2: true };
                  setWateredBeds(next);
                  checkAllWatered(next);
                  toast.success("Watered the Tulips!");
                } else {
                  toast("Find the Watering Can near the Gazebo first!", { icon: '💧' });
                }
              }}
            />
          )}
          {!wateredBeds.bed3 && (
            <InteractiveProp
              id="flower_bed_3"
              type="artwork"
              position={[3.5, 0.2, -3]}
              name="Dry Lilies"
              description={hasItem('item_watering_can') ? "Use Watering Can to water flowers." : "Need a watering can."}
              onInteract={() => {
                if (hasItem('item_watering_can')) {
                  const next = { ...wateredBeds, bed3: true };
                  setWateredBeds(next);
                  checkAllWatered(next);
                  toast.success("Watered the Lilies!");
                } else {
                  toast("Find the Watering Can near the Gazebo first!", { icon: '💧' });
                }
              }}
            />
          )}
        </group>
      )}

      {/* 8. Invisible Border Fences (Map Boundaries 600m equivalent boundaries) */}
      <RigidBody type="fixed" colliders="cuboid">
        {/* North Wall */}
        <mesh position={[0, 5, 80]} visible={false}>
          <boxGeometry args={[160, 10, 1]} />
        </mesh>
        {/* South Wall */}
        <mesh position={[0, 5, -80]} visible={false}>
          <boxGeometry args={[160, 10, 1]} />
        </mesh>
        {/* West Wall */}
        <mesh position={[-80, 5, 0]} visible={false}>
          <boxGeometry args={[1, 10, 160]} />
        </mesh>
        {/* East Wall */}
        <mesh position={[80, 5, 0]} visible={false}>
          <boxGeometry args={[1, 10, 160]} />
        </mesh>
      </RigidBody>
    </group>
  );
};

export default Campus;
