import SimplexNoise from 'simplex-noise';
import * as ROT from 'rot-js';
import { EventBus } from '../../eventbus';
import Biomes from './biomes.class';
import WorldChunk from './worldChunk.class';
/* 
The world made with a series of seeded procedural algorithms layered on top of one another. 
Because these are reproducible we don't need to store them, or generate them all in advance.

When returning information about the world, we layer a cached representation of non-procedural objects and
changes to the environment to handle things that have changed in the world. 

World generation starts at (0,0,0) and spans out in the positive and negative direction. 
This position is not the center of a chunk, but the meeting point of 4 chunks.

*/

export default class World {
  constructor(params) {
    this.seed = params.seed || 1; // what seed are we using for this world?
    this.chunkSize = 64; // how large is a single chunk?
    this.resolution = params.resolution || 40;
    this.islandRadiusInChunks = 2; // what is the maximum number of chunks we can get to before it's all ocean?

    this.isIsland = params.isIsland || false;
    this.width = this.chunkSize * (this.islandRadiusInChunks * 2);
    this.height = this.chunkSize * (this.islandRadiusInChunks * 2);

    // assign world seed to generator
    ROT.RNG.setSeed(this.seed);

    // capture environmental seeds in order for reproducibility
    this.elevationSeed = ROT.RNG.getUniform();
    this.moistureSeed = ROT.RNG.getUniform();

    // generate simplex for terrain elevation and set-up parameters for easing
    EventBus.$emit('generation_status', 'Generating Terrain Elevation');
    this.simplexElevation = new SimplexNoise(this.elevationSeed);
    this.elevationOctaveArray = [2, 4, 6, 10, 25, 150];

    // generate simplex for moisture and set-up parameters for easing
    EventBus.$emit('generation_status', 'Generating Terrain Moisture');
    this.simplexMoisture = new SimplexNoise(this.moistureSeed);
    this.moistureOctaveArray = [3, 4, 6, 10, 25];
    // cache local class instances

    EventBus.$emit('generation_status', 'Calculating Biomes');
    this.biome = new Biomes();

    EventBus.$emit('generation_status', 'Rendering World');
  }

  getWorldChunkFromWorldPosition(world, x, y, d) {
    return new WorldChunk(
      world,
      Math.floor(x / world.chunkSize),
      Math.floor(y / world.chunkSize),
      Math.floor(d)
    );
  }

  getStartPosition() {
    EventBus.$emit('generation_status', 'Locating start position');
    let position = { x: 0, y: 0, d: 0 };

    position.x = this.islandRadiusInChunks * 1.75 * this.chunkSize;

    position.y = this.islandRadiusInChunks * 2 * this.chunkSize;

    while (
      !this.getWorldPosition(position.x, position.y, position.d).biome.passable
    ) {
      position.y -= 1;
      position.x -= 1;
    }

    return position;
  }

  getChunksInArea(visibleArea) {
    let topLeftChunkX = Math.floor(visibleArea.topLeft.x / this.chunkSize);
    let topLeftChunkY = Math.floor(visibleArea.topLeft.y / this.chunkSize);
    let bottomRightChunkX = Math.floor(
      visibleArea.bottomRight.x / this.chunkSize
    );
    let bottomRightChunkY = Math.floor(
      visibleArea.bottomRight.y / this.chunkSize
    );

    let chunks = [];

    let chunkD = visibleArea.topLeft.d;
    for (let chunkY = bottomRightChunkY; chunkY >= topLeftChunkY; chunkY--) {
      for (let chunkX = bottomRightChunkX; chunkX >= topLeftChunkX; chunkX--) {
        chunks.push(new WorldChunk(this, chunkX, chunkY, chunkD));
      }
    }

    return chunks;
  }

  getWorldPosition(x, y, d) {
    return this.getPositionData(x, y, d);
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

  getPositionData(x, y, d) {
    let data = {
      x: x,
      y: y,
      d: d,
      moisture: this.getMoisture(x, y),
      elevation: this.getElevation(x, y),
    };

    data.biome = this.biome.selectBiome(data.elevation, data.moisture);
    data.biome.name = this.biome.biomeName(data.biome);
    return data;
  }

  getMoisture(x, y) {
    let xval = x / this.width;
    let yval = y / this.height;

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

  getElevation(x, y) {
    let xval = x / this.width;
    let yval = y / this.height;

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
    // adjust for islandize
    this.isIsland = true;

    elevation = this.compressToIsland(x, y, elevation, function(d) {
      return Math.sqrt(Math.pow(d, 0.6)) * Math.sqrt(Math.pow(d, 0.6)) - 0.3;
    });

    return elevation;
  }

  compressToIsland(x, y, val, dFn) {
    // get the distance from 0,0
    let nx = x / (this.islandRadiusInChunks * this.chunkSize);
    let ny = y / (this.islandRadiusInChunks * this.chunkSize);

    let d = Math.sqrt(nx * nx + ny * ny) / Math.sqrt(0.5);

    if (dFn) d = dFn(d); // d = Math.pow(d, 0.5);
    val = (1 + val - d) / 2;

    return val;
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
