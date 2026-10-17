import type { DialogueNode } from './DialogueEngine';

// ─────────────────────────────────────────────────────────────────────────────
// STORY DIALOGUES DATABASE
// Holds all branching dialogues for the 5-quest flow and 6 side quests.
// ─────────────────────────────────────────────────────────────────────────────

// ─── 1. PROFESSOR ORION ──────────────────────────────────────────────────────
export const orionQuest1: DialogueNode[] = [
  {
    id: 'orion_q1_start',
    speaker: 'Professor Orion',
    lines: [
      'Welcome to Aether Institute! I am Professor Orion, director of the Cyber Risk program.',
      'Every new student spends their first day exploring the campus, meeting people, and learning about our community before starting core training.',
      'We believe in active participation. I want you to walk around and discover our campus sectors.',
      'Ready to begin your orientation journey?'
    ],
    choices: [
      {
        text: 'Absolutely! I am excited to look around.',
        nextNodeId: 'orion_q1_accept',
        telemetry: {
          description: 'Orion Q1: Accepted orientation enthusiastically',
          traits: { extraversion: +0.3, openness: +0.2 }
        }
      },
      {
        text: 'Sure, I suppose I should get to know the layout.',
        nextNodeId: 'orion_q1_accept',
        telemetry: {
          description: 'Orion Q1: Accepted orientation neutrally',
          traits: { conscientiousness: +0.2 }
        }
      }
    ]
  },
  {
    id: 'orion_q1_accept',
    speaker: 'Professor Orion',
    lines: [
      'Excellent. First, let\'s orient you with our core sectors.',
      'Go and visit: the Library, the Innovation Lab, the Cafe, and the Botanical Garden.',
      'Get a feel for the environment. I\'ll stay here at the Plaza. Off you go!'
    ],
    nextNodeId: null
  }
];

export const orionQuest2Pending: DialogueNode[] = [
  {
    id: 'orion_q2_pending',
    speaker: 'Professor Orion',
    lines: [
      'Take your time exploring the campus. Visit the Library, the Innovation Lab, the Cafe, and the Garden.',
      'Let the peaceful surroundings sink in, and return to me once you have seen them all.'
    ],
    nextNodeId: null
  }
];

export const orionQuest3Start: DialogueNode[] = [
  {
    id: 'orion_q3_start',
    speaker: 'Professor Orion',
    lines: [
      'Welcome back! You\'ve visited all the main sectors. The campus feels peaceful today, doesn\'t it?',
      'A campus is nothing without its community. Next, I want you to meet your fellow students.',
      'Introduce yourself to Emma at the Innovation Lab, Kai at the Cyber Lab, Sophia at the Library, Lucas near the Student Plaza, and Mia in the Garden.',
      'Go hear their stories and build some connections!'
    ],
    nextNodeId: null
  }
];

export const orionQuest3Pending: DialogueNode[] = [
  {
    id: 'orion_q3_pending',
    speaker: 'Professor Orion',
    lines: [
      'Have you introduced yourself to the other students yet?',
      'Emma, Kai, Sophia, Lucas, and Mia are all waiting to meet you. Seek them out!'
    ],
    nextNodeId: null
  }
];

export const orionQuest4Start: DialogueNode[] = [
  {
    id: 'orion_q4_start',
    speaker: 'Professor Orion',
    lines: [
      'Wonderful! You\'ve made connection with the student body. They speak highly of your conversations.',
      'At Aether, we support each other. Some of our community members could use a hand with small tasks.',
      'Look around campus and see how you can help Emma, Lucas, Sophia, Mia, and the garden keeper.',
      'Oh, and if you have a moment, a warm coffee from the Cafe would help me get through these security audits!'
    ],
    nextNodeId: null
  }
];

export const orionQuest4Pending: DialogueNode[] = [
  {
    id: 'orion_q4_pending',
    speaker: 'Professor Orion',
    lines: [
      'How are the chores going? Help our students out, and remember that warm coffee if you get a chance!',
      'Let me know when the campus is fully assisted.'
    ],
    nextNodeId: null
  }
];

export const orionCoffeeComplete: DialogueNode[] = [
  {
    id: 'orion_coffee_start',
    speaker: 'Professor Orion',
    lines: [
      'Ah, is that the coffee I smell? Thank you so much! Just what I needed.'
    ],
    choices: [
      {
        text: 'Happy to help, Professor! Enjoy.',
        nextNodeId: 'orion_coffee_end',
        telemetry: {
          description: 'Orion Coffee: Friendly delivery',
          traits: { agreeableness: +0.4 }
        }
      },
      {
        text: 'Here you go. Let me know if you need anything else.',
        nextNodeId: 'orion_coffee_end',
        telemetry: {
          description: 'Orion Coffee: Professional delivery',
          traits: { conscientiousness: +0.3 }
        }
      }
    ]
  },
  {
    id: 'orion_coffee_end',
    speaker: 'Professor Orion',
    lines: [
      'You are showing excellent citizenship. Keep helping others around campus!'
    ],
    nextNodeId: null
  }
];

export const orionQuest5Start: DialogueNode[] = [
  {
    id: 'orion_q5_start',
    speaker: 'Professor Orion',
    lines: [
      'Incredible! You have helped everyone on campus today. You\'ve shown agreeableness, diligence, and responsibility.',
      'You are fully prepared for the next level.',
      'Here is your Cyber Lab Key Fob. Tomorrow, we begin your advanced Cyber Security Training.',
      'Use this fob to enter the Cyber Lab and report to Kai for your final setup. Enjoy your evening!'
    ],
    nextNodeId: null
  }
];

export const orionQuest5Pending: DialogueNode[] = [
  {
    id: 'orion_q5_pending',
    speaker: 'Professor Orion',
    lines: [
      'Use your new Key Fob to enter the Cyber Lab and complete the first day setup with Kai.'
    ],
    nextNodeId: null
  }
];


// ─── 2. EMMA ────────────────────────────────────────────────────────────────
export const emmaMeetDialogue: DialogueNode[] = [
  {
    id: 'emma_meet',
    speaker: 'Emma',
    lines: [
      'Hey! Welcome! You must be the new student Orion mentioned! I\'m Emma.',
      'I\'m a Robotics Major. I\'m currently building a custom package delivery drone.',
      'Hey, we were just about to head to the student lounge for a group introduction. Would you like to join us?'
    ],
    choices: [
      {
        text: 'I\'d love to! COLLABORATIVE introduction sounds great.',
        nextNodeId: 'emma_meet_sociable',
        telemetry: {
          description: 'Emma Meet: Join student group',
          traits: { extraversion: +0.5, agreeableness: +0.2 }
        }
      },
      {
        text: 'Maybe later. I am still orienting myself.',
        nextNodeId: 'emma_meet_neutral',
        telemetry: {
          description: 'Emma Meet: Join group later',
          traits: { extraversion: +0.0 }
        }
      },
      {
        text: 'I\'d rather not. I prefer to explore on my own.',
        nextNodeId: 'emma_meet_reserved',
        telemetry: {
          description: 'Emma Meet: Decline student group',
          traits: { extraversion: -0.5 }
        }
      }
    ]
  },
  {
    id: 'emma_meet_sociable',
    speaker: 'Emma',
    lines: [
      'Awesome! That\'s the spirit. You\'re going to fit in perfectly here!',
      'Let\'s catch up later at the Lab.'
    ],
    nextNodeId: null
  },
  {
    id: 'emma_meet_neutral',
    speaker: 'Emma',
    lines: [
      'No worries! Take your time. Catch you around!'
    ],
    nextNodeId: null
  },
  {
    id: 'emma_meet_reserved',
    speaker: 'Emma',
    lines: [
      'Understandable. Solitude is great for focus! See you later.'
    ],
    nextNodeId: null
  }
];

export const emmaSideStart: DialogueNode[] = [
  {
    id: 'emma_side_start',
    speaker: 'Emma',
    lines: [
      'Hey! I have a favor to ask. I have a huge stack of heavy robotics manuals to bring to the Library.',
      'But my hands are completely full carrying this quadcopter drone controller.',
      'Could you pick them up and drop them off on the study desk inside the Library for me?'
    ],
    choices: [
      {
        text: 'Of course! I\'ll take care of it right now.',
        nextNodeId: 'emma_side_accept',
        telemetry: {
          description: 'Emma Side: Help carry books',
          traits: { agreeableness: +0.5, conscientiousness: +0.2 }
        }
      },
      {
        text: 'Sorry, I\'m in the middle of exploring. Maybe later.',
        nextNodeId: 'emma_side_decline',
        telemetry: {
          description: 'Emma Side: Refused to help carry books',
          traits: { agreeableness: -0.3 }
        }
      }
    ]
  },
  {
    id: 'emma_side_accept',
    speaker: 'Emma',
    lines: [
      'You\'re a lifesaver! I left the manuals on the low table just outside the Innovation Lab door. Pick them up and drop them off in the Library.'
    ],
    nextNodeId: null
  },
  {
    id: 'emma_side_decline',
    speaker: 'Emma',
    lines: [
      'No problem! I\'ll figure something out.'
    ],
    nextNodeId: null
  }
];

export const emmaSideProgress: DialogueNode[] = [
  {
    id: 'emma_side_progress',
    speaker: 'Emma',
    lines: [
      'The stack of manuals is on the table outside. Drop them off on the study desk in the Library. Thanks again!'
    ],
    nextNodeId: null
  }
];

export const emmaSideComplete: DialogueNode[] = [
  {
    id: 'emma_side_complete',
    speaker: 'Emma',
    lines: [
      'Oh! You delivered the manuals? Awesome, the librarian messaged me that they arrived safely.',
      'Thanks for helping me out!'
    ],
    nextNodeId: null
  }
];


// ─── 3. KAI ─────────────────────────────────────────────────────────────────
export const kaiMeetDialogue: DialogueNode[] = [
  {
    id: 'kai_meet',
    speaker: 'Kai',
    lines: [
      'Hello. I\'m Kai. I handle network auditing here.',
      'I was checking the campus subnet. Someone left their workspace computer logged in with full access.',
      'Should we look through their files to find out who it is, or just lock it immediately?'
    ],
    choices: [
      {
        text: 'Lock it immediately. Security policy says no unattended sessions.',
        nextNodeId: 'kai_meet_secure',
        telemetry: {
          description: 'Kai Meet: Lock workstation immediately',
          traits: { conscientiousness: +0.5 },
          cyber: { category: 'deviceSecurityRisk', riskDelta: -20 }
        }
      },
      {
        text: 'Look for their info first so we can warn them directly.',
        nextNodeId: 'kai_meet_helpful',
        telemetry: {
          description: 'Kai Meet: Look at files to warn student',
          traits: { agreeableness: +0.4, conscientiousness: +0.1 },
          cyber: { category: 'deviceSecurityRisk', riskDelta: +10 }
        }
      },
      {
        text: 'Leave it alone. It\'s not our business.',
        nextNodeId: 'kai_meet_ignore',
        telemetry: {
          description: 'Kai Meet: Ignore logged-in workstation',
          traits: { conscientiousness: -0.5 },
          cyber: { category: 'deviceSecurityRisk', riskDelta: +15 }
        }
      }
    ]
  },
  {
    id: 'kai_meet_secure',
    speaker: 'Kai',
    lines: [
      'Exactly. Leaving terminals unlocked is a massive security leak. I locked it and left a security note.',
      'Nice logical thinking.'
    ],
    nextNodeId: null
  },
  {
    id: 'kai_meet_helpful',
    speaker: 'Kai',
    lines: [
      'Kind of you, but looking through files violates privacy and exposes details.',
      'Still, your intention to help is nice. I locked it and left a ticket.'
    ],
    nextNodeId: null
  },
  {
    id: 'kai_meet_ignore',
    speaker: 'Kai',
    lines: [
      'A bit risky. If a malicious actor walked past, they would have complete access.',
      'Well, see you around.'
    ],
    nextNodeId: null
  }
];

export const kaiGenericDialogue: DialogueNode[] = [
  {
    id: 'kai_generic',
    speaker: 'Kai',
    lines: [
      'Hey. Cyber security is built on continuous monitoring.',
      'Keep your eyes open and audit your environment.'
    ],
    nextNodeId: null
  }
];

export const kaiQuest5Dialogue: DialogueNode[] = [
  {
    id: 'kai_q5_start',
    speaker: 'Kai',
    lines: [
      'Welcome to the Cyber Security Lab. I\'ll be your guide for today\'s cyber risk assessment.',
      'We\'ve set up six interactive scenarios on these computers representing daily technology situations.',
      'For each scenario, pick what you would do, and then indicate how likely you are to engage in that behavior in real life.',
      'Remember, there are no right or wrong answers. Let\'s begin.'
    ],
    nextNodeId: null
  }
];


// ─── 4. SOPHIA ──────────────────────────────────────────────────────────────
export const sophiaMeetDialogue: DialogueNode[] = [
  {
    id: 'sophia_meet',
    speaker: 'Sophia',
    lines: [
      'Hey there! I\'m Sophia. I\'m a CS major but I concentrate on digital aesthetics.',
      'I\'m working on a generative neural art network that renders abstract canvas layouts.',
      'Do you want to experiment with the algorithms and play with the parameters, or should I write standard code?'
    ],
    choices: [
      {
        text: 'Let\'s experiment! Creative coding is all about visual exploration.',
        nextNodeId: 'sophia_meet_creative',
        telemetry: {
          description: 'Sophia Meet: Experiment with generative art',
          traits: { openness: +0.5, extraversion: +0.2 }
        }
      },
      {
        text: 'Stick to the standard code first. Verify baseline stability.',
        nextNodeId: 'sophia_meet_standard',
        telemetry: {
          description: 'Sophia Meet: Follow standard baseline coding',
          traits: { conscientiousness: +0.4, openness: +0.1 }
        }
      },
      {
        text: 'I don\'t have much interest in abstract digital art.',
        nextNodeId: 'sophia_meet_decline',
        telemetry: {
          description: 'Sophia Meet: Declined creative coding interest',
          traits: { openness: -0.5 }
        }
      }
    ]
  },
  {
    id: 'sophia_meet_creative',
    speaker: 'Sophia',
    lines: [
      'Yes! Designing is about breaking boundaries and seeing what emerges.',
      'Look at this cyan glow! Talk to you later.'
    ],
    nextNodeId: null
  },
  {
    id: 'sophia_meet_standard',
    speaker: 'Sophia',
    lines: [
      'Logical. Rigorous software engineering makes beautiful art load faster anyway!',
      'Thanks for the advice.'
    ],
    nextNodeId: null
  },
  {
    id: 'sophia_meet_decline',
    speaker: 'Sophia',
    lines: [
      'Ah, no problem. Everyone has their own interests! Good luck.'
    ],
    nextNodeId: null
  }
];

export const sophiaSideStart: DialogueNode[] = [
  {
    id: 'sophia_side_start',
    speaker: 'Sophia',
    lines: [
      'Oh, thank goodness you\'re here. I\'ve lost my Student ID Badge!',
      'I must have dropped it somewhere outside when signing in at the Administration building.',
      'Without it, I can\'t log into the graphics computers. Can you help me find it?'
    ],
    choices: [
      {
        text: 'Absolutely, I\'ll go look around Administration.',
        nextNodeId: 'sophia_side_accept',
        telemetry: {
          description: 'Sophia Side: Accept ID search',
          traits: { agreeableness: +0.4, conscientiousness: +0.2 }
        }
      },
      {
        text: 'Sorry, I\'m busy right now.',
        nextNodeId: 'sophia_side_decline',
        telemetry: {
          description: 'Sophia Side: Declined ID search',
          traits: { agreeableness: -0.2 }
        }
      }
    ]
  },
  {
    id: 'sophia_side_accept',
    speaker: 'Sophia',
    lines: [
      'Thanks a million! I remember standing near the security booth or the front stairs of Administration.'
    ],
    nextNodeId: null
  },
  {
    id: 'sophia_side_decline',
    speaker: 'Sophia',
    lines: [
      'Okay, I\'ll ask around. Hope it shows up.'
    ],
    nextNodeId: null
  }
];

export const sophiaSideProgress: DialogueNode[] = [
  {
    id: 'sophia_side_progress',
    speaker: 'Sophia',
    lines: [
      'Did you find the ID card near Administration yet?'
    ],
    nextNodeId: null
  }
];

export const sophiaSideComplete: DialogueNode[] = [
  {
    id: 'sophia_side_complete',
    speaker: 'Sophia',
    lines: [
      'Oh! You found it! Yes, this is my Student ID. Thank you so much!',
      'Now I can log in and render my designs. You\'re awesome!'
    ],
    nextNodeId: null
  }
];


// ─── 5. LUCAS ───────────────────────────────────────────────────────────────
export const lucasMeetDialogue: DialogueNode[] = [
  {
    id: 'lucas_meet',
    speaker: 'Lucas',
    lines: [
      'Yo! I\'m Lucas. Data Science candidate.',
      'I\'m analyzing ML models. I bet I can write a faster sorting algorithm than anyone in our class!',
      'Hey, I found a bug in Emma\'s delivery drone script. Should I tell her directly so she can fix it, or submit it to the leaderboard to gain competitive points?'
    ],
    choices: [
      {
        text: 'Tell her directly. Collaborative engineering is more productive.',
        nextNodeId: 'lucas_meet_collaborative',
        telemetry: {
          description: 'Lucas Meet: Advised collaboration',
          traits: { agreeableness: +0.5 }
        }
      },
      {
        text: 'Submit it to the leaderboard! Friendly competition makes everyone sharper.',
        nextNodeId: 'lucas_meet_competitive',
        telemetry: {
          description: 'Lucas Meet: Advised competition',
          traits: { agreeableness: -0.1, extraversion: +0.3 }
        }
      },
      {
        text: 'Keep it to yourself. Let her find her own bugs.',
        nextNodeId: 'lucas_meet_selfish',
        telemetry: {
          description: 'Lucas Meet: Advised hiding bugs',
          traits: { agreeableness: -0.5 }
        }
      }
    ]
  },
  {
    id: 'lucas_meet_collaborative',
    speaker: 'Lucas',
    lines: [
      'Yeah, you\'re probably right. Emma\'s drone is cool and breaking it doesn\'t help anyone.',
      'I\'ll send her a message. See ya!'
    ],
    nextNodeId: null
  },
  {
    id: 'lucas_meet_competitive',
    speaker: 'Lucas',
    lines: [
      'Haha, yes! Climb that leaderboard. She\'ll see my commit and write even better code next time!',
      'Thanks for the spark!'
    ],
    nextNodeId: null
  },
  {
    id: 'lucas_meet_selfish',
    speaker: 'Lucas',
    lines: [
      'Oof, cold! But I guess debugging is a core skill. I\'ll think about it.'
    ],
    nextNodeId: null
  }
];

export const lucasSideStart: DialogueNode[] = [
  {
    id: 'lucas_side_start',
    speaker: 'Lucas',
    lines: [
      'Man, I\'m in trouble. I lost my Data Science Notebook! It has all my linear algebra formulas for the test.',
      'I was studying at the Cafe outdoor patio earlier and eating a snack.',
      'Could you check if it is still lying around there? I\'m panicking.'
    ],
    choices: [
      {
        text: 'Sure, I\'ll head to the Cafe patio and check.',
        nextNodeId: 'lucas_side_accept',
        telemetry: {
          description: 'Lucas Side: Accepted notebook search',
          traits: { agreeableness: +0.4, conscientiousness: +0.2 }
        }
      },
      {
        text: 'Sorry, I\'m busy right now.',
        nextNodeId: 'lucas_side_decline',
        telemetry: {
          description: 'Lucas Side: Declined notebook search',
          traits: { agreeableness: -0.2 }
        }
      }
    ]
  },
  {
    id: 'lucas_side_accept',
    speaker: 'Lucas',
    lines: [
      'Thanks! It\'s a dark blue notebook. Check the outdoor wooden benches or tables.'
    ],
    nextNodeId: null
  },
  {
    id: 'lucas_side_decline',
    speaker: 'Lucas',
    lines: [
      'Okay, I\'ll keep looking myself.'
    ],
    nextNodeId: null
  }
];

export const lucasSideProgress: DialogueNode[] = [
  {
    id: 'lucas_side_progress',
    speaker: 'Lucas',
    lines: [
      'Did you find the blue notebook at the Cafe patio yet?'
    ],
    nextNodeId: null
  }
];

export const lucasSideComplete: DialogueNode[] = [
  {
    id: 'lucas_side_complete',
    speaker: 'Lucas',
    lines: [
      'Yes! My notebook! You found it! Thank goodness, my notes are saved.',
      'You are a life saver, classmate!'
    ],
    nextNodeId: null
  }
];


// ─── 6. MIA ─────────────────────────────────────────────────────────────────
export const miaMeetDialogue: DialogueNode[] = [
  {
    id: 'mia_meet',
    speaker: 'Mia',
    lines: [
      'Hello, nice to meet you. I\'m Mia.',
      'I\'m compiling survey data about how personality affects cybersecurity habits.',
      'The dean is coming for a surprise lab inspection in five minutes, and our survey sheets are a total mess.',
      'How do you handle sudden stressful deadlines like this?'
    ],
    choices: [
      {
        text: 'Stay calm, prioritize tasks, and execute methodically.',
        nextNodeId: 'mia_meet_calm',
        telemetry: {
          description: 'Mia Meet: Handled stress calmly',
          traits: { neuroticism: -0.5, conscientiousness: +0.3 }
        }
      },
      {
        text: 'Get worried, but speed up to get it done.',
        nextNodeId: 'mia_meet_worried',
        telemetry: {
          description: 'Mia Meet: Handled stress with worry',
          traits: { neuroticism: +0.2 }
        }
      },
      {
        text: 'Panic! A surprise inspection in 5 minutes is impossible.',
        nextNodeId: 'mia_meet_panic',
        telemetry: {
          description: 'Mia Meet: Handled stress with panic',
          traits: { neuroticism: +0.5 }
        }
      }
    ]
  },
  {
    id: 'mia_meet_calm',
    speaker: 'Mia',
    lines: [
      'Excellent response. Emotional stability keeps team projects alive under fire.',
      'Let\'s get to work.'
    ],
    nextNodeId: null
  },
  {
    id: 'mia_meet_worried',
    speaker: 'Mia',
    lines: [
      'Natural. A bit of anxiety is normal, but as long as it makes you work faster, it can be channelled!'
    ],
    nextNodeId: null
  },
  {
    id: 'mia_meet_panic',
    speaker: 'Mia',
    lines: [
      'Oh dear! Don\'t panic. We can just take a deep breath. It\'s only a checklist!'
    ],
    nextNodeId: null
  }
];

export const miaSideStart: DialogueNode[] = [
  {
    id: 'mia_side_start',
    speaker: 'Mia',
    lines: [
      'Hi! I\'m finalizing the survey calibration.',
      'Could you answer three quick situational questions for me? It will help model student behaviors.'
    ],
    choices: [
      {
        text: 'Sure, I would love to help with the study.',
        nextNodeId: 'mia_q1',
        telemetry: {
          description: 'Mia Side: Agreed to surveys',
          traits: { agreeableness: +0.4, openness: +0.2 }
        }
      },
      {
        text: 'I\'m a bit busy exploring right now.',
        nextNodeId: 'mia_side_decline',
        telemetry: {
          description: 'Mia Side: Declined surveys',
          traits: { agreeableness: -0.2 }
        }
      }
    ]
  },
  {
    id: 'mia_side_decline',
    speaker: 'Mia',
    lines: [
      'Okay, maybe later. Let me know if you change your mind.'
    ],
    nextNodeId: null
  },
  {
    id: 'mia_q1',
    speaker: 'Mia',
    lines: [
      'Question 1: You receive an email from "Campus IT Admin" asking you to log into a link to check certificate updates. What is your response?'
    ],
    choices: [
      {
        text: 'Report the email as suspicious immediately.',
        nextNodeId: 'mia_q2',
        telemetry: {
          description: 'Mia Q1: Secure phishing answer',
          traits: { conscientiousness: +0.4 },
          cyber: { category: 'phishingSusceptibility', riskDelta: -20 }
        }
      },
      {
        text: 'Click the link and log in to avoid account suspension.',
        nextNodeId: 'mia_q2',
        telemetry: {
          description: 'Mia Q1: Risky phishing answer',
          traits: { conscientiousness: -0.4 },
          cyber: { category: 'phishingSusceptibility', riskDelta: +25 }
        }
      }
    ]
  },
  {
    id: 'mia_q2',
    speaker: 'Mia',
    lines: [
      'Interesting. Question 2: How do you manage your digital passwords?'
    ],
    choices: [
      {
        text: 'Use a unique password for each account and store them in a secure manager.',
        nextNodeId: 'mia_q3',
        telemetry: {
          description: 'Mia Q2: Secure password answer',
          traits: { conscientiousness: +0.4 },
          cyber: { category: 'passwordHygiene', riskDelta: -15 }
        }
      },
      {
        text: 'Reuse one memorable password across my accounts so I don\'t forget.',
        nextNodeId: 'mia_q3',
        telemetry: {
          description: 'Mia Q2: Risky password answer',
          traits: { conscientiousness: -0.3 },
          cyber: { category: 'passwordHygiene', riskDelta: +20 }
        }
      }
    ]
  },
  {
    id: 'mia_q3',
    speaker: 'Mia',
    lines: [
      'Got it. Final question: A close classmate asks to share your VPN access token to quickly download a project file. Do you share it?'
    ],
    choices: [
      {
        text: 'Politely refuse. Sharing network credentials violates institute policy.',
        nextNodeId: 'mia_complete',
        telemetry: {
          description: 'Mia Q3: Secure credentials sharing answer',
          traits: { conscientiousness: +0.4 },
          cyber: { category: 'socialEngineeringRisk', riskDelta: -15 }
        }
      },
      {
        text: 'Share it. They are a friend and need help.',
        nextNodeId: 'mia_complete',
        telemetry: {
          description: 'Mia Q3: Risky credentials sharing answer',
          traits: { agreeableness: +0.3, conscientiousness: -0.3 },
          cyber: { category: 'socialEngineeringRisk', riskDelta: +25 }
        }
      }
    ]
  },
  {
    id: 'mia_complete',
    speaker: 'Mia',
    lines: [
      'Perfect! That completes my survey dataset calibration.',
      'Thanks for participating. This is extremely helpful!'
    ],
    nextNodeId: null
  }
];

export const miaSideComplete: DialogueNode[] = [
  {
    id: 'mia_side_complete',
    speaker: 'Mia',
    lines: [
      'Thanks again for completing the calibration survey! Have a great day.'
    ],
    nextNodeId: null
  }
];


// ─── 7. RECEPTIONIST ────────────────────────────────────────────────────────
export const receptionistGeneric: DialogueNode[] = [
  {
    id: 'receptionist_start',
    speaker: 'Receptionist',
    lines: [
      'Hello. Welcome to the Administration building. Please sign in with your student ID badge.',
      'Is there something I can assist you with today?'
    ],
    choices: [
      {
        text: 'I\'ll sign in properly right now.',
        nextNodeId: 'receptionist_secure',
        telemetry: {
          description: 'Receptionist: Sign-in compliant',
          traits: { conscientiousness: +0.4 },
          cyber: { category: 'socialEngineeringRisk', riskDelta: -15 }
        }
      },
      {
        text: 'I\'ll just step in for a minute without signing. I\'m in a rush.',
        nextNodeId: 'receptionist_bypass',
        telemetry: {
          description: 'Receptionist: Sign-in bypass attempt',
          traits: { conscientiousness: -0.4 },
          cyber: { category: 'socialEngineeringRisk', riskDelta: +20 }
        }
      }
    ]
  },
  {
    id: 'receptionist_secure',
    speaker: 'Receptionist',
    lines: [
      'Thank you. Compliance makes campus safety work. Enjoy your stay!'
    ],
    nextNodeId: null
  },
  {
    id: 'receptionist_bypass',
    speaker: 'Receptionist',
    lines: [
      'Excuse me! Please return and register. Security protocols are mandatory.'
    ],
    nextNodeId: null
  }
];


// ─── 8. SECURITY GUARD ──────────────────────────────────────────────────────
export const guardGeneric: DialogueNode[] = [
  {
    id: 'guard_start',
    speaker: 'Security Guard',
    lines: [
      'Halt. Please present your student ID card.',
      'We\'ve had reports of tailgating and unauthorized access attempts recently.'
    ],
    choices: [
      {
        text: 'Certainly, here is my card.',
        nextNodeId: 'guard_secure',
        telemetry: {
          description: 'Guard: Showed ID compliant',
          traits: { conscientiousness: +0.3 },
          cyber: { category: 'socialEngineeringRisk', riskDelta: -10 }
        }
      },
      {
        text: 'I forgot it in my dorm. Can you make an exception just once?',
        nextNodeId: 'guard_bypass',
        telemetry: {
          description: 'Guard: ID bypass request',
          traits: { conscientiousness: -0.3, agreeableness: +0.2 },
          cyber: { category: 'socialEngineeringRisk', riskDelta: +20 }
        }
      }
    ]
  },
  {
    id: 'guard_secure',
    speaker: 'Security Guard',
    lines: [
      'Perfect. Safe and sound. Continue on, candidate!'
    ],
    nextNodeId: null
  },
  {
    id: 'guard_bypass',
    speaker: 'Security Guard',
    lines: [
      'Sorry, no badge means no entry. I cannot compromise security protocol.'
    ],
    nextNodeId: null
  }
];
