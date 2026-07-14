/* =========================================================
   STORAGE.JS
   Single source of truth. Everything lives in one localStorage
   key as JSON. Every module reads/writes through DB.
   ========================================================= */

const DB_KEY = 'pd_data_v1';

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayKey(d) {
  const dt = d ? new Date(d) : new Date();
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysAgoKey(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return todayKey(d);
}

function defaultData() {
  return {
    meta: { createdAt: todayKey(), version: 1, name: 'Player One', githubUsername: '' },
    settings: { accent: 'indigo', reduceMotion: false, dailyGoalXP: 100, notifications: false },
    gamification: {
      xp: 0, level: 1, badges: [], lastActiveDate: null,
      streakGlobal: 0, longestStreakGlobal: 0
    },
    activityLog: {}, // date -> { count, xp, cats: { habit:0, todo:0, pomodoro:0, ... } }
    habits: [],
    todos: [],
    pomodoro: {
      settings: { work: 25, shortBreak: 5, longBreak: 15, sessionsBeforeLong: 4, autoStart: false },
      sessions: [],
      forest: { trees: [] }
    },
    calendarEvents: [],
    notes: [],
    goals: [],
    projects: [],
    programming: {
      dsaTopics: [], leetcode: [], codingSessions: [], contests: [], interviewPrep: []
    },
    gate: {
      subjects: [], studySessions: [], revisions: [], mockTests: [], pyq: []
    },
    health: {
      water: [], sleep: [], workouts: [], weight: [], steps: [], mood: []
    }
  };
}

function migrate(data) {
  const d = defaultData();
  function deepFill(target, src) {
    for (const k in src) {
      if (!(k in target)) target[k] = src[k];
      else if (typeof src[k] === 'object' && !Array.isArray(src[k]) && src[k] !== null) {
        deepFill(target[k], src[k]);
      }
    }
    return target;
  }
  return deepFill(data || {}, d);
}

let DB = load();

function load() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return defaultData();
    return migrate(JSON.parse(raw));
  } catch (e) {
    console.error('Storage load failed, starting fresh', e);
    return defaultData();
  }
}

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(DB));
    } catch (e) {
      console.error('Storage save failed', e);
      toast('Storage full or unavailable — export your data soon.', 'danger');
    }
  }, 80);
}

// ---- Activity + XP -----------------------------------------------------

const XP_TABLE = {
  habit: 8, todo: 5, pomodoro: 12, study: 10, coding: 10,
  workout: 10, water: 2, sleep: 4, mood: 2, weight: 3, steps: 3,
  note: 3, goal: 15, milestone: 8, mock: 15, revision: 5, leetcode: 8,
  quest: 6
};

function levelForXP(xp) {
  // level thresholds grow ~ quadratically
  let level = 1, need = 100, total = 0;
  while (xp >= total + need) {
    total += need;
    level++;
    need = Math.round(need * 1.18);
  }
  const into = xp - total;
  return { level, into, need };
}

function rankForLevel(level) {
  if (level >= 40) return 'S';
  if (level >= 30) return 'A';
  if (level >= 20) return 'B';
  if (level >= 12) return 'C';
  if (level >= 6) return 'D';
  return 'E';
}

function logActivity(category, amount, dateStr) {
  const date = dateStr || todayKey();
  if (!DB.activityLog[date]) DB.activityLog[date] = { count: 0, xp: 0, cats: {} };
  const entry = DB.activityLog[date];
  entry.count += 1;
  entry.xp += amount;
  entry.cats[category] = (entry.cats[category] || 0) + 1;

  DB.gamification.xp += amount;
  const { level } = levelForXP(DB.gamification.xp);
  const leveledUp = level > DB.gamification.level;
  DB.gamification.level = level;

  updateGlobalStreak(date);
  save();

  if (leveledUp) {
    document.dispatchEvent(new CustomEvent('pd:levelup', { detail: { level } }));
    toast(`Level up! You reached Level ${level}`, 'success');
  }
  checkBadges();
  document.dispatchEvent(new CustomEvent('pd:activity', { detail: { category, amount, date } }));
}

function updateGlobalStreak(date) {
  const g = DB.gamification;
  if (g.lastActiveDate === date) return;
  const yesterday = daysAgoKey(1);
  if (g.lastActiveDate === yesterday || g.lastActiveDate === null) {
    g.streakGlobal = (g.lastActiveDate === null ? 1 : g.streakGlobal + 1);
  } else if (g.lastActiveDate !== date) {
    g.streakGlobal = 1;
  }
  g.lastActiveDate = date;
  if (g.streakGlobal > g.longestStreakGlobal) g.longestStreakGlobal = g.streakGlobal;
}

function awardXP(category, dateStr) {
  logActivity(category, XP_TABLE[category] || 5, dateStr);
}

// ---- Badges --------------------------------------------------------------

const BADGE_DEFS = [
  { id: 'first_step', name: 'First Step', desc: 'Log your first activity', icon: '🌱', check: () => Object.keys(DB.activityLog).length >= 1 },
  { id: 'streak_3', name: 'Warming Up', desc: '3-day streak', icon: '🔥', check: () => DB.gamification.streakGlobal >= 3 },
  { id: 'streak_7', name: 'One Week Strong', desc: '7-day streak', icon: '🔥', check: () => DB.gamification.streakGlobal >= 7 },
  { id: 'streak_30', name: 'Unstoppable', desc: '30-day streak', icon: '🔥', check: () => DB.gamification.streakGlobal >= 30 },
  { id: 'streak_100', name: 'Centurion', desc: '100-day streak', icon: '💎', check: () => DB.gamification.streakGlobal >= 100 },
  { id: 'level_5', name: 'Novice', desc: 'Reach Level 5', icon: '⭐', check: () => DB.gamification.level >= 5 },
  { id: 'level_10', name: 'Adept', desc: 'Reach Level 10', icon: '⭐', check: () => DB.gamification.level >= 10 },
  { id: 'level_20', name: 'Expert', desc: 'Reach Level 20', icon: '🌟', check: () => DB.gamification.level >= 20 },
  { id: 'level_40', name: 'S-Rank Hunter', desc: 'Reach Level 40', icon: '👑', check: () => DB.gamification.level >= 40 },
  { id: 'habits_1', name: 'Habit Former', desc: 'Create your first habit', icon: '✅', check: () => DB.habits.length >= 1 },
  { id: 'habits_5', name: 'Routine Builder', desc: 'Track 5 habits', icon: '✅', check: () => DB.habits.length >= 5 },
  { id: 'todos_10', name: 'Task Slayer', desc: 'Complete 10 to-dos', icon: '📋', check: () => DB.todos.filter(t => t.done).length >= 10 },
  { id: 'todos_100', name: 'Task Legend', desc: 'Complete 100 to-dos', icon: '📋', check: () => DB.todos.filter(t => t.done).length >= 100 },
  { id: 'pomo_10', name: 'Focused Mind', desc: 'Complete 10 pomodoro sessions', icon: '🍅', check: () => DB.pomodoro.sessions.filter(s => s.type === 'work').length >= 10 },
  { id: 'pomo_50', name: 'Deep Work', desc: 'Complete 50 pomodoro sessions', icon: '🍅', check: () => DB.pomodoro.sessions.filter(s => s.type === 'work').length >= 50 },
  { id: 'forest_10', name: 'Grove Keeper', desc: 'Plant 10 trees', icon: '🌳', check: () => DB.pomodoro.forest.trees.length >= 10 },
  { id: 'forest_50', name: 'Forest Guardian', desc: 'Plant 50 trees', icon: '🌲', check: () => DB.pomodoro.forest.trees.length >= 50 },
  { id: 'notes_10', name: 'Second Brain', desc: 'Write 10 notes', icon: '🧠', check: () => DB.notes.length >= 10 },
  { id: 'goal_1', name: 'Goal Setter', desc: 'Create your first goal', icon: '🎯', check: () => DB.goals.length >= 1 },
  { id: 'goal_done_1', name: 'Goal Getter', desc: 'Complete a goal', icon: '🏆', check: () => DB.goals.filter(g => g.completedAt).length >= 1 },
  { id: 'boss_1', name: 'Boss Slayer', desc: 'Defeat a boss battle goal', icon: '⚔️', check: () => DB.goals.filter(g => g.isBossBattle && g.completedAt).length >= 1 },
  { id: 'dsa_50', name: 'Algorithm Adept', desc: 'Solve 50 DSA problems total', icon: '🧩', check: () => DB.programming.dsaTopics.reduce((s, t) => s + (t.solved || 0), 0) >= 50 },
  { id: 'leetcode_50', name: 'Leet Coder', desc: 'Log 50 LeetCode problems', icon: '💻', check: () => DB.programming.leetcode.length >= 50 },
  { id: 'coding_100h', name: 'Code Marathon', desc: '100 hours of logged coding', icon: '⌨️', check: () => DB.programming.codingSessions.reduce((s, c) => s + c.duration, 0) >= 6000 },
  { id: 'gate_subject_done', name: 'Subject Mastered', desc: 'Complete a GATE subject', icon: '📘', check: () => DB.gate.subjects.some(s => s.progress >= 100) },
  { id: 'mock_10', name: 'Test Veteran', desc: 'Take 10 mock tests', icon: '📝', check: () => DB.gate.mockTests.length >= 10 },
  { id: 'water_goal_7', name: 'Hydrated Week', desc: 'Hit water goal 7 times', icon: '💧', check: () => DB.health.water.filter(w => w.glasses >= w.goal).length >= 7 },
  { id: 'workout_20', name: 'Iron Will', desc: 'Log 20 workouts', icon: '💪', check: () => DB.health.workouts.length >= 20 },
  { id: 'sleep_track_14', name: 'Well Rested', desc: 'Track sleep 14 times', icon: '😴', check: () => DB.health.sleep.length >= 14 },
];

function checkBadges() {
  const earned = new Set(DB.gamification.badges.map(b => b.id));
  let newOnes = [];
  BADGE_DEFS.forEach(def => {
    if (!earned.has(def.id) && def.check()) {
      DB.gamification.badges.push({ id: def.id, earnedAt: todayKey() });
      newOnes.push(def);
    }
  });
  if (newOnes.length) {
    save();
    newOnes.forEach(b => toast(`Badge unlocked: ${b.icon} ${b.name}`, 'success'));
    document.dispatchEvent(new CustomEvent('pd:badges', { detail: newOnes }));
  }
}

// ---- Generic collection helpers ------------------------------------------

function pathGet(path) {
  return path.split('.').reduce((o, k) => o[k], DB);
}

function addItem(path, item, category) {
  const arr = pathGet(path);
  const full = { id: uid(), createdAt: todayKey(), ...item };
  arr.push(full);
  save();
  if (category) awardXP(category);
  return full;
}

function updateItem(path, id, patch) {
  const arr = pathGet(path);
  const idx = arr.findIndex(x => x.id === id);
  if (idx === -1) return null;
  arr[idx] = { ...arr[idx], ...patch };
  save();
  return arr[idx];
}

function deleteItem(path, id) {
  const arr = pathGet(path);
  const idx = arr.findIndex(x => x.id === id);
  if (idx === -1) return false;
  arr.splice(idx, 1);
  save();
  return true;
}

function exportData() {
  const blob = new Blob([JSON.stringify(DB, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `productivity-backup-${todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file, cb) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      DB = migrate(parsed);
      save();
      cb && cb(true);
    } catch (err) {
      console.error(err);
      cb && cb(false);
    }
  };
  reader.readAsText(file);
}

function resetData() {
  DB = defaultData();
  save();
}