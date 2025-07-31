# 🕵️‍♂️ TikTracker OSINT Suite – by Yokran

**Descripción**: Suite de herramientas OSINT para TikTok desde el navegador. Permite la extracción de información operativa clave de perfiles, publicaciones, biografías y conexiones sociales. Diseñado para analistas e investigadores. ¡BE BROWSER style 😎!

---

## 📦 Versiones disponibles

Este repositorio contiene **dos versiones funcionales** del script, según el navegador y necesidades:

| Versión | Archivo | Compatibilidad | Características |
|--------|---------|----------------|-----------------|
| `v1.0` | `TikTracker OSINT Suite-1.0.user.js` | ✅ Chrome, Firefox, Brave con **Tampermonkey** | General, ligera y multiplataforma |
| `v2.0` | `TikTracker OSINT Suite-2.0.js` | ⚠️ Solo **Firefox** con **Violentmonkey** | UA móvil, región real, mejoras DOM |

> ✅ **Recomendado**: Usa la versión 2.0 en Firefox si necesitas máxima precisión (región real y scraping robusto).

---

## ⚙️ Funcionalidades principales

### 🧑‍💼 Análisis de perfiles
- Extrae: nombre, nickname, bio, followers, me gustas, avatar, enlaces, verificación, idioma, región, timestamps internos.
- Genera archivo `.txt` descargable con toda la información estructurada.

### 🌍 Detección de región

| Versión | Método | Detalle |
|--------|--------|---------|
| `v1.0` | DOM visible | Puede ser inexacta o ausente en algunos casos |
| `v2.0` | Simulación móvil vía `User-Agent` | Región real desde HTML interno como lo vería la app oficial |

### 📄 Extracción de publicaciones
- ID, descripción, música, estadísticas, fecha formateada.
- **v2.0**: Extrae `locationCreated` (ubicación real de la publicación).
- Incluye comentarios destacados desde API pública.
- Salida: archivo `.txt`.

### 👥 Scraping masivo
- Desde `/followers` o `/following`.
- Extrae metadatos de cada perfil listado.
- Exportación en `.xlsx` con columnas normalizadas.
- **v2.0** mejora detección y compatibilidad DOM dinámico.

### 🧠 Análisis de biografías
- Escaneo de bio para identificar posibles correos, teléfonos, enlaces incrustados.
- Automático al generar el reporte de perfil.

---

## 🧩 Instalación

### Para `v1.0`
1. Instala [Tampermonkey](https://www.tampermonkey.net/) en tu navegador (Chrome, Brave, Firefox...).
2. Carga el archivo `TikTracker.user.js`.
3. Accede a TikTok y usa los botones visibles.

### Para `v2.0`
1. Usa **Firefox** obligatoriamente.
2. Instala [Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/).
3. Carga el script `TikTracker_Firefox.user.js`.
4. Accede a TikTok con sesión iniciada.

> ⚠️ Tampermonkey en Firefox **no permite cambiar el User-Agent**, por eso `v2.0` **requiere Violentmonkey** para funcionar correctamente.

---

## 📤 Formatos de salida

| Formato | Contenido |
|--------|-----------|
| `.txt` | Reporte individual de perfil o publicación |
| `.xlsx` | Scraping masivo de seguidores o seguidos |

---

## 📌 Contextos de uso

| Situación | Acción | Resultado |
|----------|--------|-----------|
| Perfil abierto | Autoalerta (v2.0) | Región real mostrada al cargar |
| Perfil abierto | Botón `🦅 Generar reporte OSINT` | Exporta info completa del usuario |
| Publicación abierta | Botón `🦅 Extraer publicación` | Exporta metadatos, ubicación, comentarios |
| Listado de seguidores/seguidos | Botón `🦅 Iniciar scraping` | Genera Excel masivo con todos los perfiles listados |

---

## 🛡️ Consideraciones técnicas

- No usa APIs privadas ni credenciales externas.
- Solo accede a HTML embebido y datos públicos.
- Soporta DOM dinámico mediante `MutationObserver` y detección inteligente.
- UA móvil integrado en `v2.0` para simular entorno oficial de TikTok app.

---

## ✨ Estilo BE BROWSER

- Interacción visible y directa desde la UI (nada oculto).
- Bajo consumo, cero loops innecesarios.
- Fácil de auditar, modificar o expandir por analistas OSINT.
- Comentarios en código para aprendizaje y trazabilidad.

---

## 🧠 Autor

**Yokran**  
Analista y desarrollador de herramientas OSINT y SOCMINT  
🔗 [github.com/Yokran](https://github.com/Yokran)

---


Especialista en scripts OSINT y análisis web desde el navegador.  
Proyecto derivado del entorno de operaciones para OSINT & Virtual HUMINT BE BROWSER.

---
