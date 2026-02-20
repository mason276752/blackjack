import { GameState, GameRules, BalanceHistory } from '../../types/game.types';
import { CountingSystem } from '../../types/game.types';

/**
 * Keys for localStorage
 */
const STORAGE_KEYS = {
  GAME_STATE: 'blackjack_game_state',
  RULES: 'blackjack_rules',
  BALANCE: 'blackjack_balance',
  STATISTICS: 'blackjack_statistics',
  COUNTING_SYSTEM: 'blackjack_counting_system',
} as const;

/**
 * Persisted game data structure
 */
interface PersistedGameData {
  rules: GameRules;
  balance: number;
  statistics: GameState['statistics'];
  countingSystem: CountingSystem;
  balanceHistory: BalanceHistory; // Balance history tracking
  selectedPreset?: 'vegas' | 'single' | 'atlantic' | 'custom'; // Rule preset selection
  lastSaved: string; // ISO timestamp
  version: string; // App version for migration
}

/**
 * Save game state to localStorage
 */
export function saveGameState(state: GameState): void {
  try {
    // Load existing data to preserve selectedPreset
    const existingData = loadGameState();

    const dataToSave: PersistedGameData = {
      rules: state.rules,
      balance: state.balance,
      statistics: state.statistics,
      countingSystem: state.countingSystem,
      balanceHistory: state.balanceHistory,
      selectedPreset: existingData?.selectedPreset, // Preserve existing selectedPreset
      lastSaved: new Date().toISOString(),
      version: '1.0.0',
    };

    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('[Storage] Failed to save game state:', error);
  }
}

/**
 * Load persisted game data from localStorage
 */
export function loadGameState(): PersistedGameData | null {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    if (!savedData) return null;

    const parsed: PersistedGameData = JSON.parse(savedData);

    // Validate data structure
    if (!parsed.rules || typeof parsed.balance !== 'number' || !parsed.statistics) {
      console.warn('[Storage] Invalid saved data structure, ignoring');
      return null;
    }

    // Initialize balanceHistory if missing (backward compatibility)
    if (!parsed.balanceHistory) {
      parsed.balanceHistory = {
        snapshots: [],
        maxSize: 1000,
      };
    }

    // Validate balanceHistory structure
    if (!Array.isArray(parsed.balanceHistory.snapshots)) {
      console.warn('[Storage] Invalid balanceHistory structure, resetting');
      parsed.balanceHistory = {
        snapshots: [],
        maxSize: 1000,
      };
    }

    return parsed;
  } catch (error) {
    console.error('[Storage] Failed to load game state:', error);
    return null;
  }
}

/**
 * Clear all saved game data
 */
export function clearSavedGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    console.log('[Storage] Cleared saved game data');
  } catch (error) {
    console.error('[Storage] Failed to clear saved data:', error);
  }
}

/**
 * Check if saved game data exists
 */
export function hasSavedGame(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.GAME_STATE) !== null;
  } catch {
    return false;
  }
}

/**
 * Get last saved timestamp
 */
export function getLastSavedTime(): Date | null {
  try {
    const savedData = loadGameState();
    return savedData ? new Date(savedData.lastSaved) : null;
  } catch {
    return null;
  }
}

/**
 * Save selected preset to localStorage
 */
export function saveSelectedPreset(preset: 'vegas' | 'single' | 'atlantic' | 'custom'): void {
  try {
    const savedData = loadGameState();
    if (savedData) {
      savedData.selectedPreset = preset;
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(savedData));
    }
  } catch (error) {
    console.error('[Storage] Failed to save selected preset:', error);
  }
}

/**
 * Load selected preset from localStorage
 */
export function loadSelectedPreset(): 'vegas' | 'single' | 'atlantic' | 'custom' | null {
  try {
    const savedData = loadGameState();
    return savedData?.selectedPreset || null;
  } catch {
    return null;
  }
}
