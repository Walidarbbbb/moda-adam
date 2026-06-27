# Moda Adam — Tienda al por mayor (prototipo demo)

Prototipo de tienda online **B2B** (venta de ropa al por mayor) construido con
**Next.js + TypeScript + Tailwind CSS**. Todo funciona **en local**, sin cuentas
externas: los pagos, el aviso por WhatsApp y la base de datos están **simulados**
y los datos se guardan en el **navegador (localStorage)**.

---

## 🚀 Cómo arrancarlo

Necesitas tener instalado **Node.js 18 o superior** (https://nodejs.org).

1. Abre una terminal dentro de la carpeta `moda-adam`.
2. Instala las dependencias (solo la primera vez):

   ```bash
   npm install
   ```

3. Arranca la web en modo desarrollo:

   ```bash
   npm run dev
   ```

4. Abre el navegador en **http://localhost:3000**

> Para detenerla, pulsa `Ctrl + C` en la terminal.

---

## 👤 Usuarios de prueba

| Tipo        | Dónde entrar        | Email                   | Contraseña   |
|-------------|---------------------|-------------------------|--------------|
| **Cliente** | `/login`            | `cliente@modaadam.com`  | `cliente123` |
| **Trabajador** | `/admin`         | `admin@modaadam.com`    | `admin123`   |

También puedes **crear clientes nuevos** desde `/registro`.

---

## 🛍️ Qué puedes probar

- **Inicio** (`/`): escaparate con secciones y novedades.
- **Catálogo** por secciones: `/catalogo/camisetas`, `/catalogo/pantalones`, `/catalogo/conjuntos`.
- **Ficha de producto**: elegir color y talla, ver stock, **AGOTADO**, pedido mínimo de 6 uds.
- **Carrito** lateral (icono de la bolsa, arriba a la derecha).
- **Finalizar compra** (`/checkout`): formulario de tarjeta **simulado** (no cobra nada).
- **Confirmación** del pedido con **botón de WhatsApp**.
- **Mis pedidos** (`/mis-pedidos`): historial del cliente.
- **Panel** (`/admin`): crear/editar productos, cambiar stock y **marcar agotado**.
  Hay un botón para **Reiniciar la demo** si quieres empezar de cero.

---

## 🔌 Dónde se conectaría "lo real" (para la versión final)

En el código verás comentarios marcados con `👉 EN REAL:` que señalan los puntos
donde, en producción, se sustituiría la simulación por servicios reales:

- **Base de datos** → `lib/seed-data.ts` y `lib/store.tsx`. Los productos, usuarios
  y pedidos pasarían a una base de datos como **Supabase** (lectura/escritura desde
  el servidor en lugar de `localStorage`).
- **Pago real** → `app/checkout/page.tsx`. El formulario falso se sustituiría por
  **Stripe** (cobro real; el pedido se crea solo si el pago se confirma).
- **Aviso por WhatsApp** → `lib/format.ts` (`whatsappLink`) y `lib/constants.ts`
  (`WHATSAPP_NUMBER`). Además del enlace manual, se podría avisar automáticamente
  con la **API de WhatsApp Business**.
- **Contraseñas** → en esta demo se guardan en texto plano en el navegador. En real
  se cifran (hash) y se validan en un servidor seguro.

> El número de WhatsApp de ejemplo es `34600000000` (en `lib/constants.ts`).
> Cámbialo por el real del negocio.

---

## 📁 Estructura del proyecto

```
moda-adam/
├─ app/                 # Páginas (cada carpeta = una ruta)
│  ├─ page.tsx          # Inicio
│  ├─ catalogo/         # Catálogo por secciones
│  ├─ producto/[id]/    # Ficha de producto
│  ├─ checkout/         # Pago simulado
│  ├─ pedido/[id]/      # Confirmación + WhatsApp
│  ├─ mis-pedidos/      # Historial del cliente
│  ├─ login, registro/  # Cuentas de cliente
│  └─ admin/            # Panel de trabajadores
├─ components/          # Piezas reutilizables (cabecera, carrito, tarjetas…)
├─ lib/                 # Datos y "cerebro": tipos, datos de ejemplo y el store
└─ ...                  # Configuración (Next, Tailwind, TypeScript)
```

---

Hecho como prototipo de demostración. ¡Listo para enseñar antes de montar la versión real!
