/* =========================================================
   POMODORO.JS — focus timer + tree forest
   ========================================================= */

const pomoState = {
  mode: 'work', // work | short | long
  remaining: 25 * 60,
  running: false,
  intervalId: null,
  cycleCount: 0
};

function pomoDurations() {
  const s = DB.pomodoro.settings;
  return { work: s.work * 60, short: s.shortBreak * 60, long: s.longBreak * 60 };
}

function pickTreeSpecies() {
  const total = DB.pomodoro.forest.trees.length;
  const streak = DB.gamification.streakGlobal;
  let pool = ['🌱', '🌿'];
  if (total >= 10) pool = pool.concat(['🌳', '🌴']);
  if (total >= 25) pool = pool.concat(['🌸', '🎋']);
  if (streak >= 14 || total >= 50) pool = pool.concat(['🌲', '🎄']);
  return pool[Math.floor(Math.random() * pool.length)];
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 660; g.gain.value = 0.08;
    o.start(); setTimeout(() => { o.stop(); ctx.close(); }, 260);
  } catch (e) { /* audio not available */ }
}

function pomoStart() {
  if (pomoState.running) return;
  pomoState.running = true;
  pomoState.intervalId = setInterval(pomoTick, 1000);
  updatePomoButtons();
}
function pomoPause() {
  pomoState.running = false;
  clearInterval(pomoState.intervalId);
  updatePomoButtons();
}
function pomoReset() {
  pomoPause();
  pomoState.remaining = pomoDurations()[pomoState.mode];
  renderPomoRing();
}
function pomoSetMode(mode) {
  pomoPause();
  pomoState.mode = mode;
  pomoState.remaining = pomoDurations()[mode];
  renderPomoUI();
}

function pomoTick() {
  pomoState.remaining--;
  if (pomoState.remaining <= 0) {
    pomoComplete();
  }
  renderPomoRing();
}

function pomoComplete() {
  pomoPause();
  beep();
  const durations = pomoDurations();
  const minutesDone = Math.round(durations[pomoState.mode] / 60);
  const sess = { date: todayKey(), duration: minutesDone, type: pomoState.mode, completedAt: new Date().toISOString() };
  DB.pomodoro.sessions.push(sess);

  if (pomoState.mode === 'work') {
    awardXP('pomodoro');
    const species = pickTreeSpecies();
    DB.pomodoro.forest.trees.push({ id: uid(), species, plantedAt: todayKey() });
    pomoState.cycleCount++;
    toast(`Session complete! You planted a ${species}`, 'success');
    const sessionsBeforeLong = DB.pomodoro.settings.sessionsBeforeLong || 4;
    pomoState.mode = (pomoState.cycleCount % sessionsBeforeLong === 0) ? 'long' : 'short';
  } else {
    toast('Break over — ready to focus again?', 'default');
    pomoState.mode = 'work';
  }
  pomoState.remaining = pomoDurations()[pomoState.mode];
  save();
  renderPomoUI();
  if (document.getElementById('view-dashboard').classList.contains('active')) renderDashboard();
}

function updatePomoButtons() {
  const startBtn = document.getElementById('pomo-start');
  if (!startBtn) return;
  startBtn.textContent = pomoState.running ? '⏸ Pause' : '▶ Start';
}

function renderPomoRing() {
  const durations = pomoDurations();
  const total = durations[pomoState.mode];
  const pct = 1 - (pomoState.remaining / total);
  const circumference = 2 * Math.PI * 108;
  const offset = circumference * (1 - pct);
  const fg = document.getElementById('pomo-fg-ring');
  if (fg) fg.style.strokeDashoffset = offset;
  const t = document.getElementById('pomo-time-text');
  if (t) {
    const m = Math.floor(Math.max(0, pomoState.remaining) / 60);
    const s = Math.max(0, pomoState.remaining) % 60;
    t.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  document.title = pomoState.running ? `${document.getElementById('pomo-time-text')?.textContent || ''} · Ascend` : 'Ascend — Personal Productivity OS';
}

function saveNewPomoSettings() {
  const work = parseInt(document.getElementById('pomo-set-work').value) || 25;
  const short = parseInt(document.getElementById('pomo-set-short').value) || 5;
  const long = parseInt(document.getElementById('pomo-set-long').value) || 15;
  const n = parseInt(document.getElementById('pomo-set-n').value) || 4;
  DB.pomodoro.settings = { ...DB.pomodoro.settings, work, shortBreak: short, longBreak: long, sessionsBeforeLong: n };
  save();
  pomoState.remaining = pomoDurations()[pomoState.mode];
  renderPomoRing();
  toast('Timer settings saved', 'success');
}

function renderForest() {
  const trees = DB.pomodoro.forest.trees;
  const host = document.getElementById('forest-grid');
  if (!host) return;
  if (!trees.length) {
    host.innerHTML = emptyState('🌱', 'Your forest is empty. Complete a focus session to plant your first tree.');
    return;
  }
  host.innerHTML = trees.slice().reverse().slice(0, 200).map(t => `<div class="tree" title="Planted ${fmtDate(t.plantedAt)}">${t.species}</div>`).join('');
}

function renderPomoUI() {
  const view = document.getElementById('view-pomodoro');
  const modeLabels = { work: 'Focus', short: 'Short Break', long: 'Long Break' };
  const s = DB.pomodoro.settings;
  const todaySessions = DB.pomodoro.sessions.filter(x => x.date === todayKey());
  const totalFocusMin = DB.pomodoro.sessions.filter(x => x.type === 'work').reduce((a, b) => a + b.duration, 0);

  view.innerHTML = `
    <div class="page-head">
      <div><h1>Pomodoro & Forest</h1><div class="sub">${DB.pomodoro.forest.trees.length} trees planted · ${minutesToHM(totalFocusMin)} total focus</div></div>
    </div>
    <div class="grid grid-2">
      <div class="card">
        <div class="pomo-wrap">
          <div class="pill-toggle">
            <button class="${pomoState.mode === 'work' ? 'active' : ''}" onclick="pomoSetMode('work')">Focus</button>
            <button class="${pomoState.mode === 'short' ? 'active' : ''}" onclick="pomoSetMode('short')">Short Break</button>
            <button class="${pomoState.mode === 'long' ? 'active' : ''}" onclick="pomoSetMode('long')">Long Break</button>
          </div>
          <div class="pomo-ring">
            <svg width="240" height="240" viewBox="0 0 240 240">
              <circle class="bg-ring" cx="120" cy="120" r="108" fill="none" stroke-width="12"></circle>
              <circle id="pomo-fg-ring" class="fg-ring" cx="120" cy="120" r="108" fill="none" stroke-width="12"
                stroke-dasharray="${2 * Math.PI * 108}" stroke-dashoffset="0"></circle>
            </svg>
            <div class="pomo-time">
              <div class="t" id="pomo-time-text">--:--</div>
              <div class="mode">${modeLabels[pomoState.mode]}</div>
            </div>
          </div>
          <div class="pomo-controls">
            <button class="btn btn-primary" id="pomo-start" onclick="pomoState.running ? pomoPause() : pomoStart()">▶ Start</button>
            <button class="btn" onclick="pomoReset()">↺ Reset</button>
          </div>
          <div class="sub">${todaySessions.filter(s=>s.type==='work').length} focus sessions today</div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Timer settings</h3></div>
        <div class="field-row">
          <div class="field"><label>Focus (min)</label><input type="number" id="pomo-set-work" value="${s.work}" min="1" /></div>
          <div class="field"><label>Short break (min)</label><input type="number" id="pomo-set-short" value="${s.shortBreak}" min="1" /></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Long break (min)</label><input type="number" id="pomo-set-long" value="${s.longBreak}" min="1" /></div>
          <div class="field"><label>Sessions before long break</label><input type="number" id="pomo-set-n" value="${s.sessionsBeforeLong}" min="1" /></div>
        </div>
        <button class="btn btn-primary btn-block" onclick="saveNewPomoSettings()">Save settings</button>
        <div class="divider"></div>
        <div class="card-head"><h3>Today's sessions</h3></div>
        <div class="list">
          ${todaySessions.length ? todaySessions.slice().reverse().map(s => `
            <div class="row"><span class="ic">${s.type === 'work' ? '◍' : '☕'}</span><div class="row-main"><div class="row-title">${s.type === 'work' ? 'Focus' : s.type === 'short' ? 'Short break' : 'Long break'}</div></div><div class="mono muted">${s.duration}m</div></div>
          `).join('') : emptyState('◍', 'No sessions yet today.')}
        </div>
      </div>
    </div>

    <div class="card mt-16">
      <div class="card-head"><h3>Your forest 🌲</h3><span class="sub">Every focus session plants a tree. Consistency unlocks rarer species.</span></div>
      <div class="forest-grid" id="forest-grid"></div>
    </div>
  `;
  renderPomoRing();
  updatePomoButtons();
  renderForest();
}

VIEW_RENDERERS.pomodoro = renderPomoUI;