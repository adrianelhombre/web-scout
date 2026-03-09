import { supabase } from './supabaseClient.js';

export async function requireAuth() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = 'login.html';
    return null;
  }

  return session;
}

export async function setupLogoutButton(buttonId = 'logoutBtn') {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  });
}

export async function redirectIfLoggedIn() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    window.location.href = 'index.html';
  }
}

export async function loginWithEmail(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
}
