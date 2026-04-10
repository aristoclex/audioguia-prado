// ══════════════════════════════════════════════════════════════
//  Service Worker — Audioguía Museo del Prado
//  Estrategia: Cache-First (funciona sin conexión)
// ══════════════════════════════════════════════════════════════

const CACHE_NAME = 'audioguia-prado-v1';

// Todos los recursos que se guardarán en caché al instalar
const RECURSOS = [
  // ── Páginas principales ──────────────────────────────────────
  './index.html',
  './obra.html',

  // ── CSS y JS ─────────────────────────────────────────────────
  './css/style.css',
  './js/data.js',

  // ── Manifest e iconos ─────────────────────────────────────────
  './manifest.json',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg',

  // ── Imágenes ─────────────────────────────────────────────────
  './assets/images/sala_7a_david_goliat.webp',
  './assets/images/sala_8b_trinidad_greco.webp',
  './assets/images/sala_8b_caballero_mano_pecho.webp',
  './assets/images/sala_8b_coronacion_virgen_greco.webp',
  './assets/images/sala_9_sueno_jacob.webp',
  './assets/images/sala_9_isaac_jacob.webp',
  './assets/images/sala_9a_rendicion_breda.webp',
  './assets/images/sala_10_borrachos.webp',
  './assets/images/sala_10a_agnus_dei.webp',
  './assets/images/sala_11_fragua_vulcano.webp',
  './assets/images/sala_11_villa_medici_01.webp',
  './assets/images/sala_11_villa_medici_02.webp',
  './assets/images/sala_12_meninas.webp',
  './assets/images/sala_14_coronacion_virgen_velazquez.webp',
  './assets/images/sala_14_san_antonio_san_pablo.webp',
  './assets/images/sala_15_sebastian_morra.webp',
  './assets/images/sala_15a_hilanderas.webp',
  './assets/images/sala_16_inmaculada_venerables.webp',
  './assets/images/sala_25_lavatorio.webp',
  './assets/images/sala_26_hipomenes_atalanta.webp',
  './assets/images/sala_27_carlos_v_muhlberg.webp',
  './assets/images/sala_28_adoracion_magos.webp',
  './assets/images/sala_29_tres_gracias.webp',
  './assets/images/sala_32_familia_carlos_iv.webp',
  './assets/images/sala_38_maja_desnuda.webp',
  './assets/images/sala_38_maja_desnuda_vestida.webp',
  './assets/images/sala_42_bacanal_andrios.webp',
  './assets/images/sala_44_danae.webp',
  './assets/images/sala_49_cardenal.webp',
  './assets/images/sala_49_noli_me_tangere.webp',
  './assets/images/sala_51_ultima_cena.webp',
  './assets/images/sala_51a_santo_domingo_silos.webp',
  './assets/images/sala_51c_frescos_maderuelo_01.webp',
  './assets/images/sala_51c_frescos_maderuelo_02.webp',
  './assets/images/sala_51c_frescos_maderuelo_03.webp',
  './assets/images/sala_52b_gioconda_prado.webp',
  './assets/images/sala_55a_laguna_estigia.webp',
  './assets/images/sala_55a_triunfo_muerte.webp',
  './assets/images/sala_55b_adan_eva_durero.webp',
  './assets/images/sala_56a_carro_heno.webp',
  './assets/images/sala_56a_jardin_delicias_01.webp',
  './assets/images/sala_56a_jardin_delicias_02.webp',
  './assets/images/sala_56a_mesa_pecados.webp',
  './assets/images/sala_56a_piedra_locura.webp',
  './assets/images/sala_56b_anunciacion_fra_angelico.webp',
  './assets/images/sala_56b_transito_virgen.webp',
  './assets/images/sala_58_descendimiento.webp',
  './assets/images/sala_60a_chicos_playa.webp',
  './assets/images/sala_61a_satiro.webp',
  './assets/images/sala_61b_isabel_testamento.webp',
  './assets/images/sala_61b_muerte_lucrecia.webp',
  './assets/images/sala_62b_el_cid.webp',
  './assets/images/sala_64_65_fusilamientos.webp',
  './assets/images/sala_64_carga_mamelucos.webp',
  './assets/images/sala_64_coloso.webp',
  './assets/images/sala_64_muerte_viriato.webp',
  './assets/images/sala_67_aquelarre.webp',
  './assets/images/sala_67_duelo_garrotazos.webp',
  './assets/images/sala_67_perro_hundido.webp',
  './assets/images/sala_67_saturno.webp',
  './assets/images/sala_71_orestes_pilades.webp',
  './assets/images/sala_73_diadumeno.webp',
  './assets/images/sala_75_fusilamiento_torrijos.webp',
  './assets/images/sala_75_juana_loca.webp',
  './assets/images/sala_75_muerte_seneca.webp',
  './assets/images/sala_75_rendicion_bailen.webp',
  './assets/images/sala_76_judith_holofernes.webp',

  // ── Audios ───────────────────────────────────────────────────
  './assets/audio/sala_7a_david_goliat.mp3',
  './assets/audio/sala_8b_trinidad_greco.mp3',
  './assets/audio/sala_8b_caballero_mano_pecho.mp3',
  './assets/audio/sala_8b_coronacion_virgen_greco.mp3',
  './assets/audio/sala_9_sueno_jacob.mp3',
  './assets/audio/sala_9_isaac_jacob.mp3',
  './assets/audio/sala_9a_rendicion_breda.mp3',
  './assets/audio/sala_10_borrachos.mp3',
  './assets/audio/sala_10a_agnus_dei.mp3',
  './assets/audio/sala_11_fragua_vulcano.mp3',
  './assets/audio/sala_11_villa_medici.mp3',
  './assets/audio/sala_12_meninas.mp3',
  './assets/audio/sala_14_coronacion_virgen_velazquez.mp3',
  './assets/audio/sala_14_san_antonio_san_pablo.mp3',
  './assets/audio/sala_15_sebastian_morra.mp3',
  './assets/audio/sala_15a_hilanderas.mp3',
  './assets/audio/sala_16_inmaculada_venerables.mp3',
  './assets/audio/sala_25_lavatorio.mp3',
  './assets/audio/sala_26_hipomenes_atalanta.mp3',
  './assets/audio/sala_27_carlos_v_muhlberg.mp3',
  './assets/audio/sala_28_adoracion_magos.mp3',
  './assets/audio/sala_29_tres_gracias.mp3',
  './assets/audio/sala_32_familia_carlos_iv.mp3',
  './assets/audio/sala_38_maja_desnuda.mp3',
  './assets/audio/sala_42_bacanal_andrios.mp3',
  './assets/audio/sala_44_danae.mp3',
  './assets/audio/sala_49_cardenal.mp3',
  './assets/audio/sala_49_noli_me_tangere.mp3',
  './assets/audio/sala_51_ultima_cena.mp3',
  './assets/audio/sala_51a_santo_domingo_silos.mp3',
  './assets/audio/sala_51c_frescos_maderuelo.mp3',
  './assets/audio/sala_52b_gioconda_prado.mp3',
  './assets/audio/sala_55a_laguna_estigia.mp3',
  './assets/audio/sala_55a_triunfo_muerte.mp3',
  './assets/audio/sala_55b_adan_eva_durero.mp3',
  './assets/audio/sala_56a_carro_heno.mp3',
  './assets/audio/sala_56a_jardin_delicias.mp3',
  './assets/audio/sala_56a_mesa_pecados.mp3',
  './assets/audio/sala_56a_piedra_locura.mp3',
  './assets/audio/sala_56b_anunciacion_fra_angelico.mp3',
  './assets/audio/sala_56b_transito_virgen.mp3',
  './assets/audio/sala_58_descendimiento.mp3',
  './assets/audio/sala_60a_chicos_playa.mp3',
  './assets/audio/sala_61a_satiro.mp3',
  './assets/audio/sala_61b_isabel_testamento.mp3',
  './assets/audio/sala_61b_muerte_lucrecia.mp3',
  './assets/audio/sala_62b_el_cid.mp3',
  './assets/audio/sala_64_65_fusilamientos.mp3',
  './assets/audio/sala_64_carga_mamelucos.mp3',
  './assets/audio/sala_64_coloso.mp3',
  './assets/audio/sala_64_muerte_viriato.mp3',
  './assets/audio/sala_67_aquelarre.mp3',
  './assets/audio/sala_67_duelo_garrotazos.mp3',
  './assets/audio/sala_67_perro_hundido.mp3',
  './assets/audio/sala_67_saturno.mp3',
  './assets/audio/sala_71_orestes_pilades.mp3',
  './assets/audio/sala_73_diadumeno.mp3',
  './assets/audio/sala_75_fusilamiento_torrijos.mp3',
  './assets/audio/sala_75_juana_loca.mp3',
  './assets/audio/sala_75_muerte_seneca.mp3',
  './assets/audio/sala_75_rendicion_bailen.mp3',
  './assets/audio/sala_76_judith_holofernes.mp3',
];

// ── Instalación: poblar la caché ─────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cachear en lotes para no saturar el navegador
      const BATCH = 20;
      const batches = [];
      for (let i = 0; i < RECURSOS.length; i += BATCH) {
        batches.push(RECURSOS.slice(i, i + BATCH));
      }
      return batches.reduce((promise, batch) =>
        promise.then(() =>
          Promise.allSettled(
            batch.map(url =>
              cache.add(url).catch(err =>
                console.warn('[SW] No se pudo cachear:', url, err.message)
              )
            )
          )
        ),
        Promise.resolve()
      );
    }).then(() => self.skipWaiting())
  );
});

// ── Activación: borrar cachés antiguas ───────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: Cache-First con fallback a red ────────────────────
self.addEventListener('fetch', event => {
  // Solo interceptar peticiones GET al mismo origen
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      // No está en caché: intentar red y guardar el resultado
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const copia = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copia));
        return response;
      }).catch(() => {
        // Sin red y sin caché: respuesta de error mínima
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
