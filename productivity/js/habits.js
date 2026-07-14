/* =========================================================
   HABITS.JS
   ========================================================= */

const HABIT_COLORS = ['#6D5EF2', '#34D399', '#F2B84B', '#F87171', '#38BDF8', '#C084FC', '#FB923C'];

function habitStreak(h) {
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = daysAgoKey(i);
    if (h.completions[d]) streak++;
    else if (i === 0) continue; // allow today to be unchecked without breaking streak display
    else break;
  }
  return streak;
}

function isHabitDueToday(h) {
  if (h.frequency === 'daily') return true;
  if (h.frequency === 'weekly') return true; // weekly just needs N completions per week, always shown
  if (Array.isArray(h.days)) {
    const dow = new Date().getDay(); // 0 sun - 6 sat
    return h.days.includes(dow);
  }
  return true;
}

function toggleHabit(id) {
  const h = DB.habits.find(x => x.id === id);
  if (!h) return;
  const t = todayKey();
  if (h.completions[t]) {
    delete h.completions[t];
  } else {
    h.completions[t] = true;
    awardXP('habit');
  }
  save();
  renderHabits();
  refreshCurrentView();
}

function openHabitModal(existing) {
  const isEdit = !!existing;
  openModal(isEdit ? 'Edit habit' : 'New habit', `
    <div class="field"><label>Name</label><input id="hb-name" value="${existing ? escapeHTML(existing.name) : ''}" placeholder="e.g. Read 20 pages" /></div>
    <div class="field-row">
      <div class="field"><label>Frequency</label>
        <select id="hb-freq">
          <option value="daily" ${existing?.frequency === 'daily' ? 'selected' : ''}>Daily</option>
          <option value="weekly" ${existing?.frequency === 'weekly' ? 'selected' : ''}>A few times a week</option>
        </select>
      </div>
      <div class="field"><label>Color</label><input type="color" id="hb-color" value="${existing?.color || HABIT_COLORS[DB.habits.length % HABIT_COLORS.length]}" /></div>
    </div>
    <div class="field"><label>Icon (emoji)</label><input id="hb-icon" value="${existing?.icon || '✓'}" maxlength="2" /></div>
    <div class="modal-actions">
      ${isEdit ? `<button class="btn btn-danger" id="hb-delete">Delete</button>` : ''}
      <button class="btn btn-primary" id="hb-save">${isEdit ? 'Save changes' : 'Create habit'}</button>
    </div>
  `, {
    onMount: root => {
      root.querySelector('#hb-save').addEventListener('click', () => {
        const name = root.querySelector('#hb-name').value.trim();
        if (!name) { toast('Give your habit a name', 'danger'); return; }
        const payload = {
          name,
          frequency: root.querySelector('#hb-freq').value,
          color: root.querySelector('#hb-color').value,
          icon: root.querySelector('#hb-icon').value || '✓'
        };
        if (isEdit) updateItem('habits', existing.id, payload);
        else addItem('habits', { ...payload, completions: {}, archived: false });
        closeModal();
        renderHabits();
        refreshCurrentView();
      });
      if (isEdit) {
        root.querySelector('#hb-delete').addEventListener('click', () => {
          confirmAction('Delete this habit and all its history?', () => { deleteItem('habits', existing.id); renderHabits(); });
        });
      }
    }
  });
}

function renderHabits() {
  const view = document.getElementById('view-habits');
  const active = DB.habits.filter(h => !h.archived);
  view.innerHTML = `
    <div class="page-head">
      <div><h1>Habits</h1><div class="sub">${active.length} tracked habit${active.length === 1 ? '' : 's'}</div></div>
      <button class="btn btn-primary" onclick="openHabitModal()">+ New habit</button>
    </div>
    <div class="list" id="habits-list"></div>
  `;
  const listEl = document.getElementById('habits-list');
  if (!active.length) {
    listEl.innerHTML = emptyState('✓', 'No habits yet. Small daily actions compound into big results.', 'Create your first habit', `onclick="openHabitModal()"`);
    return;
  }
  listEl.innerHTML = active.map(h => {
    const t = todayKey();
    const checked = !!h.completions[t];
    const streak = habitStreak(h);
    const map = {};
    Object.keys(h.completions).forEach(d => map[d] = 1);
    return `
    <div class="card card-tight">
      <div class="flex-between">
        <div class="flex gap-12">
          <button class="checkbox-round ${checked ? 'checked' : ''}" onclick="toggleHabit('${h.id}')">${checked ? '✓' : ''}</button>
          <div>
            <div class="row-title">${h.icon} ${escapeHTML(h.name)}</div>
            <div class="row-meta">${h.frequency === 'daily' ? 'Daily' : 'Weekly'} · 🔥 ${streak} day streak</div>
          </div>
        </div>
        <div class="flex gap-8">
          <button class="icon-btn" onclick='openHabitModal(${JSON.stringify(h).replace(/'/g, "&#39;")})'>✎</button>
        </div>
      </div>
      <div class="mt-8" id="hm-${h.id}"></div>
    </div>`;
  }).join('');

  active.forEach(h => {
    const map = {};
    Object.keys(h.completions).forEach(d => map[d] = 1);
    const container = document.getElementById(`hm-${h.id}`);
    if (container) renderHeatmap(container, map, { weeks: 18, colorFor: v => v ? h.color : 'var(--hm-0)' });
  });
}

VIEW_RENDERERS.habits = renderHabits;