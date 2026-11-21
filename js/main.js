/* =====================================================================
   Book & Play — interacciones del sitio
   ===================================================================== */
(function () {
  "use strict";

  const cfg = window.SITE_CONFIG || {};
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const waUrl = (text) => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;

  /* ---------- Enlaces de contacto (WhatsApp / email) ---------- */
  // Página actual: <body data-audience="jugadores|complejos">
  const audience = document.body.dataset.audience || "jugadores";
  const msg = cfg.whatsappMensaje;
  const waMessage = (typeof msg === "object" ? msg[audience] : msg) || "Hola, quiero información sobre Book & Play.";

  $$("[data-wa-link]").forEach((a) => {
    a.href = waUrl(waMessage);
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-email-link]").forEach((a) => (a.href = `mailto:${cfg.email}`));
  $$("[data-email-text]").forEach((el) => (el.textContent = cfg.email));
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Header: sombra al hacer scroll ---------- */
  const header = $("[data-header]");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const toggle = $("[data-nav-toggle]");
  const nav = $("#nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      toggle.querySelector("use")?.setAttribute("href", open ? "#i-x" : "#i-menu");
      document.body.classList.toggle("nav-open", open);
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    $$("a", nav).forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
  }

  /* ---------- Tabs accesibles (dueños / jugadores) ---------- */
  $$("[data-tabs]").forEach((wrap) => {
    const tabs = $$('[role="tab"]', wrap);
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
        next.focus();
        select(next);
      });
    });
  });

  /* ---------- Calculadora de recompensas ---------- */
  const calc = $("[data-rewards]");
  if (calc) {
    const MIN_POR_RESERVA = 5;
    const MIN_HORA_GRATIS = 60;
    const input = $('[data-input="reservas"]', calc);
    const ring = $("[data-ring]");
    const out = (name) => $$(`[data-out="${name}"]`);

    const update = () => {
      const reservas = Number(input.value);
      const minMes = reservas * MIN_POR_RESERVA;
      const horasAnio = Math.floor((minMes * 12) / MIN_HORA_GRATIS);
      const progreso = Math.min(minMes, MIN_HORA_GRATIS);

      out("reservas").forEach((el) => (el.textContent = reservas));
      out("minutos").forEach((el) => (el.textContent = minMes));
      out("horas").forEach((el) => (el.textContent = horasAnio));
      out("ring-min").forEach((el) => (el.textContent = progreso));
      if (ring) ring.style.setProperty("--p", Math.round((progreso / MIN_HORA_GRATIS) * 100));
      input.style.setProperty("--fill", `${((reservas - input.min) / (input.max - input.min)) * 100}%`);
    };
    input.addEventListener("input", update);
    update();
  }

  /* ---------- Botones de plan → preseleccionan el plan en el formulario ---------- */
  const form = $("[data-contact-form]");
  $$("[data-plan]").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (form && form.plan) form.plan.value = btn.dataset.plan;
    })
  );

  /* ---------- Formulario de contacto → WhatsApp ---------- */
  if (form) {
    const error = $("[data-form-error]", form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const required = $$("[required]", form);
      let ok = true;
      required.forEach((field) => {
        const valid = field.value.trim() !== "";
        field.closest(".field").classList.toggle("is-invalid", !valid);
        if (!valid) ok = false;
      });
      error.hidden = ok;
      if (!ok) {
        required.find((f) => !f.value.trim()).focus();
        return;
      }

      const d = Object.fromEntries(new FormData(form));
      const lineas = [
        "Hola, quiero solicitar una demo de Book & Play para mi complejo.",
        `• Nombre: ${d.nombre}`,
        `• Teléfono: ${d.telefono}`,
        d.complejo && `• Complejo: ${d.complejo}`,
        `• Rol: ${d.rol}`,
        `• Ciudad: ${d.ciudad}`,
        `• Plan de interés: ${d.plan}`,
        d.mensaje && `• Mensaje: ${d.mensaje}`,
      ].filter(Boolean);

      window.open(waUrl(lineas.join("\n")), "_blank", "noopener");
    });

    $$("input, select, textarea", form).forEach((f) =>
      f.addEventListener("input", () => f.closest(".field")?.classList.remove("is-invalid"))
    );
  }

  /* ---------- Animación de aparición al hacer scroll ---------- */
  const reveals = $$(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }
})();
