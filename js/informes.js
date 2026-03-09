import { supabase } from './supabaseClient.js';
import { requireAuth, setupLogoutButton } from './auth.js';

initJugadorPage();

async function initJugadorPage() {
  const session = await requireAuth();
  if (!session) return;

  await setupLogoutButton();

  const params = new URLSearchParams(window.location.search);
  const jugadorId = params.get('id');

  if (!jugadorId) {
    showMessage('detailMessage', 'Jugador no encontrado.', true);
    return;
  }

  await loadJugador(jugadorId);
  await loadInformes(jugadorId);

  document.getElementById('informeForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const payload = {
      jugador_id: jugadorId,
      usuario_id: session.user.id,
      fecha: form.fecha.value,
      partido: form.partido.value.trim(),
      comentario: form.comentario.value.trim()
    };

    const { error } = await supabase.from('informes').insert(payload);

    if (error) {
      showMessage('informeMessage', `Error al guardar informe: ${error.message}`, true);
      return;
    }

    showMessage('informeMessage', 'Informe añadido correctamente.');
    form.reset();
    await loadInformes(jugadorId);
  });
}

async function loadJugador(id) {
  const { data, error } = await supabase
    .from('jugadores')
    .select('*, clubes(nombre)')
    .eq('id', id)
    .single();

  if (error || !data) {
    showMessage('detailMessage', `No se pudo cargar el jugador: ${error?.message || 'sin datos'}`, true);
    return;
  }

  const fields = {
    pNombre: data.nombre,
    pAno: data.ano_nacimiento,
    pPosicion: data.posicion,
    pPierna: data.pierna,
    pClub: data.clubes?.nombre || '-',
    pCategoria: data.categoria,
    pNivel: data.nivel,
    pPotencial: data.potencial,
    pEstado: data.estado,
    pObservaciones: data.observaciones || '-'
  };

  Object.entries(fields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

async function loadInformes(jugadorId) {
  const { data, error } = await supabase
    .from('informes')
    .select('fecha,partido,comentario,created_at')
    .eq('jugador_id', jugadorId)
    .order('fecha', { ascending: false });

  const container = document.getElementById('informesList');

  if (error) {
    container.innerHTML = `<p class="message error">${error.message}</p>`;
    return;
  }

  if (!data?.length) {
    container.innerHTML = '<p class="muted">Sin informes todavía.</p>';
    return;
  }

  container.innerHTML = data
    .map(
      (i) => `
      <article class="informe-item">
        <strong>${i.fecha || '-'}</strong>
        <p><strong>Partido:</strong> ${i.partido || '-'}</p>
        <p>${i.comentario || ''}</p>
      </article>
    `
    )
    .join('');
}

function showMessage(id, text, isError = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = `message ${isError ? 'error' : 'success'}`;
}
