# Book & Play: sitio web

Sitio de marketing de **Book & Play**, la plataforma para reservar canchas de fútbol y pádel en San Pedro Sula. Está hecho en HTML, CSS y JavaScript, sin frameworks ni compilación.

## Verlo localmente

Abrí `index.html` en el navegador, o usá la extensión **Live Server** de VS Code.

## Cambiar los colores

Todos los colores del sitio salen de tres variables en [`css/theme.css`](css/theme.css):

```css
--brand-primary:   #18a957;  /* botones y acentos */
--brand-secondary: #0e1b2c;  /* fondos oscuros y footer */
--brand-accent:    #ffc20e;  /* realces y ofertas */
```

- Para probar colores en vivo, abrí `index.html?colores`.
- Para ver una paleta predefinida, abrí `index.html?paleta=portada` (también están `cancha`, `electrico`, `padel` y `atardecer`).

## Publicación

El sitio se publica con **GitHub Pages** desde la rama `main` (carpeta raíz). Cada `git push` a `main` actualiza el sitio en uno o dos minutos.

El archivo `.nojekyll` le indica a GitHub Pages que sirva los archivos tal cual, sin procesarlos con Jekyll.
