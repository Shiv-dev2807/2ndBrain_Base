/* =========================================================
   APP.JS — Bootstrap: init all modules, restore route
   All scripts load at end of <body>, so DOM is ready by now.
   ========================================================= */

function initApp() {
  // Apply saved settings (accent color, etc.)
  if (typeof applySettings === 'function') applySettings();

  // Build sidebar navigation
  renderSidebar();

  // Update topbar XP/streak
  updateTopbarStatus();

  // Restore last view from URL hash
  const hash = location.hash.replace('#', '');
  const validViews = [
    'dashboard','main-section','analytics','habits','todos',
    'pomodoro','timers','calendar','notes','goals',
    'programming','gate','health','levelup','settings'
  ];
  const startView = validViews.includes(hash) ? hash : 'dashboard';
  goToView(startView);
}

// Scripts are at bottom of <body> — DOM is already parsed
initApp();

