import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://jkkkzfeplokriesenwbp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_m77HaXduc6yceR9KYbOP9A_ahSI93KU'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const ESTADOS = ['observado', 'seguimiento', 'interesante', 'prioritario', 'descartado'];
export const PIERNAS = ['derecha', 'izquierda', 'ambidiestro'];
export const POSICIONES = ['portero', 'defensa', 'lateral', 'mediocentro', 'extremo', 'delantero'];
