/* =====================================================================
   BookPlayTheme — utilidades para cambiar la colorimetría del sitio.

   Uso desde la consola del navegador (o desde otro script):
     BookPlayTheme.setBrandColors({ primary: '#1463ff', secondary: '#0b1533', accent: '#c6ff3d' })
     BookPlayTheme.applyPalette('portada')
     BookPlayTheme.reset()
     BookPlayTheme.exportCSS()   // devuelve el bloque CSS listo para pegar en css/theme.css

   Panel visual para probar colores: abrí el sitio con ?colores
   (ej: http://localhost:5500/index.html?colores)
   Ver una paleta puntual: index.html?paleta=portada  (se puede combinar: ?paleta=padel&colores)
   ===================================================================== */
(function () {
  "use strict";

  // Mantener sincronizado con los bloques [data-theme] de css/theme.css
  const PALETAS = {
    cancha: { label: "Cancha (verde)", primary: "#18a957", secondary: "#0e1b2c", accent: "#ffc20e" },
    portada: { label: "Portada (amarillo/carbón)", primary: "#ffc20e", secondary: "#2b2b2b", accent: "#ff7a00" },
    electrico: { label: "Eléctrico (azul)", primary: "#1463ff", secondary: "#0b1533", accent: "#c6ff3d" },
    padel: { label: "Pádel (lima)", primary: "#b6e51f", secondary: "#13213c", accent: "#ff5a36" },
    atardecer: { label: "Atardecer (naranja)", primary: "#ff5a1f", secondary: "#1c1530", accent: "#ffd23f" },
  };

  const STORAGE_KEY = "bp-colores";
  const root = document.documentElement;
  root.classList.add("js"); // habilita animaciones que dependen de JavaScript

  /* ---------- Helpers de color ---------- */
  function hexToRgb(hex) {
    let h = String(hex).trim().replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16);
    if (Number.isNaN(n) || h.length !== 6) return null;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgbToHex({ r, g, b }) {
    return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  }

  function luminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const ch = [rgb.r, rgb.g, rgb.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }

  function contrast(a, b) {
    const l1 = luminance(a);
    const l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  function mix(hex, target, amount) {
    const a = hexToRgb(hex);
    const b = hexToRgb(target);
    return rgbToHex({
      r: a.r + (b.r - a.r) * amount,
      g: a.g + (b.g - a.g) * amount,
      b: a.b + (b.b - a.b) * amount,
    });
  }

  /** Texto legible (blanco o casi negro) sobre un color de fondo. */
  function readableOn(bg) {
    return contrast(bg, "#ffffff") >= contrast(bg, "#111111") ? "#ffffff" : "#111111";
  }

  /** Oscurece un color hasta que sea legible como texto sobre blanco (AA 4.5:1). */
  function inkOnWhite(hex) {
    let c = hex;
    for (let i = 0; i < 12 && contrast(c, "#ffffff") < 4.5; i++) c = mix(c, "#000000", 0.12);
    return c;
  }

  function readVar(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  /* ---------- API pública ---------- */

  /**
   * Cambia los colores de marca. Podés pasar solo los que quieras cambiar.
   * @param {{primary?:string, secondary?:string, accent?:string, neutral?:string}} colors
   * @param {{persist?:boolean}} [opts] persist=true los guarda en este navegador
   */
  function setBrandColors(colors, opts = {}) {
    const map = { primary: "--brand-primary", secondary: "--brand-secondary", accent: "--brand-accent", neutral: "--brand-neutral" };
    Object.entries(colors || {}).forEach(([key, value]) => {
      if (map[key] && hexToRgb(value)) root.style.setProperty(map[key], value);
    });
    refreshContrast();
    if (opts.persist) save(getColors());
    root.dispatchEvent(new CustomEvent("bp:theme-change", { detail: getColors() }));
  }

  /** Aplica una paleta predefinida por nombre (ver PALETAS). */
  function applyPalette(name, opts = {}) {
    const p = PALETAS[name];
    if (!p) {
      console.warn(`[BookPlayTheme] Paleta "${name}" no existe. Disponibles:`, Object.keys(PALETAS));
      return;
    }
    root.dataset.theme = name;
    setBrandColors({ primary: p.primary, secondary: p.secondary, accent: p.accent }, opts);
  }

  /** Vuelve a los colores definidos en css/theme.css y borra lo guardado. */
  function reset() {
    ["--brand-primary", "--brand-secondary", "--brand-accent", "--brand-neutral", "--on-primary", "--on-secondary", "--on-accent", "--primary-ink"].forEach((v) =>
      root.style.removeProperty(v)
    );
    delete root.dataset.theme;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* sin storage */ }
    refreshContrast();
    root.dispatchEvent(new CustomEvent("bp:theme-change", { detail: getColors() }));
  }

  /** Colores de marca actuales. */
  function getColors() {
    return {
      primary: readVar("--brand-primary"),
      secondary: readVar("--brand-secondary"),
      accent: readVar("--brand-accent"),
      neutral: readVar("--brand-neutral"),
    };
  }

  /** Bloque CSS listo para pegar en css/theme.css */
  function exportCSS() {
    const c = getColors();
    return [
      `  --brand-primary: ${c.primary};`,
      `  --brand-secondary: ${c.secondary};`,
      `  --brand-accent: ${c.accent};`,
      `  --brand-neutral: ${c.neutral};`,
    ].join("\n");
  }

  /** Recalcula colores de texto según contraste (se llama solo). */
  function refreshContrast() {
    const c = getColors();
    if (hexToRgb(c.primary)) {
      root.style.setProperty("--on-primary", readableOn(c.primary));
      root.style.setProperty("--primary-ink", inkOnWhite(c.primary));
    }
    if (hexToRgb(c.secondary)) root.style.setProperty("--on-secondary", readableOn(c.secondary));
    if (hexToRgb(c.accent)) root.style.setProperty("--on-accent", readableOn(c.accent));
  }

  function save(colors) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(colors)); } catch (e) { /* sin storage */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /* ---------- Panel de prueba de colores (solo con ?colores) ---------- */
  function mountPanel() {
    const panel = document.createElement("aside");
    panel.className = "theme-panel";
    panel.setAttribute("aria-label", "Probador de colores");
    const opts = Object.entries(PALETAS).map(([k, p]) => `<option value="${k}">${p.label}</option>`).join("");
    panel.innerHTML = `
      <button class="theme-panel__toggle" type="button" aria-expanded="true">🎨 Colores</button>
      <div class="theme-panel__body">
        <label>Paleta
          <select data-tp="palette"><option value="">— Personalizada —</option>${opts}</select>
        </label>
        <label>Primario <input type="color" data-tp="primary"></label>
        <label>Secundario <input type="color" data-tp="secondary"></label>
        <label>Acento <input type="color" data-tp="accent"></label>
        <div class="theme-panel__actions">
          <button type="button" data-tp="copy">Copiar CSS</button>
          <button type="button" data-tp="reset">Restablecer</button>
        </div>
        <small>Los cambios se guardan solo en este navegador. Para dejarlos fijos, pegá el CSS copiado en <code>css/theme.css</code>.</small>
      </div>`;
    document.body.appendChild(panel);

    const $ = (sel) => panel.querySelector(`[data-tp="${sel}"]`);
    const sync = () => {
      const c = getColors();
      ["primary", "secondary", "accent"].forEach((k) => {
        const rgb = hexToRgb(c[k]);
        if (rgb) $(k).value = rgbToHex(rgb);
      });
      $("palette").value = root.dataset.theme || "";
    };

    $("palette").addEventListener("change", (e) => {
      if (e.target.value) applyPalette(e.target.value, { persist: true });
      sync();
    });
    ["primary", "secondary", "accent"].forEach((k) =>
      $(k).addEventListener("input", (e) => {
        delete root.dataset.theme;
        setBrandColors({ [k]: e.target.value }, { persist: true });
        $("palette").value = "";
      })
    );
    $("copy").addEventListener("click", async (e) => {
      const css = exportCSS();
      try {
        await navigator.clipboard.writeText(css);
        e.target.textContent = "¡Copiado!";
      } catch (err) {
        console.log(css);
        e.target.textContent = "Ver consola";
      }
      setTimeout(() => (e.target.textContent = "Copiar CSS"), 1600);
    });
    $("reset").addEventListener("click", () => { reset(); sync(); });
    panel.querySelector(".theme-panel__toggle").addEventListener("click", (e) => {
      const open = panel.classList.toggle("is-collapsed") === false;
      e.currentTarget.setAttribute("aria-expanded", String(open));
    });
    sync();
  }

  /* ---------- Inicio ---------- */
  const params = new URLSearchParams(location.search);
  const devMode = params.has("colores");
  if (devMode) {
    const saved = load();
    if (saved) setBrandColors(saved);
  }
  // ?paleta=portada → muestra el sitio con esa paleta (útil para compartir opciones con el equipo)
  if (params.get("paleta")) applyPalette(params.get("paleta"));
  refreshContrast();

  document.addEventListener("DOMContentLoaded", () => {
    if (devMode) mountPanel();
  });

  window.BookPlayTheme = { PALETAS, setBrandColors, applyPalette, reset, getColors, exportCSS, contrast };
})();
