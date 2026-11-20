# Plan de trabajo: sitio web de Book & Play

Sitio de marketing para promocionar Book & Play (proyecto de Industria del Software, punto 2: "Aplicar la estrategia de marketing creando un sitio web sólido").

## 1. Stack elegido

| Capa | Elección | Por qué |
|---|---|---|
| Estructura | **HTML5** semántico | Es suficiente para un sitio de marketing y es bueno para el SEO. |
| Estilos | **CSS puro con variables (custom properties)** | Los colores, tipografías y radios se cambian en un solo archivo. No hace falta compilar nada. |
| Interacción | **JavaScript vanilla** (sin frameworks) | Se usa en el menú móvil, las pestañas, la calculadora de recompensas, el formulario a WhatsApp y las animaciones. Pesa poco y no tiene dependencias. |
| Fuentes | Google Fonts (Barlow Condensed + DM Sans) | Los títulos tienen un estilo deportivo y el texto se lee bien. Se cambian en `css/theme.css`. |
| Formulario | Abre WhatsApp con el mensaje armado | No necesita backend. Más adelante se puede cambiar por Formspree o Netlify Forms. |
| Hosting | **GitHub Pages** o **Netlify** (gratis) | Se publica con `git push`, incluye HTTPS y permite un dominio propio. |

**¿Por qué no React, Wix o Tailwind?** Es un sitio de una sola página con contenido estático. Un framework agrega una etapa de compilación y más complejidad, sin ningún beneficio real. Wix no permite mostrar el trabajo técnico del equipo. Si después el sitio crece (blog, varias páginas, CMS), se puede migrar a **Astro** reutilizando el mismo HTML y CSS.

## 2. Estructura del proyecto

```
BookandPlay/
├── index.html          ← landing principal
├── legal.html          ← términos, privacidad y cancelaciones
├── css/
│   ├── theme.css       ← COLORES, fuentes, radios y sombras (editar aquí)
│   └── styles.css      ← estilos de los componentes (solo usan variables)
├── js/
│   ├── theme.js        ← API para cambiar colores + panel ?colores
│   ├── config.js       ← número de WhatsApp y correo
│   └── main.js         ← interacciones
└── assets/
    ├── favicon.svg
    └── img/            ← (pendiente) logo, capturas reales, foto OG
```

## 3. Sistema de colores (la marca todavía no está definida)

Todo el sitio sale de **3 variables** en `css/theme.css`:

```css
--brand-primary:   #18a957;  /* botones y acentos */
--brand-secondary: #0e1b2c;  /* fondos oscuros y footer */
--brand-accent:    #ffc20e;  /* realces y ofertas */
```

Los tonos claros, los oscuros, los bordes y el color del texto se calculan solos con `color-mix()`. El JS además elige automáticamente si el texto va blanco o negro según el contraste. Hay **tres formas** de probar colores:

1. **Panel visual:** abrí `index.html?colores`. Aparece un panel abajo a la izquierda con 5 paletas y selectores de color. El botón "Copiar CSS" te da las líneas para pegar en `theme.css`.
   - Para mostrarle una paleta al equipo: `index.html?paleta=portada` (también `cancha`, `electrico`, `padel` o `atardecer`).
2. **Consola del navegador:**
   ```js
   BookPlayTheme.applyPalette('portada')            // cancha | portada | electrico | padel | atardecer
   BookPlayTheme.setBrandColors({ primary: '#ff5a1f' })
   BookPlayTheme.exportCSS()
   BookPlayTheme.reset()
   ```
3. **Fijo en HTML:** `<html lang="es" data-theme="electrico">`

Regla para el equipo: **en `styles.css` no se escriben colores a mano**. Si hace falta uno nuevo, se agrega como variable en `theme.css`.

## 4. Lineamientos cubiertos (Capítulo 5: "Crear un sitio web sólido")

| Requisito | Dónde está en el sitio | Estado |
|---|---|---|
| Propuesta de valor | Hero, sección "Adiós al cuaderno…" y datos clave | ✅ Base lista |
| Funcionalidades completas | Pestañas Dueños / Jugadores, Panel IA, Recompensas | ✅ Base lista |
| Precios, planes u ofertas | Sección Precios (Básico, Premium, Jugador) + banner de lanzamiento | ✅ Falta confirmar la comisión |
| Referencias y testimonios | Sección Testimonios | ⚠️ Son plantillas: hay que poner testimonios reales |
| Condiciones legales de uso | `legal.html` (términos, privacidad, cancelación) | ⚠️ Borrador: falta revisión legal |
| Contacto (chat, correo, teléfono) | Formulario a WhatsApp, botón flotante y correo | ⚠️ Faltan el número y el correo reales en `js/config.js` |
| Call-to-action eficientes | "Afiliar mi complejo", "Pedir una demo", "Quiero jugar", "Descargar app" | ✅ |
| UX / crecimiento liderado por producto | Calculadora de recompensas interactiva y mockups de la app y del panel | ✅ Base lista |

## 5. Ideas tomadas del referente (clubes.atcsports.io)

- El hero tiene un mockup del producto y dos CTA: hablar con ventas y probar.
- Hay una franja de datos clave. Como todavía no tenemos clientes, usamos datos del producto (24/7, 50%, 1 hora gratis) y no métricas inventadas.
- Se cuenta el onboarding en 4 pasos con acompañamiento en persona.
- WhatsApp aparece en todas partes: botón flotante, formulario y enlace directo.
- **Lo que agregamos y ATC no tiene en su home:** precios visibles, preguntas frecuentes, testimonios, una sección para jugadores (somos un marketplace B2B + B2C) y un elemento interactivo.

## 6. Fases y tareas

### Fase 0: Base técnica ✅ (hecha)
- [x] Estructura de archivos y sistema de variables de color
- [x] Landing completa con todas las secciones
- [x] Página legal (borrador)
- [x] Diseño responsive (móvil, tablet y escritorio) y accesibilidad básica (navegación con teclado, ARIA, `prefers-reduced-motion`)

### Fase 1: Identidad visual (lo decide el equipo)
- [ ] Elegir la paleta definitiva (usar `?colores` en una reunión) y fijarla en `theme.css`
- [ ] Diseñar el logo (SVG) y reemplazar el ícono de balón en el header, el footer y `assets/favicon.svg`
- [ ] Confirmar las tipografías o cambiarlas en `theme.css`

### Fase 2: Contenido real
- [ ] Número de WhatsApp Business y correo → `js/config.js`
- [ ] Confirmar la comisión del Plan Básico (10% o la de lanzamiento, 6–8%) y la duración de la oferta
- [ ] Capturas reales de la app y del panel (reemplazan los mockups en HTML) → `assets/img/`
- [ ] Testimonios reales del piloto, con permiso (por ahora la sección está marcada como plantilla)
- [ ] Enlaces de redes sociales y de las tiendas de apps
- [ ] Revisar `legal.html` con la asesoría legal y confirmar la política de cancelación

### Fase 3: Mejoras opcionales
- [ ] Calculadora para dueños: "¿Cuánto pierdes por ausencias al mes?"
- [ ] Sección de la Copa Book & Play (torneos)
- [ ] Formulario con almacenamiento (Formspree o Netlify Forms) además de WhatsApp
- [ ] Imagen Open Graph (`og:image`) para las vistas previas en WhatsApp y redes
- [ ] Analítica (Google Analytics o Plausible) para medir conversiones de los CTA

### Fase 4: QA y publicación
- [ ] Probar en Chrome, Edge, Firefox, Safari (iOS) y Android
- [ ] Lighthouse con 90 o más en Performance, Accesibilidad, Best Practices y SEO
- [ ] Validar el HTML (validator.w3.org) y revisar la ortografía
- [ ] Crear el repositorio en GitHub y publicar en GitHub Pages o Netlify
- [ ] (Opcional) Dominio propio, por ejemplo `bookandplay.hn`

## 7. Cómo correrlo localmente

No hace falta instalar nada: abrí `index.html` en el navegador. Para que se recargue solo al guardar, usá la extensión **Live Server** de VS Code (clic derecho → "Open with Live Server").
