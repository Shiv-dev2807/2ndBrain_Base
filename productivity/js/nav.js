/* =========================================================
   NAV.JS — sidebar + view switching + topbar status
   ========================================================= */

const NAV_STRUCTURE = [
  {
    title: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: '⌂' },
      { id: 'main-section', label: 'Main (Prog + GATE)', icon: '◆' },
      { id: 'analytics', label: 'Analytics', icon: '▤' },
    ]
  },
  {
    title: 'Productivity', items: [
      { id: 'habits', label: 'Habits', icon: '✓' },
      { id: 'todos', label: 'To-Do', icon: '☰' },
      { id: 'pomodoro', label: 'Pomodoro + Forest', icon: '◍' },
      { id: 'timers', label: 'Timers', icon: '◷' },
      { id: 'calendar', label: 'Calendar', icon: '▦' },
      { id: 'notes', label: 'Notes & Second Brain', icon: '✎' },
      { id: 'goals', label: 'Goals & Projects', icon: '◎' },
    ]
  },
  {
    title: 'Academic & Career', items: [
      { id: 'programming', label: 'Programming', icon: '{}' },
      { id: 'gate', label: 'GATE Prep', icon: '∑' },
    ]
  },
  {
    title: 'Life', items: [
      { id: 'health', label: 'Health & Lifestyle', icon: '♥' },
      { id: 'levelup', label: 'Level Up', icon: '★' },
    ]
  },
];

const VIEW_TITLES = {
  dashboard: 'Dashboard', 'main-section': 'Main', analytics: 'Analytics',
  habits: 'Habits', todos: 'To-Do List', pomodoro: 'Pomodoro & Forest', timers: 'Timers',
  calendar: 'Calendar', notes: 'Notes & Second Brain', goals: 'Goals & Projects',
  programming: 'Programming', gate: 'GATE Preparation', health: 'Health & Lifestyle',
  levelup: 'Level Up — Solo Leveling Mode', settings: 'Settings'
};

const VIEW_RENDERERS = {}; // populated by each module: VIEW_RENDERERS.dashboard = renderDashboard

function renderSidebar() {
  const nav = document.getElementById('nav-scroll');
  nav.innerHTML = '';
  NAV_STRUCTURE.forEach(group => {
    const gt = el('div', { class: 'nav-group-title' }, group.title);
    nav.appendChild(gt);
    group.items.forEach(item => {
      const btn = el('button', {
        class: 'nav-item', 'data-view': item.id,
        onclick: () => goToView(item.id)
      }, [
        el('span', { class: 'ic' }, item.icon),
        el('span', { class: 'nav-label' }, item.label)
      ]);
      nav.appendChild(btn);
    });
  });
}

let currentView = 'dashboard';

function goToView(viewId) {
  currentView = viewId;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === viewId));
  document.querySelectorAll('section.view').forEach(s => s.classList.toggle('active', s.id === 'view-' + viewId));
  document.getElementById('topbar-title').textContent = VIEW_TITLES[viewId] || viewId;
  document.getElementById('main-scroll').scrollTop = 0;
  document.getElementById('sidebar').classList.remove('mobile-open');
  if (VIEW_RENDERERS[viewId]) VIEW_RENDERERS[viewId]();
  location.hash = viewId;
}

function refreshCurrentView() {
  if (VIEW_RENDERERS[currentView]) VIEW_RENDERERS[currentView]();
}

function updateTopbarStatus() {
  const g = DB.gamification;
  const { level, into, need } = levelForXP(g.xp);
  document.getElementById('topbar-level').textContent = level;
  document.getElementById('topbar-xp-fill').style.width = `${Math.min(100, (into / need) * 100)}%`;
  document.getElementById('topbar-streak').textContent = `🔥 ${g.streakGlobal}`;
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const collapsed = sb.classList.toggle('collapsed');
  const btn = document.getElementById('collapse-btn');
  if (btn) btn.textContent = collapsed ? '» Expand' : '« Collapse';
  try { localStorage.setItem('pd_sidebar_collapsed', collapsed ? '1' : '0'); } catch(e) {}
}

// Restore sidebar state
(function() {
  try {
    if (localStorage.getItem('pd_sidebar_collapsed') === '1') {
      const sb = document.getElementById('sidebar');
      if (sb) {
        sb.classList.add('collapsed');
        const btn = document.getElementById('collapse-btn');
        if (btn) btn.textContent = '» Expand';
      }
    }
  } catch(e) {}
})();

document.addEventListener('pd:activity', updateTopbarStatus);
document.addEventListener('pd:levelup', updateTopbarStatus);