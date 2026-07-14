/* =========================================================
   ANALYTICS.JS — Full Analytics Dashboard
   ========================================================= */

let analyticsTab = 'overview';

function bestDay() {
  let best = null, bestXP = 0;
  Object.entries(DB.activityLog).forEach(([d, v]) => { if (v.xp > bestXP) { bestXP = v.xp; best = d; } });
  return best ? { date: best, xp: bestXP } : null;
}

function mostProductiveHour() {
  // Use pomodoro completedAt times
  const hours = {};
  DB.pomodoro.sessions.filter(s => s.type === 'work' && s.completedAt).forEach(s => {
    const h = new Date(s.completedAt).getHours();
    hours[h] = (hours[h] || 0) + 1;
  });
  let best = null, bestCount = 0;
  Object.entries(hours).forEach(([h, c]) => { if (c > bestCount) { bestCount = c; best = h; } });
  return best !== null ? `${best}:00–${parseInt(best)+1}:00` : '—';
}

function consistencyScore() {
  const last30 = lastNDays(30);
  const activeDays = last30.filter(d => DB.activityLog[d]).length;
  return Math.round((activeDays / 30) * 100);
}

function monthlyXP(monthsBack) {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth() - monthsBack;
  const d = new Date(y, m, 1);
  const prefix = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  return Object.entries(DB.activityLog)
    .filter(([date]) => date.startsWith(prefix))
    .reduce((s, [, v]) => s + v.xp, 0);
}

function renderAnalytics() {
  const view = document.getElementById('view-analytics');
  view.innerHTML = `
    <div class="page-head">
      <div><h1>Analytics</h1><div class="sub">Deep insights into your productivity patterns.</div></div>
    </div>
    <div class="tabs">
      ${['overview','habits','tasks','focus','health','gate'].map(t => `<button class="tab-btn ${analyticsTab===t?'active':''}" data-t="${t}">${{overview:'Overview',habits:'Habits',tasks:'Tasks',focus:'Focus',health:'Health',gate:'GATE'}[t]}</button>`).join('')}
    </div>
    <div id="analytics-body"></div>
  `;
  view.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => { analyticsTab = b.dataset.t; renderAnalytics(); }));
  const body = document.getElementById('analytics-body');

  if (analyticsTab === 'overview') {
    const bd = bestDay();
    const last7Active = lastNDays(7).filter(d => DB.activityLog[d]).length;
    const totalGoalsDone = DB.goals.filter(g => g.completedAt).length;
    const consistency = consistencyScore();
    const streak = DB.gamification.streakGlobal;
    const longestStreak = DB.gamification.longestStreakGlobal;
    const last6MonthsXP = Array.from({length:6},(_,i)=>monthlyXP(5-i));
    const monthLabels = Array.from({length:6},(_,i)=>{
      const d=new Date(); d.setMonth(d.getMonth()-(5-i));
      return d.toLocaleDateString(undefined,{month:'short'});
    });
    // category breakdown
    const cats = {};
    Object.values(DB.activityLog).forEach(v => { Object.entries(v.cats||{}).forEach(([c,n])=>{ cats[c]=(cats[c]||0)+n; }); });
    const catEntries = Object.entries(cats).sort((a,b)=>b[1]-a[1]);

    body.innerHTML = `
      <div class="grid grid-stats mb-8">
        <div class="card stat-card"><div class="stat-icon">📅</div><div class="stat-val mono">${Object.keys(DB.activityLog).length}</div><div class="stat-label">Active days total</div></div>
        <div class="card stat-card"><div class="stat-icon">🔥</div><div class="stat-val mono">${streak}</div><div class="stat-label">Current streak</div></div>
        <div class="card stat-card"><div class="stat-icon">🏆</div><div class="stat-val mono">${longestStreak}</div><div class="stat-label">Longest streak</div></div>
        <div class="card stat-card"><div class="stat-icon">💯</div><div class="stat-val mono">${consistency}%</div><div class="stat-label">Consistency (30d)</div></div>
        <div class="card stat-card"><div class="stat-icon">📆</div><div class="stat-val mono">${last7Active}/7</div><div class="stat-label">Active days this week</div></div>
        <div class="card stat-card"><div class="stat-icon">🎯</div><div class="stat-val mono">${totalGoalsDone}</div><div class="stat-label">Goals completed</div></div>
      </div>
      <div class="grid grid-2 mb-8">
        <div class="card">
          <div class="card-head"><h3>Activity heatmap — 52 weeks</h3></div>
          <div class="scroll-x" id="an-heatmap-full"></div>
        </div>
        <div class="card">
          <div class="card-head"><h3>XP per month (6 months)</h3></div>
          <div class="chart-box"><canvas id="an-monthly-xp"></canvas></div>
        </div>
      </div>
      <div class="grid grid-2 mb-8">
        <div class="card">
          <div class="card-head"><h3>Best performing day</h3><span class="sub">${bd ? fmtDate(bd.date) : '—'}</span></div>
          <div class="muted" style="font-size:13px">${bd ? `${bd.xp} XP earned on ${fmtDate(bd.date)}` : 'No data yet'}</div>
          <div class="divider"></div>
          <div class="card-head"><h3>Most productive hour</h3></div>
          <div class="stat-val mono">${mostProductiveHour()}</div>
        </div>
        <div class="card">
          <div class="card-head"><h3>Category breakdown</h3></div>
          ${catEntries.length ? `<div class="chart-box short"><canvas id="an-cat-pie"></canvas></div>` : emptyState('📊','Log activities to see breakdown.')}
        </div>
      </div>
      <div class="card mb-8">
        <div class="card-head"><h3>XP trend — last 30 days</h3></div>
        <div class="chart-box"><canvas id="an-xp-30"></canvas></div>
      </div>
    `;
    const hmMap = {};
    Object.entries(DB.activityLog).forEach(([d,v]) => hmMap[d] = v.count);
    renderHeatmap(document.getElementById('an-heatmap-full'), hmMap, { weeks: 52 });
    barChart('an-monthly-xp', monthLabels, [{ label: 'XP', data: last6MonthsXP }]);
    const last30 = lastNDays(30);
    lineChart('an-xp-30', last30.map(fmtShort), [{ label: 'XP', data: last30.map(d => DB.activityLog[d]?.xp || 0) }]);
    if (catEntries.length) pieChart('an-cat-pie', catEntries.map(([k])=>k), catEntries.map(([,v])=>v));
  }

  if (analyticsTab === 'habits') {
    const active = DB.habits.filter(h => !h.archived);
    const totalCompletions = active.reduce((s,h) => s + Object.keys(h.completions).length, 0);
    body.innerHTML = `
      <div class="grid grid-stats mb-8">
        <div class="card stat-card"><div class="stat-icon">✓</div><div class="stat-val mono">${active.length}</div><div class="stat-label">Active habits</div></div>
        <div class="card stat-card"><div class="stat-icon">📊</div><div class="stat-val mono">${totalCompletions}</div><div class="stat-label">Total completions</div></div>
        <div class="card stat-card"><div class="stat-icon">🔥</div><div class="stat-val mono">${active.length ? Math.max(...active.map(h=>habitStreak(h))) : 0}</div><div class="stat-label">Best habit streak</div></div>
      </div>
      ${active.length ? active.map(h => {
        const streak = habitStreak(h);
        const total = Object.keys(h.completions).length;
        const map = {};
        Object.keys(h.completions).forEach(d => map[d] = 1);
        return `<div class="card mb-8">
          <div class="card-head"><h3>${h.icon} ${escapeHTML(h.name)}</h3><span class="mono" style="color:var(--warning)">🔥 ${streak}</span></div>
          <div class="row-meta mb-8">${total} total completions · ${h.frequency}</div>
          <div id="hm-an-${h.id}"></div>
        </div>`;
      }).join('') : emptyState('✓','No habits tracked yet.')}
    `;
    active.forEach(h => {
      const el = document.getElementById(`hm-an-${h.id}`);
      const map = {}; Object.keys(h.completions).forEach(d => map[d] = 1);
      if (el) renderHeatmap(el, map, { weeks: 26, colorFor: v => v ? h.color : 'var(--hm-0)' });
    });
  }

  if (analyticsTab === 'tasks') {
    const done = DB.todos.filter(t => t.done);
    const active = DB.todos.filter(t => !t.done);
    const byPri = { high: done.filter(t=>t.priority==='high').length, med: done.filter(t=>t.priority==='med').length, low: done.filter(t=>t.priority==='low').length };
    const completionMap = {};
    done.filter(t=>t.doneAt).forEach(t=>{ completionMap[t.doneAt]=(completionMap[t.doneAt]||0)+1; });
    const last30 = lastNDays(30);
    body.innerHTML = `
      <div class="grid grid-stats mb-8">
        <div class="card stat-card"><div class="stat-icon">✅</div><div class="stat-val mono">${done.length}</div><div class="stat-label">Tasks completed</div></div>
        <div class="card stat-card"><div class="stat-icon">⏳</div><div class="stat-val mono">${active.length}</div><div class="stat-label">Active tasks</div></div>
        <div class="card stat-card"><div class="stat-icon">🔴</div><div class="stat-val mono">${byPri.high}</div><div class="stat-label">High priority done</div></div>
        <div class="card stat-card"><div class="stat-icon">📅</div><div class="stat-val mono">${done.filter(t=>t.doneAt===todayKey()).length}</div><div class="stat-label">Completed today</div></div>
      </div>
      <div class="card mb-8">
        <div class="card-head"><h3>Daily completions — last 30 days</h3></div>
        <div class="chart-box"><canvas id="an-tasks-chart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Priority breakdown (completed)</h3></div>
        <div class="chart-box short"><canvas id="an-tasks-pie"></canvas></div>
      </div>
    `;
    barChart('an-tasks-chart', last30.map(fmtShort), [{ label: 'Tasks Done', data: last30.map(d=>completionMap[d]||0) }]);
    if (done.length) pieChart('an-tasks-pie', ['High','Medium','Low'], [byPri.high, byPri.med, byPri.low]);
  }

  if (analyticsTab === 'focus') {
    const sessions = DB.pomodoro.sessions.filter(s => s.type === 'work');
    const totalMin = sessions.reduce((s,x)=>s+x.duration,0);
    const last30 = lastNDays(30);
    const focusPerDay = last30.map(d => sessions.filter(s=>s.date===d).reduce((s,x)=>s+x.duration,0));
    const sessionsPerDay = last30.map(d => sessions.filter(s=>s.date===d).length);
    body.innerHTML = `
      <div class="grid grid-stats mb-8">
        <div class="card stat-card"><div class="stat-icon">⏱</div><div class="stat-val mono">${minutesToHM(totalMin)}</div><div class="stat-label">Total focus time</div></div>
        <div class="card stat-card"><div class="stat-icon">🍅</div><div class="stat-val mono">${sessions.length}</div><div class="stat-label">Sessions completed</div></div>
        <div class="card stat-card"><div class="stat-icon">🌲</div><div class="stat-val mono">${DB.pomodoro.forest.trees.length}</div><div class="stat-label">Trees planted</div></div>
        <div class="card stat-card"><div class="stat-icon">📅</div><div class="stat-val mono">${minutesToHM(focusPerDay[focusPerDay.length-1])}</div><div class="stat-label">Focus time today</div></div>
      </div>
      <div class="card mb-8">
        <div class="card-head"><h3>Focus minutes — last 30 days</h3></div>
        <div class="chart-box"><canvas id="an-focus-chart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Sessions per day — last 30 days</h3></div>
        <div class="chart-box"><canvas id="an-sessions-chart"></canvas></div>
      </div>
    `;
    lineChart('an-focus-chart', last30.map(fmtShort), [{ label: 'Minutes', data: focusPerDay }]);
    barChart('an-sessions-chart', last30.map(fmtShort), [{ label: 'Sessions', data: sessionsPerDay }]);
  }

  if (analyticsTab === 'health') {
    const last30 = lastNDays(30);
    const sleepData = last30.map(d => DB.health.sleep.find(s=>s.date===d)?.hours||0);
    const waterData = last30.map(d => DB.health.water.find(w=>w.date===d)?.glasses||0);
    const avgSleep = sleepData.filter(Boolean).reduce((s,x)=>s+x,0) / (sleepData.filter(Boolean).length||1);
    const avgWater = waterData.filter(Boolean).reduce((s,x)=>s+x,0) / (waterData.filter(Boolean).length||1);
    body.innerHTML = `
      <div class="grid grid-stats mb-8">
        <div class="card stat-card"><div class="stat-icon">💪</div><div class="stat-val mono">${DB.health.workouts.length}</div><div class="stat-label">Workouts logged</div></div>
        <div class="card stat-card"><div class="stat-icon">😴</div><div class="stat-val mono">${avgSleep.toFixed(1)}h</div><div class="stat-label">Avg sleep (30d)</div></div>
        <div class="card stat-card"><div class="stat-icon">💧</div><div class="stat-val mono">${avgWater.toFixed(1)}</div><div class="stat-label">Avg glasses/day (30d)</div></div>
      </div>
      <div class="card mb-8">
        <div class="card-head"><h3>Sleep hours — last 30 days</h3></div>
        <div class="chart-box"><canvas id="an-sleep"></canvas></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Water intake — last 30 days</h3></div>
        <div class="chart-box"><canvas id="an-water"></canvas></div>
      </div>
    `;
    barChart('an-sleep', last30.map(fmtShort), [{ label: 'Hours', data: sleepData }]);
    barChart('an-water', last30.map(fmtShort), [{ label: 'Glasses', data: waterData }]);
  }

  if (analyticsTab === 'gate') {
    const G = DB.gate;
    const totalStudyMin = G.studySessions.reduce((s,x)=>s+x.duration,0);
    const last30 = lastNDays(30);
    const studyPerDay = last30.map(d => G.studySessions.filter(s=>s.date===d).reduce((s,x)=>s+x.duration,0));
    body.innerHTML = `
      <div class="grid grid-stats mb-8">
        <div class="card stat-card"><div class="stat-icon">📚</div><div class="stat-val mono">${minutesToHM(totalStudyMin)}</div><div class="stat-label">Total study time</div></div>
        <div class="card stat-card"><div class="stat-icon">📝</div><div class="stat-val mono">${G.mockTests.length}</div><div class="stat-label">Mock tests taken</div></div>
        <div class="card stat-card"><div class="stat-icon">📖</div><div class="stat-val mono">${G.subjects.length}</div><div class="stat-label">Subjects tracked</div></div>
        <div class="card stat-card"><div class="stat-icon">🔁</div><div class="stat-val mono">${G.revisions.length}</div><div class="stat-label">Revisions done</div></div>
      </div>
      <div class="card mb-8">
        <div class="card-head"><h3>Study time — last 30 days</h3></div>
        <div class="chart-box"><canvas id="an-study"></canvas></div>
      </div>
      ${G.subjects.length ? `
      <div class="card">
        <div class="card-head"><h3>Subject progress</h3></div>
        <div class="chart-box"><canvas id="an-gate-sub"></canvas></div>
      </div>` : ''}
    `;
    barChart('an-study', last30.map(fmtShort), [{ label: 'Minutes', data: studyPerDay }]);
    if (G.subjects.length) barChart('an-gate-sub', G.subjects.map(s=>s.name), [{ label: 'Progress %', data: G.subjects.map(s=>s.progress||0) }]);
  }
}

VIEW_RENDERERS.analytics = renderAnalytics;
