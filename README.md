# Scouting Cantera Zaragoza

Aplicación web estática para registrar y seguir jugadores de fútbol base usando **Supabase** (Auth + PostgreSQL) y frontend con **HTML/CSS/JavaScript vanilla**.

## Estructura

- `login.html`: inicio de sesión.
- `index.html`: listado de jugadores + filtros.
- `nuevo-jugador.html`: alta de jugadores.
- `jugador.html`: detalle e informes.
- `css/styles.css`: estilos responsive.
- `js/supabaseClient.js`: cliente Supabase.
- `js/auth.js`: utilidades de autenticación.
- `js/jugadores.js`: listado/alta de jugadores.
- `js/filtros.js`: utilidades de filtros.
- `js/informes.js`: detalle e informes.
- `sql/schema.sql`: creación de tablas y políticas RLS.

## Configuración de Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta `sql/schema.sql` en el SQL Editor.
3. En `js/supabaseClient.js`, sustituye:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Crea usuarios desde **Authentication > Users** o habilita signup según necesidad interna.

## Despliegue en GitHub Pages

1. Sube este repositorio a GitHub.
2. En **Settings > Pages**, selecciona rama y carpeta raíz (`/root`).
3. Asegura que las rutas sean relativas (ya están preparadas para Pages).

## Flujo funcional

- Si no hay sesión, cualquier pantalla protegida redirige a `login.html`.
- Tras login correcto, redirección automática a `index.html`.
- Los filtros ejecutan consultas directas a Supabase.
- Al hacer clic en una fila se abre `jugador.html?id=<uuid>`.
- Desde la ficha se añaden informes asociados al jugador y usuario autenticado.
