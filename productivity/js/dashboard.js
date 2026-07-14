/* =========================================================
   DASHBOARD.JS
   ========================================================= */

function productivityScore() {
  const today = todayKey();
  const todayXP = (DB.activityLog[today]?.xp) || 0;
  const goal = DB.settings.dailyGoalXP || 100;
  const xpScore = Math.min(1, todayXP / goal) * 50;
  const streakScore = Math.min(1, DB.gamification.streakGlobal / 14) * 30;
  const last7 = lastNDays(7);
  const activeDays = last7.filter(d => DB.activityLog[d]).length;
  const consistencyScore = (activeDays / 7) * 20;
  return Math.round(xpScore + streakScore + consistencyScore);
}

function upcomingDeadlines() {
  const items = [];
  DB.todos.filter(t => !t.done && t.due).forEach(t => items.push({ title: t.title, date: t.due, type: 'Task' }));
  DB.goals.filter(g => !g.completedAt && g.targetDate).forEach(g => items.push({ title: g.title, date: g.targetDate, type: g.isBossBattle ? 'Boss Battle' : 'Goal' }));
  DB.calendarEvents.forEach(e => items.push({ title: e.title, date: e.date, type: e.type }));
  DB.gate.mockTests.filter(m => m.date >= todayKey()).forEach(m => items.push({ title: m.name, date: m.date, type: 'Mock Test' }));
  return items.filter(i => i.date >= daysAgoKey(0)).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
}

function recentActivity() {
  const items = [];
  DB.todos.filter(t => t.done && t.doneAt).forEach(t => items.push({ text: `Completed task "${t.title}"`, date: t.doneAt, icon: '☰' }));
  DB.pomodoro.sessions.slice(-15).forEach(s => items.push({ text: `${s.type === 'work' ? 'Focused for' : 'Took a break for'} ${s.duration}m`, date: s.date, icon: '◍' }));
  DB.notes.slice(-10).forEach(n => items.push({ text: `Added ${n.type} note "${n.title || 'Untitled'}"`, date: n.createdAt, icon: '✎' }));
  DB.goals.filter(g => g.completedAt).forEach(g => items.push({ text: `Achieved goal "${g.title}"`, date: g.completedAt, icon: '◎' }));
  DB.health.workouts.slice(-10).forEach(w => items.push({ text: `Logged ${w.type} workout`, date: w.date, icon: '♥' }));
  return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
}

function renderDashboard() {
  const g = DB.gamification;
  const { level, into, need } = levelForXP(g.xp);
  const today = todayKey();
  const todayEntry = DB.activityLog[today] || { count: 0, xp: 0 };
  const habitsToday = DB.habits.filter(h => !h.archived);
  const habitsDoneToday = habitsToday.filter(h => h.completions[today]).length;
  const todosDoneToday = DB.todos.filter(t => t.done && t.doneAt === today).length;
  const focusToday = DB.pomodoro.sessions.filter(s => s.date === today && s.type === 'work').reduce((s, x) => s + x.duration, 0);
  const score = productivityScore();

  const view = document.getElementById('view-dashboard');
  view.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Welcome back, ${escapeHTML(DB.meta.name || 'Player One')}</h1>
        <div class="sub">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} · Level ${level} · ${DB.gamification.streakGlobal}-day streak</div>
      </div>
      <div class="quick-links">
        <button class="quick-link" onclick="goToView('habits')">✓ Habits</button>
        <button class="quick-link" onclick="goToView('todos')">☰ To-Do</button>
        <button class="quick-link" onclick="goToView('pomodoro')">◍ Focus</button>
        <button class="quick-link" onclick="goToView('notes')">✎ Notes</button>
      </div>
    </div>

    <div class="grid grid-stats mb-8">
      <div class="card stat-card"><div class="stat-icon">🏆</div><div class="stat-val mono">${score}</div><div class="stat-label">Productivity score today</div></div>
      <div class="card stat-card"><div class="stat-icon">⚡</div><div class="stat-val mono">${g.xp}</div><div class="stat-label">Total XP · ${todayEntry.xp} today</div></div>
      <div class="card stat-card"><div class="stat-icon">✓</div><div class="stat-val mono">${habitsDoneToday}/${habitsToday.length}</div><div class="stat-label">Habits done today</div></div>
      <div class="card stat-card"><div class="stat-icon">☰</div><div class="stat-val mono">${todosDoneToday}</div><div class="stat-label">Tasks completed today</div></div>
      <div class="card stat-card"><div class="stat-icon">◍</div><div class="stat-val mono">${minutesToHM(focusToday)}</div><div class="stat-label">Focused time today</div></div>
      <div class="card stat-card"><div class="stat-icon">🔥</div><div class="stat-val mono">${g.streakGlobal}</div><div class="stat-label">Day streak · best ${g.longestStreakGlobal}</div></div>
    </div>

    <div class="grid grid-2 mb-8">
      <div class="card">
        <div class="card-head"><h3>Activity — last 26 weeks</h3><span class="sub">${Object.keys(DB.activityLog).length} active days total</span></div>
        <div id="dash-heatmap"></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>This week</h3><span class="sub">activities per day</span></div>
        <div class="chart-box short"><canvas id="dash-week-chart"></canvas></div>
      </div>
    </div>

    <div class="grid grid-3 mb-8">
      <div class="card">
        <div class="card-head"><h3>Time distribution</h3></div>
        <div class="chart-box short"><canvas id="dash-pie-chart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Upcoming</h3></div>
        <div class="list" id="dash-upcoming"></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Recent activity</h3></div>
        <div class="list" id="dash-recent"></div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <div class="card-head"><h3>Goals in progress</h3><button class="btn btn-sm" onclick="goToView('goals')">View all</button></div>
        <div class="list" id="dash-goals"></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Habit streaks</h3><button class="btn btn-sm" onclick="goToView('habits')">View all</button></div>
        <div class="list" id="dash-habits"></div>
      </div>
    </div>
  `;

  // heatmap
  const hmMap = {};
  Object.entries(DB.activityLog).forEach(([d, v]) => hmMap[d] = v.count);
  renderHeatmap(document.getElementById('dash-heatmap'), hmMap, { weeks: 26 });

  // week chart
  const days = lastNDays(7);
  const counts = days.map(d => DB.activityLog[d]?.count || 0);
  barChart('dash-week-chart', days.map(d => fmtShort(d)), [{ label: 'Activities', data: counts }]);

  // pie chart: time distribution
  const codingMin = DB.programming.codingSessions.reduce((s, c) => s + c.duration, 0);
  const studyMin = DB.gate.studySessions.reduce((s, c) => s + c.duration, 0);
  const focusMin = DB.pomodoro.sessions.filter(s => s.type === 'work').reduce((s, c) => s + c.duration, 0);
  const workoutMin = DB.health.workouts.reduce((s, c) => s + c.duration, 0);
  const pieData = [
    ['Coding', codingMin], ['GATE Study', studyMin], ['Deep Focus', focusMin], ['Workouts', workoutMin]
  ].filter(([, v]) => v > 0);
  if (pieData.length) {
    pieChart('dash-pie-chart', pieData.map(p => p[0]), pieData.map(p => p[1]));
  } else {
    document.getElementById('dash-pie-chart').closest('.chart-box').innerHTML = emptyState('📊', 'Log some sessions to see your time distribution.');
  }

  // upcoming
  const up = upcomingDeadlines();
  document.getElementById('dash-upcoming').innerHTML = up.length ? up.map(i => `
    <div class="row"><div class="row-main"><div class="row-title">${escapeHTML(i.title)}</div><div class="row-meta">${escapeHTML(i.type)} · ${fmtDate(i.date)}</div></div></div>
  `).join('') : emptyState('📅', 'Nothing on the horizon.');

  // recent
  const rec = recentActivity();
  document.getElementById('dash-recent').innerHTML = rec.length ? rec.map(i => `
    <div class="row"><span class="ic">${i.icon}</span><div class="row-main"><div class="row-title">${escapeHTML(i.text)}</div><div class="row-meta">${fmtDate(i.date)}</div></div></div>
  `).join('') : emptyState('🕓', 'No activity logged yet — go complete something!');

  // goals
  const activeGoals = DB.goals.filter(g => !g.completedAt).slice(0, 4);
  document.getElementById('dash-goals').innerHTML = activeGoals.length ? activeGoals.map(g => `
    <div class="row"><div class="row-main">
      <div class="row-title">${g.isBossBattle ? '⚔️ ' : ''}${escapeHTML(g.title)}</div>
      <div class="mt-8">${progressBar(g.progress)}</div>
    </div><div class="mono muted">${g.progress}%</div></div>
  `).join('') : emptyState('🎯', 'No active goals yet.', 'Add a goal', `onclick="goToView('goals')"`);

  // habit streaks
  const withStreak = habitsToday.map(h => ({ h, streak: habitStreak(h) })).sort((a, b) => b.streak - a.streak).slice(0, 5);
  document.getElementById('dash-habits').innerHTML = withStreak.length ? withStreak.map(({ h, streak }) => `
    <div class="row"><span class="dot" style="background:${h.color}"></span><div class="row-main"><div class="row-title">${escapeHTML(h.name)}</div></div><div class="mono" style="color:var(--warning)">🔥 ${streak}</div></div>
  `).join('') : emptyState('✓', 'No habits yet.', 'Create a habit', `onclick="goToView('habits')"`);
}

VIEW_RENDERERS.dashboard = renderDashboard;