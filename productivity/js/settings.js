/* =========================================================
   SETTINGS.JS
   ========================================================= */

const ACCENT_PRESETS = [
  { id: 'indigo', label: 'Indigo', accent: '#6D5EF2', strong: '#8478FF' },
  { id: 'cyan',   label: 'Cyan',   accent: '#0891B2', strong: '#22D3EE' },
  { id: 'rose',   label: 'Rose',   accent: '#E11D48', strong: '#FB7185' },
  { id: 'amber',  label: 'Amber',  accent: '#D97706', strong: '#F59E0B' },
  { id: 'emerald',label: 'Emerald',accent: '#059669', strong: '#34D399' },
  { id: 'violet', label: 'Violet', accent: '#7C3AED', strong: '#A78BFA' },
];

function applyAccent(preset) {
  const p = ACCENT_PRESETS.find(x => x.id === preset) || ACCENT_PRESETS[0];
  document.documentElement.style.setProperty('--accent', p.accent);
  document.documentElement.style.setProperty('--accent-strong', p.strong);
  document.documentElement.style.setProperty('--accent-soft', p.accent + '22');
  document.documentElement.style.setProperty('--hm-1', p.accent + '44');
  document.documentElement.style.setProperty('--hm-2', p.accent + '88');
  document.documentElement.style.setProperty('--hm-3', p.accent + 'BB');
  document.documentElement.style.setProperty('--hm-4', p.strong);
}

function applySettings() {
  applyAccent(DB.settings.accent || 'indigo');
  if (DB.settings.reduceMotion) {
    document.documentElement.style.setProperty('--reduce-motion', '1');
  }
}

function renderSettings() {
  const view = document.getElementById('view-settings');
  const s = DB.settings;
  const m = DB.meta;

  view.innerHTML = `
    <div class="page-head">
      <div><h1>Settings</h1><div class="sub">Customize your experience and manage your data.</div></div>
    </div>
    <div class="grid grid-2">
      <!-- Profile -->
      <div class="card">
        <div class="card-head"><h3>👤 Profile</h3></div>
        <div class="field"><label>Display Name</label><input id="s-name" value="${escapeHTML(m.name||'')}" placeholder="Player One" /></div>
        <div class="field"><label>GitHub Username (for live stats)</label><input id="s-github" value="${escapeHTML(m.githubUsername||'')}" placeholder="yourusername" /></div>
        <div class="field"><label>Daily XP Goal</label><input type="number" id="s-xpgoal" value="${s.dailyGoalXP||100}" min="10" /></div>
        <button class="btn btn-primary" onclick="saveProfile()">Save profile</button>
      </div>

      <!-- Theme -->
      <div class="card">
        <div class="card-head"><h3>🎨 Theme</h3></div>
        <div class="field"><label>Accent color</label>
          <div class="chip-row mt-8" id="accent-presets">
            ${ACCENT_PRESETS.map(p => `
              <button class="chip ${(s.accent||'indigo')===p.id?'selected-chip':''}" onclick="pickAccent('${p.id}')" style="cursor:pointer; border-color:${p.accent}; ${(s.accent||'indigo')===p.id?'background:'+p.accent+'33;color:'+p.strong:''}">
                <span style="width:10px;height:10px;border-radius:50%;background:${p.accent};display:inline-block"></span> ${p.label}
              </button>
            `).join('')}
          </div>
        </div>
        <div class="field" style="margin-top:16px">
          <label><input type="checkbox" id="s-reduce" ${s.reduceMotion?'checked':''} /> Reduce motion</label>
        </div>
        <button class="btn btn-primary mt-8" onclick="saveTheme()">Apply theme</button>
      </div>

      <!-- Data Management -->
      <div class="card">
        <div class="card-head"><h3>💾 Data & Backup</h3></div>
        <p class="muted" style="font-size:12.5px;margin-bottom:16px">All data is stored locally in your browser. Export regularly as backup.</p>
        <div class="list">
          <button class="btn btn-block" onclick="exportData()">⬇ Export data (JSON)</button>
          <label class="btn btn-block" style="cursor:pointer;margin-top:8px">
            ⬆ Import data (JSON)
            <input type="file" accept=".json" style="display:none" onchange="handleImport(this)" />
          </label>
          <button class="btn btn-block btn-danger" style="margin-top:8px" onclick="handleReset()">🗑 Reset all data</button>
        </div>
      </div>

      <!-- Storage Info -->
      <div class="card">
        <div class="card-head"><h3>📊 Storage Info</h3></div>
        <div class="list" id="storage-info"></div>
        <button class="btn btn-sm mt-8" onclick="renderStorageInfo()">Refresh</button>
      </div>
    </div>
  `;

  renderStorageInfo();
}

function saveProfile() {
  DB.meta.name = document.getElementById('s-name').value.trim() || 'Player One';
  DB.meta.githubUsername = document.getElementById('s-github').value.trim();
  DB.settings.dailyGoalXP = parseInt(document.getElementById('s-xpgoal').value) || 100;
  save();
  toast('Profile saved!', 'success');
  updateTopbarStatus();
}

function pickAccent(id) {
  DB.settings.accent = id;
  applyAccent(id);
  renderSettings();
}

function saveTheme() {
  DB.settings.accent = DB.settings.accent || 'indigo';
  DB.settings.reduceMotion = document.getElementById('s-reduce').checked;
  save();
  applySettings();
  toast('Theme applied!', 'success');
}

function handleImport(input) {
  const file = input.files[0];
  if (!file) return;
  importData(file, ok => {
    if (ok) { toast('Data imported successfully!', 'success'); location.reload(); }
    else toast('Import failed — invalid file.', 'danger');
  });
}

function handleReset() {
  confirmAction('This will permanently delete ALL your data. Are you absolutely sure?', () => {
    resetData();
    toast('All data reset.', 'danger');
    location.reload();
  });
}

function renderStorageInfo() {
  const host = document.getElementById('storage-info');
  if (!host) return;
  try {
    const raw = localStorage.getItem('pd_data_v1') || '';
    const kb = (raw.length / 1024).toFixed(1);
    const items = {
      Habits: DB.habits.length, 'To-Dos': DB.todos.length,
      Notes: DB.notes.length, Goals: DB.goals.length,
      'Pomodoro sessions': DB.pomodoro.sessions.length,
      'Activity days': Object.keys(DB.activityLog).length,
    };
    host.innerHTML = `
      <div class="row"><div class="row-main"><div class="row-title">Storage used</div></div><span class="mono muted">${kb} KB</span></div>
      ${Object.entries(items).map(([k,v])=>`<div class="row"><div class="row-main"><div class="row-title">${k}</div></div><span class="mono muted">${v}</span></div>`).join('')}
    `;
  } catch(e) {
    host.innerHTML = '<div class="muted">Unable to read storage info.</div>';
  }
}

VIEW_RENDERERS.settings = renderSettings;
