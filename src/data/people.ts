/** Player cut-outs for avatars: `src`, width/height `ratio` and `cx` — horizontal centre of the head (0…1) (full-length photos, head at the top). */
export const people = {
  martin: { src: require('../../assets/images/people/martin.webp'), ratio: 0.441, cx: 0.577 },
  natel: { src: require('../../assets/images/media-natel.webp'), ratio: 0.394, cx: 0.724 },
  moraes: { src: require('../../assets/images/player-moraes.webp'), ratio: 0.378, cx: 0.727 },
  vakulko: { src: require('../../assets/images/team-cutout.webp'), ratio: 0.531, cx: 0.43 },
  sultaniyazov: { src: require('../../assets/images/people/sultaniyazov.webp'), ratio: 0.472, cx: 0.437 },
  astanov: { src: require('../../assets/images/player-astanov.webp'), ratio: 0.499, cx: 0.434 },
  kapacina: { src: require('../../assets/images/people/kapacina.webp'), ratio: 0.444, cx: 0.681 },
  amir: { src: require('../../assets/images/player-amir.webp'), ratio: 0.324, cx: 0.697 },
  antich: { src: require('../../assets/images/people/antich.webp'), ratio: 0.363, cx: 0.673 },
  kilama: { src: require('../../assets/images/people/kilama.webp'), ratio: 0.424, cx: 0.429 },
  sAstanov: { src: require('../../assets/images/media-astanov.webp'), ratio: 0.347, cx: 0.412 },
  shaizada: { src: require('../../assets/images/player-shaizada.webp'), ratio: 0.342, cx: 0.674 },
  tolepbergen: { src: require('../../assets/images/people/tolepbergen.webp'), ratio: 0.453, cx: 0.704 },
  turganov: { src: require('../../assets/images/people/turganov.webp'), ratio: 0.456, cx: 0.421 },
  zhaksybaev: { src: require('../../assets/images/people/zhaksybaev.webp'), ratio: 0.369, cx: 0.695 },
  khalmatov: { src: require('../../assets/images/people/khalmatov.webp'), ratio: 0.482, cx: 0.395 },
  bToktybay: { src: require('../../assets/images/people/b-toktybay.webp'), ratio: 0.509, cx: 0.415 },
  mToktybay: { src: require('../../assets/images/media-toktybay.webp'), ratio: 0.472, cx: 0.65 },
  naumets: { src: require('../../assets/images/people/naumets.webp'), ratio: 0.384, cx: 0.698 },
  abagna: { src: require('../../assets/images/people/abagna.webp'), ratio: 0.403, cx: 0.453 },
};

export type PersonKey = keyof typeof people;
