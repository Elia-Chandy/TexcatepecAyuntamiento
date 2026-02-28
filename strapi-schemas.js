// ========================================================
// ESQUEMAS STRAPI - AYUNTAMIENTO DE TEXCATEPEC
// Copiar cada bloque en su respectivo Content Type en Strapi
// ========================================================

// 1. NOTICIAS
{
  "kind": "collectionType",
  "collectionName": "noticias",
  "info": { "singularName": "noticia", "pluralName": "noticias", "displayName": "Noticias" },
  "options": { "draftAndPublish": true },
  "attributes": {
    "titulo": { "type": "string", "required": true },
    "extracto": { "type": "text", "required": true },
    "contenido": { "type": "richtext" },
    "fecha_publicacion": { "type": "date", "required": true },
    "categoria": {
      "type": "enumeration",
      "enum": ["Gobierno","Obras","Salud","Educacion","Desarrollo Social","Cultura","Servicios","General"],
      "default": "General"
    },
    "imagen_destacada": { "type": "media", "multiple": false, "allowedTypes": ["images"] },
    "slug": { "type": "uid", "targetField": "titulo" }
  }
}

// 2. DOCUMENTOS RAPIDOS (Inicio)
{
  "kind": "collectionType",
  "collectionName": "documentos_rapidos",
  "info": { "singularName": "documento-rapido", "pluralName": "documentos-rapidos", "displayName": "Documentos Rápidos" },
  "options": { "draftAndPublish": false },
  "attributes": {
    "titulo": { "type": "string", "required": true },
    "fecha": { "type": "date" },
    "archivo": { "type": "media", "multiple": false, "allowedTypes": ["files"] },
    "orden": { "type": "integer", "default": 0 }
  }
}

// 3. PLAN MUNICIPAL DE DESARROLLO
{
  "kind": "singleType",
  "collectionName": "plan_municipal",
  "info": { "singularName": "plan-municipal", "pluralName": "planes-municipales", "displayName": "Plan Municipal de Desarrollo" },
  "options": { "draftAndPublish": false },
  "attributes": {
    "descripcion_general": { "type": "richtext", "required": true },
    "objetivos_estrategicos": { "type": "json" },
    "documento_pdf": { "type": "media", "multiple": false, "allowedTypes": ["files"] },
    "fecha_publicacion": { "type": "date" }
  }
}

// 4. ARCHIVO MUNICIPAL
{
  "kind": "collectionType",
  "collectionName": "archivos_municipales",
  "info": { "singularName": "archivo-municipal", "pluralName": "archivos-municipales", "displayName": "Archivo Municipal" },
  "options": { "draftAndPublish": false },
  "attributes": {
    "titulo": { "type": "string", "required": true },
    "fecha": { "type": "date" },
    "descripcion": { "type": "text" },
    "documento": { "type": "media", "multiple": true, "allowedTypes": ["files"] }
  }
}

// 5. PORTAL DE TRANSPARENCIA
{
  "kind": "singleType",
  "collectionName": "portal_transparencia",
  "info": { "singularName": "portal-transparencia", "pluralName": "portales-transparencia", "displayName": "Portal de Transparencia" },
  "options": { "draftAndPublish": false },
  "attributes": {
    "informacion_general": { "type": "richtext" },
    "documentos_oficiales": {
      "type": "component",
      "repeatable": true,
      "component": "shared.documento-oficial"
    },
    "enlaces_relevantes": {
      "type": "component",
      "repeatable": true,
      "component": "shared.enlace"
    }
  }
}

// 6. OBLIGACIONES COMUNES
{
  "kind": "collectionType",
  "collectionName": "obligaciones_comunes",
  "info": { "singularName": "obligacion-comun", "pluralName": "obligaciones-comunes", "displayName": "Obligaciones Comunes" },
  "options": { "draftAndPublish": false },
  "attributes": {
    "nombre_ley": { "type": "string", "required": true },
    "descripcion": { "type": "richtext" },
    "responsable": { "type": "string", "required": true },
    "fecha_actualizacion": { "type": "date" },
    "documento_oficial": { "type": "media", "multiple": false, "allowedTypes": ["files"] },
    "orden": { "type": "integer", "default": 0 }
  }
}

// 7. FOOTER (Single Type)
{
  "kind": "singleType",
  "collectionName": "footer",
  "info": { "singularName": "footer", "pluralName": "footers", "displayName": "Footer" },
  "options": { "draftAndPublish": false },
  "attributes": {
    "datos_institucionales": { "type": "richtext" },
    "facebook": { "type": "string" },
    "twitter": { "type": "string" },
    "youtube": { "type": "string" },
    "instagram": { "type": "string" },
    "aviso_privacidad": { "type": "richtext" },
    "derechos_reservados": { "type": "string" }
  }
}

// ====== COMPONENT: shared.documento-oficial ======
{
  "collectionName": "components_shared_documento_oficials",
  "info": { "displayName": "Documento Oficial" },
  "attributes": {
    "titulo": { "type": "string" },
    "tipo": { "type": "string" },
    "fecha": { "type": "date" },
    "archivo": { "type": "media", "multiple": false, "allowedTypes": ["files"] }
  }
}

// ====== COMPONENT: shared.enlace ======
{
  "collectionName": "components_shared_enlaces",
  "info": { "displayName": "Enlace" },
  "attributes": {
    "texto": { "type": "string" },
    "url": { "type": "string" },
    "icono": { "type": "string" }
  }
}
