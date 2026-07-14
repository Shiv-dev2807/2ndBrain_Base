/* =========================================================
   MAIN-SECTION.JS — combined Programming + GATE dashboard
   ========================================================= */

function combinedStreak() {
  const codingDates = new Set(DB.programming.codingSessions.map(s => s.date));
  const studyDates = new Set(DB.gate.studySessions.map(s => s.date));
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = daysAgoKey(i);
    if (codingDates.has(d) || studyDates.has(d)) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

function renderMainSection() {
  const view = document.getElementById('view-main-section');
  const codingMin = DB.programming.codingSessions.reduce((s, c) => s + c.duration, 0);
  const studyMin = DB.gate.studySessions.reduce((s, c) => s + c.duration, 0);
  const totalMin = codingMin + studyMin;
  const dsaSolved = DB.programming.dsaTopics.reduce((s, t) => s + t.solved, 0);
  const gateProgress = DB.gate.subjects.length ? Math.round(DB.gate.subjects.reduce((s, sj) => s + sj.progress, 0) / DB.gate.subjects.length) : 0;
  const relevantGoals = DB.goals.filter(g => !g.completedAt && /programming|gate|coding|cs|dsa/i.test(g.category || ''));

  view.innerHTML = `
    <div class="page-head">
      <div><h1>Main — Programming + GATE</h1><div class="sub">Your combined academic & career dashboard</div></div>
      <div class="quick-links">
        <button class="quick-link" onclick="goToView('programming')">{} Programming</button>
        <button class="quick-link" onclick="goToView('gate')">∑ GATE</button>
      </div>
    </div>

    <div class="grid grid-stats mb-8">
      <div class="card stat-card"><div class="stat-icon">⏱</div><div class="stat-val mono">${minutesToHM(totalMin)}</div><div class="stat-label">Total logged hours</div></div>
      <div class="card stat-card"><div class="stat-icon">🧩</div><div class="stat-val mono">${dsaSolved}</div><div class="stat-label">DSA problems solved</div></div>
      <div class="card stat-card"><div class="stat-icon">📘</div><div class="stat-val mono">${gateProgress}%</div><div class="stat-label">GATE syllabus covered</div></div>
      <div class="card stat-card"><div class="stat-icon">🔥</div><div class="stat-val mono">${combinedStreak()}</div><div class="stat-label">Combined streak</div></div>
    </div>

    <div class="grid grid-2 mb-8">
      <div class="card">
        <div class="card-head"><h3>Combined activity (16 weeks)</h3></div>
        <div id="main-heatmap"></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Hours split</h3></div>
        <div class="chart-box short"><canvas id="main-pie"></canvas></div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <div class="card-head"><h3>Weekly hours: Coding vs GATE study</h3></div>
        <div class="chart-box"><canvas id="main-bar"></canvas></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Linked goals</h3></div>
        <div class="list" id="main-goals"></div>
      </div>
    </div>
  `;

  const map = {};
  DB.programming.codingSessions.forEach(s => map[s.date] = (map[s.date] || 0) + 1);
  DB.gate.studySessions.forEach(s => map[s.date] = (map[s.date] || 0) + 1);
  renderHeatmap(document.getElementById('main-heatmap'), map, { weeks: 16 });

  if (totalMin > 0) {
    pieChart('main-pie', ['Coding', 'GATE Study'], [codingMin, studyMin]);
  } else {
    document.getElementById('main-pie').closest('.card').querySelector('.chart-box').innerHTML = emptyState('📊', 'Log sessions to see your split.');
  }

  const days = lastNDays(7);
  const codingByDay = days.map(d => DB.programming.codingSessions.filter(s => s.date === d).reduce((a, b) => a + b.duration, 0) / 60);
  const studyByDay = days.map(d => DB.gate.studySessions.filter(s => s.date === d).reduce((a, b) => a + b.duration, 0) / 60);
  barChart('main-bar', days.map(fmtShort), [
    { label: 'Coding (h)', data: codingByDay },
    { label: 'GATE Study (h)', data: studyByDay }
  ]);

  document.getElementById('main-goals').innerHTML = relevantGoals.length ? relevantGoals.map(g => `
    <div class="row"><div class="row-main"><div class="row-title">${escapeHTML(g.title)}</div><div class="mt-8">${progressBar(g.progress)}</div></div><div class="mono muted">${g.progress}%</div></div>
  `).join('') : emptyState('🎯', 'Tag a goal with category "Programming" or "GATE" to see it here.');
}

VIEW_RENDERERS['main-section'] = renderMainSection;