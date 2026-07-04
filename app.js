const STORAGE_KEY = 'gym_registro_v1';
const EXERCISES_KEY = 'gym_ejercicios_v2';
const NEW_VALUE = '__nuevo__';
const $ = (id) => document.getElementById(id);

const DEFAULT_EXERCISES = [
  'Press banca', 'Press inclinado', 'Aperturas con mancuernas', 'Fondos',
  'Press hombros', 'Elevaciones laterales', 'Remo con barra', 'Remo sentado',
  'Jalón al pecho', 'Dominadas', 'Peso muerto', 'Sentadilla', 'Prensa de piernas',
  'Estocadas', 'Cuádriceps en máquina', 'Curl femoral', 'Hip thrust',
  'Curl bíceps', 'Curl martillo', 'Tríceps polea', 'Extensión de tríceps',
  'Abdominales', 'Plancha', 'Gemelos'
];

let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let customExercises = JSON.parse(localStorage.getItem(EXERCISES_KEY) || '[]');

function todayISO() { return new Date().toISOString().slice(0,10); }
function saveEntries() { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); renderAll(); }
function saveExercises() { localStorage.setItem(EXERCISES_KEY, JSON.stringify(customExercises)); }
function fmtDate(s) { const [y,m,d]=s.split('-'); return `${d}/${m}/${y}`; }
function normalizeExercise(s) { return String(s || '').trim().replace(/\s+/g, ' '); }
function allExercises() {
  const fromEntries = entries.map(e => normalizeExercise(e.ejercicio));
  return [...new Set([...DEFAULT_EXERCISES, ...customExercises, ...fromEntries].filter(Boolean))]
    .sort((a,b)=>a.localeCompare(b));
}
function usedExercises() {
  return [...new Set(entries.map(e => normalizeExercise(e.ejercicio)).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
}
function escapeHtml(str) { return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

function resetForm() {
  $('entryForm').reset();
  $('fecha').value = todayISO();
  $('editId').value = '';
  $('saveBtn').textContent = 'Guardar ejercicio';
  $('cancelEdit').classList.add('hidden');
  $('nuevoEjercicioBox').classList.add('hidden');
  renderExerciseSelect();
}

function renderExerciseSelect(selected = '') {
  const options = allExercises().map(e => `<option value="${escapeHtml(e)}" ${e===selected?'selected':''}>${escapeHtml(e)}</option>`).join('');
  $('ejercicioSelect').innerHTML = `<option value="" disabled ${selected?'':'selected'}>Elegí un ejercicio</option>${options}<option value="${NEW_VALUE}">+ Nuevo ejercicio</option>`;
}

function currentExerciseValue() {
  if ($('ejercicioSelect').value === NEW_VALUE) return normalizeExercise($('nuevoEjercicio').value);
  return normalizeExercise($('ejercicioSelect').value);
}

function renderHistory() {
  const q = $('search').value.toLowerCase().trim();
  const list = entries
    .filter(e => !q || e.ejercicio.toLowerCase().includes(q))
    .sort((a,b) => b.fecha.localeCompare(a.fecha) || b.createdAt - a.createdAt);
  $('historyList').innerHTML = list.length ? list.map(cardHtml).join('') : '<div class="empty">Todavía no hay registros.</div>';
}

function cardHtml(e) {
  return `<article class="card">
    <h3>${escapeHtml(e.ejercicio)}</h3>
    <p class="meta">${fmtDate(e.fecha)}</p>
    <div class="stats">
      <span class="badge">${e.series} series</span>
      <span class="badge">${e.reps} reps</span>
      <span class="badge">${e.peso} kg</span>
    </div>
    ${e.obs ? `<p>${escapeHtml(e.obs)}</p>` : ''}
    <div class="actions">
      <button class="secondary" onclick="editEntry('${e.id}')">Editar</button>
      <button class="delete" onclick="deleteEntry('${e.id}')">Borrar</button>
    </div>
  </article>`;
}

function renderProgress() {
  const exercises = usedExercises();
  const current = $('progressExercise').value || exercises[0] || '';
  $('progressExercise').innerHTML = exercises.length ? exercises.map(e => `<option value="${escapeHtml(e)}" ${e===current?'selected':''}>${escapeHtml(e)}</option>`).join('') : '<option>Sin datos</option>';
  if (!exercises.length) { $('progressBox').innerHTML = '<div class="empty">Cargá ejercicios para ver progreso.</div>'; return; }
  const ex = $('progressExercise').value;
  const data = entries.filter(e => e.ejercicio === ex).sort((a,b) => a.fecha.localeCompare(b.fecha));
  const last = data[data.length-1];
  const maxPeso = Math.max(...data.map(e => Number(e.peso)));
  const maxVolume = Math.max(...data.map(e => Number(e.peso) * Number(e.reps) * Number(e.series)));
  $('progressBox').innerHTML = `<article class="card">
    <h3>${escapeHtml(ex)}</h3>
    <div class="stats">
      <span class="badge">Último: ${last.peso} kg</span>
      <span class="badge">Mejor peso: ${maxPeso} kg</span>
      <span class="badge">Mejor volumen: ${maxVolume} kg</span>
    </div>
    <p class="meta">Registros: ${data.length}</p>
  </article>` + data.slice(-8).reverse().map(e => `<article class="card"><b>${fmtDate(e.fecha)}</b><div class="stats"><span class="badge">${e.series}x${e.reps}</span><span class="badge">${e.peso} kg</span></div></article>`).join('');
}

function renderAll() { renderHistory(); renderProgress(); }

window.editEntry = (id) => {
  const e = entries.find(x => x.id === id); if (!e) return;
  $('editId').value = e.id;
  $('fecha').value = e.fecha;
  renderExerciseSelect(e.ejercicio);
  $('nuevoEjercicioBox').classList.add('hidden');
  $('nuevoEjercicio').value = '';
  $('series').value = e.series;
  $('reps').value = e.reps;
  $('peso').value = e.peso;
  $('obs').value = e.obs || '';
  $('saveBtn').textContent = 'Guardar cambios';
  $('cancelEdit').classList.remove('hidden');
  switchTab('nuevo');
  window.scrollTo({top:0, behavior:'smooth'});
};

window.deleteEntry = (id) => {
  if (confirm('¿Borrar este registro?')) {
    entries = entries.filter(e => e.id !== id);
    saveEntries();
  }
};

$('ejercicioSelect').addEventListener('change', () => {
  const isNew = $('ejercicioSelect').value === NEW_VALUE;
  $('nuevoEjercicioBox').classList.toggle('hidden', !isNew);
  if (isNew) setTimeout(() => $('nuevoEjercicio').focus(), 50);
});

$('entryForm').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const ejercicio = currentExerciseValue();
  if (!ejercicio) { alert('Elegí o escribí un ejercicio.'); return; }

  if ($('ejercicioSelect').value === NEW_VALUE && !customExercises.includes(ejercicio) && !DEFAULT_EXERCISES.includes(ejercicio)) {
    customExercises.push(ejercicio);
    customExercises = [...new Set(customExercises)].sort((a,b)=>a.localeCompare(b));
    saveExercises();
  }

  const item = {
    id: $('editId').value || crypto.randomUUID(),
    fecha: $('fecha').value,
    ejercicio,
    series: Number($('series').value),
    reps: Number($('reps').value),
    peso: Number($('peso').value),
    obs: $('obs').value.trim(),
    createdAt: Date.now()
  };
  if ($('editId').value) entries = entries.map(e => e.id === item.id ? {...e, ...item, createdAt:e.createdAt} : e);
  else entries.push(item);
  saveEntries(); resetForm(); switchTab('historial');
});

$('cancelEdit').addEventListener('click', resetForm);
$('search').addEventListener('input', renderHistory);
$('progressExercise').addEventListener('change', renderProgress);
$('exportBtn').addEventListener('click', () => {
  const csv = ['Fecha,Ejercicio,Series,Reps,Peso,Observaciones', ...entries.map(e => [e.fecha,e.ejercicio,e.series,e.reps,e.peso,e.obs].map(v => '"'+String(v).replaceAll('"','""')+'"').join(','))].join('\n');
  const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='gym-registro.csv'; a.click(); URL.revokeObjectURL(url);
});

document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
function switchTab(tab) {
  document.querySelectorAll('.tab,.panel').forEach(el => el.classList.remove('active'));
  document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');
  $(tab).classList.add('active');
  renderAll();
}

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
resetForm(); renderAll();
