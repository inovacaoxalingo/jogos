/* A cópia antiga do Corpo Humano (ref. 53309) saiu daqui: agora fica só em /interactive-play/corpo-humano/.
   Este arquivo desliga o service worker antigo nos aparelhos que já tinham aberto este endereço
   e leva a pessoa para o endereço novo. Não guarda nada. */
const NOVO = 'https://inovacaoxalingo.github.io/interactive-play/corpo-humano/';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(self.registration.unregister()
    .then(() => self.clients.matchAll({ type: 'window' }))
    .then(cs => Promise.all(cs.map(c => c.navigate(NOVO).catch(() => {})))));
});
