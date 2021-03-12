import SimplexNoise from 'simplex-noise';
import * as ROT from 'rot-js';
//import MathHelper from '../helpers/math';
import Biomes from './biomes.class';

export default class World {
  constructor(params) {
    this.elevations = [];

    this.seed = params.seed || 1;

    this.resolution = params.resolution || 32;

    ROT.RNG.setSeed(this.seed);
    this.elevationSeed = ROT.RNG.getUniform();
    this.moistureSeed = ROT.RNG.getUniform();

    this.chunkSize = 64;
    this.biome = new Biomes();
    this.simplexElevation = new SimplexNoise(this.elevationSeed);
    this.simplexMoisture = new SimplexNoise(this.moistureSeed);
    this.elevationOctaveArray = [2, 4, 6, 10, 25, 50];
    this.moistureOctaveArray = [2, 10];
    this.exponent = 5.5;
  }

  worldCoordinatesToChunkCoordinates(x, y) {
    return {
      chunkX: Math.floor(x / this.chunkSize),
      chunkY: Math.floor(y / this.chunkSize),
      offsetX: x % this.chunkSize,
      offsetY: y % this.chunkSize,
    };
  }

  chunkCoordinatesToWorldCoordinates(chunkX, chunkY) {
    return {
      x: chunkX * this.chunkSize - this.chunkSize / 2,
      y: chunkY * this.chunkSize - this.chunkSize / 2,
      width: this.chunkSize,
      height: this.chunkSize,
    };
  }

  // adjust range of simplex numbers from -1 ot 1 to 0 to 1.
  normalizeSimplex(simplexValue) {
    return (simplexValue + 1) / 2;
  }

  /* generate the geographic information for the world at the location */
  generateMap(xPos, yPos, height, width) {
    let mapCenter = {
      x: xPos - Math.floor(height / 2),
      y: yPos - Math.floor(width / 2),
    };

    return mapCenter;
  }

  generateChunk(chunkX, chunkY) {
    // calculate the world coodinates of the chunk.
    return {
      chunkX: chunkX,
      chunkY: chunkY,
      worldCoordinates: this.chunkCoordinatesToWorldCoordinates(chunkX, chunkY),
    };
  }

  getPositionData(x, y, d, width, height) {
    if (!d) d = 0;

    let data = {
      moisture: this.getMoisture(x, y, width, height),
      elevation: this.getElevation(x, y, width, height),
    };

    return data;
  }

  getMoisture(x, y, width, height) {
    let xval = x / width;
    let yval = y / height;

    let moisture = this.simplexMoisture.noise2D(xval, yval);

    for (
      let octaveIndex = 0;
      octaveIndex < this.moistureOctaveArray.length;
      octaveIndex++
    ) {
      moisture +=
        (1 / this.moistureOctaveArray[octaveIndex]) *
        this.simplexMoisture.noise2D(
          this.moistureOctaveArray[octaveIndex] * xval,
          this.moistureOctaveArray[octaveIndex] * yval
        );
    }

    moisture = this.normalizeSimplex(moisture);

    return moisture;
  }

  getElevation(x, y, width, height) {
    let xval = x / width;
    let yval = y / height;

    let elevation = this.simplexElevation.noise2D(xval, yval);

    for (
      let octaveIndex = 0;
      octaveIndex < this.elevationOctaveArray.length;
      octaveIndex++
    ) {
      elevation +=
        (1 / this.elevationOctaveArray[octaveIndex]) *
        this.simplexElevation.noise2D(
          this.elevationOctaveArray[octaveIndex] * xval,
          this.elevationOctaveArray[octaveIndex] * yval
        );
    }

    elevation = this.normalizeSimplex(elevation);

    return elevation;
  }

  getBiomeColors(e, m) {
    let data = Array(4);
    let biome = this.biome.selectBiome(e, m);

    let eColor = e < 0 ? 192 + 64 * -e : 256;
    data[0] = biome.r; // r
    data[1] = biome.g; // g
    data[2] = biome.b; // b
    data[3] = eColor; //e * 255; // alpha

    return data;
  }

  renderToCanvas(xPos, yPos, canvas) {
    let ctx = canvas.getContext('2d');

    // get the coordinates so that out view is in the center of the map.
    let mapCenter = {
      x: xPos - Math.floor(canvas.width / 2),
      y: yPos - Math.floor(canvas.height / 2),
    };

    let imgdata = ctx.createImageData(canvas.width, canvas.height);

    for (var y = 0; y < canvas.height; y++) {
      for (var x = 0; x < canvas.width; x++) {
        const index = (x + y * canvas.width) * 4;

        let positionData = this.getPositionData(
          x + mapCenter.x,
          y + mapCenter.y,
          0,
          canvas.width,
          canvas.height
        );

        let biomeData = this.getBiomeColors(
          positionData.elevation,
          positionData.moisture
        );

        imgdata.data[index] = biomeData[0];
        imgdata.data[index + 1] = biomeData[1];
        imgdata.data[index + 2] = biomeData[2];
        imgdata.data[index + 3] = biomeData[3];
      }
    }

    ctx.putImageData(imgdata, 0, 0);
  }
}
