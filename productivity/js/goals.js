/* =========================================================
   GOALS.JS — goal tracker + project tracker
   ========================================================= */

let goalsTab = 'goals';

// ---- Goals ----------------------------------------------------------------

function recomputeGoalProgress(goal) {
  if (goal.milestones && goal.milestones.length) {
    const done = goal.milestones.filter(m => m.done).length;
    goal.progress = Math.round((done / goal.milestones.length) * 100);
    if (goal.progress === 100 && !goal.completedAt) {
      goal.completedAt = todayKey();
      awardXP(goal.isBossBattle ? 'goal' : 'goal');
      toast(`${goal.isBossBattle ? 'Boss defeated' : 'Goal achieved'}: ${goal.title}`, 'success');
    } else if (goal.progress < 100 && goal.completedAt) {
      goal.completedAt = null;
    }
  }
}

function addMilestone(goalId, title) {
  const g = DB.goals.find(x => x.id === goalId);
  if (!g || !title.trim()) return;
  g.milestones = g.milestones || [];
  g.milestones.push({ id: uid(), title: title.trim(), done: false });
  save();
  renderGoals();
}
function toggleMilestone(goalId, mId) {
  const g = DB.goals.find(x => x.id === goalId);
  if (!g) return;
  const m = g.milestones.find(x => x.id === mId);
  m.done = !m.done;
  if (m.done) awardXP('milestone');
  recomputeGoalProgress(g);
  save();
  renderGoals();
  refreshCurrentView();
}
function markGoalDone(goalId) {
  const g = DB.goals.find(x => x.id === goalId);
  if (!g) return;
  g.completedAt = todayKey();
  g.progress = 100;
  awardXP('goal');
  save();
  toast(`${g.isBossBattle ? 'Boss defeated' : 'Goal achieved'}: ${g.title}`, 'success');
  renderGoals();
}

function openGoalModal(existing) {
  const isEdit = !!existing;
  openModal(isEdit ? 'Edit goal' : 'New goal', `
    <div class="field"><label>Title</label><input id="gl-title" value="${existing ? escapeHTML(existing.title) : ''}" placeholder="e.g. Run a half marathon" /></div>
    <div class="field"><label>Description</label><textarea id="gl-desc">${existing ? escapeHTML(existing.description || '') : ''}</textarea></div>
    <div class="field-row">
      <div class="field"><label>Category</label><input id="gl-category" value="${existing?.category || ''}" placeholder="e.g. Health, Career" /></div>
      <div class="field"><label>Target date</label><input type="date" id="gl-date" value="${existing?.targetDate || ''}" /></div>
    </div>
    <div class="field"><label><input type="checkbox" id="gl-boss" ${existing?.isBossBattle ? 'checked' : ''}/> Mark as a Boss Battle (major goal)</label></div>
    <div class="modal-actions">
      ${isEdit ? `<button class="btn btn-danger" id="gl-delete">Delete</button>` : ''}
      <button class="btn btn-primary" id="gl-save">${isEdit ? 'Save changes' : 'Create goal'}</button>
    </div>
  `, {
    onMount: root => {
      root.querySelector('#gl-save').addEventListener('click', () => {
        const title = root.querySelector('#gl-title').value.trim();
        if (!title) { toast('Give the goal a title', 'danger'); return; }
        const payload = {
          title, description: root.querySelector('#gl-desc').value.trim(),
          category: root.querySelector('#gl-category').value.trim(),
          targetDate: root.querySelector('#gl-date').value || null,
          isBossBattle: root.querySelector('#gl-boss').checked
        };
        if (isEdit) updateItem('goals', existing.id, payload);
        else addItem('goals', { ...payload, progress: 0, milestones: [], completedAt: null });
        closeModal();
        renderGoals();
        refreshCurrentView();
      });
      if (isEdit) {
        root.querySelector('#gl-delete').addEventListener('click', () => {
          confirmAction('Delete this goal?', () => { deleteItem('goals', existing.id); renderGoals(); });
        });
      }
    }
  });
}

function goalCardHTML(g) {
  return `
    <div class="card card-tight">
      <div class="flex-between">
        <div>
          <div class="row-title">${g.isBossBattle ? '⚔️ ' : '🎯 '}${escapeHTML(g.title)} ${g.completedAt ? '<span class="tag tag-low">done</span>' : ''}</div>
          <div class="row-meta">${g.category ? escapeHTML(g.category) + ' · ' : ''}${g.targetDate ? 'Due ' + fmtDate(g.targetDate) : 'No deadline'}</div>
        </div>
        <div class="flex gap-8">
          ${!g.completedAt ? `<button class="btn btn-sm" onclick="markGoalDone('${g.id}')">Mark done</button>` : ''}
          <button class="icon-btn" onclick='openGoalModal(${JSON.stringify(g).replace(/'/g, "&#39;")})'>✎</button>
        </div>
      </div>
      ${g.description ? `<p class="muted mt-8" style="font-size:12.5px">${escapeHTML(g.description)}</p>` : ''}
      <div class="mt-8 flex gap-12"><div style="flex:1">${progressBar(g.progress, g.isBossBattle ? '' : 'success')}</div><span class="mono muted">${g.progress}%</span></div>
      <div class="mt-8">
        ${(g.milestones || []).map(m => `
          <div class="quest-item">
            <button class="checkbox-round ${m.done ? 'checked' : ''}" onclick="toggleMilestone('${g.id}','${m.id}')">${m.done ? '✓' : ''}</button>
            <span style="${m.done ? 'text-decoration:line-through;color:var(--text-faint)' : ''}">${escapeHTML(m.title)}</span>
          </div>
        `).join('')}
        <div class="flex gap-8 mt-8">
          <input placeholder="Add milestone..." id="ms-input-${g.id}" style="flex:1" onkeydown="if(event.key==='Enter'){addMilestone('${g.id}', this.value); this.value='';}" />
          <button class="btn btn-sm" onclick="const i=document.getElementById('ms-input-${g.id}'); addMilestone('${g.id}', i.value); i.value='';">Add</button>
        </div>
      </div>
    </div>`;
}

// ---- Projects ---------------------------------------------------------

function openProjectModal(existing) {
  const isEdit = !!existing;
  openModal(isEdit ? 'Edit project' : 'New project', `
    <div class="field"><label>Name</label><input id="pj-name" value="${existing ? escapeHTML(existing.name) : ''}" placeholder="e.g. Personal website redesign" /></div>
    <div class="field"><label>Description</label><textarea id="pj-desc">${existing ? escapeHTML(existing.description || '') : ''}</textarea></div>
    <div class="field"><label>Status</label>
      <select id="pj-status">
        <option value="planning" ${existing?.status === 'planning' ? 'selected' : ''}>Planning</option>
        <option value="active" ${!existing || existing.status === 'active' ? 'selected' : ''}>Active</option>
        <option value="done" ${existing?.status === 'done' ? 'selected' : ''}>Done</option>
      </select>
    </div>
    <div class="modal-actions">
      ${isEdit ? `<button class="btn btn-danger" id="pj-delete">Delete</button>` : ''}
      <button class="btn btn-primary" id="pj-save">${isEdit ? 'Save changes' : 'Create project'}</button>
    </div>
  `, {
    onMount: root => {
      root.querySelector('#pj-save').addEventListener('click', () => {
        const name = root.querySelector('#pj-name').value.trim();
        if (!name) { toast('Give the project a name', 'danger'); return; }
        const payload = { name, description: root.querySelector('#pj-desc').value.trim(), status: root.querySelector('#pj-status').value };
        if (isEdit) updateItem('projects', existing.id, payload);
        else addItem('projects', { ...payload, progress: 0, tasks: [] });
        closeModal();
        renderGoals();
      });
      if (isEdit) {
        root.querySelector('#pj-delete').addEventListener('click', () => {
          confirmAction('Delete this project?', () => { deleteItem('projects', existing.id); renderGoals(); });
        });
      }
    }
  });
}

function addProjectTask(projId, title) {
  const p = DB.projects.find(x => x.id === projId);
  if (!p || !title.trim()) return;
  p.tasks.push({ id: uid(), title: title.trim(), done: false });
  recomputeProjectProgress(p);
  save();
  renderGoals();
}
function toggleProjectTask(projId, taskId) {
  const p = DB.projects.find(x => x.id === projId);
  const t = p.tasks.find(x => x.id === taskId);
  t.done = !t.done;
  recomputeProjectProgress(p);
  save();
  renderGoals();
}
function recomputeProjectProgress(p) {
  if (!p.tasks.length) { p.progress = 0; return; }
  p.progress = Math.round((p.tasks.filter(t => t.done).length / p.tasks.length) * 100);
  if (p.progress === 100) p.status = 'done';
}

function projectCardHTML(p) {
  return `
    <div class="card card-tight">
      <div class="flex-between">
        <div>
          <div class="row-title">${escapeHTML(p.name)} <span class="tag tag-${p.status === 'done' ? 'low' : p.status === 'active' ? 'med' : 'high'}">${p.status}</span></div>
          ${p.description ? `<div class="row-meta">${escapeHTML(p.description)}</div>` : ''}
        </div>
        <button class="icon-btn" onclick='openProjectModal(${JSON.stringify(p).replace(/'/g, "&#39;")})'>✎</button>
      </div>
      <div class="mt-8 flex gap-12"><div style="flex:1">${progressBar(p.progress)}</div><span class="mono muted">${p.progress}%</span></div>
      <div class="mt-8">
        ${p.tasks.map(t => `
          <div class="quest-item">
            <button class="checkbox-round ${t.done ? 'checked' : ''}" onclick="toggleProjectTask('${p.id}','${t.id}')">${t.done ? '✓' : ''}</button>
            <span style="${t.done ? 'text-decoration:line-through;color:var(--text-faint)' : ''}">${escapeHTML(t.title)}</span>
          </div>
        `).join('')}
        <div class="flex gap-8 mt-8">
          <input placeholder="Add task..." id="pt-input-${p.id}" style="flex:1" onkeydown="if(event.key==='Enter'){addProjectTask('${p.id}', this.value); this.value='';}" />
          <button class="btn btn-sm" onclick="const i=document.getElementById('pt-input-${p.id}'); addProjectTask('${p.id}', i.value); i.value='';">Add</button>
        </div>
      </div>
    </div>`;
}

// ---- Render -------------------------------------------------------------

function renderGoals() {
  const view = document.getElementById('view-goals');
  view.innerHTML = `
    <div class="page-head">
      <div><h1>Goals & Projects</h1><div class="sub">${DB.goals.filter(g=>!g.completedAt).length} active goals · ${DB.projects.filter(p=>p.status!=='done').length} active projects</div></div>
      <button class="btn btn-primary" onclick="goalsTab === 'goals' ? openGoalModal() : openProjectModal()">+ New ${goalsTab === 'goals' ? 'goal' : 'project'}</button>
    </div>
    <div class="tabs">
      <button class="tab-btn ${goalsTab === 'goals' ? 'active' : ''}" data-t="goals">Goals</button>
      <button class="tab-btn ${goalsTab === 'projects' ? 'active' : ''}" data-t="projects">Projects</button>
    </div>
    <div class="list" id="goals-list"></div>
  `;
  view.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => { goalsTab = b.dataset.t; renderGoals(); }));

  const listEl = document.getElementById('goals-list');
  if (goalsTab === 'goals') {
    const items = [...DB.goals].sort((a, b) => (a.completedAt ? 1 : 0) - (b.completedAt ? 1 : 0));
    listEl.innerHTML = items.length ? items.map(goalCardHTML).join('') : emptyState('🎯', 'No goals yet. What do you want to achieve?', 'Set a goal', `onclick="openGoalModal()"`);
  } else {
    const items = [...DB.projects].sort((a, b) => (a.status === 'done' ? 1 : 0) - (b.status === 'done' ? 1 : 0));
    listEl.innerHTML = items.length ? items.map(projectCardHTML).join('') : emptyState('📁', 'No projects yet.', 'Start a project', `onclick="openProjectModal()"`);
  }
}

VIEW_RENDERERS.goals = renderGoals;