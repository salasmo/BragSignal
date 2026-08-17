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
- `sitemap.ts` y `robots.ts` (bonus, ya que estábamos en modo SEO)

## Persistencia: Supabase (ya no localStorage)

Los datos ahora viven en una base de Supabase (Postgres), no en el navegador — así puedes verlos desde cualquier dispositivo.

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, corre el contenido de `supabase-schema.sql` (crea la tabla `entries` con RLS habilitado).
3. En **Project Settings → API**, copia el `Project URL` y el `anon public` key.
4. Copia `.env.example` a `.env.local` y pega esos valores:

```bash
cp .env.example .env.local
```

5. En Vercel, agrega las mismas variables en **Settings → Environment Variables** antes de desplegar.

**Nota de seguridad:** esta app no tiene login. Las políticas de RLS en `supabase-schema.sql` permiten lectura/escritura pública a quien tenga tu URL y anon key — está bien para un brag document personal donde tú controlas quién conoce esas claves, pero si algún día le agregas más gente o datos sensibles, cambia esas políticas para requerir autenticación (Supabase Auth se integra directo).

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
