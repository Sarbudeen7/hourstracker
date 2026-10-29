import { DEFAULT_HOURS } from '../constants/defaultData';

const STORAGE_KEY_PREFIX = 'output40_day_';
const STREAK_KEY = 'output40_streak';

export function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadDayData(dateKey = getTodayKey()) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${dateKey}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading day data', err);
  }

  // Initial structure for a fresh day
  const blocks = {};
  DEFAULT_HOURS.forEach((h) => {
    blocks[h.id] = {
      id: h.id,
      label: h.label,
      isRecharge: h.isRecharge,
      plannedGoal: '',
      status: 'unlogged', // 'unlogged' | 'creator' | 'consumer' | 'wasted' | 'recharge'
      outputProof: '',
      goalAligned: true,
      watchedMedia: false,
      mediaJustification: '',
      appOpened: '',
      failureReason: '',
      timestamp: null
    };
  });

  return {
    date: dateKey,
    blocks,
    dailyTheme: 'Radical Output: Zero Excuses',
    targetHours: 16
  };
}

export function saveDayData(dayData, dateKey = getTodayKey()) {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${dateKey}`, JSON.stringify(dayData));
  } catch (err) {
    console.error('Error saving day data', err);
  }
}

export function loadStreak() {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading streak', err);
  }
  return { currentStreak: 1, bestStreak: 1, lastLoggedDate: getTodayKey() };
}

export function saveStreak(streak) {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  } catch (err) {
    console.error('Error saving streak', err);
  }
}
