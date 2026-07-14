/* =========================================================
   GAMIFICATION.JS — Level Up / Solo Leveling Mode
   ========================================================= */

const RANK_STYLES = {
  E: { color: '#8A90A0', bg: 'rgba(138,144,160,0.12)', glow: 'rgba(138,144,160,0.3)' },
  D: { color: '#34D399', bg: 'rgba(52,211,153,0.12)', glow: 'rgba(52,211,153,0.3)' },
  C: { color: '#38BDF8', bg: 'rgba(56,189,248,0.12)', glow: 'rgba(56,189,248,0.3)' },
  B: { color: '#C084FC', bg: 'rgba(192,132,252,0.12)', glow: 'rgba(192,132,252,0.3)' },
  A: { color: '#F2B84B', bg: 'rgba(242,184,75,0.12)', glow: 'rgba(242,184,75,0.3)' },
  S: { color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)', glow: 'rgba(255,107,107,0.5)' }
};

const ATTRIBUTES = [
  { key: 'habit', label: 'Discipline', icon: '⚡', path: () => DB.habits.filter(h => !h.archived).length * 8 + Object.keys(DB.activityLog).filter(d => DB.activityLog[d].cats?.habit).length * 2 },
  { key: 'focus', label: 'Focus', icon: '🎯', path: () => Math.round(DB.pomodoro.sessions.filter(s => s.type === 'work').length * 1.5) },
  { key: 'coding', label: 'Coding', icon: '💻', path: () => Math.round(DB.programming.codingSessions.reduce((s, c) => s + c.duration, 0) / 10) + DB.programming.leetcode.length },
  { key: 'study', label: 'Knowledge', icon: '📚', path: () => Math.round(DB.gate.studySessions.reduce((s, c) => s + c.duration, 0) / 10) + DB.notes.length * 2 },
  { key: 'health', label: 'Vitality', icon: '💪', path: () => DB.health.workouts.length * 5 + DB.health.sleep.length * 2 + DB.health.water.filter(w => w.glasses >= w.goal).length * 3 },
  { key: 'streak', label: 'Consistency', icon: '🔥', path: () => DB.gamification.longestStreakGlobal * 4 }
];

function computeAttributeScore(attr) {
  const raw = attr.path();
  return Math.min(100, Math.round(raw));
}

const QUESTS = [
  {
    id: 'q_habits_daily', icon: '✓', title: 'Daily Habit Check', desc: 'Complete all active habits today',
    check: () => {
      const active = DB.habits.filter(h => !h.archived);
      if (!active.length) return { done: false, cur: 0, max: 1, pct: 0 };
      const done = active.filter(h => h.completions[todayKey()]).length;
      return { done: done >= active.length, cur: done, max: active.length, pct: Math.round((done / active.length) * 100) };
    }
  },
  {
    id: 'q_pomodoro_4', icon: '🍅', title: 'Four Sessions Focus', desc: 'Complete 4 focus sessions today',
    check: () => {
      const done = DB.pomodoro.sessions.filter(s => s.date === todayKey() && s.type === 'work').length;
      const max = 4;
      return { done: done >= max, cur: done, max, pct: Math.min(100, Math.round((done / max) * 100)) };
    }
  },
  {
    id: 'q_task_5', icon: '☰', title: 'Task Crusher', desc: 'Complete 5 to-do tasks today',
    check: () => {
      const done = DB.todos.filter(t => t.done && t.doneAt === todayKey()).length;
      return { done: done >= 5, cur: done, max: 5, pct: Math.min(100, Math.round((done / 5) * 100)) };
    }
  },
  {
    id: 'q_water_8', icon: '💧', title: 'Hydrated Hero', desc: 'Drink 8 glasses of water today',
    check: () => {
      const entry = DB.health.water.find(w => w.date === todayKey());
      const g = entry ? entry.glasses : 0;
      const goal = entry ? entry.goal : 8;
      return { done: g >= goal, cur: g, max: goal, pct: Math.min(100, Math.round((g / goal) * 100)) };
    }
  },
  {
    id: 'q_xp_100', icon: '⚡', title: 'XP Hunter', desc: 'Earn 100 XP today',
    check: () => {
      const xp = DB.activityLog[todayKey()]?.xp || 0;
      return { done: xp >= 100, cur: xp, max: 100, pct: Math.min(100, Math.round((xp / 100) * 100)) };
    }
  },
  {
    id: 'q_leetcode_1', icon: '🧩', title: 'Algorithm Session', desc: 'Solve at least 1 LeetCode problem today',
    check: () => {
      const done = DB.programming.leetcode.filter(l => l.date === todayKey()).length;
      return { done: done >= 1, cur: done, max: 1, pct: Math.min(100, done * 100) };
    }
  },
  {
    id: 'q_note_1', icon: '✎', title: 'Second Brain Entry', desc: 'Write at least 1 note today',
    check: () => {
      const done = DB.notes.filter(n => n.createdAt === todayKey()).length;
      return { done: done >= 1, cur: done, max: 1, pct: Math.min(100, done * 100) };
    }
  }
];

function renderLevelUp() {
  const g = DB.gamification;
  const { level, into, need } = levelForXP(g.xp);
  const rank = rankForLevel(level);
  const rs = RANK_STYLES[rank];
  const pct = Math.round((into / need) * 100);

  // XP history last 30 days
  const last30 = lastNDays(30);
  const xpPerDay = last30.map(d => DB.activityLog[d]?.xp || 0);

  // Attribute scores
  const attrs = ATTRIBUTES.map(a => ({ ...a, score: computeAttributeScore(a) }));

  // Badges
  const earnedSet = new Set(g.badges.map(b => b.id));
  const earnedBadges = BADGE_DEFS.filter(b => earnedSet.has(b.id));
  const lockedBadges = BADGE_DEFS.filter(b => !earnedSet.has(b.id)).slice(0, 8);

  // Daily quests
  const quests = QUESTS.map(q => ({ ...q, result: q.check() }));

  const view = document.getElementById('view-levelup');
  view.innerHTML = `
    <div class="page-head">
      <div><h1>Level Up — Solo Mode</h1><div class="sub">Your personal growth RPG. Level up by doing real things.</div></div>
    </div>

    <div class="grid grid-2 mb-8">
      <!-- STATUS WINDOW -->
      <div class="status-window">
        <div class="flex gap-16 mb-8" style="align-items:flex-start">
          <div class="rank-badge" style="background: linear-gradient(135deg, ${rs.color}, ${rs.color}88); box-shadow: 0 0 24px ${rs.glow}">${rank}</div>
          <div style="flex:1">
            <div style="font-family:var(--font-display); font-size:22px; font-weight:700">Level ${level}</div>
            <div class="muted" style="font-size:12px; margin-top:2px">Rank ${rank} · ${g.xp.toLocaleString()} total XP</div>
            <div class="pbar mt-8" style="height:8px">
              <div class="pbar-fill" style="width:${pct}%; background: linear-gradient(90deg, ${rs.color}88, ${rs.color})"></div>
            </div>
            <div class="muted" style="font-size:11px; margin-top:4px">${into} / ${need} XP to Level ${level + 1}</div>
          </div>
        </div>
        <div class="divider"></div>
        <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-faint); margin-bottom:10px">Attributes</div>
        ${attrs.map(a => `
          <div class="attr-row">
            <span class="attr-name">${a.icon} ${a.label}</span>
            <div style="flex:1"><div class="pbar thin"><div class="pbar-fill" style="width:${a.score}%; background:${rs.color}"></div></div></div>
            <span class="attr-val">${a.score}</span>
          </div>
        `).join('')}
        <div class="divider"></div>
        <div class="grid grid-3" style="gap:8px">
          <div class="stat-card"><div class="stat-icon">🔥</div><div class="stat-val mono">${g.streakGlobal}</div><div class="stat-label">Current streak</div></div>
          <div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-val mono">${g.longestStreakGlobal}</div><div class="stat-label">Best streak</div></div>
          <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-val mono">${earnedBadges.length}</div><div class="stat-label">Badges earned</div></div>
        </div>
      </div>

      <!-- RADAR + DAILY QUESTS -->
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="card-head"><h3>Attribute Radar</h3></div>
          <div class="chart-box"><canvas id="radar-chart"></canvas></div>
        </div>
      </div>
    </div>

    <!-- Daily Quests -->
    <div class="card mb-8">
      <div class="card-head"><h3>⚔️ Daily Quests</h3><span class="sub">${quests.filter(q => q.result.done).length}/${quests.length} completed</span></div>
      <div class="list">
        ${quests.map(q => `
          <div class="quest-item">
            <span style="font-size:18px">${q.icon}</span>
            <div style="flex:1">
              <div class="row-title ${q.result.done ? '' : ''}" style="${q.result.done ? 'color:var(--success)' : ''}">${q.title} ${q.result.done ? '✓' : ''}</div>
              <div class="row-meta">${q.desc}</div>
              <div class="pbar thin mt-8"><div class="pbar-fill" style="width:${q.result.pct}%; background:${q.result.done ? 'var(--success)' : 'var(--accent)'}"></div></div>
            </div>
            <span class="mono muted" style="font-size:11px">${q.result.cur}/${q.result.max}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- XP Timeline -->
    <div class="card mb-8">
      <div class="card-head"><h3>XP Timeline — last 30 days</h3></div>
      <div class="chart-box"><canvas id="xp-timeline-chart"></canvas></div>
    </div>

    <!-- Badges -->
    <div class="card mb-8">
      <div class="card-head"><h3>🏅 Badges Earned (${earnedBadges.length})</h3></div>
      <div class="badge-grid">
        ${earnedBadges.length ? earnedBadges.map(b => `
          <div class="badge-item">
            <div class="b-icon">${b.icon}</div>
            <div class="b-name">${b.name}</div>
          </div>
        `).join('') : `<div class="muted" style="grid-column:1/-1; text-align:center; padding:20px 0">No badges yet — keep going!</div>`}
      </div>
    </div>

    <!-- Locked badges preview -->
    ${lockedBadges.length ? `
    <div class="card">
      <div class="card-head"><h3>🔒 Next Badges to Unlock</h3></div>
      <div class="badge-grid">
        ${lockedBadges.map(b => `
          <div class="badge-item locked" title="${b.desc}">
            <div class="b-icon">${b.icon}</div>
            <div class="b-name">${b.name}</div>
          </div>
        `).join('')}
      </div>
    </div>` : ''}
  `;

  // Radar chart
  radarChart('radar-chart',
    attrs.map(a => a.label),
    attrs.map(a => a.score)
  );

  // XP timeline
  lineChart('xp-timeline-chart', last30.map(fmtShort), [{ label: 'XP Earned', data: xpPerDay }]);
}

VIEW_RENDERERS.levelup = renderLevelUp;

// Listen to activity events to refresh if on levelup view
document.addEventListener('pd:activity', () => { if (typeof currentView !== 'undefined' && currentView === 'levelup') renderLevelUp(); });
document.addEventListener('pd:badges', () => { if (typeof currentView !== 'undefined' && currentView === 'levelup') renderLevelUp(); });
