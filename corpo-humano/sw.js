/* Service worker – Conhecendo o Corpo Humano (ref. 53309)
   Guarda a página e as imagens para abrir rápido e funcionar com internet fraca.
   A versão muda a cada publicação, e o cache antigo é apagado sozinho. */
const VERSAO = '202611031142';
const PREFIXO = 'xalingo-53309-';
const CACHE = PREFIXO + VERSAO;
const BASICO = [
 "./",
 "index.html",
 "manifest.webmanifest",
 "assets/fonts/open-sans.woff2",
 "assets/lib/zxing-reader.js",
 "assets/apple-touch.png",
 "assets/btn_naotenho.webp",
 "assets/btn_tenho.webp",
 "assets/carta_1.webp",
 "assets/carta_10.webp",
 "assets/carta_11.webp",
 "assets/carta_12.webp",
 "assets/carta_2.webp",
 "assets/carta_3.webp",
 "assets/carta_4.webp",
 "assets/carta_5.webp",
 "assets/carta_6.webp",
 "assets/carta_7.webp",
 "assets/carta_8.webp",
 "assets/carta_9.webp",
 "assets/carta_verso.webp",
 "assets/doodles.webp",
 "assets/fig_cardiovascular.webp",
 "assets/fig_digestorio.webp",
 "assets/fig_esqueletico.webp",
 "assets/fig_nervoso.webp",
 "assets/fig_respiratorio.webp",
 "assets/icone-192.png",
 "assets/icone-512.png",
 "assets/icone-maskable-512.png",
 "assets/icone.webp",
 "assets/logo_ip.webp",
 "assets/logo_xalingo.webp",
 "assets/onde-qr.webp"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASICO)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIXO) && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.headers.has('range')) return; // áudio em partes vai direto para a rede
  const u = new URL(r.url);
  if (u.origin !== location.origin || u.pathname.endsWith('.usdz')) return;
  if (r.mode === 'navigate') {
    // página: tenta a rede primeiro (pega a versão nova), sem internet usa a guardada
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // arquivos: usa o guardado e busca na rede o que ainda não tem
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
    if (res.ok && res.type === 'basic') { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); }
    return res;
  })));
});
