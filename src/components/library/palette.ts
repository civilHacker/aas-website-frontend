/** Lighting tuned to the warm, lamp-lit library backdrop. */
export const scenePalette = {
  ambient: "#6b4a2c",
  ambientIntensity: 0.6,
  key: "#ffc98a",
  keyIntensity: 2.6,
  keyPosition: [-5.5, 5, 6] as [number, number, number],
  fill: "#3a2a1c",
  fillIntensity: 0.6,
  shadowOpacity: 0.55,
  environment: 0.28,
};

/** Intrinsic aspect ratio of the backdrop photo and where its table surface sits (fraction of height). */
export const BACKDROP_RATIO = 1672 / 941;
export const TABLE_LINE = 0.81;
