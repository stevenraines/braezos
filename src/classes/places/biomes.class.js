import _ from 'lodash';

export default class Biomes {
  constructor() {
    this.waterTable = 0.15;
  }

  selectBiome(e, m) {
    if (e < this.waterTable + 0.1) return this.biomes.OCEAN;
    if (e < this.waterTable + 0.15) return this.biomes.BEACH;

    if (e > this.waterTable + 0.2) {
      if (m < 0.16) return this.biomes.TEMPERATE_DESERT;
      if (m < 0.3) return this.biomes.GRASSLAND;
      if (m < 0.63) return this.biomes.TEMPERATE_DECIDUOUS_FOREST;
      return this.biomes.TEMPERATE_RAIN_FOREST;
    }

    if (e > this.waterTable + 0.6) {
      if (m < 0.33) return this.biomes.TEMPERATE_DESERT;
      if (m < 0.76) return this.biomes.SHRUBLAND;
      return this.biomes.TAIGA;
    }

    if (e > this.waterTable + 0.8) {
      if (m < 0.1) return this.biomes.SCORCHED;
      if (m < 0.2) return this.biomes.BARE;
      if (m < 0.5) return this.biomes.TUNDRA;
      return this.biomes.SNOW;
    }

    if (m < 0.26) return this.biomes.SUBTROPICAL_DESERT;
    if (m < 0.43) return this.biomes.GRASSLAND;
    if (m < 0.7) return this.biomes.TROPICAL_SEASONAL_FOREST;
    return this.biomes.TROPICAL_RAIN_FOREST;
  }

  biomeName(biome) {
    return _.findKey(this.biomes, biome);
  }

  get biomes() {
    return {
      OCEAN: { r: 0, g: 0, b: 255 },
      BEACH: { r: 235, g: 225, b: 52, a: 150 },
      SCORCHED: { r: 235, g: 225, b: 52, a: 150 },
      BARE: { r: 235, g: 225, b: 52, a: 150 },
      TEMPERATE_DECIDUOUS_FOREST: { r: 123, g: 161, b: 48 },
      TEMPERATE_RAIN_FOREST: { r: 114, g: 132, b: 27 },
      TROPICAL_SEASONAL_FOREST: { r: 38, g: 171, b: 58 },
      TROPICAL_RAIN_FOREST: { r: 114, g: 132, b: 27 },
      JUNGLE: { r: 54, g: 133, b: 112 },
      SAVANNAH: { r: 185, g: 235, b: 86 },
      GRASSLAND: { r: 153, g: 221, b: 19 },
      TEMPERATE_DESERT: { r: 255, g: 219, b: 77 },
      SUBTROPICAL_DESERT: { r: 255, g: 219, b: 77 },
      DESERT: { r: 255, g: 219, b: 77 },
      TUNDRA: { r: 190, g: 197, b: 191 },
      TAIGA: { r: 99, g: 113, b: 71 },
      SHRUBLAND: { r: 178, g: 182, b: 84 },
      SNOW: { r: 255, g: 255, b: 255 },
    };
  }
}
