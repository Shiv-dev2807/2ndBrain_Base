/* =========================================================
   TODOS.JS
   ========================================================= */

let todoFilter = 'active';

function toggleTodo(id) {
  const t = DB.todos.find(x => x.id === id);
  if (!t) return;
  const wasDone = t.done;
  updateItem('todos', id, { done: !wasDone, doneAt: !wasDone ? todayKey() : null });
  if (!wasDone) awardXP('todo');
  renderTodos();
}

function openTodoModal(existing) {
  const isEdit = !!existing;
  openModal(isEdit ? 'Edit task' : 'New task', `
    <div class="field"><label>Title</label><input id="td-title" value="${existing ? escapeHTML(existing.title) : ''}" placeholder="What needs to get done?" /></div>
    <div class="field-row">
      <div class="field"><label>Priority</label>
        <select id="td-priority">
          <option value="low" ${existing?.priority === 'low' ? 'selected' : ''}>Low</option>
          <option value="med" ${!existing || existing.priority === 'med' ? 'selected' : ''}>Medium</option>
          <option value="high" ${existing?.priority === 'high' ? 'selected' : ''}>High</option>
        </select>
      </div>
      <div class="field"><label>Due date</label><input type="date" id="td-due" value="${existing?.due || ''}" /></div>
    </div>
    <div class="field"><label>Category</label><input id="td-category" value="${existing?.category || ''}" placeholder="e.g. Work, Personal, Study" /></div>
    <div class="field"><label>Notes</label><textarea id="td-notes" placeholder="Optional details">${existing ? escapeHTML(existing.notes || '') : ''}</textarea></div>
    <div class="modal-actions">
      ${isEdit ? `<button class="btn btn-danger" id="td-delete">Delete</button>` : ''}
      <button class="btn btn-primary" id="td-save">${isEdit ? 'Save changes' : 'Add task'}</button>
    </div>
  `, {
    onMount: root => {
      root.querySelector('#td-save').addEventListener('click', () => {
        const title = root.querySelector('#td-title').value.trim();
        if (!title) { toast('Give the task a title', 'danger'); return; }
        const payload = {
          title,
          priority: root.querySelector('#td-priority').value,
          due: root.querySelector('#td-due').value || null,
          category: root.querySelector('#td-category').value.trim(),
          notes: root.querySelector('#td-notes').value.trim()
        };
        if (isEdit) updateItem('todos', existing.id, payload);
        else addItem('todos', { ...payload, done: false, doneAt: null });
        closeModal();
        renderTodos();
        refreshCurrentView();
      });
      if (isEdit) {
        root.querySelector('#td-delete').addEventListener('click', () => {
          confirmAction('Delete this task?', () => { deleteItem('todos', existing.id); renderTodos(); });
        });
      }
    }
  });
}

function renderTodos() {
  const view = document.getElementById('view-todos');
  const all = DB.todos;
  const active = all.filter(t => !t.done);
  const done = all.filter(t => t.done);
  const overdue = active.filter(t => t.due && t.due < todayKey()).length;

  view.innerHTML = `
    <div class="page-head">
      <div><h1>To-Do List</h1><div class="sub">${active.length} active · ${overdue} overdue · ${done.length} completed</div></div>
      <button class="btn btn-primary" onclick="openTodoModal()">+ New task</button>
    </div>
    <div class="tabs">
      <button class="tab-btn ${todoFilter === 'active' ? 'active' : ''}" data-f="active">Active</button>
      <button class="tab-btn ${todoFilter === 'all' ? 'active' : ''}" data-f="all">All</button>
      <button class="tab-btn ${todoFilter === 'done' ? 'active' : ''}" data-f="done">Completed</button>
    </div>
    <div class="list" id="todos-list"></div>
  `;
  view.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => { todoFilter = b.dataset.f; renderTodos(); }));

  let items = todoFilter === 'active' ? active : todoFilter === 'done' ? done : all;
  items = [...items].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const pri = { high: 0, med: 1, low: 2 };
    if ((a.due || '9999') !== (b.due || '9999')) return (a.due || '9999').localeCompare(b.due || '9999');
    return pri[a.priority] - pri[b.priority];
  });

  const listEl = document.getElementById('todos-list');
  if (!items.length) {
    listEl.innerHTML = emptyState('☰', 'Nothing here. Add a task to get moving.', 'Add a task', `onclick="openTodoModal()"`);
    return;
  }
  listEl.innerHTML = items.map(t => {
    const isOverdue = !t.done && t.due && t.due < todayKey();
    return `
    <div class="row">
      <button class="checkbox-round ${t.done ? 'checked' : ''}" onclick="toggleTodo('${t.id}')">${t.done ? '✓' : ''}</button>
      <div class="row-main">
        <div class="row-title ${t.done ? 'done' : ''}">${escapeHTML(t.title)}</div>
        <div class="row-meta">
          ${t.category ? `${escapeHTML(t.category)} · ` : ''}${t.due ? `${isOverdue ? '⚠️ Overdue ' : ''}${fmtDate(t.due)}` : 'No due date'}
        </div>
      </div>
      <span class="tag tag-${t.priority}">${t.priority}</span>
      <div class="row-actions">
        <button class="icon-btn" onclick='openTodoModal(${JSON.stringify(t).replace(/'/g, "&#39;")})'>✎</button>
      </div>
    </div>`;
  }).join('');
}

VIEW_RENDERERS.todos = renderTodos;