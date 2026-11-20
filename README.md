# Book & Play: sitio web

Sitio de marketing de **Book & Play**, la plataforma para reservar canchas de fútbol y pádel en San Pedro Sula. Está hecho en HTML, CSS y JavaScript, sin frameworks ni compilación.

## Verlo localmente

Abrí `index.html` en el navegador, o usá la extensión **Live Server** de VS Code.

## Cambiar los colores

Editá las 3 variables `--brand-*` en [`css/theme.css`](css/theme.css). Para probar paletas en vivo, abrí `index.html?colores`. Los detalles están en [`PLAN.md`](PLAN.md#3-sistema-de-colores-la-marca-todavía-no-está-definida).

## Publicación

El sitio se publica con **GitHub Pages** desde la rama `main` (carpeta raíz). Cada `git push` a `main` actualiza el sitio en uno o dos minutos.

El archivo `.nojekyll` le indica a GitHub Pages que sirva los archivos tal cual, sin procesarlos con Jekyll.

## Plan de trabajo

Las fases, las tareas y los pendientes están en [`PLAN.md`](PLAN.md).
