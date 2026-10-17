export interface NPCSchedule {
  morning: { locationName: string; coords: [number, number, number]; action: string };
  lunch: { locationName: string; coords: [number, number, number]; action: string };
  afternoon: { locationName: string; coords: [number, number, number]; action: string };
  evening: { locationName: string; coords: [number, number, number]; action: string };
  night: { locationName: string; coords: [number, number, number]; action: string };
}

export interface NPCProfile {
  id: string;
  name: string;
  role: string;
  color: string;
  speed: number;
  schedule: NPCSchedule;
  dialogue: string[];
}

const MAJORS = [
  'Computer Science',
  'Cybersecurity',
  'Robotics Engineering',
  'Digital Arts',
  'VR Development',
  'Information Systems',
  'Data Science',
];

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Drew', 'Quinn',
  'Skyler', 'Avery', 'Jamie', 'Robin', 'Kendall', 'Reese', 'Blake', 'Cameron',
  'Dakota', 'Finley', 'Harley', 'Jessie', 'Kira', 'Lee', 'Max', 'Nico',
  'Parker', 'Rowan', 'Sage', 'Sam', 'Spencer', 'Tatum',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
];

// ─────────────────────────────────────────────
// Campus zone coordinates  (world-space units)
// ─────────────────────────────────────────────
export const CAMPUS_COORDS: Record<string, [number, number, number]> = {
  // Core story buildings
  Plaza:          [0,   0,  0],
  Administration: [0,   0, -30],
  Library:        [-30, 0,  0],
  InnovationLab:  [20,  0,  20],
  CyberLab:       [30,  0,  5],
  Cafe:           [-20, 0,  20],
  Garden:         [0,   0,  30],
  StudentPlaza:   [20,  0, -20],

  // Legacy / background zones (kept for background NPC routing)
  ArtStudio:        [-20, 0, -20],
  Dormitory:        [-10, 0, -35],
  VRLab:            [35,  0, -10],
  Cafeteria:        [-20, 0,  20], // alias for Cafe
  BotanicalGarden:  [0,   0,  30], // alias for Garden
  StudentCenter:    [20,  0, -20], // alias for StudentPlaza
  InnovationLabAlt: [20,  0,  20],
};

// ─────────────────────────────────────────────
// 8 CANONICAL STORY NPCs  (spec requirement)
// ─────────────────────────────────────────────
export const KEY_NPCS: NPCProfile[] = [
  // 1. Professor Orion — first NPC the player meets
  {
    id: 'npc_orion',
    name: 'Professor Orion',
    role: 'Faculty · Cybersecurity',
    color: '#3b82f6',
    speed: 0,
    schedule: {
      morning:   { locationName: 'Plaza',          coords: CAMPUS_COORDS.Plaza,          action: 'Greeting Students' },
      lunch:     { locationName: 'Cafe',            coords: CAMPUS_COORDS.Cafe,           action: 'Lunch Break' },
      afternoon: { locationName: 'CyberLab',        coords: CAMPUS_COORDS.CyberLab,       action: 'Lecturing' },
      evening:   { locationName: 'Administration',  coords: CAMPUS_COORDS.Administration, action: 'Faculty Meeting' },
      night:     { locationName: 'Administration',  coords: CAMPUS_COORDS.Administration, action: 'Grading' },
    },
    dialogue: [
      'Welcome to the campus! Security starts with awareness.',
      'Have you completed the campus orientation checklist?',
    ],
  },

  // 2. Emma — Robotics student, Innovation Lab
  {
    id: 'npc_emma',
    name: 'Emma',
    role: 'Student · Robotics Engineering',
    color: '#8b5cf6',
    speed: 2.2,
    schedule: {
      morning:   { locationName: 'InnovationLab', coords: CAMPUS_COORDS.InnovationLab, action: 'Building Drones' },
      lunch:     { locationName: 'Cafe',           coords: CAMPUS_COORDS.Cafe,          action: 'Eating' },
      afternoon: { locationName: 'Library',        coords: CAMPUS_COORDS.Library,       action: 'Studying Schematics' },
      evening:   { locationName: 'StudentPlaza',   coords: CAMPUS_COORDS.StudentPlaza,  action: 'Gaming Lounge' },
      night:     { locationName: 'Dormitory',      coords: CAMPUS_COORDS.Dormitory,     action: 'Sleeping' },
    },
    dialogue: [
      'Robots don\'t make cybersecurity mistakes — humans do!',
      'Have you visited the robotics hangar in the Innovation Lab?',
    ],
  },

  // 3. Kai — Cybersecurity student
  {
    id: 'npc_kai',
    name: 'Kai',
    role: 'Student · Cybersecurity',
    color: '#f59e0b',
    speed: 2.5,
    schedule: {
      morning:   { locationName: 'CyberLab',    coords: CAMPUS_COORDS.CyberLab,  action: 'Security Auditing' },
      lunch:     { locationName: 'Cafe',         coords: CAMPUS_COORDS.Cafe,      action: 'Eating' },
      afternoon: { locationName: 'Library',      coords: CAMPUS_COORDS.Library,   action: 'Reading Papers' },
      evening:   { locationName: 'Dormitory',    coords: CAMPUS_COORDS.Dormitory, action: 'Locking Workstations' },
      night:     { locationName: 'Dormitory',    coords: CAMPUS_COORDS.Dormitory, action: 'Sleeping' },
    },
    dialogue: [
      'Rule number one: never plug in a random USB drive.',
      'Is your password longer than 16 characters?',
    ],
  },

  // 4. Sophia — Computer Science student
  {
    id: 'npc_sophia',
    name: 'Sophia',
    role: 'Student · Computer Science',
    color: '#ec4899',
    speed: 2.0,
    schedule: {
      morning:   { locationName: 'Library',      coords: CAMPUS_COORDS.Library,      action: 'Studying Algorithms' },
      lunch:     { locationName: 'Cafe',         coords: CAMPUS_COORDS.Cafe,         action: 'Eating' },
      afternoon: { locationName: 'CyberLab',     coords: CAMPUS_COORDS.CyberLab,     action: 'Lab Session' },
      evening:   { locationName: 'Garden',       coords: CAMPUS_COORDS.Garden,       action: 'Relaxing' },
      night:     { locationName: 'Dormitory',    coords: CAMPUS_COORDS.Dormitory,    action: 'Sleeping' },
    },
    dialogue: [
      'I\'ve been reading about zero-day exploits — fascinating and terrifying.',
      'The campus Wi-Fi is open; always use a VPN!',
    ],
  },

  // 5. Lucas — Data Science student
  {
    id: 'npc_lucas',
    name: 'Lucas',
    role: 'Student · Data Science',
    color: '#14b8a6',
    speed: 2.3,
    schedule: {
      morning:   { locationName: 'Library',       coords: CAMPUS_COORDS.Library,      action: 'Data Analysis' },
      lunch:     { locationName: 'Cafe',          coords: CAMPUS_COORDS.Cafe,         action: 'Eating' },
      afternoon: { locationName: 'StudentPlaza',  coords: CAMPUS_COORDS.StudentPlaza, action: 'Study Group' },
      evening:   { locationName: 'InnovationLab', coords: CAMPUS_COORDS.InnovationLab, action: 'ML Project' },
      night:     { locationName: 'Dormitory',     coords: CAMPUS_COORDS.Dormitory,    action: 'Sleeping' },
    },
    dialogue: [
      'I found a suspicious USB on a bench — I reported it to security immediately.',
      'Data integrity is everything. Back up your work!',
    ],
  },

  // 6. Mia — VR / Digital Arts student
  {
    id: 'npc_mia',
    name: 'Mia',
    role: 'Student · Digital Arts',
    color: '#f43f5e',
    speed: 1.9,
    schedule: {
      morning:   { locationName: 'ArtStudio',    coords: CAMPUS_COORDS.ArtStudio,    action: 'Designing Visuals' },
      lunch:     { locationName: 'Cafe',         coords: CAMPUS_COORDS.Cafe,         action: 'Eating' },
      afternoon: { locationName: 'Garden',       coords: CAMPUS_COORDS.Garden,       action: 'Sketching' },
      evening:   { locationName: 'StudentPlaza', coords: CAMPUS_COORDS.StudentPlaza, action: 'Social Hour' },
      night:     { locationName: 'Dormitory',    coords: CAMPUS_COORDS.Dormitory,    action: 'Sleeping' },
    },
    dialogue: [
      'I always lock my screen before stepping away — second nature now!',
      'Someone sent me a suspicious email — I forwarded it straight to IT.',
    ],
  },

  // 7. Receptionist — Administration Building (static)
  {
    id: 'npc_receptionist',
    name: 'Receptionist',
    role: 'Staff · Administration',
    color: '#64748b',
    speed: 0,
    schedule: {
      morning:   { locationName: 'Administration', coords: [0, 0, -26], action: 'On Duty' },
      lunch:     { locationName: 'Administration', coords: [0, 0, -26], action: 'On Duty' },
      afternoon: { locationName: 'Administration', coords: [0, 0, -26], action: 'On Duty' },
      evening:   { locationName: 'Administration', coords: [0, 0, -26], action: 'Closing Up' },
      night:     { locationName: 'Administration', coords: [0, 0, -26], action: 'Off Duty' },
    },
    dialogue: [
      'Welcome to the Administration building! Please sign in with your student ID.',
      'All visitors must present a valid badge. No exceptions.',
    ],
  },

  // 8. Security Guard — Main Plaza entrance (static)
  {
    id: 'npc_guard',
    name: 'Security Guard',
    role: 'Staff · Campus Security',
    color: '#22c55e',
    speed: 0,
    schedule: {
      morning:   { locationName: 'Plaza', coords: [0, 0, -10], action: 'Patrolling Entrance' },
      lunch:     { locationName: 'Plaza', coords: [0, 0, -10], action: 'On Post' },
      afternoon: { locationName: 'Plaza', coords: [0, 0, -10], action: 'On Post' },
      evening:   { locationName: 'Plaza', coords: [0, 0, -10], action: 'Evening Patrol' },
      night:     { locationName: 'Plaza', coords: [0, 0, -10], action: 'Night Watch' },
    },
    dialogue: [
      'Campus security is everyone\'s responsibility. Stay alert!',
      'If you see something suspicious, report it immediately.',
    ],
  },
];

// ─────────────────────────────────────────────
// Procedurally generated background NPCs (ambiance)
// ─────────────────────────────────────────────
const BG_LOCATIONS = [
  'Plaza', 'Library', 'InnovationLab', 'CyberLab', 'Cafe',
  'Garden', 'StudentPlaza', 'ArtStudio', 'Dormitory', 'VRLab',
];

export const generateNPCs = (): NPCProfile[] => {
  const list: NPCProfile[] = [...KEY_NPCS];

  const getJitteredCoords = (locName: string): [number, number, number] => {
    const base = CAMPUS_COORDS[locName] || [0, 0, 0];
    let x = base[0] + (Math.random() - 0.5) * 8;
    let z = base[2] + (Math.random() - 0.5) * 8;

    // Avoid central plaza fountain (radius 5 at 0,0,0)
    if (locName === 'Plaza') {
      const dist = Math.sqrt(x * x + z * z);
      if (dist < 6.8) {
        const scale = 7.2 / (dist || 1);
        x *= scale;
        z *= scale;
      }
    }
    return [x, 0, z];
  };

  for (let i = 0; i < 15; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName  = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const name      = `${firstName} ${lastName}`;
    const role      = MAJORS[i % MAJORS.length];

    const colors = ['#f43f5e','#ec4899','#a855f7','#6366f1','#3b82f6','#06b6d4','#14b8a6','#10b981'];
    const color = colors[i % colors.length];
    
    // Set speed to 0 to make them stationary, preventing straight-line walking through solid buildings
    const speed = 0;

    const morningLoc   = BG_LOCATIONS[i % BG_LOCATIONS.length];
    const afternoonLoc = BG_LOCATIONS[(i + 2) % BG_LOCATIONS.length];
    const eveningLoc   = BG_LOCATIONS[(i + 4) % BG_LOCATIONS.length];

    const schedule: NPCSchedule = {
      morning:   { locationName: morningLoc,   coords: getJitteredCoords(morningLoc),   action: 'Studying' },
      lunch:     { locationName: 'Cafe',        coords: getJitteredCoords('Cafe'),        action: 'Eating Lunch' },
      afternoon: { locationName: afternoonLoc,  coords: getJitteredCoords(afternoonLoc),  action: 'Working on Project' },
      evening:   { locationName: eveningLoc,    coords: getJitteredCoords(eveningLoc),    action: 'Socializing' },
      night:     { locationName: 'Dormitory',   coords: getJitteredCoords('Dormitory'),   action: 'Sleeping' },
    };

    list.push({
      id: `npc_bg_${i}`,
      name,
      role,
      color,
      speed,
      schedule,
      dialogue: [`Hey! I'm studying ${role} here at CyberQuest Campus!`],
    });
  }

  return list;
};

export const npcDatabase = generateNPCs();
export default npcDatabase;
