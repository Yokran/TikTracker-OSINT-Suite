# 🕵️‍♂️ TikTracker OSINT Suite – by Yokran

**Versión**: 1.0  
**Descripción**: Suite de herramientas OSINT para TikTok desde el navegador. Permite la extracción de información operativa clave de perfiles, publicaciones, biografías y hashtags. Diseñado para analistas y operadores de inteligencia. ¡BE BROWSER style 😎!

---

## ⚙️ Funcionalidades

### 1. 🌍 Detección de región del perfil objetivo
- Al acceder a cualquier página de perfil (https://www.tiktok.com/@usuario), el script detecta automáticamente la región geográfica del usuario objetivo.
- Esta información se muestra en una ventana emergente (alert) al cargar la página.

### 2. 🧑‍💼 Información de perfil
- Extrae nombre, userID, nickname, seguidores, seguidos, me gustas, bio, enlaces, región y lenguaje del usuario objetivo.
- Útil para obtener una visión rápida del objetivo desde su página de perfil.

### 3. 🧠 Análisis de biografía
- Escanea la biografía del perfil en busca de correos, teléfonos, redes, y patrones sospechosos.
- Permite localizar huellas de contacto o enlaces cruzados.

### 4. 👥 Scraping Masivo (`/followers` o `/following`)
- Extrae datos clave de la conectividad del usuario objetivo (Información de perfil de seguidores y seguidos).
- Guarda resultados en un archivo `.xlsx`.

### 5. 📄 Extracción de publicaciones
- Desde cualquier publicación (video o foto), genera un informe con:
  - ID del post y URL
  - Usuario creador
  - Descripción
  - Música asociada
  - Estadísticas: Me gusta, Comentarios, Compartidos
  - Fecha formateada
  - Región del autor
  - Comentarios destacados

> ❗**Nota**: Por razones de seguridad operacional, la descarga del contenido multimedia no se incluye en el script. Se recomienda usar la extensión [Descargador de Videos de TikTok](https://chromewebstore.google.com/detail/descargador-de-videos-de/kpmfbehibdfhajhelkcpfbdlibigpndb) para este propósito.

---

## 🧩 Instalación

1. Instala [Tampermonkey](https://www.tampermonkey.net/) en tu navegador.
2. Carga el script `TikTracker OSINT Suite.js` desde este repositorio.
3. Accede a TikTok y usa las funciones según el contexto: perfil, publicación o hashtag.

---

## 📦 Requisitos técnicos

* Navegador compatible con Tampermonkey.
* Acceso a TikTok con sesión iniciada (para scraping masivo).
* Permite `fetch()` dentro del dominio `tiktok.com`.

---

## ✨ Estilo BE BROWSER

* Interacción directa con el DOM, sin automatismos invisibles.
* Activación manual, visible y controlada desde botones UI.
* Extracción robusta mediante `fetch()` y expresiones regulares.
* Cero dependencias externas (excepto XLSX para exportación).

---

## 📤 Salidas generadas

* `.txt` con información individual de perfil o publicación.
* `.xlsx` estructurado para scraping masivo de seguidores/seguidos.

---

## 📌 Uso recomendado

| Contexto | Acción disponible | Resultado |
|----------|-------------------|-----------|
| Región visible | Análisis automático | Detecta la región del usuario y la muestra mediante alert() |
| Perfil de usuario | Botón `📋 Extraer perfil` (visible junto al nick) | Exporta todos los datos clave del usuario |
| Perfil de usuario | Botón `📋 Iniciar scraping` (aparece al acceder a los lestidas de seguidos y seguidores) | Exporta todos los datos clave del usuario |
| Publicación (video/foto) | Botón `🦅 Extraer publicación` (visible junto al nick del usuario bajo la reproducción de la publicación) | Exporta metadatos y comentarios |
| Biografía visible | Análisis automático | Detecta y resalta info sensible |

---

## 🛡️ Consideraciones

- El script no requiere credenciales ni APIs externas.
- Todos los datos son extraídos desde el DOM o el HTML embebido.
- Compatible con renderizado dinámico gracias a detección inteligente y `waitForElement`.

---

## 🧠 Autor

**Yokran**  
Especialista en scripts OSINT y análisis web desde el navegador.  
Proyecto derivado del entorno de operaciones para OSINT & Virtual HUMINT BE BROWSER.

---
