/* =========================================================
   CHARTS.JS — thin Chart.js wrappers, consistent dark theme
   ========================================================= */

const CHART_COLORS = ['#6D5EF2', '#34D399', '#F2B84B', '#F87171', '#38BDF8', '#C084FC', '#FB923C'];
const chartRegistry = {};

function baseChartOptions(extra = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#8A90A0', font: { family: 'Inter', size: 11 } } },
      tooltip: {
        backgroundColor: '#171B26', borderColor: '#262C3B', borderWidth: 1,
        titleColor: '#E7E9EE', bodyColor: '#C7CAD6', padding: 10, cornerRadius: 8
      }
    },
    scales: {
      x: { ticks: { color: '#8A90A0', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#8A90A0', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true }
    },
    ...extra
  };
}

function makeChart(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  if (chartRegistry[canvasId]) { chartRegistry[canvasId].destroy(); }
  const chart = new Chart(canvas.getContext('2d'), config);
  chartRegistry[canvasId] = chart;
  return chart;
}

function lineChart(canvasId, labels, datasets, opts = {}) {
  return makeChart(canvasId, {
    type: 'line',
    data: {
      labels,
      datasets: datasets.map((ds, i) => ({
        tension: 0.35, fill: true, borderWidth: 2, pointRadius: 2, pointHoverRadius: 4,
        borderColor: CHART_COLORS[i % CHART_COLORS.length],
        backgroundColor: CHART_COLORS[i % CHART_COLORS.length] + '22',
        ...ds
      }))
    },
    options: baseChartOptions({ scales: { x: { ticks: { color: '#8A90A0', font: { size: 10 } }, grid: { display: false } }, y: { ticks: { color: '#8A90A0', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true } }, ...opts })
  });
}

function barChart(canvasId, labels, datasets, opts = {}) {
  return makeChart(canvasId, {
    type: 'bar',
    data: {
      labels,
      datasets: datasets.map((ds, i) => ({
        backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
        borderRadius: 6, maxBarThickness: 28,
        ...ds
      }))
    },
    options: baseChartOptions(opts)
  });
}

function pieChart(canvasId, labels, data, opts = {}) {
  return makeChart(canvasId, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: CHART_COLORS, borderColor: '#0B0D12', borderWidth: 2 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '62%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#8A90A0', boxWidth: 10, font: { family: 'Inter', size: 11 } } },
        tooltip: baseChartOptions().plugins.tooltip
      },
      ...opts
    }
  });
}

function radarChart(canvasId, labels, data, opts = {}) {
  return makeChart(canvasId, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        data, label: 'Attributes',
        borderColor: '#6D5EF2', backgroundColor: '#6D5EF233', pointBackgroundColor: '#6D5EF2', borderWidth: 2
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: baseChartOptions().plugins.tooltip },
      scales: {
        r: {
          angleLines: { color: 'rgba(255,255,255,0.08)' },
          grid: { color: 'rgba(255,255,255,0.08)' },
          pointLabels: { color: '#C7CAD6', font: { size: 11, family: 'Inter' } },
          ticks: { display: false, backdropColor: 'transparent' },
          suggestedMin: 0, suggestedMax: 100
        }
      },
      ...opts
    }
  });
}