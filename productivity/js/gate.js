/* =========================================================
   GATE.JS
   ========================================================= */

let gateTab = 'overview';

function recomputeSubjectProgress(subj) {
  if (!subj.chapters.length) { subj.progress = 0; return; }
  subj.progress = Math.round((subj.chapters.filter(c => c.done).length / subj.chapters.length) * 100);
}

function openSubjectModal(existing) {
  openModal(existing ? 'Edit subject' : 'New subject', `
    <div class="field"><label>Subject name</label><input id="sj-name" value="${existing ? escapeHTML(existing.name) : ''}" placeholder="e.g. Operating Systems" /></div>
    <div class="modal-actions">
      ${existing ? `<button class="btn btn-danger" id="sj-delete">Delete</button>` : ''}
      <button class="btn btn-primary" id="sj-save">Save</button>
    </div>
  `, {
    onMount: root => {
      root.querySelector('#sj-save').addEventListener('click', () => {
        const name = root.querySelector('#sj-name').value.trim();
        if (!name) return toast('Name the subject', 'danger');
        if (existing) updateItem('gate.subjects', existing.id, { name });
        else addItem('gate.subjects', { name, progress: 0, chapters: [] });
        closeModal(); renderGate();
      });
      if (existing) root.querySelector('#sj-delete').addEventListener('click', () => confirmAction('Delete this subject?', () => { deleteItem('gate.subjects', existing.id); renderGate(); }));
    }
  });
}
function addChapter(subjId, title) {
  const s = DB.gate.subjects.find(x => x.id === subjId);
  if (!s || !title.trim()) return;
  s.chapters.push({ id: uid(), name: title.trim(), done: false });
  recomputeSubjectProgress(s);
  save(); renderGate();
}
function toggleChapter(subjId, chId) {
  const s = DB.gate.subjects.find(x => x.id === subjId);
  const c = s.chapters.find(x => x.id === chId);
  c.done = !c.done;
  recomputeSubjectProgress(s);
  save(); renderGate();
}

function openStudySessionModal() {
  openModal('Log study session', `
    <div class="field-row">
      <div class="field"><label>Duration (minutes)</label><input type="number" id="ss-dur" value="60" min="1" /></div>
      <div class="field"><label>Date</label><input type="date" id="ss-date" value="${todayKey()}" /></div>
    </div>
    <div class="field"><label>Subject</label>
      <select id="ss-subject">
        <option value="">General</option>
        ${DB.gate.subjects.map(s => `<option value="${escapeHTML(s.name)}">${escapeHTML(s.name)}</option>`).join('')}
      </select>
    </div>
    <div class="modal-actions"><button class="btn btn-primary" id="ss-save">Log session</button></div>
  `, {
    onMount: root => root.querySelector('#ss-save').addEventListener('click', () => {
      addItem('gate.studySessions', { duration: parseInt(root.querySelector('#ss-dur').value) || 30, date: root.querySelector('#ss-date').value, subject: root.querySelector('#ss-subject').value }, 'study');
      closeModal(); renderGate();
    })
  });
}

function openRevisionModal() {
  openModal('Log revision', `
    <div class="field"><label>Topic</label><input id="rv-topic" placeholder="e.g. Process Scheduling" /></div>
    <div class="modal-actions"><button class="btn btn-primary" id="rv-save">Log revision</button></div>
  `, {
    onMount: root => root.querySelector('#rv-save').addEventListener('click', () => {
      const topic = root.querySelector('#rv-topic').value.trim();
      if (!topic) return toast('Add a topic', 'danger');
      const existing = DB.gate.revisions.find(r => r.topic.toLowerCase() === topic.toLowerCase());
      if (existing) { existing.count++; existing.lastRevised = todayKey(); save(); }
      else addItem('gate.revisions', { topic, count: 1, lastRevised: todayKey() });
      awardXP('revision');
      closeModal(); renderGate();
    })
  });
}

function openMockTestModal() {
  openModal('Log mock test', `
    <div class="field"><label>Test name</label><input id="mt-name" placeholder="e.g. GATE Mock 12" /></div>
    <div class="field-row">
      <div class="field"><label>Score</label><input type="number" id="mt-score" value="0" /></div>
      <div class="field"><label>Total marks</label><input type="number" id="mt-total" value="100" /></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Accuracy %</label><input type="number" id="mt-accuracy" value="0" max="100" /></div>
      <div class="field"><label>Date</label><input type="date" id="mt-date" value="${todayKey()}" /></div>
    </div>
    <div class="modal-actions"><button class="btn btn-primary" id="mt-save">Log test</button></div>
  `, {
    onMount: root => root.querySelector('#mt-save').addEventListener('click', () => {
      const name = root.querySelector('#mt-name').value.trim();
      if (!name) return toast('Name the test', 'danger');
      addItem('gate.mockTests', {
        name, score: parseFloat(root.querySelector('#mt-score').value) || 0,
        total: parseFloat(root.querySelector('#mt-total').value) || 100,
        accuracy: parseFloat(root.querySelector('#mt-accuracy').value) || 0,
        date: root.querySelector('#mt-date').value
      }, 'mock');
      closeModal(); renderGate();
    })
  });
}

function openPyqModal() {
  openModal('Log PYQ set', `
    <div class="field"><label>Year</label><input id="pq-year" placeholder="e.g. 2021" /></div>
    <div class="field-row">
      <div class="field"><label>Solved</label><input type="number" id="pq-solved" value="0" /></div>
      <div class="field"><label>Total</label><input type="number" id="pq-total" value="65" /></div>
    </div>
    <div class="modal-actions"><button class="btn btn-primary" id="pq-save">Add</button></div>
  `, {
    onMount: root => root.querySelector('#pq-save').addEventListener('click', () => {
      const year = root.querySelector('#pq-year').value.trim();
      if (!year) return toast('Add a year', 'danger');
      addItem('gate.pyq', { year, solved: parseInt(root.querySelector('#pq-solved').value) || 0, total: parseInt(root.querySelector('#pq-total').value) || 1 });
      closeModal(); renderGate();
    })
  });
}

function renderGate() {
  const view = document.getElementById('view-gate');
  const G = DB.gate;
  const totalStudyMin = G.studySessions.reduce((s, c) => s + c.duration, 0);
  const avgAccuracy = G.mockTests.length ? Math.round(G.mockTests.reduce((s, m) => s + m.accuracy, 0) / G.mockTests.length) : 0;

  view.innerHTML = `
    <div class="page-head">
      <div><h1>GATE Preparation</h1><div class="sub">${minutesToHM(totalStudyMin)} studied · ${G.mockTests.length} mock tests · ${avgAccuracy}% avg accuracy</div></div>
      <button class="btn btn-primary" onclick="openStudySessionModal()">+ Log study session</button>
    </div>
    <div class="tabs">
      ${['overview','subjects','revision','mock','pyq'].map(t => `<button class="tab-btn ${gateTab===t?'active':''}" data-t="${t}">${{overview:'Overview',subjects:'Subjects',revision:'Revision',mock:'Mock Tests',pyq:'PYQ Tracker'}[t]}</button>`).join('')}
    </div>
    <div id="gate-body"></div>
  `;
  view.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => { gateTab = b.dataset.t; renderGate(); }));

  const body = document.getElementById('gate-body');

  if (gateTab === 'overview') {
    body.innerHTML = `
      <div class="grid grid-2">
        <div class="card"><div class="card-head"><h3>Study activity (12 weeks)</h3></div><div id="gate-heatmap"></div></div>
        <div class="card"><div class="card-head"><h3>Mock test accuracy over time</h3></div><div class="chart-box short"><canvas id="acc-chart"></canvas></div></div>
      </div>`;
    const map = {};
    G.studySessions.forEach(s => map[s.date] = (map[s.date] || 0) + 1);
    renderHeatmap(document.getElementById('gate-heatmap'), map, { weeks: 12 });
    if (G.mockTests.length) {
      const sorted = [...G.mockTests].sort((a, b) => a.date.localeCompare(b.date));
      lineChart('acc-chart', sorted.map(m => fmtShort(m.date)), [{ label: 'Accuracy %', data: sorted.map(m => m.accuracy) }]);
    } else {
      document.getElementById('acc-chart').closest('.card').querySelector('.chart-box').innerHTML = emptyState('📈', 'Log mock tests to see your accuracy trend.');
    }
  }

  if (gateTab === 'subjects') {
    body.innerHTML = `<div class="flex-between mb-8"><span class="sub">Chapter-wise progress</span><button class="btn btn-sm btn-primary" onclick="openSubjectModal()">+ Add subject</button></div><div class="grid grid-2" id="subj-list"></div>`;
    const listEl = document.getElementById('subj-list');
    listEl.innerHTML = G.subjects.length ? G.subjects.map(s => `
      <div class="subject-card">
        <div class="flex-between">
          <div class="row-title">${escapeHTML(s.name)}</div>
          <button class="icon-btn" onclick='openSubjectModal(${JSON.stringify(s).replace(/'/g,"&#39;")})'>✎</button>
        </div>
        <div class="mt-8">${progressBar(s.progress)}</div>
        <div class="row-meta mt-8 mb-8">${s.chapters.filter(c=>c.done).length}/${s.chapters.length} chapters complete</div>
        ${s.chapters.map(c => `<div class="quest-item"><button class="checkbox-round ${c.done?'checked':''}" onclick="toggleChapter('${s.id}','${c.id}')">${c.done?'✓':''}</button><span style="${c.done?'text-decoration:line-through;color:var(--text-faint)':''}">${escapeHTML(c.name)}</span></div>`).join('')}
        <div class="flex gap-8 mt-8">
          <input placeholder="Add chapter..." id="ch-input-${s.id}" style="flex:1" onkeydown="if(event.key==='Enter'){addChapter('${s.id}', this.value); this.value='';}" />
          <button class="btn btn-sm" onclick="const i=document.getElementById('ch-input-${s.id}'); addChapter('${s.id}', i.value); i.value='';">Add</button>
        </div>
      </div>
    `).join('') : emptyState('📘', 'No subjects yet.', '+ Add subject', `onclick="openSubjectModal()"`);
  }

  if (gateTab === 'revision') {
    body.innerHTML = `<div class="flex-between mb-8"><span class="sub">Topics revised & how many times</span><button class="btn btn-sm btn-primary" onclick="openRevisionModal()">+ Log revision</button></div><div class="list" id="rev-list"></div>`;
    const listEl = document.getElementById('rev-list');
    const items = [...G.revisions].sort((a, b) => b.count - a.count);
    listEl.innerHTML = items.length ? items.map(r => `
      <div class="row"><div class="row-main"><div class="row-title">${escapeHTML(r.topic)}</div><div class="row-meta">Last revised ${fmtDate(r.lastRevised)}</div></div><span class="mono" style="color:var(--accent-strong)">×${r.count}</span></div>
    `).join('') : emptyState('🔁', 'No revisions logged yet.', '+ Log revision', `onclick="openRevisionModal()"`);
  }

  if (gateTab === 'mock') {
    body.innerHTML = `<div class="flex-between mb-8"><span class="sub">Score & accuracy history</span><button class="btn btn-sm btn-primary" onclick="openMockTestModal()">+ Log test</button></div><div class="list" id="mock-list"></div>`;
    const listEl = document.getElementById('mock-list');
    const items = [...G.mockTests].sort((a, b) => b.date.localeCompare(a.date));
    listEl.innerHTML = items.length ? items.map(m => `
      <div class="row"><div class="row-main"><div class="row-title">${escapeHTML(m.name)}</div><div class="row-meta">${fmtDate(m.date)} · ${m.accuracy}% accuracy</div></div><span class="mono">${m.score}/${m.total}</span></div>
    `).join('') : emptyState('📝', 'No mock tests logged yet.', '+ Log test', `onclick="openMockTestModal()"`);
  }

  if (gateTab === 'pyq') {
    body.innerHTML = `<div class="flex-between mb-8"><span class="sub">Previous year question sets</span><button class="btn btn-sm btn-primary" onclick="openPyqModal()">+ Add year</button></div><div class="grid grid-4" id="pyq-list"></div>`;
    const listEl = document.getElementById('pyq-list');
    const items = [...G.pyq].sort((a, b) => b.year.localeCompare(a.year));
    listEl.innerHTML = items.length ? items.map(p => `
      <div class="subject-card"><div class="row-title">${escapeHTML(p.year)}</div><div class="mt-8">${progressBar(Math.round((p.solved/p.total)*100))}</div><div class="row-meta mt-8">${p.solved}/${p.total} solved</div></div>
    `).join('') : emptyState('📄', 'No PYQ sets logged yet.', '+ Add year', `onclick="openPyqModal()"`);
  }
}

VIEW_RENDERERS.gate = renderGate;