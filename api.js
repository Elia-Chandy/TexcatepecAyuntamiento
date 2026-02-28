/**
 * api.js — Integración Frontend ↔ Strapi v5 CMS
 * Ayuntamiento de Texcatepec
 * IMPORTANTE: Compatible con Strapi v5 (respuesta plana, sin .attributes)
 */

const STRAPI_URL = 'http://localhost:1337'; // Cambiar en producción por tu URL de Railway/Render
const STRAPI_TOKEN = 'TU_API_TOKEN_AQUI';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${STRAPI_TOKEN}`
};

async function strapiGet(endpoint, params = '') {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}?populate=*${params}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[Strapi] Error en ${endpoint}:`, err);
    return null;
  }
}

// NOTICIAS — Strapi v5: datos directamente en item (sin .attributes)
async function fetchNoticias(limit = 10) {
  const data = await strapiGet('noticias', `&pagination[pageSize]=${limit}&sort=fecha_publicacion:desc`);
  if (!data) return [];
  return data.data.map(item => ({
    id: item.id,
    titulo: item.titulo,
    extracto: item.extracto,
    contenido: item.contenido,
    fecha: formatDate(item.fecha_publicacion),
    categoria: item.categoria,
    imagen: item.imagen_destacada?.url ? `${STRAPI_URL}${item.imagen_destacada.url}` : null
  }));
}

async function fetchDocumentosRapidos() {
  const data = await strapiGet('documentos-rapidos', '&sort=orden:asc');
  if (!data) return [];
  return data.data.map(item => ({
    titulo: item.titulo,
    fecha: formatDate(item.fecha),
    url: item.archivo?.url ? `${STRAPI_URL}${item.archivo.url}` : '#'
  }));
}

async function fetchPlanMunicipal() {
  const data = await strapiGet('plan-municipal');
  if (!data?.data) return null;
  return {
    descripcion: data.data.descripcion_general,
    objetivos: data.data.objetivos_estrategicos || [],
    fecha: formatDate(data.data.fecha_publicacion),
    pdf: data.data.documento_pdf?.url ? `${STRAPI_URL}${data.data.documento_pdf.url}` : null
  };
}

async function fetchArchivoMunicipal() {
  const data = await strapiGet('archivos-municipales', '&sort=fecha:desc');
  if (!data) return [];
  return data.data.map(item => ({
    id: item.id, titulo: item.titulo,
    fecha: formatDate(item.fecha), descripcion: item.descripcion,
    documentos: (item.documento || []).map(d => ({ nombre: d.name, url: `${STRAPI_URL}${d.url}` }))
  }));
}

async function fetchObligaciones() {
  const data = await strapiGet('obligaciones-comunes', '&sort=orden:asc');
  if (!data) return [];
  return data.data.map(item => ({
    id: item.id, nombre: item.nombre_ley, responsable: item.responsable,
    fecha: formatDate(item.fecha_actualizacion),
    url: item.documento_oficial?.url ? `${STRAPI_URL}${item.documento_oficial.url}` : null
  }));
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function initWithStrapi() {
  console.log('[Texcatepec] Cargando datos de Strapi v5...');
  const noticias = await fetchNoticias(6);
  if (noticias.length) { window.CMS.noticias = noticias; renderHomeNews(); renderPrensaGrid(); }
  const docs = await fetchDocumentosRapidos();
  if (docs.length) { window.CMS.documentos = docs; renderQuickDocs(); }
  console.log('[Texcatepec] Datos cargados.');
}

document.addEventListener('DOMContentLoaded', initWithStrapi);
