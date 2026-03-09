import { supabase, ESTADOS, PIERNAS, POSICIONES } from './supabaseClient.js';
import { requireAuth, setupLogoutButton } from './auth.js';
import { fillFilterSelects, getCurrentFilters } from './filtros.js';

const path = window.location.pathname;
const page = path.substring(path.lastIndexOf('/') + 1);

if (page === 'index.html' || page === '') {
  initIndexPage();
}

if (page === 'nuevo-jugador.html') {
  initNuevoJugadorPage();
}

async function initIndexPage() {
  const session = await requireAuth();
  if (!session) return;

  await setupLogoutButton();

  const clubes = await fetchClubes();
  fillFilterSelects(clubes);

  const filterForm = document.getElementById('filtrosForm');
  filterForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    await loadJugadores();
  });

  document.getElementById('clearFiltersBtn')?.addEventListener('click', async () => {
    filterForm?.reset();
    await loadJugadores();
  });

  await loadJugadores();
}

async function loadJugadores() {
  const filters = getCurrentFilters();
  let query = supabase
    .from('jugadores')
    .select('id,nombre,ano_nacimiento,posicion,categoria,nivel,potencial,estado,clubes(nombre)')
    .order('created_at', { ascending: false });

  if (filters.ano_nacimiento) query = query.eq('ano_nacimiento', Number(filters.ano_nacimiento));
  if (filters.posicion) query = query.eq('posicion', filters.posicion);
  if (filters.club_id) query = query.eq('club_id', filters.club_id);
  if (filters.categoria) query = query.ilike('categoria', `%${filters.categoria}%`);
  if (filters.nivel) query = query.eq('nivel', Number(filters.nivel));
  if (filters.potencial) query = query.eq('potencial', Number(filters.potencial));
  if (filters.estado) query = query.eq('estado', filters.estado);

  const { data, error } = await query;

  const tbody = document.getElementById('jugadoresBody');
  const message = document.getElementById('listMessage');

  if (error) {
    tbody.innerHTML = '';
    message.textContent = `Error cargando jugadores: ${error.message}`;
    message.className = 'message error';
    return;
  }

  renderJugadores(data || []);
}

function renderJugadores(jugadores) {
  const tbody = document.getElementById('jugadoresBody');
  const message = document.getElementById('listMessage');

  if (!jugadores.length) {
    tbody.innerHTML = '';
    message.textContent = 'No hay jugadores con los filtros actuales.';
    message.className = 'message';
    return;
  }

  message.textContent = `${jugadores.length} jugadores encontrados`;
  message.className = 'message success';

  tbody.innerHTML = jugadores
    .map(
      (j) => `
      <tr class="clickable" data-id="${j.id}">
        <td>${j.nombre}</td>
        <td>${j.ano_nacimiento ?? '-'}</td>
        <td>${capitalize(j.posicion)}</td>
        <td>${j.clubes?.nombre ?? '-'}</td>
        <td>${j.categoria ?? '-'}</td>
        <td>${j.nivel}</td>
        <td>${j.potencial}</td>
        <td><span class="badge">${capitalize(j.estado)}</span></td>
      </tr>`
    )
    .join('');

  tbody.querySelectorAll('tr.clickable').forEach((row) => {
    row.addEventListener('click', () => {
      window.location.href = `jugador.html?id=${row.dataset.id}`;
    });
  });
}

async function initNuevoJugadorPage() {
  const session = await requireAuth();
  if (!session) return;

  await setupLogoutButton();

  const clubes = await fetchClubes();
  populateJugadorFormSelects(clubes);

  const form = document.getElementById('jugadorForm');
  const msg = document.getElementById('formMessage');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      nombre: form.nombre.value.trim(),
      ano_nacimiento: Number(form.ano_nacimiento.value),
      posicion: form.posicion.value,
      pierna: form.pierna.value,
      club_id: form.club_id.value,
      categoria: form.categoria.value.trim(),
      nivel: Number(form.nivel.value),
      potencial: Number(form.potencial.value),
      estado: form.estado.value,
      observaciones: form.observaciones.value.trim()
    };

    const { error } = await supabase.from('jugadores').insert(payload);

    if (error) {
      msg.textContent = `No se pudo guardar: ${error.message}`;
      msg.className = 'message error';
      return;
    }

    msg.textContent = 'Jugador creado correctamente.';
    msg.className = 'message success';
    form.reset();
  });
}

function populateJugadorFormSelects(clubes) {
  const posicion = document.getElementById('posicion');
  const pierna = document.getElementById('pierna');
  const estado = document.getElementById('estado');
  const club = document.getElementById('club_id');

  POSICIONES.forEach((v) => posicion.add(new Option(capitalize(v), v)));
  PIERNAS.forEach((v) => pierna.add(new Option(capitalize(v), v)));
  ESTADOS.forEach((v) => estado.add(new Option(capitalize(v), v)));
  clubes.forEach((c) => club.add(new Option(c.nombre, c.id)));
}

async function fetchClubes() {
  const { data, error } = await supabase.from('clubes').select('id,nombre').order('nombre');
  if (error) {
    console.error('Error cargando clubes', error.message);
    return [];
  }
  return data || [];
}

function capitalize(value = '') {
  if (!value) return '-';
  return value.charAt(0).toUpperCase() + value.slice(1);
}
