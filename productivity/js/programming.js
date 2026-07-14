/* =========================================================
   PROGRAMMING.JS
   ========================================================= */

let progTab = 'overview';

function codingStreak() {
  const dates = new Set(DB.programming.codingSessions.map(s => s.date));
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = daysAgoKey(i);
    if (dates.has(d)) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

// ---- DSA -------------------------------------------------------------
function openDsaModal(existing) {
  openModal(existing ? 'Edit topic' : 'New DSA topic', `
    <div class="field"><label>Topic name</label><input id="dsa-name" value="${existing ? escapeHTML(existing.name) : ''}" placeholder="e.g. Dynamic Programming" /></div>
    <div class="field-row">
      <div class="field"><label>Problems solved</label><input type="number" id="dsa-solved" value="${existing?.solved ?? 0}" min="0" /></div>
      <div class="field"><label>Total problems</label><input type="number" id="dsa-total" value="${existing?.total ?? 20}" min="1" /></div>
    </div>
    <div class="modal-actions">
      ${existing ? `<button class="btn btn-danger" id="dsa-delete">Delete</button>` : ''}
      <button class="btn btn-primary" id="dsa-save">Save</button>
    </div>
  `, {
    onMount: root => {
      root.querySelector('#dsa-save').addEventListener('click', () => {
        const name = root.querySelector('#dsa-name').value.trim();
        if (!name) return toast('Name the topic', 'danger');
        const payload = { name, solved: parseInt(root.querySelector('#dsa-solved').value) || 0, total: parseInt(root.querySelector('#dsa-total').value) || 1 };
        if (existing) updateItem('programming.dsaTopics', existing.id, payload);
        else addItem('programming.dsaTopics', payload);
        closeModal(); renderProgramming();
      });
      if (existing) root.querySelector('#dsa-delete').addEventListener('click', () => confirmAction('Delete this topic?', () => { deleteItem('programming.dsaTopics', existing.id); renderProgramming(); }));
    }
  });
}

// ---- LeetCode ----------------------------------------------------------
function openLeetcodeModal() {
  openModal('Log LeetCode problem', `
    <div class="field"><label>Problem title</label><input id="lc-title" placeholder="e.g. Two Sum" /></div>
    <div class="field-row">
      <div class="field"><label>Difficulty</label>
        <select id="lc-diff"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
      </div>
      <div class="field"><label>Date</label><input type="date" id="lc-date" value="${todayKey()}" /></div>
    </div>
    <div class="field"><label>URL (optional)</label><input id="lc-url" placeholder="https://leetcode.com/..." /></div>
    <div class="modal-actions"><button class="btn btn-primary" id="lc-save">Add</button></div>
  `, {
    onMount: root => root.querySelector('#lc-save').addEventListener('click', () => {
      const title = root.querySelector('#lc-title').value.trim();
      if (!title) return toast('Add a problem title', 'danger');
      addItem('programming.leetcode', { title, difficulty: root.querySelector('#lc-diff').value, date: root.querySelector('#lc-date').value, url: root.querySelector('#lc-url').value.trim() }, 'leetcode');
      closeModal(); renderProgramming();
    })
  });
}

// ---- Coding sessions -----------------------------------------------------
function openCodingSessionModal() {
  openModal('Log coding session', `
    <div class="field-row">
      <div class="field"><label>Duration (minutes)</label><input type="number" id="cs-dur" value="60" min="1" /></div>
      <div class="field"><label>Date</label><input type="date" id="cs-date" value="${todayKey()}" /></div>
    </div>
    <div class="field"><label>Project / topic</label><input id="cs-project" placeholder="e.g. Portfolio site" /></div>
    <div class="modal-actions"><button class="btn btn-primary" id="cs-save">Log session</button></div>
  `, {
    onMount: root => root.querySelector('#cs-save').addEventListener('click', () => {
      addItem('programming.codingSessions', { duration: parseInt(root.querySelector('#cs-dur').value) || 30, date: root.querySelector('#cs-date').value, project: root.querySelector('#cs-project').value.trim() }, 'coding');
      closeModal(); renderProgramming();
    })
  });
}

// ---- Contests -----------------------------------------------------------
function openContestModal() {
  openModal('Add contest', `
    <div class="field"><label>Name</label><input id="ct-name" placeholder="e.g. Codeforces Round 950" /></div>
    <div class="field-row">
      <div class="field"><label>Platform</label><input id="ct-platform" placeholder="Codeforces, LeetCode..." /></div>
      <div class="field"><label>Date</label><input type="date" id="ct-date" value="${todayKey()}" /></div>
    </div>
    <div class="field"><label><input type="checkbox" id="ct-upcoming"/> Upcoming (not yet completed)</label></div>
    <div class="field-row">
      <div class="field"><label>Rank (if completed)</label><input type="number" id="ct-rank" /></div>
      <div class="field"><label>Rating (if applicable)</label><input type="number" id="ct-rating" /></div>
    </div>
    <div class="modal-actions"><button class="btn btn-primary" id="ct-save">Add contest</button></div>
  `, {
    onMount: root => root.querySelector('#ct-save').addEventListener('click', () => {
      const name = root.querySelector('#ct-name').value.trim();
      if (!name) return toast('Name the contest', 'danger');
      addItem('programming.contests', {
        name, platform: root.querySelector('#ct-platform').value.trim(), date: root.querySelector('#ct-date').value,
        upcoming: root.querySelector('#ct-upcoming').checked,
        rank: root.querySelector('#ct-rank').value || null, rating: root.querySelector('#ct-rating').value || null
      });
      closeModal(); renderProgramming();
    })
  });
}

// ---- Interview prep -------------------------------------------------------
function addInterviewTopic(title) {
  if (!title.trim()) return;
  addItem('programming.interviewPrep', { topic: title.trim(), done: false });
  renderProgramming();
}
function toggleInterviewTopic(id) {
  const t = DB.programming.interviewPrep.find(x => x.id === id);
  t.done = !t.done;
  save(); renderProgramming();
}

// ---- GitHub stats ---------------------------------------------------------
async function loadGithubStats() {
  const user = DB.meta.githubUsername;
  const host = document.getElementById('gh-stats');
  if (!host) return;
  if (!user) { host.innerHTML = emptyState('🐙', 'Add your GitHub username in Settings to see live stats.', 'Go to Settings', `onclick="goToView('settings')"`); return; }
  host.innerHTML = `<div class="muted" style="font-size:12.5px">Loading GitHub stats for ${escapeHTML(user)}...</div>`;
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}`);
    if (!res.ok) throw new Error('not found');
    const data = await res.json();
    host.innerHTML = `
      <div class="flex gap-16">
        <img src="${data.avatar_url}" width="56" height="56" style="border-radius:12px" alt="" />
        <div>
          <div class="row-title">${escapeHTML(data.name || data.login)}</div>
          <div class="row-meta">@${escapeHTML(data.login)}</div>
        </div>
      </div>
      <div class="grid grid-3 mt-16">
        <div class="stat-card"><div class="stat-val mono">${data.public_repos}</div><div class="stat-label">Public repos</div></div>
        <div class="stat-card"><div class="stat-val mono">${data.followers}</div><div class="stat-label">Followers</div></div>
        <div class="stat-card"><div class="stat-val mono">${data.following}</div><div class="stat-label">Following</div></div>
      </div>
    `;
  } catch (e) {
    host.innerHTML = emptyState('⚠️', `Couldn't load GitHub data for "${user}". Check the username in Settings.`);
  }
}

// ---- Render ---------------------------------------------------------------
function renderProgramming() {
  const view = document.getElementById('view-programming');
  const P = DB.programming;
  const totalSolved = P.dsaTopics.reduce((s, t) => s + t.solved, 0);
  const totalCodingMin = P.codingSessions.reduce((s, c) => s + c.duration, 0);
  const streak = codingStreak();

  view.innerHTML = `
    <div class="page-head">
      <div><h1>Programming</h1><div class="sub">${totalSolved} DSA problems solved · ${minutesToHM(totalCodingMin)} logged · 🔥 ${streak} day streak</div></div>
      <button class="btn btn-primary" onclick="openCodingSessionModal()">+ Log session</button>
    </div>
    <div class="tabs">
      ${['overview','dsa','leetcode','contests','interview','github'].map(t => `<button class="tab-btn ${progTab===t?'active':''}" data-t="${t}">${{overview:'Overview',dsa:'DSA Tracker',leetcode:'LeetCode',contests:'Contests',interview:'Interview Prep',github:'GitHub'}[t]}</button>`).join('')}
    </div>
    <div id="prog-body"></div>
  `;
  view.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => { progTab = b.dataset.t; renderProgramming(); }));

  const body = document.getElementById('prog-body');

  if (progTab === 'overview') {
    body.innerHTML = `
      <div class="grid grid-2">
        <div class="card"><div class="card-head"><h3>Coding activity (12 weeks)</h3></div><div id="prog-heatmap"></div></div>
        <div class="card"><div class="card-head"><h3>DSA topic coverage</h3></div><div class="chart-box short"><canvas id="dsa-chart"></canvas></div></div>
      </div>`;
    const map = {};
    P.codingSessions.forEach(s => map[s.date] = (map[s.date] || 0) + 1);
    renderHeatmap(document.getElementById('prog-heatmap'), map, { weeks: 12 });
    if (P.dsaTopics.length) {
      barChart('dsa-chart', P.dsaTopics.map(t => t.name), [{ label: 'Solved', data: P.dsaTopics.map(t => t.solved) }, { label: 'Total', data: P.dsaTopics.map(t => t.total) }]);
    } else {
      document.getElementById('dsa-chart').closest('.card').querySelector('.chart-box').innerHTML = emptyState('🧩', 'Add DSA topics to see coverage.');
    }
  }

  if (progTab === 'dsa') {
    body.innerHTML = `
      <div class="flex-between mb-8"><span class="sub">Track problems solved per topic</span><button class="btn btn-sm btn-primary" onclick="openDsaModal()">+ Add topic</button></div>
      <div class="grid grid-3" id="dsa-list"></div>`;
    const listEl = document.getElementById('dsa-list');
    listEl.innerHTML = P.dsaTopics.length ? P.dsaTopics.map(t => `
      <div class="subject-card" onclick='openDsaModal(${JSON.stringify(t).replace(/'/g,"&#39;")})' style="cursor:pointer">
        <div class="row-title">${escapeHTML(t.name)}</div>
        <div class="mt-8">${progressBar(Math.round((t.solved/t.total)*100))}</div>
        <div class="row-meta mt-8">${t.solved} / ${t.total} solved</div>
      </div>`).join('') : emptyState('🧩', 'No DSA topics yet.', '+ Add topic', `onclick="openDsaModal()"`);
  }

  if (progTab === 'leetcode') {
    const diffCounts = { easy: 0, medium: 0, hard: 0 };
    P.leetcode.forEach(l => diffCounts[l.difficulty]++);
    body.innerHTML = `
      <div class="grid grid-4 mb-8">
        <div class="stat-card card"><div class="stat-val mono">${P.leetcode.length}</div><div class="stat-label">Total solved</div></div>
        <div class="stat-card card"><div class="stat-val mono" style="color:var(--success)">${diffCounts.easy}</div><div class="stat-label">Easy</div></div>
        <div class="stat-card card"><div class="stat-val mono" style="color:var(--warning)">${diffCounts.medium}</div><div class="stat-label">Medium</div></div>
        <div class="stat-card card"><div class="stat-val mono" style="color:var(--danger)">${diffCounts.hard}</div><div class="stat-label">Hard</div></div>
      </div>
      <div class="flex-between mb-8"><span class="sub">Recent problems</span><button class="btn btn-sm btn-primary" onclick="openLeetcodeModal()">+ Log problem</button></div>
      <div class="list" id="lc-list"></div>`;
    const listEl = document.getElementById('lc-list');
    const items = [...P.leetcode].sort((a, b) => b.date.localeCompare(a.date));
    listEl.innerHTML = items.length ? items.map(l => `
      <div class="row"><span class="tag tag-${l.difficulty === 'easy' ? 'low' : l.difficulty === 'medium' ? 'med' : 'high'}">${l.difficulty}</span>
      <div class="row-main">${l.url ? `<a href="${escapeHTML(l.url)}" target="_blank" rel="noopener" class="row-title">${escapeHTML(l.title)}</a>` : `<div class="row-title">${escapeHTML(l.title)}</div>`}</div>
      <div class="row-meta">${fmtDate(l.date)}</div></div>
    `).join('') : emptyState('💻', 'No problems logged yet.', '+ Log problem', `onclick="openLeetcodeModal()"`);
  }

  if (progTab === 'contests') {
    body.innerHTML = `<div class="flex-between mb-8"><span class="sub">Upcoming & past contests</span><button class="btn btn-sm btn-primary" onclick="openContestModal()">+ Add contest</button></div><div class="list" id="ct-list"></div>`;
    const listEl = document.getElementById('ct-list');
    const items = [...P.contests].sort((a, b) => b.date.localeCompare(a.date));
    listEl.innerHTML = items.length ? items.map(c => `
      <div class="row"><div class="row-main"><div class="row-title">${escapeHTML(c.name)}</div><div class="row-meta">${escapeHTML(c.platform || '')} · ${fmtDate(c.date)}</div></div>
      ${c.upcoming ? `<span class="tag tag-med">upcoming</span>` : `<span class="mono muted">${c.rank ? 'Rank ' + c.rank : ''} ${c.rating ? '· ' + c.rating : ''}</span>`}</div>
    `).join('') : emptyState('🏁', 'No contests logged yet.', '+ Add contest', `onclick="openContestModal()"`);
  }

  if (progTab === 'interview') {
    body.innerHTML = `
      <div class="flex gap-8 mb-16"><input id="iv-input" placeholder="Add interview topic (e.g. System Design basics)" style="flex:1" onkeydown="if(event.key==='Enter'){addInterviewTopic(this.value); this.value='';}" /><button class="btn btn-primary" onclick="const i=document.getElementById('iv-input'); addInterviewTopic(i.value); i.value='';">Add</button></div>
      <div class="list" id="iv-list"></div>`;
    const listEl = document.getElementById('iv-list');
    listEl.innerHTML = P.interviewPrep.length ? P.interviewPrep.map(t => `
      <div class="row"><button class="checkbox-round ${t.done ? 'checked' : ''}" onclick="toggleInterviewTopic('${t.id}')">${t.done ? '✓' : ''}</button>
      <div class="row-main"><div class="row-title ${t.done?'done':''}">${escapeHTML(t.topic)}</div></div></div>
    `).join('') : emptyState('🎤', 'No interview topics yet.');
  }

  if (progTab === 'github') {
    body.innerHTML = `<div class="card"><div class="card-head"><h3>GitHub profile</h3></div><div id="gh-stats"></div></div>`;
    loadGithubStats();
  }
}

VIEW_RENDERERS.programming = renderProgramming;