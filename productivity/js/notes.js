/* =========================================================
   NOTES.JS — quick notes, brain dump, journal, second brain
   ========================================================= */

let notesTab = 'all';
let notesSearch = '';
const NOTE_TYPES = {
  quick: { label: 'Quick Note', icon: '⚡' },
  braindump: { label: 'Brain Dump', icon: '🧠' },
  journal: { label: 'Journal', icon: '📔' },
  secondbrain: { label: 'Second Brain', icon: '📚' }
};
const MOODS = ['😔', '😕', '😐', '🙂', '😄'];

function openNoteModal(existing) {
  const isEdit = !!existing;
  const type = existing?.type || (notesTab !== 'all' ? notesTab : 'quick');
  openModal(isEdit ? 'Edit note' : 'New note', `
    <div class="field"><label>Type</label>
      <select id="nt-type">
        ${Object.entries(NOTE_TYPES).map(([k, v]) => `<option value="${k}" ${type === k ? 'selected' : ''}>${v.icon} ${v.label}</option>`).join('')}
      </select>
    </div>
    <div class="field"><label>Title</label><input id="nt-title" value="${existing ? escapeHTML(existing.title || '') : ''}" placeholder="Give it a title" /></div>
    <div class="field"><label>Content</label><textarea id="nt-content" style="min-height:140px" placeholder="Write it down...">${existing ? escapeHTML(existing.content || '') : ''}</textarea></div>
    <div class="field"><label>Tags (comma separated)</label><input id="nt-tags" value="${existing ? escapeHTML((existing.tags || []).join(', ')) : ''}" placeholder="e.g. idea, work, book" /></div>
    <div class="modal-actions">
      ${isEdit ? `<button class="btn btn-danger" id="nt-delete">Delete</button>` : ''}
      <button class="btn btn-primary" id="nt-save">${isEdit ? 'Save changes' : 'Add note'}</button>
    </div>
  `, {
    onMount: root => {
      root.querySelector('#nt-save').addEventListener('click', () => {
        const content = root.querySelector('#nt-content').value.trim();
        if (!content) { toast('Write something first', 'danger'); return; }
        const tags = root.querySelector('#nt-tags').value.split(',').map(s => s.trim()).filter(Boolean);
        const payload = {
          type: root.querySelector('#nt-type').value,
          title: root.querySelector('#nt-title').value.trim(),
          content, tags, updatedAt: todayKey()
        };
        if (isEdit) updateItem('notes', existing.id, payload);
        else addItem('notes', payload, 'note');
        closeModal();
        renderNotes();
      });
      if (isEdit) {
        root.querySelector('#nt-delete').addEventListener('click', () => {
          confirmAction('Delete this note?', () => { deleteItem('notes', existing.id); renderNotes(); });
        });
      }
    }
  });
}

function renderNotes() {
  const view = document.getElementById('view-notes');
  view.innerHTML = `
    <div class="page-head">
      <div><h1>Notes & Second Brain</h1><div class="sub">${DB.notes.length} notes across quick notes, brain dumps, journal, and knowledge base</div></div>
      <button class="btn btn-primary" onclick="openNoteModal()">+ New note</button>
    </div>
    <div class="tabs">
      <button class="tab-btn ${notesTab === 'all' ? 'active' : ''}" data-t="all">All</button>
      ${Object.entries(NOTE_TYPES).map(([k, v]) => `<button class="tab-btn ${notesTab === k ? 'active' : ''}" data-t="${k}">${v.icon} ${v.label}</button>`).join('')}
    </div>
    <div class="field mb-8"><input id="notes-search" placeholder="Search notes..." value="${escapeHTML(notesSearch)}" /></div>
    <div class="list" id="notes-list"></div>
  `;
  view.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => { notesTab = b.dataset.t; renderNotes(); }));
  view.querySelector('#notes-search').addEventListener('input', debounce(e => { notesSearch = e.target.value; renderNotesList(); }, 200));
  renderNotesList();
}

function renderNotesList() {
  const listEl = document.getElementById('notes-list');
  if (!listEl) return;
  let items = notesTab === 'all' ? DB.notes : DB.notes.filter(n => n.type === notesTab);
  if (notesSearch) {
    const q = notesSearch.toLowerCase();
    items = items.filter(n => (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q) || (n.tags || []).some(t => t.toLowerCase().includes(q)));
  }
  items = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (!items.length) {
    listEl.innerHTML = emptyState('✎', 'No notes here yet.', 'Write one', `onclick="openNoteModal()"`);
    return;
  }
  listEl.innerHTML = items.map(n => `
    <div class="card card-tight" style="cursor:pointer" onclick='openNoteModal(${JSON.stringify(n).replace(/'/g, "&#39;")})'>
      <div class="flex-between">
        <div class="row-title">${NOTE_TYPES[n.type]?.icon || '✎'} ${escapeHTML(n.title || 'Untitled')}</div>
        <div class="row-meta">${fmtDate(n.createdAt)}</div>
      </div>
      <p class="muted mt-8" style="font-size:12.5px; white-space:pre-wrap; max-height:60px; overflow:hidden;">${escapeHTML((n.content || '').slice(0, 220))}${n.content && n.content.length > 220 ? '…' : ''}</p>
      ${n.tags && n.tags.length ? `<div class="chip-row mt-8">${n.tags.map(t => `<span class="chip">#${escapeHTML(t)}</span>`).join('')}</div>` : ''}
    </div>
  `).join('');
}

VIEW_RENDERERS.notes = renderNotes;