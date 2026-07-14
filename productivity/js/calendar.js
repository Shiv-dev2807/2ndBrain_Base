/* =========================================================
   CALENDAR.JS
   ========================================================= */

let calViewDate = new Date();

function calAllEventsForMonth(year, month) {
  // returns map date -> [{title, type}]
  const map = {};
  function push(date, title, type) {
    if (!map[date]) map[date] = [];
    map[date].push({ title, type });
  }
  DB.calendarEvents.forEach(e => push(e.date, e.title, e.type));
  DB.todos.filter(t => !t.done && t.due).forEach(t => push(t.due, t.title, 'deadline'));
  DB.goals.filter(g => !g.completedAt && g.targetDate).forEach(g => push(g.targetDate, g.title, g.isBossBattle ? 'deadline' : 'event'));
  DB.gate.mockTests.forEach(m => push(m.date, m.name, 'exam'));
  return map;
}

function openEventModal(dateStr) {
  openModal('New calendar event', `
    <div class="field"><label>Title</label><input id="ev-title" placeholder="e.g. Dentist appointment" /></div>
    <div class="field-row">
      <div class="field"><label>Date</label><input type="date" id="ev-date" value="${dateStr}" /></div>
      <div class="field"><label>Type</label>
        <select id="ev-type">
          <option value="event">Event</option>
          <option value="deadline">Deadline</option>
          <option value="exam">Exam</option>
        </select>
      </div>
    </div>
    <div class="modal-actions"><button class="btn btn-primary" id="ev-save">Add event</button></div>
  `, {
    onMount: root => {
      root.querySelector('#ev-save').addEventListener('click', () => {
        const title = root.querySelector('#ev-title').value.trim();
        if (!title) { toast('Give the event a title', 'danger'); return; }
        addItem('calendarEvents', { title, date: root.querySelector('#ev-date').value, type: root.querySelector('#ev-type').value });
        closeModal();
        renderCalendar();
      });
    }
  });
}

function calShowDay(dateStr, events) {
  const custom = DB.calendarEvents.filter(e => e.date === dateStr);
  openModal(fmtDate(dateStr), `
    <div class="list">
      ${events.length ? events.map(e => `<div class="row"><div class="row-main"><div class="row-title">${escapeHTML(e.title)}</div><div class="row-meta">${escapeHTML(e.type)}</div></div></div>`).join('') : emptyState('📅', 'Nothing scheduled.')}
    </div>
    <div class="modal-actions"><button class="btn btn-primary" id="ev-add-day">+ Add event on this day</button></div>
  `, {
    onMount: root => {
      root.querySelector('#ev-add-day').addEventListener('click', () => openEventModal(dateStr));
    }
  });
}

function calNav(delta) {
  calViewDate.setMonth(calViewDate.getMonth() + delta);
  renderCalendar();
}

function renderCalendar() {
  const view = document.getElementById('view-calendar');
  const year = calViewDate.getFullYear(), month = calViewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // make Monday first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const eventsMap = calAllEventsForMonth(year, month);
  const today = todayKey();

  view.innerHTML = `
    <div class="page-head">
      <div><h1>Calendar</h1><div class="sub">${firstDay.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div></div>
      <div class="flex gap-8">
        <button class="btn btn-sm" onclick="calNav(-1)">‹ Prev</button>
        <button class="btn btn-sm" onclick="calViewDate = new Date(); renderCalendar()">Today</button>
        <button class="btn btn-sm" onclick="calNav(1)">Next ›</button>
        <button class="btn btn-primary btn-sm" onclick="openEventModal('${today}')">+ Event</button>
      </div>
    </div>
    <div class="card">
      <div class="cal-grid mb-8">
        ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => `<div class="cal-dow">${d}</div>`).join('')}
      </div>
      <div class="cal-grid" id="cal-cells"></div>
    </div>
  `;

  const cells = document.getElementById('cal-cells');
  let html = '';
  for (let i = startOffset - 1; i >= 0; i--) {
    html += `<div class="cal-cell other-month"><div class="num">${daysInPrevMonth - i}</div></div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const evts = eventsMap[dateStr] || [];
    html += `<div class="cal-cell ${dateStr === today ? 'today' : ''}" onclick='calShowDay("${dateStr}", ${JSON.stringify(evts).replace(/'/g, "&#39;")})'>
      <div class="num">${d}</div>
      ${evts.slice(0, 3).map(e => `<div class="cal-evt ${e.type}">${escapeHTML(e.title)}</div>`).join('')}
      ${evts.length > 3 ? `<div class="cal-evt">+${evts.length - 3} more</div>` : ''}
    </div>`;
  }
  const totalCells = startOffset + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    html += `<div class="cal-cell other-month"><div class="num">${d}</div></div>`;
  }
  cells.innerHTML = html;
}

VIEW_RENDERERS.calendar = renderCalendar;