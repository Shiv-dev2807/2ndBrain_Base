/* =========================================================
   TIMERS.JS — stopwatch + countdown
   ========================================================= */

const swState = { elapsedMs: 0, running: false, startTs: null, intervalId: null, laps: [] };
const cdState = { totalSec: 300, remaining: 300, running: false, intervalId: null };
let timersTab = 'stopwatch';

function fmtStopwatch(ms) {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const s = totalSec % 60;
  const m = Math.floor(totalSec / 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

function swStart() {
  if (swState.running) return;
  swState.running = true;
  swState.startTs = Date.now() - swState.elapsedMs;
  swState.intervalId = setInterval(() => {
    swState.elapsedMs = Date.now() - swState.startTs;
    const d = document.getElementById('sw-display');
    if (d) d.textContent = fmtStopwatch(swState.elapsedMs);
  }, 33);
  renderTimersButtons();
}
function swPause() { swState.running = false; clearInterval(swState.intervalId); renderTimersButtons(); }
function swReset() { swPause(); swState.elapsedMs = 0; swState.laps = []; renderTimers(); }
function swLap() {
  if (!swState.running) return;
  swState.laps.unshift({ n: swState.laps.length + 1, t: swState.elapsedMs });
  renderTimers();
}

function cdTick() {
  cdState.remaining--;
  const d = document.getElementById('cd-display');
  if (d) d.textContent = fmtHMS(cdState.remaining);
  if (cdState.remaining <= 0) {
    cdPause();
    beep();
    toast('Countdown finished!', 'success');
  }
}
function fmtHMS(totalSec) {
  totalSec = Math.max(0, totalSec);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
function cdStart() {
  if (cdState.running || cdState.remaining <= 0) return;
  cdState.running = true;
  cdState.intervalId = setInterval(cdTick, 1000);
  renderTimersButtons();
}
function cdPause() { cdState.running = false; clearInterval(cdState.intervalId); renderTimersButtons(); }
function cdSetFromInputs() {
  const h = parseInt(document.getElementById('cd-h')?.value) || 0;
  const m = parseInt(document.getElementById('cd-m')?.value) || 0;
  const s = parseInt(document.getElementById('cd-s')?.value) || 0;
  cdState.totalSec = h * 3600 + m * 60 + s;
  cdState.remaining = cdState.totalSec;
  const d = document.getElementById('cd-display');
  if (d) d.textContent = fmtHMS(cdState.remaining);
}
function cdReset() { cdPause(); cdState.remaining = cdState.totalSec; const d = document.getElementById('cd-display'); if (d) d.textContent = fmtHMS(cdState.remaining); }

function renderTimersButtons() {
  const sb = document.getElementById('sw-start');
  if (sb) sb.textContent = swState.running ? '⏸ Pause' : '▶ Start';
  const cb = document.getElementById('cd-start');
  if (cb) cb.textContent = cdState.running ? '⏸ Pause' : '▶ Start';
}

function renderTimers() {
  const view = document.getElementById('view-timers');
  view.innerHTML = `
    <div class="page-head"><div><h1>Timers</h1><div class="sub">Stopwatch and countdown, independent of your focus sessions.</div></div></div>
    <div class="tabs">
      <button class="tab-btn ${timersTab === 'stopwatch' ? 'active' : ''}" data-t="stopwatch">Stopwatch</button>
      <button class="tab-btn ${timersTab === 'countdown' ? 'active' : ''}" data-t="countdown">Countdown</button>
    </div>
    <div class="grid grid-2">
      <div class="card" style="${timersTab === 'stopwatch' ? '' : 'display:none'}" id="sw-panel">
        <div class="pomo-wrap">
          <div class="timer-display" id="sw-display">${fmtStopwatch(swState.elapsedMs)}</div>
          <div class="pomo-controls">
            <button class="btn btn-primary" id="sw-start" onclick="swState.running ? swPause() : swStart()">▶ Start</button>
            <button class="btn" onclick="swLap()">🏁 Lap</button>
            <button class="btn" onclick="swReset()">↺ Reset</button>
          </div>
        </div>
        <div class="lap-list list">
          ${swState.laps.length ? swState.laps.map(l => `<div class="row"><div class="row-main">Lap ${l.n}</div><div class="mono">${fmtStopwatch(l.t)}</div></div>`).join('') : ''}
        </div>
      </div>
      <div class="card" style="${timersTab === 'countdown' ? '' : 'display:none'}" id="cd-panel">
        <div class="pomo-wrap">
          <div class="timer-display" id="cd-display">${fmtHMS(cdState.remaining)}</div>
          <div class="field-row3">
            <div class="field"><label>Hours</label><input type="number" id="cd-h" min="0" value="0" onchange="cdSetFromInputs()"></div>
            <div class="field"><label>Minutes</label><input type="number" id="cd-m" min="0" value="5" onchange="cdSetFromInputs()"></div>
            <div class="field"><label>Seconds</label><input type="number" id="cd-s" min="0" value="0" onchange="cdSetFromInputs()"></div>
          </div>
          <div class="pomo-controls">
            <button class="btn btn-primary" id="cd-start" onclick="cdState.running ? cdPause() : cdStart()">▶ Start</button>
            <button class="btn" onclick="cdReset()">↺ Reset</button>
          </div>
        </div>
      </div>
    </div>
  `;
  view.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => { timersTab = b.dataset.t; renderTimers(); }));
  cdSetFromInputs();
}

VIEW_RENDERERS.timers = renderTimers;