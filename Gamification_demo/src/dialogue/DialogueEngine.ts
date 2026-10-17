import { create } from 'zustand';
import { useBigFiveStore } from '../psychology/BigFiveEngine';
import type { BigFiveTraits } from '../psychology/BigFiveEngine';
import { useCyberRiskStore } from '../cyber/CyberRiskEngine';
import type { CyberRiskProfile } from '../cyber/CyberRiskEngine';
import audioManager from '../audio/AudioManager';

export interface DialogueChoice {
  text: string;
  nextNodeId: string;
  telemetry?: {
    description: string;
    traits?: Partial<BigFiveTraits>;
    cyber?: {
      category: keyof CyberRiskProfile;
      riskDelta: number;
    };
  };
}

export interface DialogueNode {
  id: string;
  speaker: string;
  speakerPortrait?: string; // URL/path to avatar
  lines: string[];
  choices?: DialogueChoice[];
  nextNodeId?: string | null; // Next node if there are no choices
}

interface DialogueStore {
  isOpen: boolean;
  nodes: Record<string, DialogueNode>;
  currentNodeId: string | null;
  currentLineIndex: number;
  onCompleteCallback: (() => void) | null;
  
  // Getters
  getCurrentNode: () => DialogueNode | null;
  getCurrentLine: () => string | null;

  // Actions
  startDialogue: (nodesList: DialogueNode[], startNodeId: string, onComplete?: () => void) => void;
  advanceDialogue: () => void;
  selectChoice: (choice: DialogueChoice) => void;
  closeDialogue: () => void;
}

export const useDialogueStore = create<DialogueStore>((set, get) => ({
  isOpen: false,
  nodes: {},
  currentNodeId: null,
  currentLineIndex: 0,
  onCompleteCallback: null,

  getCurrentNode: () => {
    const { nodes, currentNodeId } = get();
    if (!currentNodeId) return null;
    return nodes[currentNodeId] || null;
  },

  getCurrentLine: () => {
    const node = get().getCurrentNode();
    if (!node) return null;
    return node.lines[get().currentLineIndex] || null;
  },

  startDialogue: (nodesList, startNodeId, onComplete) => {
    const nodesMap: Record<string, DialogueNode> = {};
    nodesList.forEach((n) => {
      nodesMap[n.id] = n;
    });

    set({
      nodes: nodesMap,
      currentNodeId: startNodeId,
      currentLineIndex: 0,
      isOpen: true,
      onCompleteCallback: onComplete || null,
    });
    audioManager.playSFX('dialogue_open');
  },

  advanceDialogue: () => {
    const { currentNodeId, currentLineIndex, nodes } = get();
    if (!currentNodeId) return;

    const node = nodes[currentNodeId];
    if (!node) return;

    audioManager.playSFX('dialogue_click');

    // If there are more lines in the current node, advance to the next line
    if (currentLineIndex < node.lines.length - 1) {
      set({ currentLineIndex: currentLineIndex + 1 });
    } else {
      // If we are at the last line, check if there are choices to show
      if (node.choices && node.choices.length > 0) {
        // Stop here and wait for choice selection (handled in UI)
        return;
      }

      // If no choices, check for nextNodeId
      if (node.nextNodeId) {
        set({
          currentNodeId: node.nextNodeId,
          currentLineIndex: 0,
        });
      } else {
        // End of dialogue
        get().closeDialogue();
      }
    }
  },

  selectChoice: (choice) => {
    // Record telemetry if present
    if (choice.telemetry) {
      const { description, traits, cyber } = choice.telemetry;

      // Log Big Five adjustments
      if (traits) {
        useBigFiveStore.getState().recordAction(
          `dialogue_${choice.nextNodeId}`,
          `Dialogue Choice: ${description}`,
          traits
        );
      }

      // Log Cybersecurity behaviors
      if (cyber) {
        useCyberRiskStore.getState().recordIncident(
          `dialogue_${choice.nextNodeId}`,
          cyber.category,
          `Dialogue Risk Action: ${description}`,
          cyber.riskDelta
        );
      }
    }

    audioManager.playSFX('dialogue_choice');

    // Transition to the next node
    set({
      currentNodeId: choice.nextNodeId,
      currentLineIndex: 0,
    });
  },

  closeDialogue: () => {
    const { onCompleteCallback } = get();
    set({
      isOpen: false,
      currentNodeId: null,
      currentLineIndex: 0,
      nodes: {},
    });
    audioManager.playSFX('dialogue_close');
    if (onCompleteCallback) {
      onCompleteCallback();
      set({ onCompleteCallback: null });
    }
  },
}));
