// ==UserScript==
// @name         TikTracker OSINT Suite Mark 2 (UA Móvil Region Fix)
// @namespace    Yokran
// @version      2.0
// @description  Suite OSINT todo-en-uno para TikTok con soporte actualizado de región vía User-Agent móvil. BE BROWSER style 😎
// @author       Yokran
// @match        https://www.tiktok.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// ==/UserScript==

(function () {
    'use strict';

    // === Constantes globales ===
    const MOBILE_USER_AGENT = "Mozilla/5.0 (iPad; CPU OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_40.6.0 BytedanceWebview/d8a21c6";

    // === Obtiene la región usando un User-Agent móvil (bypass regional) ===
    async function obtenerRegionMovil(username) {
        try {
            const res = await fetch(`https://www.tiktok.com/@${username}`, {
                headers: { "User-Agent": MOBILE_USER_AGENT },
                credentials: 'omit'
            });
            const html = await res.text();
            const base = html.indexOf(`"uniqueId":"${username}"`);
            const bloque = html.slice(base, base + 6000);
            return (bloque.match(/"region":"(.*?)"/) || [])[1] || '';
        } catch (e) {
            console.warn("[UA Móvil] Error obteniendo región:", e);
            return '';
        }
    }

    // === Alerta de región al cargar un perfil ===
    window.addEventListener('load', async () => {
    const ruta = window.location.pathname;
    const esPerfilDirecto = /^\/@[^/]+\/?$/.test(ruta); // solo /@usuario o /@usuario/

    if (esPerfilDirecto) {
        const username = ruta.split('/')[1]?.replace('@', '').split('?')[0];
        const region = await obtenerRegionMovil(username);
        if (region) alert("🌍 Región detectada: " + region);
    }
});

    // === Utilidad: Espera hasta que un elemento exista en el DOM ===
    function waitForElement(selector, callback, retries = 20) {
        const el = document.querySelector(selector);
        if (el) return callback(el);
        if (retries === 0) return;
        setTimeout(() => waitForElement(selector, callback, retries - 1), 500);
    }

    // === Inserta botón para generar reporte OSINT en perfiles ===
    function crearBotonPerfil(username) {
        if (document.querySelector('#osintBtn')) return;
        const btn = document.createElement('button');
        btn.innerText = '🦅 Generar reporte OSINT';
        btn.id = 'osintBtn';
        btn.style.cssText = 'margin-left: 10px; padding: 4px 10px; background: #000; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 12px;';
        btn.onclick = () => generarReporte(username);
        const insertPoint = document.querySelector('[data-e2e="user-title"]');
        if (insertPoint && insertPoint.parentNode) insertPoint.parentNode.appendChild(btn);
    }

    // === Genera reporte OSINT ===
    async function generarReporte(username) {
        const data = [`👤 Nombre de usuario: @${username}`];
        const res = await fetch(`https://www.tiktok.com/@${username}`, { credentials: 'include' });
        const html = await res.text();
        const bloque = html.slice(Math.max(0, html.indexOf(`\"uniqueId\":\"${username}\"`) - 4000));
        const get = (regex) => (bloque.match(regex) || [])[1] || '';

        const nameElement = document.querySelector('[data-e2e="user-title"]');
        if (nameElement) data.push("📛 Nombre real: " + nameElement.innerText.trim());
        const bioElement = document.querySelector('[data-e2e="user-bio"]');
        if (bioElement) data.push("📝 Bio: " + bioElement.innerText.trim());
        const linkElement = document.querySelector('a[data-e2e="user-link"]');
        if (linkElement) data.push("🔗 Enlace externo: " + linkElement.href);
        const avatarElement = document.querySelector('[data-e2e="user-avatar"]');
        if (avatarElement?.src) data.push("🖼️ Imagen de perfil: " + avatarElement.src);

        const stats = document.querySelectorAll('[data-e2e^="followers-count"], [data-e2e^="following-count"], [data-e2e^="likes-count"]');
        stats.forEach(stat => {
            const label = stat.getAttribute('data-e2e');
            const value = stat.innerText.trim();
            if (label.includes("followers")) data.push("👥 Seguidores: " + value);
            if (label.includes("following")) data.push("➡️ Siguiendo: " + value);
            if (label.includes("likes")) data.push("❤️ Me gusta: " + value);
        });

        const emailMatches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
        if (emailMatches) data.push("📧 Correos: " + [...new Set(emailMatches)].join(', '));

        const region = await obtenerRegionMovil(username);
        if (region) data.push("📍 Región del perfil: " + region);
        const language = get(/"language":"(.*?)"/);
        if (language) data.push("🗣️ Idioma del perfil: " + language);
        const verified = get(/"verified":(true|false)/);
        if (verified) data.push("✔️ Verificado: " + verified);
        const uid = get(/"id":"(\d{6,})"/);
        if (uid) data.push("🆔 ID interno TikTok: " + uid);
        const createdTime = get(/"createTime":(\d{10})/);
        if (createdTime) data.push("📅 Fecha de creación: " + new Date(+createdTime * 1000).toLocaleDateString());
        const nickModify = get(/"nickNameModifyTime":(\d{10})/);
        if (nickModify) data.push("🔄 Cambio de nick: " + new Date(+nickModify * 1000).toLocaleDateString());

    // === Crea un fichero de salida .txt con los resultados ===
    const blob = new Blob([data.join('\n')], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${username}_tiktok_profile.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

    // === Inserta botón para generar informe desde una publicación ===
    function crearBotonPost() {
    
    const esPublicacion = /\/@[^/]+\/(video|photo)\/\d+/.test(window.location.pathname);
    if (!esPublicacion) return;
    
    if (document.getElementById('post-osint-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'post-osint-btn';
    btn.innerText = '🦅 Extraer publicación';
    btn.style.cssText = `
        margin-left: 10px;
        padding: 4px 10px;
        background: #000;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
    `;

    // Busca todos los <a> que apuntan a /@usuario
    const userLinks = [...document.querySelectorAll('a[href^="/@"]')];

    // Filtra el que contenga el nombre visible (con al menos un span dentro)
    const nameAnchor = userLinks.find(a => a.querySelector('span'));

    const target = nameAnchor?.parentElement;

    if (target) {
        target.appendChild(btn);
    } else {
        console.warn("🛑 No se encontró dónde insertar el botón de publicación.");
    }

    btn.onclick = () => extraerPublicacion();
}

// === Recopila toda la información de la publicación ===
async function extraerPublicacion() {
    const data = [];
    const url = window.location.href;
    const username = url.split('/@')[1]?.split('/')[0];
    const videoId = url.match(/\/(video|photo)\/(\d+)/)?.[2];
    data.push(`📹 Publicación ID: ${videoId}`);
    data.push(`👤 Usuario: @${username}`);
    data.push(`🔗 URL: ${url}`);

    const desc = document.querySelector('[data-e2e="browse-video-desc"]')?.innerText?.trim();
    if (desc) data.push(`📝 Descripción: ${desc}`);
    const music = document.querySelector('[data-e2e="browse-music-info"]')?.innerText?.trim();
    if (music) data.push(`🎵 Música: ${music}`);

    const stats = document.querySelectorAll('[data-e2e="like-count"], [data-e2e="comment-count"], [data-e2e="share-count"]');
    stats.forEach(stat => {
        const label = stat.getAttribute('data-e2e');
        const value = stat.innerText.trim();
        if (label.includes('like')) data.push(`❤️ Me gusta: ${value}`);
        if (label.includes('comment')) data.push(`💬 Comentarios: ${value}`);
        if (label.includes('share')) data.push(`🔁 Compartidos: ${value}`);
    });

    const fechaVisible = document.querySelector('[data-e2e="browser-nickname"] span:last-child')?.innerText?.trim();
    if (fechaVisible) {
        const partes = fechaVisible.split('-');
        let fechaFormateada = fechaVisible;
        if (partes.length === 2) {
            const mes = partes[0].padStart(2, '0');
            const dia = partes[1].padStart(2, '0');
            const anio = new Date().getFullYear();
            fechaFormateada = `${dia}-${mes}-${anio}`;
        } else if (partes.length === 3) {
            const anio = partes[0];
            const mes = partes[1].padStart(2, '0');
            const dia = partes[2].padStart(2, '0');
            fechaFormateada = `${dia}-${mes}-${anio}`;
        }
        data.push(`📆 Fecha de publicación: ${fechaFormateada}`);
    }

    const res = await fetch(url, { credentials: 'include' });
    const html = await res.text();
    const bloque = html.slice(Math.max(0, html.indexOf(videoId) - 4000));
    const get = (regex) => (bloque.match(regex) || [])[1] || '';
    const ubicacion = get(/locationCreated":"([^"]*)"/);
    if (ubicacion) data.push(`📍 Ubicación de la publicación: ${ubicacion}`);

    const comentarios = await fetch(`https://www.tiktok.com/api/comment/list/?aid=1988&count=20&cursor=0&aweme_id=${videoId}`, {
        headers: { 'accept': 'application/json' },
        credentials: 'include'
    }).then(r => r.json()).catch(() => null);
    if (comentarios?.comments?.length) {
        data.push('\n🗣️ Comentarios destacados:');
        comentarios.comments.forEach(c => {
            const user = c.user?.nickname || c.user?.uniqueId || 'usuario_desconocido';
            const txt = c.text || '';
            data.push(`- @${user}: ${txt}`);
        });
    } else {
        data.push('\n🗣️ No se pudieron recuperar comentarios.');
    }

    // === Crea un fichero de salida .txt con los resultados ===
    const blob = new Blob([data.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${videoId}_post.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

    // === Activadores por contenido ===
    window.addEventListener('load', () => {
        const username = window.location.pathname.split('/')[1]?.replace('@', '').split('?')[0];
        if (window.location.pathname.startsWith('/@')) {
            waitForElement('[data-e2e="user-title"]', () => crearBotonPerfil(username));
            waitForElement('a[href^="/@"] span', crearBotonPost);
        }
    });

    const observer = new MutationObserver(() => {
        const visible = document.querySelector('#tux-portal-container .css-wq5jjc-DivUserListContainer');
        if (visible) crearBotonScraping();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // === Scraper masivo con XLSX ===
    let scraping = false, stopRequested = false, btn;
    function crearBotonScraping() {
        if (document.getElementById('falcon-scraper-btn')) return;
        btn = document.createElement('button');
        btn.id = 'falcon-scraper-btn';
        btn.innerText = '🦅 Iniciar scraping';
        Object.assign(btn.style, {
            position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
            backgroundColor: '#ff0050', color: '#fff', padding: '10px 16px',
            border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'pointer',
        });
        btn.onclick = async () => {
            if (scraping) { stopRequested = true; btn.innerText = '🛑 Deteniendo...'; return; }
            scraping = true;
            btn.innerText = '⏳ Procesando...';
            await scrollHastaElFinal();

            const contenedor = document.querySelector('#tux-portal-container .css-wq5jjc-DivUserListContainer');
            const items = contenedor?.querySelectorAll('a[href^="/@"]') || [];
            const usuarios = [...new Set(Array.from(items).map(a => a.href.split('/@')[1]?.split('?')[0]).filter(Boolean))];
            const resultados = [['ID', 'Nickname', 'Username', 'Perfil URL', 'Region', 'Language', 'Create Time', 'Nick Modify Time']];

            for (const user of usuarios) {
                if (stopRequested) break;
                const datos = await extraerDatosUsuario(user);
                if (datos) resultados.push(datos);
                btn.innerText = `🟡 ${resultados.length - 1}/${usuarios.length}`;
                await new Promise(r => setTimeout(r, 2000));
            }

            descargarXLSX(resultados);
            btn.innerText = '✅ Completado';
            scraping = stopRequested = false;
        };
        document.body.appendChild(btn);
    }

    // === Ejecuta un infinito para recopilar listado de seguidos/seguidores ===
    async function scrollHastaElFinal() {
        const contenedor = document.querySelector('#tux-portal-container .css-wq5jjc-DivUserListContainer');
        let previousCount = 0, attempts = 0;
        while (attempts < 10) {
            contenedor.scrollBy(0, 1000);
            await new Promise(r => setTimeout(r, 1500));
            const actualCount = contenedor.querySelectorAll('a[href^="/@"]').length;
            if (actualCount === previousCount) attempts++; else { attempts = 0; previousCount = actualCount; }
        }
    }

    // === Extrae los datos de todos los usuarios scrapeados ===
    async function extraerDatosUsuario(user) {
        try {
            const res = await fetch(`https://www.tiktok.com/@${user}`, { credentials: 'include' });
            const html = await res.text();
            const bloque = html.slice(Math.max(0, html.indexOf(`"uniqueId":"${user}"`) - 4000));
            const get = (regex) => (bloque.match(regex) || [])[1] || '';
            const region = await obtenerRegionMovil(user);
            const id = (html.match(/"id":"(\d{6,})"/) || [])[1] || '';
            if (!id || !user) return null;
            return [id, get(/"nickname":"(.*?)"/), user, `https://www.tiktok.com/@${user}`, region, get(/"language":"(.*?)"/), parseFecha(get(/"createTime":(\d+)/)), parseFecha(get(/"nickNameModifyTime":(\d+)/))];
        } catch { return null; }
    }

    function parseFecha(ts) {
        if (!ts) return '';
        const d = new Date(+ts * 1000);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
    }

    // === Crea un fichero de salida .txt con los resultados ===
    function descargarXLSX(data) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        ws['!cols'] = Array(data[0].length).fill({ wch: 20 });
        XLSX.utils.book_append_sheet(wb, ws, "TikTokData");
        XLSX.writeFile(wb, `tiktok_scrape_${Date.now()}.xlsx`);
    }

})();