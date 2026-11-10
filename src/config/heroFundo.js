// Fundo em vídeo do hero da página inicial (src/presentation/ui/HeroBackground.jsx).
//
// Loop de 17,6 s do Mesh Gradient (Paper Shaders) nas cores do site, tirado da
// gravação em midia/fundo-site-1080p.webm (trecho 81,1 s -> 98,7 s, escolhido por
// ter o fim quase igual ao começo; o último 1,5 s funde de volta no início, então
// a volta do loop não tem salto).
//
// Para cada formato: o WebM vem primeiro (mais leve) e o MP4 fica de reserva para
// navegador sem WebM ou aparelho antigo/fraco (H.264 tem decodificação em hardware
// em praticamente tudo). O nome tem a versão (v1): ao trocar o vídeo, gere
// arquivos com v2, porque a pasta /video fica 30 dias em cache.
//
// O tipo leva o codec completo (vp09.perfil.nível.bits, avc1.perfil+nível): com
// só "vp9" o Chrome responde que não sabe se toca e mandaria todo mundo para o MP4.
export const heroFundo = {
  // Primeiro quadro do loop. Aparece na hora, antes do vídeo, e fica no lugar
  // dele com "reduzir movimento", economia de dados ou conexão 2G.
  capa: '/video/hero-v1-capa.webp',
  // Granulado por cima do vídeo: disfarça as faixas do degradê e os blocos da
  // compressão que vieram da gravação (o olho lê a textura, não o defeito).
  // 0 desliga; 0.2 é sutil; 0.35 é o padrão; 0.6 já parece grão de filme.
  grao: 0.35,
  // Tela deitada, ou em pé mas larga (tablet).
  horizontal: {
    largura: 1920,
    altura: 1080,
    fontes: [
      { src: '/video/hero-v1-1080.webm', tipo: 'video/webm; codecs="vp09.00.40.08"' },
      { src: '/video/hero-v1-720.mp4', tipo: 'video/mp4; codecs="avc1.64001F"' },
    ],
  },
  // Celular em pé: recorte vertical 540x960, um terço do peso. O recorte é a
  // faixa do vídeo deitado que fica a 64,8% da largura, a mesma que a capa
  // mostra no celular (HeroBackground.module.css), então a troca não aparece.
  vertical: {
    largura: 540,
    altura: 960,
    fontes: [
      { src: '/video/hero-v1-vertical.webm', tipo: 'video/webm; codecs="vp09.00.31.08"' },
      { src: '/video/hero-v1-vertical.mp4', tipo: 'video/mp4; codecs="avc1.64001F"' },
    ],
  },
};
