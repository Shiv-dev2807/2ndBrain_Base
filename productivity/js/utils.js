/* =========================================================
   UTILS.JS — shared UI helpers used across every module
   ========================================================= */

function toast(msg, kind = 'default') {
  const host = document.getElementById('toast-host');
  const el = document.createElement('div');
  el.className = `toast toast--${kind}`;
  el.textContent = msg;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'class') node.className = attrs[k];
    else if (k.startsWith('on') && typeof attrs[k] === 'function') node.addEventListener(k.slice(2), attrs[k]);
    else if (k === 'html') node.innerHTML = attrs[k];
    else node.setAttribute(k, attrs[k]);
  }
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

// ---- Modal ----------------------------------------------------------------

function openModal(title, bodyHTML, { onMount, wide } = {}) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal ${wide ? 'modal--wide' : ''}">
        <div class="modal-head">
          <h3>${escapeHTML(title)}</h3>
          <button class="icon-btn" data-close-modal aria-label="Close">✕</button>
        </div>
        <div class="modal-body">${bodyHTML}</div>
      </div>
    </div>`;
  root.querySelector('.modal-backdrop').addEventListener('click', e => {
    if (e.target.hasAttribute('data-close-modal') || e.target.classList.contains('modal-backdrop')) closeModal();
  });
  document.addEventListener('keydown', escCloseOnce);
  if (onMount) onMount(root);
}
function escCloseOnce(e) { if (e.key === 'Escape') { closeModal(); } }
function closeModal() {
  document.getElementById('modal-root').innerHTML = '';
  document.removeEventListener('keydown', escCloseOnce);
}

// ---- Date helpers ----------------------------------------------------------

function fmtDate(dstr) {
  if (!dstr) return '—';
  const d = new Date(dstr + (dstr.length === 10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtShort(dstr) {
  const d = new Date(dstr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}
function minutesToHM(mins) {
  const h = Math.floor(mins / 60), m = Math.round(mins % 60);
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}
function lastNDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(daysAgoKey(i));
  return out;
}

// ---- Heatmap (GitHub-style contribution grid) -----------------------------

function renderHeatmap(container, dataMap, { weeks = 26, colorFor } = {}) {
  const days = lastNDays(weeks * 7);
  const maxVal = Math.max(1, ...days.map(d => (dataMap[d] || 0)));
  const getColor = colorFor || (v => {
    if (!v) return 'var(--hm-0)';
    const ratio = v / maxVal;
    if (ratio > 0.75) return 'var(--hm-4)';
    if (ratio > 0.5) return 'var(--hm-3)';
    if (ratio > 0.25) return 'var(--hm-2)';
    return 'var(--hm-1)';
  });
  // group into weeks (columns), 7 rows
  const cols = [];
  for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7));
  const grid = el('div', { class: 'heatmap' });
  cols.forEach(week => {
    const colEl = el('div', { class: 'hm-col' });
    week.forEach(d => {
      const v = dataMap[d] || 0;
      const cell = el('div', {
        class: 'hm-cell',
        style: `background:${getColor(v)}`,
        title: `${d}: ${v} ${v === 1 ? 'activity' : 'activities'}`
      });
      colEl.appendChild(cell);
    });
    grid.appendChild(colEl);
  });
  container.innerHTML = '';
  container.appendChild(grid);
}

// ---- Progress bar ------------------------------------------------------

function progressBar(pct, extraClass = '') {
  const p = Math.max(0, Math.min(100, pct));
  return `<div class="pbar ${extraClass}"><div class="pbar-fill" style="width:${p}%"></div></div>`;
}

function emptyState(icon, text, actionLabel, actionAttr) {
  return `<div class="empty-state">
    <div class="empty-icon">${icon}</div>
    <p>${escapeHTML(text)}</p>
    ${actionLabel ? `<button class="btn btn-primary" ${actionAttr}>${escapeHTML(actionLabel)}</button>` : ''}
  </div>`;
}

function confirmAction(msg, onYes) {
  openModal('Are you sure?', `
    <p class="muted">${escapeHTML(msg)}</p>
    <div class="modal-actions">
      <button class="btn" data-close-modal>Cancel</button>
      <button class="btn btn-danger" id="confirm-yes">Delete</button>
    </div>
  `, {
    onMount: root => {
      root.querySelector('#confirm-yes').addEventListener('click', () => { onYes(); closeModal(); });
    }
  });
}

// simple debounce
function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}