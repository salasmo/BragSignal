# Brag Signal

Tu brag document personal — Next.js 14 (App Router) + TypeScript + Tailwind, listo para Vercel.

## Qué incluye

- **Custom 404** — `app/not-found.tsx`
- **Títulos únicos por página** — `title.template` en `app/layout.tsx`, override en cada `page.tsx`
- **CTA above the fold** — botón "Registrar un logro" en el hero, sin necesidad de scroll
- **Meta descriptions** — por página, vía `export const metadata`
- **Breadcrumbs** — visibles + `BreadcrumbList` JSON-LD (`components/Breadcrumbs.tsx`)
- **Schema estructurado** — `Person` JSON-LD en `app/layout.tsx` (ver nota abajo)
- **Página de privacidad** — `/privacy`
- **Sticky mobile CTA** — barra flotante solo en mobile (`components/StickyMobileCTA.tsx`)
- **Liquid glass** — `backdrop-filter: blur() saturate()` en `.glass` / `.glass-strong` (`app/globals.css`)
- **Drop shadows** — `shadow-glass`, `shadow-glow`, `shadow-card` en `tailwind.config.ts`
- **Sin skeleton loaders** — la página de inicio es un Server Component que hace fetch a Supabase antes de renderizar (`app/page.tsx`), así que el HTML llega con los datos ya adentro; no hay estado de "cargando" en el cliente
- **Hover animations** — cards, botones y CTAs con `transition` + `hover:-translate-y-*`
- **Dashboard de resumen** — logros totales, % con métrica, racha de meses activos, actividad mensual (barras), desglose por categoría, top roles/contexto y skills más usadas (`components/SummaryDashboard.tsx`)
- **Fecha editable y puesto/contexto por logro** — el modal de registro ahora incluye un selector de fecha y un campo de rol/empresa
- **Login** — email + contraseña vía Supabase Auth; cada quien ve y edita solo sus propias entradas (`middleware.ts`, `app/login/`)
- `sitemap.ts` y `robots.ts` (bonus, ya que estábamos en modo SEO)

## Persistencia + login: Supabase

Los datos viven en Supabase (Postgres) y cada entrada pertenece a un usuario autenticado — ya no hay acceso público a la tabla.

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, corre el contenido de `supabase-schema.sql` (crea la tabla `entries` con `user_id` y RLS que solo deja ver/editar tus propias filas).
3. En **Authentication → Providers**, confirma que "Email" esté habilitado (viene así por defecto).
   - Para uso personal, puedes desactivar **"Confirm email"** en Authentication → Settings, así entras directo después de registrarte sin esperar el correo de confirmación. Si lo dejas activado, configura el redirect URL (paso 6) para que el link de confirmación funcione.
4. En **Project Settings → API**, copia el `Project URL` y el `anon public` key.
5. Copia `.env.example` a `.env.local` y pega esos valores:

```bash
cp .env.example .env.local
```

6. En **Authentication → URL Configuration**, agrega estas URLs de redirect (necesarias para el link de confirmación de correo):
   - `http://localhost:3000/auth/callback` (para desarrollo local)
   - `https://tu-dominio.vercel.app/auth/callback` (tu dominio real de Vercel, una vez que lo tengas)
7. En Vercel, agrega las mismas variables de `.env.local` en **Settings → Environment Variables** antes de desplegar.
8. Entra a `/login`, crea tu cuenta, y listo — cada logro que registres queda ligado a tu usuario.

**¿Ya tenías la versión anterior sin login?** Tu tabla `entries` vieja no tiene `user_id`. En `supabase-schema.sql` hay un bloque de migración comentado al final con los pasos para agregarlo sin perder tus datos.

### Nota sobre "local schema"

No metí un schema de `LocalBusiness` porque este es un brag document *personal*, no un negocio con ubicación física — hubiera sido data estructurada falsa. En su lugar usé `Person` schema (tu nombre, rol, empleador, universidad). Si en realidad querías `LocalBusiness` para otra cosa, dime y lo agrego.

## Cómo correrlo local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Deploy a Vercel

1. Sube esta carpeta a un repo de GitHub.
2. En [vercel.com/new](https://vercel.com/new), importa el repo — Vercel detecta Next.js automáticamente, no necesitas configurar nada.
3. Antes de desplegar (o después, en Settings → Environment), actualiza `SITE_URL` en `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts` y `components/HomeClient.tsx` / `app/privacy/page.tsx` con tu dominio real de Vercel.
4. Deploy.

## Dónde vive tu data

En tu base de Supabase, tabla `entries` (ver `supabase-schema.sql`). El cliente vive en `lib/supabase.ts` y todo el CRUD en `lib/entries.ts`.
