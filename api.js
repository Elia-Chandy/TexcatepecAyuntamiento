/**
 * api.js — Integración Frontend ↔ Strapi v5 CMS
 * Ayuntamiento de Texcatepec
 */

const STRAPI_URL = 'http://localhost:1337'; // Cambiar en producción por tu URL de Render
const STRAPI_TOKEN = 'd4d0749c0c0ed0e9c866d79cceb12a4aac33ff300c6f56223da387d1f2ca7fd04c419234c7fd07045b142b376ad4328719bb9014311cc5495ee9562ae9c3a9419c140f9f5f11707889255e368491359c20925efd8a62ed7258306a23c33c5950dcba5f8aaf546fd1f8e9bac645d3b8b0ac5d490a18b278882e4559244e202514';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${STRAPI_TOKEN}`
};

async function strapiGet(endpoint, params = '') {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}${params}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[Strapi] Error en ${endpoint}:`, err);
    return null;
  }
}

async function fetchNoticias(limit = 10) {
  const data = await strapiGet('noticias', `?pagination[pageSize]=${limit}&sort=fecha_publicacion:desc&populate[imagen_destacada][fields][0]=url`);
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
    id: item.id,
    titulo: item.titulo,
    fecha: formatDate(item.fecha),
    descripcion: item.descripcion,
    documentos: (item.documento || []).map(d => ({ nombre: d.name, url: `${STRAPI_URL}${d.url}` }))
  }));
}

async function fetchObligaciones() {
  const data = await strapiGet('obligaciones-comunes', '&sort=orden:asc');
  if (!data) return [];
  return data.data.map(item => ({
    id: item.id,
    nombre: item.nombre_ley,
    responsable: item.responsable,
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

  try {
    const noticias = await fetchNoticias(6);
    if (noticias.length) {
      const grid = document.getElementById('homeNewsGrid');
      const prensa = document.getElementById('prensaGrid');
      const html = noticias.map(n => `
        <div class="news-card" onclick="openNewsModal(${n.id})">
          <div class="news-card-image" style="position:relative;overflow:hidden;">
            ${n.imagen
              ? `<img src="${n.imagen}" style="width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;">`
              : `<span style="font-size:60px;">📰</span>`
            }
            <span class="news-card-cat">${n.categoria || 'General'}</span>
          </div>
          <div class="news-card-body">
            <div class="news-card-date">📅 ${n.fecha}</div>
            <h3>${n.titulo}</h3>
            <p>${n.extracto}</p>
          </div>
        </div>
      `).join('');
      if (grid) grid.innerHTML = html;
      if (prensa) prensa.innerHTML = html;
    }
  } catch(e) { console.error('Error noticias:', e); }

  console.log('[Texcatepec] Datos cargados.');
}

document.addEventListener('DOMContentLoaded', initWithStrapi);