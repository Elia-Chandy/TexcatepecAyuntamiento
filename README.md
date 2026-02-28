# 🏛️ Ayuntamiento de Texcatepec — Portal Municipal

Sitio web oficial del Ayuntamiento de Texcatepec, Veracruz, con CMS Strapi.

## 📁 Estructura del Proyecto

```
texcatepec/
├── frontend/
│   ├── index.html          ← Sitio web completo (funcional sin Strapi)
│   └── api.js              ← Integración con Strapi CMS
└── strapi-config/
    ├── all-schemas.js      ← Esquemas de todos los Content Types
    └── schemas/
        └── noticia.json
```

---

## 🚀 Instalación Rápida

### Paso 1 — Frontend (inmediato)
```bash
# Abre directamente en el navegador — no requiere servidor
open frontend/index.html
```

### Paso 2 — Instalar Strapi CMS
```bash
# Crear proyecto Strapi
npx create-strapi-app@latest texcatepec-cms --quickstart
cd texcatepec-cms

# Iniciar Strapi
npm run develop
# → Admin disponible en http://localhost:1337/admin
```

### Paso 3 — Crear Content Types en Strapi

En el panel de Strapi (Content-Type Builder), crea los siguientes tipos:

| Tipo | Nombre | Kind |
|------|--------|------|
| Noticias | `noticia` | Collection Type |
| Documentos Rápidos | `documento-rapido` | Collection Type |
| Archivo Municipal | `archivo-municipal` | Collection Type |
| Obligaciones Comunes | `obligacion-comun` | Collection Type |
| Plan Municipal | `plan-municipal` | Single Type |
| Portal Transparencia | `portal-transparencia` | Single Type |
| Footer | `footer` | Single Type |

> Consulta los atributos de cada tipo en `/strapi-config/all-schemas.js`

### Paso 4 — Configurar Permisos en Strapi
```
Settings → Users & Permissions → Roles → Public
→ Habilitar: find, findOne para todos los Content Types
```

### Paso 5 — Generar API Token
```
Settings → API Tokens → Create new token
→ Tipo: Read-only
→ Copiar el token
```

### Paso 6 — Conectar Frontend con Strapi
En `frontend/api.js`, edita:
```javascript
const STRAPI_URL = 'http://localhost:1337'; // O tu URL de producción
const STRAPI_TOKEN = 'TU_TOKEN_AQUI';
```

Luego agrega en `index.html` antes del cierre `</body>`:
```html
<script src="api.js" type="module"></script>
```

---

## 🎨 Paleta de Colores

| Color | Variable CSS | Hex |
|-------|-------------|-----|
| Vino principal | `--vino` | `#6B1020` |
| Vino oscuro | `--vino-dark` | `#4A0B16` |
| Azul oscuro | `--azul-dark` | `#0D2B4E` |
| Azul medio | `--azul` | `#1A3D6B` |
| Dorado | `--gold` | `#C9A227` |

---

## 📋 Secciones del Sitio

| Sección | Descripción |
|---------|-------------|
| **Inicio** | Hero, bienvenida, noticias recientes, documentos rápidos |
| **Ayuntamiento** | Plan Municipal de Desarrollo + Archivo Municipal |
| **Transparencia** | Portal de Transparencia + Obligaciones Comunes |
| **Prensa** | Grid de noticias con modal de detalle |
| **Contacto** | Datos, formulario de contacto, botón WhatsApp |

---

## 🌤️ Widget del Clima

El widget usa OpenWeatherMap API (gratuita).
1. Regístrate en https://openweathermap.org/api
2. Copia tu API Key
3. Pégala en `api.js` → `const API_KEY = 'TU_KEY'`

---

## 📦 APIs de Strapi disponibles

```
GET /api/noticias?populate=*&sort=fecha_publicacion:desc
GET /api/documentos-rapidos?sort=orden:asc
GET /api/plan-municipal?populate=*
GET /api/archivos-municipales?populate=*
GET /api/portal-transparencia?populate=*
GET /api/obligaciones-comunes?sort=orden:asc
GET /api/footer
```

---

## 🔌 Formulario de Contacto

Para activar el envío de correos, configura una de estas opciones en Strapi:

**Opción A — Plugin oficial:**
```bash
npm install @strapi/provider-email-nodemailer
```

**Opción B — EmailJS (más simple):**
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```
Configura en https://emailjs.com con tu cuenta gratuita.

---

## 🌐 Despliegue en Producción

| Componente | Servicio recomendado |
|-----------|---------------------|
| Frontend | Netlify, Vercel, o servidor Apache/Nginx |
| Strapi CMS | Railway, Render, o VPS propio |
| Base de datos | PostgreSQL (Railway o Supabase) |
| Archivos/Media | Cloudinary (plugin Strapi gratuito) |

### Configurar Cloudinary en Strapi:
```bash
npm install @strapi/provider-upload-cloudinary
```

---

## ✅ Funcionalidades Implementadas

- [x] Navegación por secciones (SPA)
- [x] Banner hero animado
- [x] Mensaje de bienvenida
- [x] Grid de noticias con modal de detalle
- [x] Accesos rápidos a documentos
- [x] Plan Municipal con objetivos estratégicos
- [x] Archivo Municipal con tabla y detalle
- [x] Portal de Transparencia con documentos
- [x] Obligaciones Comunes (Art. 70)
- [x] Sección de Prensa completa
- [x] Formulario de contacto funcional
- [x] Botón de WhatsApp
- [x] Widget del clima
- [x] Footer completo con redes sociales
- [x] Diseño responsive (mobile-friendly)
- [x] Colores vino y azul oscuro institucionales
- [x] Esquemas Strapi para todos los contenidos
- [x] API de integración completa

---

*Desarrollado para el Ayuntamiento de Texcatepec, Veracruz — 2024*
