import { ESTADOS, POSICIONES } from './supabaseClient.js';

export function getCurrentFilters() {
  return {
    ano_nacimiento: document.getElementById('fAno')?.value?.trim() || '',
    posicion: document.getElementById('fPosicion')?.value || '',
    club_id: document.getElementById('fClub')?.value || '',
    categoria: document.getElementById('fCategoria')?.value?.trim() || '',
    nivel: document.getElementById('fNivel')?.value || '',
    potencial: document.getElementById('fPotencial')?.value || '',
    estado: document.getElementById('fEstado')?.value || ''
  };
}

export function fillFilterSelects(clubes = []) {
  const posicionSelect = document.getElementById('fPosicion');
  const estadoSelect = document.getElementById('fEstado');
  const clubSelect = document.getElementById('fClub');

  if (posicionSelect) {
    POSICIONES.forEach((pos) => posicionSelect.add(new Option(capitalize(pos), pos)));
  }

  if (estadoSelect) {
    ESTADOS.forEach((estado) => estadoSelect.add(new Option(capitalize(estado), estado)));
  }

  if (clubSelect) {
    clubes.forEach((club) => clubSelect.add(new Option(club.nombre, club.id)));
  }
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
