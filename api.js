/**
 * api.js — Integración Frontend ↔ Strapi v5 CMS
 * Ayuntamiento de Texcatepec
 */

const STRAPI_URL = 'http://localhost:1337';
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
  const data = await strapiGet('documento-rapidos', '?populate[archivo][fields][0]=url');
  if (!data) return [];
  return data.data.map(item => ({
    titulo: item.titulo,
    fecha: formatDate(item.fecha),
    url: item.archivo?.url ? `${STRAPI_URL}${item.archivo.url}` : '#'
  }));
}

async function fetchPlanMunicipal() {
  const data = await strapiGet('plan-municipal', '?populate[documento_pdf][fields][0]=url');
  if (!data?.data) return null;
  return {
    titulo: data.data.titulo,
    descripcion: data.data.descripcion_general,
    objetivos: data.data.objetivos_estrategicos || [],
    fecha: formatDate(data.data.fecha),
    pdf: data.data.documento_pdf?.url ? `${STRAPI_URL}${data.data.documento_pdf.url}` : null
  };
}

async function fetchArchivoMunicipal() {
  const data = await strapiGet('archivo-municipals', '?sort=fecha:desc&populate[documento][fields][0]=url&populate[documento][fields][1]=name');
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
  const data = await strapiGet('obligaciones-comunes', '?sort=orden:asc&populate[documento_oficial][fields][0]=url');
  if (!data) return [];
  return data.data.map(item => ({
    id: item.id,
    nombre: item.nombre_ley,
    responsable: item.responsable,
    fecha: formatDate(item.fecha_actualizacion),
    url: item.documento_oficial?.url ? `${STRAPI_URL}${item.documento_oficial.url}` : null
  }));
}

async function fetchBienvenida() {
  const data = await strapiGet('bienvenida', '?populate[imagen][fields][0]=url');
  if (!data?.data) return null;
  return {
    titulo: data.data.titulo,
    descripcion1: data.data.descripcion_1,
    descripcion2: data.data.descripcion_2,
    imagen: data.data.imagen?.url ? `${STRAPI_URL}${data.data.imagen.url}` : null,
    textoBoton: data.data.texto_boton
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function initWithStrapi() {
  console.log('[Texcatepec] Cargando datos de Strapi v5...');

  // Noticias
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

  // Bienvenida
  try {
    const bienvenida = await fetchBienvenida();
    if (bienvenida) {
      const el = document.querySelector('.welcome h2');
      const p1 = document.querySelectorAll('.welcome p')[0];
      const p2 = document.querySelectorAll('.welcome p')[1];
      const btn = document.querySelector('.welcome .btn-vino');
      const img = document.querySelector('.welcome-image');
      if (el && bienvenida.titulo) el.textContent = bienvenida.titulo;
      if (p1 && bienvenida.descripcion1) p1.textContent = bienvenida.descripcion1;
      if (p2 && bienvenida.descripcion2) p2.textContent = bienvenida.descripcion2;
      if (btn && bienvenida.textoBoton) btn.textContent = bienvenida.textoBoton;
      if (img && bienvenida.imagen) img.innerHTML = `<img src="${bienvenida.imagen}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;
    }
  } catch(e) { console.error('Error bienvenida:', e); }

  // Plan Municipal
  try {
    const plan = await fetchPlanMunicipal();
    if (plan) {
      const titulo = document.querySelector('#ayunt-content-pmd .card-header h3');
      const desc = document.querySelector('#ayunt-content-pmd .card-body p');
      const fecha = document.querySelector('#ayunt-content-pmd .date-badge');
      const objetivos = document.querySelector('#ayunt-content-pmd .objectives-list');
      const pdfBtn = document.querySelector('#ayunt-content-pmd .btn-vino');
      const pdfNombre = document.getElementById('pmd-nombre-pdf');
      if (titulo && plan.titulo) titulo.textContent = plan.titulo;
      if (desc && plan.descripcion) desc.textContent = plan.descripcion;
      if (fecha && plan.fecha) fecha.textContent = plan.fecha;
      if (objetivos && plan.objetivos.length) {
        objetivos.innerHTML = plan.objetivos.map(o => `<li>${o}</li>`).join('');
      }
      if (pdfNombre && plan.titulo) pdfNombre.textContent = plan.titulo;
      if (pdfBtn && plan.pdf) pdfBtn.href = plan.pdf;
    }
  } catch(e) { console.error('Error plan municipal:', e); }

  // Archivo Municipal
  try {
    const archivo = await fetchArchivoMunicipal();
    if (archivo.length) {
      CMS.archivo = archivo;
      renderArchivoTable();
    }
  } catch(e) { console.error('Error archivo:', e); }

  // Documentos Rápidos
try {
  const docs = await fetchDocumentosRapidos();
  if (docs.length) {
    const grid = document.getElementById('quickDocsGrid');
    if (grid) {
      grid.innerHTML = docs.map(d => `
        <div class="doc-card">
          <div class="doc-icon">${d.emoji || '📄'}</div>
          <h4>${d.titulo}</h4>
          <div class="doc-date">📅 ${d.fecha}</div>
          <a href="${d.url}" target="_blank" class="btn btn-azul" style="font-size:12px;padding:6px 14px;margin-top:4px;">⬇️ Descargar</a>
        </div>
      `).join('');
    }
  }
} catch(e) { console.error('Error documentos rapidos:', e); }

  console.log('[Texcatepec] Datos cargados.');
}

document.addEventListener('DOMContentLoaded', initWithStrapi);