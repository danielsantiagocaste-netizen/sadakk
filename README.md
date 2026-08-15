# SADAK — Control interno de perfumes

Aplicación web/PWA para el control de inventario, ventas, abonos y ganancias de SADAK.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre el link que aparezca (normalmente `http://localhost:5173`).

Necesitas un archivo `.env` con:

```
VITE_SUPABASE_URL=https://qbucpveglmaorpgwegqt.supabase.co
VITE_SUPABASE_ANON_KEY=tu_publishable_key
```

## Base de datos

El esquema completo (tablas, triggers, seguridad) está en `supabase/schema.sql`.
Se ejecuta una sola vez en Supabase → SQL Editor.

## Desplegar en internet (Vercel)

Ver la guía completa en la conversación con Claude, o resumen:

1. Crea una cuenta gratis en vercel.com
2. Instala la CLI: `npm i -g vercel`
3. Desde la carpeta del proyecto: `vercel login` y luego `vercel --prod`
4. Agrega las variables de entorno en el dashboard de Vercel (Settings → Environment Variables)
5. Vuelve a desplegar: `vercel --prod`

## Instalar en iPhone

1. Abre la URL de tu app desplegada en Safari (no funciona desde Chrome en iPhone)
2. Toca el botón de compartir (el cuadrado con la flecha hacia arriba)
3. Busca "Añadir a pantalla de inicio"
4. Confirma — aparecerá el ícono de SADAK en tu pantalla como una app normal
