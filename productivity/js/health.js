/* =========================================================
   HEALTH.JS
   ========================================================= */

let healthTab = 'overview';

function findTodayEntry(path) {
  const arr = pathGet(path);
  return arr.find(x => x.date === todayKey());
}

function setWater(delta) {
  let entry = findTodayEntry('health.water');
  if (!entry) { entry = addItem('health.water', { date: todayKey(), glasses: 0, goal: 8 }); }
  entry.glasses = Math.max(0, entry.glasses + delta);
  if (delta > 0) awardXP('water');
  save();
  renderHealth();
}

function saveSleep() {
  const hours = parseFloat(document.getElementById('sleep-hours').value) || 0;
  const quality = document.getElementById('sleep-quality').value;
  let entry = findTodayEntry('health.sleep');
  if (entry) updateItem('health.sleep', entry.id, { hours, quality });
  else addItem('health.sleep', { hours, quality }, 'sleep');
  toast('Sleep logged', 'success');
  renderHealth();
}

function saveMood(mood) {
  let entry = findTodayEntry('health.mood');
  if (entry) updateItem('health.mood', entry.id, { mood });
  else addItem('health.mood', { mood }, 'mood');
  renderHealth();
}

function saveSteps() {
  const count = parseInt(document.getElementById('steps-count').value) || 0;
  const goal = parseInt(document.getElementById('steps-goal').value) || 8000;
  let entry = findTodayEntry('health.steps');
  if (entry) updateItem('health.steps', entry.id, { count, goal });
  else addItem('health.steps', { count, goal }, 'steps');
  toast('Steps logged', 'success');
  renderHealth();
}

function openWorkoutModal() {
  openModal('Log workout', `
    <div class="field"><label>Type</label><input id="wk-type" placeholder="e.g. Running, Strength, Yoga" /></div>
    <div class="field-row">
      <div class="field"><label>Duration (min)</label><input type="number" id="wk-dur" value="30" min="1" /></div>
      <div class="field"><label>Date</label><input type="date" id="wk-date" value="${todayKey()}" /></div>
    </div>
    <div class="field"><label>Notes</label><textarea id="wk-notes"></textarea></div>
    <div class="modal-actions"><button class="btn btn-primary" id="wk-save">Log workout</button></div>
  `, {
    onMount: root => root.querySelector('#wk-save').addEventListener('click', () => {
      const type = root.querySelector('#wk-type').value.trim();
      if (!type) return toast('Add a workout type', 'danger');
      addItem('health.workouts', { type, duration: parseInt(root.querySelector('#wk-dur').value) || 30, date: root.querySelector('#wk-date').value, notes: root.querySelector('#wk-notes').value.trim() }, 'workout');
      closeModal(); renderHealth();
    })
  });
}

function openWeightModal() {
  openModal('Log weight', `
    <div class="field-row">
      <div class="field"><label>Weight</label><input type="number" step="0.1" id="wt-val" /></div>
      <div class="field"><label>Unit</label><select id="wt-unit"><option value="kg">kg</option><option value="lb">lb</option></select></div>
    </div>
    <div class="field"><label>Date</label><input type="date" id="wt-date" value="${todayKey()}" /></div>
    <div class="modal-actions"><button class="btn btn-primary" id="wt-save">Log weight</button></div>
  `, {
    onMount: root => root.querySelector('#wt-save').addEventListener('click', () => {
      const val = parseFloat(root.querySelector('#wt-val').value);
      if (!val) return toast('Enter a weight', 'danger');
      addItem('health.weight', { value: val, unit: root.querySelector('#wt-unit').value, date: root.querySelector('#wt-date').value }, 'weight');
      closeModal(); renderHealth();
    })
  });
}

function renderHealth() {
  const view = document.getElementById('view-health');
  const todayWater = findTodayEntry('health.water') || { glasses: 0, goal: 8 };
  const todaySleep = findTodayEntry('health.sleep');
  const todaySteps = findTodayEntry('health.steps') || { count: 0, goal: 8000 };
  const todayMood = findTodayEntry('health.mood');

  view.innerHTML = `
    <div class="page-head"><div><h1>Health & Lifestyle</h1><div class="sub">Small habits, tracked daily.</div></div></div>
    <div class="tabs">
      ${['overview','water','sleep','workouts','weight','steps','mood'].map(t => `<button class="tab-btn ${healthTab===t?'active':''}" data-t="${t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}
    </div>
    <div id="health-body"></div>
  `;
  view.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => { healthTab = b.dataset.t; renderHealth(); }));
  const body = document.getElementById('health-body');

  if (healthTab === 'overview') {
    body.innerHTML = `
      <div class="grid grid-4 mb-8">
        <div class="card stat-card"><div class="stat-icon">💧</div><div class="stat-val mono">${todayWater.glasses}/${todayWater.goal}</div><div class="stat-label">Glasses today</div></div>
        <div class="card stat-card"><div class="stat-icon">😴</div><div class="stat-val mono">${todaySleep ? todaySleep.hours + 'h' : '—'}</div><div class="stat-label">Sleep last night</div></div>
        <div class="card stat-card"><div class="stat-icon">👣</div><div class="stat-val mono">${todaySteps.count}</div><div class="stat-label">Steps today</div></div>
        <div class="card stat-card"><div class="stat-icon">🙂</div><div class="stat-val mono">${todayMood ? todayMood.mood : '—'}</div><div class="stat-label">Mood today</div></div>
      </div>
      <div class="grid grid-2">
        <div class="card"><div class="card-head"><h3>Weight trend</h3></div><div class="chart-box short"><canvas id="weight-chart"></canvas></div></div>
        <div class="card"><div class="card-head"><h3>Sleep hours (14 days)</h3></div><div class="chart-box short"><canvas id="sleep-chart"></canvas></div></div>
      </div>
    `;
    if (DB.health.weight.length) {
      const sorted = [...DB.health.weight].sort((a, b) => a.date.localeCompare(b.date));
      lineChart('weight-chart', sorted.map(w => fmtShort(w.date)), [{ label: `Weight (${sorted[0].unit})`, data: sorted.map(w => w.value) }]);
    } else {
      document.getElementById('weight-chart').closest('.card').querySelector('.chart-box').innerHTML = emptyState('⚖️', 'No weight logged yet.', 'Log weight', `onclick="openWeightModal()"`);
    }
    const last14 = lastNDays(14);
    const sleepData = last14.map(d => DB.health.sleep.find(s => s.date === d)?.hours || 0);
    barChart('sleep-chart', last14.map(fmtShort), [{ label: 'Hours', data: sleepData }]);
  }

  if (healthTab === 'water') {
    body.innerHTML = `
      <div class="card" style="max-width:360px">
        <div class="card-head"><h3>Water intake today</h3></div>
        <div class="pomo-wrap">
          <div class="stat-val mono" style="font-size:40px">${todayWater.glasses} / ${todayWater.goal}</div>
          <div class="pomo-controls">
            <button class="btn btn-primary" onclick="setWater(1)">+ Glass</button>
            <button class="btn" onclick="setWater(-1)">- Glass</button>
          </div>
          ${progressBar(Math.round((todayWater.glasses / todayWater.goal) * 100))}
        </div>
      </div>
      <div class="card mt-16"><div class="card-head"><h3>Last 14 days</h3></div><div class="chart-box short"><canvas id="water-history"></canvas></div></div>
    `;
    const last14 = lastNDays(14);
    const data = last14.map(d => DB.health.water.find(w => w.date === d)?.glasses || 0);
    barChart('water-history', last14.map(fmtShort), [{ label: 'Glasses', data }]);
  }

  if (healthTab === 'sleep') {
    body.innerHTML = `
      <div class="card" style="max-width:360px">
        <div class="card-head"><h3>Log last night's sleep</h3></div>
        <div class="field"><label>Hours slept</label><input type="number" id="sleep-hours" step="0.5" value="${todaySleep?.hours || ''}" /></div>
        <div class="field"><label>Quality</label><select id="sleep-quality"><option value="poor" ${todaySleep?.quality==='poor'?'selected':''}>Poor</option><option value="okay" ${!todaySleep||todaySleep.quality==='okay'?'selected':''}>Okay</option><option value="good" ${todaySleep?.quality==='good'?'selected':''}>Good</option><option value="great" ${todaySleep?.quality==='great'?'selected':''}>Great</option></select></div>
        <button class="btn btn-primary btn-block" onclick="saveSleep()">Save</button>
      </div>
      <div class="card mt-16"><div class="card-head"><h3>Last 14 nights</h3></div><div class="chart-box short"><canvas id="sleep-history"></canvas></div></div>
    `;
    const last14 = lastNDays(14);
    const data = last14.map(d => DB.health.sleep.find(s => s.date === d)?.hours || 0);
    barChart('sleep-history', last14.map(fmtShort), [{ label: 'Hours', data }]);
  }

  if (healthTab === 'workouts') {
    body.innerHTML = `<div class="flex-between mb-8"><span class="sub">${DB.health.workouts.length} workouts logged</span><button class="btn btn-sm btn-primary" onclick="openWorkoutModal()">+ Log workout</button></div><div class="list" id="wk-list"></div>`;
    const items = [...DB.health.workouts].sort((a, b) => b.date.localeCompare(a.date));
    document.getElementById('wk-list').innerHTML = items.length ? items.map(w => `
      <div class="row"><div class="row-main"><div class="row-title">${escapeHTML(w.type)}</div><div class="row-meta">${fmtDate(w.date)}${w.notes ? ' · ' + escapeHTML(w.notes) : ''}</div></div><div class="mono muted">${w.duration}m</div></div>
    `).join('') : emptyState('💪', 'No workouts logged yet.', '+ Log workout', `onclick="openWorkoutModal()"`);
  }

  if (healthTab === 'weight') {
    body.innerHTML = `<div class="flex-between mb-8"><span class="sub">${DB.health.weight.length} entries</span><button class="btn btn-sm btn-primary" onclick="openWeightModal()">+ Log weight</button></div><div class="card"><div class="chart-box"><canvas id="weight-full-chart"></canvas></div></div>`;
    if (DB.health.weight.length) {
      const sorted = [...DB.health.weight].sort((a, b) => a.date.localeCompare(b.date));
      lineChart('weight-full-chart', sorted.map(w => fmtShort(w.date)), [{ label: `Weight (${sorted[0].unit})`, data: sorted.map(w => w.value) }]);
    } else {
      document.getElementById('weight-full-chart').closest('.card').innerHTML = emptyState('⚖️', 'No weight logged yet.', 'Log weight', `onclick="openWeightModal()"`);
    }
  }

  if (healthTab === 'steps') {
    body.innerHTML = `
      <div class="card" style="max-width:360px">
        <div class="card-head"><h3>Today's steps</h3></div>
        <div class="field"><label>Steps</label><input type="number" id="steps-count" value="${todaySteps.count}" /></div>
        <div class="field"><label>Goal</label><input type="number" id="steps-goal" value="${todaySteps.goal}" /></div>
        <button class="btn btn-primary btn-block" onclick="saveSteps()">Save</button>
        ${progressBar(Math.round((todaySteps.count/todaySteps.goal)*100))}
      </div>
      <div class="card mt-16"><div class="card-head"><h3>Last 14 days</h3></div><div class="chart-box short"><canvas id="steps-history"></canvas></div></div>
    `;
    const last14 = lastNDays(14);
    const data = last14.map(d => DB.health.steps.find(s => s.date === d)?.count || 0);
    barChart('steps-history', last14.map(fmtShort), [{ label: 'Steps', data }]);
  }

  if (healthTab === 'mood') {
    body.innerHTML = `
      <div class="card" style="max-width:420px">
        <div class="card-head"><h3>How are you feeling today?</h3></div>
        <div class="flex gap-12" style="justify-content:center; font-size:30px">
          ${MOODS.map(m => `<button class="icon-btn" style="width:44px;height:44px;font-size:24px;${todayMood?.mood===m?'background:var(--accent-soft)':''}" onclick="saveMood('${m}')">${m}</button>`).join('')}
        </div>
      </div>
      <div class="card mt-16"><div class="card-head"><h3>Mood calendar (30 days)</h3></div><div class="flex gap-8" style="flex-wrap:wrap" id="mood-cal"></div></div>
    `;
    const last30 = lastNDays(30);
    document.getElementById('mood-cal').innerHTML = last30.map(d => {
      const m = DB.health.mood.find(x => x.date === d);
      return `<div class="tree" title="${d}">${m ? m.mood : '·'}</div>`;
    }).join('');
  }
}

VIEW_RENDERERS.health = renderHealth;