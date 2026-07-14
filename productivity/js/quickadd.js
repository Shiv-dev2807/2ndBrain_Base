/* =========================================================
   QUICKADD.JS — Global quick-add modal (Ctrl+K or button)
   ========================================================= */

function openQuickAdd() {
  openModal('Quick Add', `
    <div class="tabs" style="margin-bottom:16px">
      <button class="tab-btn active" id="qa-tab-task" onclick="qaSwitch('task')">Task</button>
      <button class="tab-btn" id="qa-tab-note" onclick="qaSwitch('note')">Note</button>
      <button class="tab-btn" id="qa-tab-habit" onclick="qaSwitch('habit')">Habit check</button>
      <button class="tab-btn" id="qa-tab-water" onclick="qaSwitch('water')">Water</button>
    </div>
    <div id="qa-body"></div>
  `, { onMount: () => qaSwitch('task') });
}

function qaSwitch(tab) {
  ['task','note','habit','water'].forEach(t => {
    const b = document.getElementById(`qa-tab-${t}`);
    if (b) b.classList.toggle('active', t === tab);
  });
  const body = document.getElementById('qa-body');
  if (!body) return;

  if (tab === 'task') {
    body.innerHTML = `
      <div class="field"><label>Task title</label><input id="qa-title" placeholder="What needs to get done?" autofocus /></div>
      <div class="field-row">
        <div class="field"><label>Priority</label>
          <select id="qa-priority"><option value="low">Low</option><option value="med" selected>Medium</option><option value="high">High</option></select>
        </div>
        <div class="field"><label>Due date</label><input type="date" id="qa-due" /></div>
      </div>
      <div class="modal-actions"><button class="btn btn-primary" id="qa-save">Add task</button></div>
    `;
    document.getElementById('qa-save').addEventListener('click', () => {
      const title = document.getElementById('qa-title').value.trim();
      if (!title) { toast('Give the task a title', 'danger'); return; }
      addItem('todos', { title, priority: document.getElementById('qa-priority').value, due: document.getElementById('qa-due').value || null, done: false, doneAt: null });
      closeModal();
      toast('Task added!', 'success');
      if (typeof currentView !== 'undefined' && currentView === 'todos') renderTodos();
      refreshCurrentView();
    });
    setTimeout(() => document.getElementById('qa-title')?.focus(), 50);
  }

  if (tab === 'note') {
    body.innerHTML = `
      <div class="field"><label>Quick note</label><textarea id="qa-note" style="min-height:100px" placeholder="Write it down..." autofocus></textarea></div>
      <div class="field"><label>Tags (comma separated)</label><input id="qa-tags" placeholder="e.g. idea, work" /></div>
      <div class="modal-actions"><button class="btn btn-primary" id="qa-save-note">Save note</button></div>
    `;
    document.getElementById('qa-save-note').addEventListener('click', () => {
      const content = document.getElementById('qa-note').value.trim();
      if (!content) { toast('Write something first', 'danger'); return; }
      const tags = document.getElementById('qa-tags').value.split(',').map(s=>s.trim()).filter(Boolean);
      addItem('notes', { type: 'quick', title: content.slice(0,60), content, tags, updatedAt: todayKey() }, 'note');
      closeModal();
      toast('Note saved!', 'success');
      if (typeof currentView !== 'undefined' && currentView === 'notes') renderNotes();
    });
    setTimeout(() => document.getElementById('qa-note')?.focus(), 50);
  }

  if (tab === 'habit') {
    const active = DB.habits.filter(h => !h.archived);
    body.innerHTML = `
      <div class="list">
        ${active.length ? active.map(h => {
          const done = !!h.completions[todayKey()];
          return `<div class="row" onclick="qaToggleHabit('${h.id}')" style="cursor:pointer" id="qa-habit-row-${h.id}">
            <div class="checkbox-round ${done?'checked':''}" id="qa-hb-check-${h.id}">${done?'✓':''}</div>
            <div class="row-main"><div class="row-title">${h.icon} ${escapeHTML(h.name)}</div></div>
          </div>`;
        }).join('') : '<div class="muted" style="text-align:center;padding:20px">No habits tracked yet.</div>'}
      </div>
    `;
  }

  if (tab === 'water') {
    const entry = DB.health.water.find(w => w.date === todayKey()) || { glasses: 0, goal: 8 };
    body.innerHTML = `
      <div style="text-align:center;padding:16px 0">
        <div class="stat-val mono" style="font-size:40px;margin-bottom:12px">${entry.glasses} / ${entry.goal}</div>
        <div class="pomo-controls">
          <button class="btn btn-primary" onclick="setWater(1); qaSwitch('water')">+ Glass</button>
          <button class="btn" onclick="setWater(-1); qaSwitch('water')">- Glass</button>
        </div>
        <div class="pbar mt-8">${progressBar(Math.round((entry.glasses/entry.goal)*100))}</div>
      </div>
    `;
  }
}

function qaToggleHabit(id) {
  toggleHabit(id);
  const h = DB.habits.find(x => x.id === id);
  if (!h) return;
  const done = !!h.completions[todayKey()];
  const check = document.getElementById(`qa-hb-check-${id}`);
  if (check) { check.className = `checkbox-round ${done?'checked':''}`; check.textContent = done?'✓':''; }
}

// Keyboard shortcut: Ctrl+K
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openQuickAdd();
  }
});
