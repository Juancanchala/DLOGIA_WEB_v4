# D'LOGIA — Sitio Web v4

Sitio web de la marca D'LOGIA. Vanilla HTML/CSS/JS con ES modules. Sin frameworks, sin build tools.

## Estructura del proyecto

```
dlogia/
├── index.html              # HTML principal
├── .gitignore              # ⚠️ config.js excluido
│
├── css/
│   ├── tokens.css          # Design tokens, reset, utilidades globales
│   ├── nav.css             # Navegación + mobile
│   ├── hero.css            # Hero section + animaciones de entrada
│   ├── sections.css        # Todas las secciones (about, servicios, portafolio, precios, etc.)
│   └── chat.css            # Widget de chat + modal de testimonios
│
└── js/
    ├── config.js           # ⚠️ API keys (NO subir a repo público)
    ├── main.js             # Entry point — inicializa todos los módulos
    ├── particles.js        # Motor de partículas (Canvas API)
    ├── chat.js             # Widget IA con OpenAI
    └── ui.js               # Nav, scroll reveal, contadores, filtros, testimonios
```

## Setup rápido

1. **Clona o descarga** el proyecto

2. **Configura tu API key** en `js/config.js`:
   ```js
   export const CONFIG = {
     OPENAI_KEY: 'sk-tu-api-key-aqui',
     WA_NUMBER:  '573124942672',
   };
   ```

3. **Corre localmente** — necesitas un servidor HTTP (no funciona con `file://` por los ES modules):
   ```bash
   # Python
   python -m http.server 3000

   # Node (npx)
   npx serve .

   # VS Code — instala extensión "Live Server" y click en "Go Live"
   ```

4. **Abre** `http://localhost:3000`

## Deploy en Netlify (recomendado)

1. Sube el proyecto a un **repositorio privado** en GitHub
2. En Netlify → "New site from Git" → selecciona el repo
3. Build command: *(vacío)*  
   Publish directory: `.` (raíz)
4. En Netlify → Site settings → **Environment variables**:
   - Agrega `OPENAI_KEY = sk-tu-key`
5. Modifica `js/config.js` para leer la variable de entorno si usas funciones serverless, o mantén el archivo local y **nunca lo subas al repo**.

> **Opción más segura para producción**: crear una Netlify Function que haga el proxy a OpenAI, así la API key nunca llega al navegador.

## Personalización

| Qué cambiar | Dónde |
|---|---|
| Colores / tipografía | `css/tokens.css` → variables `:root` |
| Foto (reemplazar avatar) | `index.html` → sección `#sobre-mi`, reemplaza `.avatar-frame` con `<img>` |
| Proyectos del portafolio | `index.html` → sección `#portafolio` |
| Precios | `index.html` → sección `#precios` |
| Personalidad del agente IA | `js/chat.js` → constante `SYSTEM_PROMPT` |
| Testimonios dummy | `js/ui.js` → array `DUMMY_TESTIMONIALS` |
| Número de WhatsApp | `js/config.js` → `WA_NUMBER` |

## Notas técnicas

- **ES Modules**: el proyecto usa `type="module"` — requiere servidor HTTP, no abre directo con doble click
- **localStorage**: el chat guarda historial de conversación; los testimonios nuevos también se guardan localmente
- **Partículas**: el canvas se adapta al tamaño de pantalla y tiene efecto de repulsión con el mouse
- **Sin dependencias externas**: cero npm, cero webpack, cero React — solo HTML/CSS/JS puro
