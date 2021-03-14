const _ = require('lodash');
module.exports = class Biomes {
  constructor() {
    this.waterTable = 0.05;
  }

  selectBiome(e, m) {
    if (e < 0) return this.biomes.ABYSS;
    if (e < this.waterTable) return this.biomes.OCEAN;
    if (e < this.waterTable + 0.03) return this.biomes.SHALLOWS;
    if (e < this.waterTable + 0.04) {
      if (m < 0.2) return this.biomes.BARE;
      if (m < 0.8) return this.biomes.BEACH;

      return this.biomes.SWAMP;
    }

    if (e > this.waterTable + 0.65) {
      if (m < 0.2) return this.biomes.SCORCHED;
      if (m < 0.4) return this.biomes.BARE;
      if (m < 0.8) return this.biomes.TUNDRA;
      return this.biomes.SNOW;
    }

    if (e > this.waterTable + 0.4) {
      if (m < 0.01) return this.biomes.TEMPERATE_DESERT;
      if (m < 0.76) return this.biomes.SHRUBLAND;
      return this.biomes.TAIGA;
    }

    if (e > this.waterTable) {
      if (m < 0.01) return this.biomes.TEMPERATE_DESERT;
      if (m < 0.4) return this.biomes.GRASSLAND;
      if (m < 0.63) return this.biomes.TEMPERATE_DECIDUOUS_FOREST;
      return this.biomes.SWAMP;
    }

    //if (m < 0.26) return this.biomes.SUBTROPICAL_DESERT;
    //if (m < 0.43) return this.biomes.GRASSLAND;
    return this.biomes.TEMPERATE_DECIDUOUS_FOREST;
  }

  biomeName(biome) {
    return _.findKey(this.biomes, biome);
  }

  get biomes() {
    return {
      ABYSS: { r: 28, g: 124, b: 157, passable: false },
      OCEAN: { r: 64, g: 172, b: 209, passable: false },
      SHALLOWS: { r: 150, g: 226, b: 252, passable: true },
      BEACH: { r: 255, g: 240, b: 174, a: 150, passable: true },
      SCORCHED: { r: 205, g: 125, b: 52, a: 150, passable: true },
      BARE: { r: 175, g: 175, b: 175, a: 150, passable: true },
      TEMPERATE_DECIDUOUS_FOREST: { r: 123, g: 161, b: 48, passable: true },
      SWAMP: { r: 114, g: 132, b: 27, passable: true },
      TROPICAL_SEASONAL_FOREST: { r: 38, g: 171, b: 58, passable: true },
      JUNGLE: { r: 54, g: 133, b: 112, passable: true },
      SAVANNAH: { r: 185, g: 235, b: 86, passable: true },
      GRASSLAND: { r: 153, g: 221, b: 19, passable: true },
      TEMPERATE_DESERT: { r: 255, g: 219, b: 77, passable: true },
      SUBTROPICAL_DESERT: { r: 255, g: 219, b: 77, passable: true },
      DESERT: { r: 255, g: 219, b: 77, passable: true },
      TUNDRA: { r: 190, g: 197, b: 191, passable: true },
      TAIGA: { r: 99, g: 113, b: 71, passable: true },
      SHRUBLAND: { r: 178, g: 182, b: 84, passable: true },
      SNOW: { r: 255, g: 255, b: 255, passable: true },
    };
  }
};
