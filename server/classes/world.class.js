const Base = require('./base.class');
const SimplexNoise = require('simplex-noise');

const storage = require('node-persist');
//const path = require('path');

const ROT = require('rot-js');
const { createCanvas } = require('canvas');
const Biomes = require('./biomes');
const WorldChunk = require('./worldChunk.class');
const _ = require('lodash');
const Player = require('./things/actors/player.class');
const Environment = require('./environment.class');

/* 
The world made with a series of seeded procedural algorithms layered on top of one another. 
Because these are reproducible we don't need to store them, or generate them all in advance.

When returning information about the world, we layer a cached representation of non-procedural objects and
changes to the environment to handle things that have changed in the world. 

World generation starts at (0,0,0) and spans out in the positive and negative direction. 
This position is not the center of a chunk, but the meeting point of 4 chunks.

*/

module.exports = class World extends Base {
  constructor(params) {
    super(params);

    this.seed = parseInt(params.seed) || 1; // what seed are we using for this world?
    this.__storagePath = `data/worlds/${this.seed}`;

    this.__storage = storage.create({
      dir: this.__storagePath,
      stringify: JSON.stringify,
      parse: JSON.parse,
      encoding: 'utf8',
      logging: false, // can also be custom logging function
      ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
      expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache
      forgiveParseErrors: false,
    });

    this.__scheduler = new ROT.Scheduler.Simple();
    this.__engine = new ROT.Engine(this.__scheduler);
    this.__running = false;
    this.turns = 0;
    this.turnDurationMS = 1000;

    this.__chunkSize = 32; // (32) how large is a single chunk?
    this.__islandRadiusInChunks = 4; // (4)  what is the maximum number of chunks we can get to before it's all ocean?

    this.__isIsland = params.isIsland || false;
    this.__width =
      this.__chunkSize * (this.__islandRadiusInChunks * 2) +
      this.__chunkSize * 3;
    this.__height =
      this.__chunkSize * (this.__islandRadiusInChunks * 2) +
      this.__chunkSize * 3;

    // cache local class instances4

    this.__biome = new Biomes();

    this.__environment = new Environment({}, this);
    // players in the world
    this.__players = [];
  }

  async initialize() {
    await this.__storage.init();
    let storageWorld = await this.__storage.getItem('world');
    if (storageWorld) {
      this.deserialize(storageWorld);
    } else {
      // assign world seed to generator

      ROT.RNG.setSeed(this.seed);
      this.state = ROT.RNG.getState();
      await this.__storage.setItem('world', this.serialize());
    }

    ROT.RNG.setState(this.state);

    // capture environmental seeds in order for reproducibility
    this.__elevationSeed = ROT.RNG.getUniform();
    this.__moistureSeed = ROT.RNG.getUniform();

    // generate simplex for terrain elevation and set-up parameters for easing
    this.__simplexElevation = new SimplexNoise(this.__elevationSeed);
    this.__elevationOctaveArray = [2, 4, 6, 10, 25, 150];
    this.__exponent = 1;

    // generate simplex for moisture and set-up parameters for easing

    this.__simplexMoisture = new SimplexNoise(this.__moistureSeed);
    this.__moistureOctaveArray = [3, 4, 6, 10, 25, 450];

    this.__scheduler.add(this.__environment, true);
    this.__environment.__scheduled = true;
    this.__engine.start();
  }

  deregisterPlayer(player) {
    console.log(`deregisterPlayer ${player.name}`);

    this.__scheduler.remove(player);

    this.__players = _.remove(this.__players, function(p) {
      p.name = player.name;
    });
  }

  async getPlayer(params) {
    if (!params.name) return;
    let player = _.find(this.__players, params);

    if (player) return player;

    player = new Player(params, this);
    this.__players.push(player);

    await player.initialize();
    let returnPlayer = _.clone(player);
    player.isNew = false; // doing this b/c the player in memory isn't updated with "isNew" = false even after the character is created. This should be
    // changed once we get character creation working

    console.log(`adding ${player.name} ${player.__scheduled}`);
    this.__scheduler.add(player, true);
    player.__scheduled = true;
    //console.log(player.name, this.__scheduler);
    return returnPlayer;
  }

  async getPlayerBySocketId(socketId) {
    if (!socketId) return;
    let player = _.find(this.__players, { socketId: socketId });
    if (player) return player;

    return null;
  }

  getWorldChunkFromWorldPosition(x, y, d) {
    return new WorldChunk(
      this,
      Math.floor(x / this.__chunkSize),
      Math.floor(y / this.__chunkSize),
      Math.floor(d)
    );
  }

  getStartPosition() {
    let position = { x: 0, y: 0, d: 0 };

    position.x = this.__islandRadiusInChunks * 1.75 * this.__chunkSize;

    position.y = this.__islandRadiusInChunks * 2 * this.__chunkSize;

    while (
      !this.getWorldPosition(position.x, position.y, position.d).biome.passable
    ) {
      position.y -= 1;
      position.x -= 1;
    }

    return position;
  }

  /* 
  Return all the positions the specified area
  Area: { 
          topLeft: { x: <val>, y: <val>: d: <val>},
          bottomRight: { x: <val>, y: <val>: d: <val>},
  }

*/
  getWorldPositions(area) {
    let topLeftX = Math.floor(area.topLeft.x);
    let topLeftY = Math.floor(area.topLeft.y);
    let bottomRightX = Math.floor(area.bottomRight.x);
    let bottomRightY = Math.floor(area.bottomRight.y);

    let rows = [];
    let posD = area.topLeft.d;
    for (let posY = topLeftY; posY <= bottomRightY; posY++) {
      let columns = [];
      for (let posX = topLeftX; posX <= bottomRightX; posX++) {
        let wp = this.getWorldPosition(posX, posY, posD);
        delete wp.world;
        columns.push(wp);
      }

      rows.push(columns);
    }

    return rows;
  }

  getWorldPosition(x, y, d) {
    return this.getPositionData(x, y, d);
  }

  worldCoordinatesToChunkCoordinates(x, y) {
    return {
      chunkX: Math.floor(x / this.__chunkSize),
      chunkY: Math.floor(y / this.__chunkSize),
      offsetX: x % this.__chunkSize,
      offsetY: y % this.__chunkSize,
    };
  }

  chunkCoordinatesToWorldCoordinates(chunkX, chunkY) {
    return {
      x: chunkX * this.__chunkSize - this.__chunkSize / 2,
      y: chunkY * this.__chunkSize - this.__chunkSize / 2,
      width: this.__chunkSize,
      height: this.__chunkSize,
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

    data.biome = this.__biome.selectBiome(data.elevation, data.moisture);
    data.biome.name = this.__biome.biomeName(data.biome);
    return data;
  }

  getMoisture(x, y) {
    let xval = x / this.__width;
    let yval = y / this.__height;

    let moisture = this.__simplexMoisture.noise2D(xval, yval);

    for (
      let octaveIndex = 0;
      octaveIndex < this.__moistureOctaveArray.length;
      octaveIndex++
    ) {
      moisture +=
        (1 / this.__moistureOctaveArray[octaveIndex]) *
        this.__simplexMoisture.noise2D(
          this.__moistureOctaveArray[octaveIndex] * xval,
          this.__moistureOctaveArray[octaveIndex] * yval
        );
    }

    moisture = this.normalizeSimplex(moisture);

    return moisture;
  }

  getElevation(x, y) {
    let xval = x / (this.__width / 4);
    let yval = y / (this.__height / 4);

    let elevation = this.__simplexElevation.noise2D(xval, yval);
    for (
      let octaveIndex = 0;
      octaveIndex < this.__elevationOctaveArray.length;
      octaveIndex++
    ) {
      elevation +=
        (1 / this.__elevationOctaveArray[octaveIndex]) *
        this.__simplexElevation.noise2D(
          this.__elevationOctaveArray[octaveIndex] * xval,
          this.__elevationOctaveArray[octaveIndex] * yval
        );
    }

    // elevation = elevation / divisor;
    //elevation = Math.pow(elevation, this.__exponent);

    // adjust for islandize
    this.__isIsland = true;
    elevation = this.normalizeSimplex(elevation);
    elevation = this.compressToIsland(x, y, elevation, function(d) {
      return Math.sqrt(Math.pow(d, 0.6)) * Math.sqrt(Math.pow(d, 0.6)) - 0.3;
    });

    elevation = Math.round(elevation * 48) / 48;

    return elevation;
  }

  compressToIsland(x, y, val, dFn) {
    // get the distance from 0,0
    let nx =
      x /
      ((this.__islandRadiusInChunks * this.__chunkSize) /
        (this.__islandRadiusInChunks / 2.5));
    let ny =
      y /
      ((this.__islandRadiusInChunks * this.__chunkSize) /
        (this.__islandRadiusInChunks / 2.5));

    let d = Math.sqrt(nx * nx + ny * ny) / Math.sqrt(0.5);

    if (dFn) d = dFn(d); // d = Math.pow(d, 0.5);
    val = (1 + val - d) / 2;

    return val;
  }

  getBiomeColors(e, m) {
    let data = Array(4);
    let biome = this.__biome.selectBiome(e, m);

    let eColor = e < 0 ? 192 + 64 * -e : 256;
    data[0] = biome.r; // r
    data[1] = biome.g; // g
    data[2] = biome.b; // b
    data[3] = eColor; //e * 255; // alpha

    return data;
  }

  iterateOverWorld(fn) {
    if (!fn) return;

    for (var y = 0; y < this.__height; y++) {
      for (var x = 0; x < this.__width; x++) {
        fn(x, y);
      }
    }
  }

  renderToImage() {
    let xPos = 0;
    let yPos = 0;
    const canvas = createCanvas(this.__width, this.__height);

    let ctx = canvas.getContext('2d');

    // get the coordinates so that out view is in the center of the map.
    let mapCenter = {
      x: xPos - Math.floor(canvas.width / 2),
      y: yPos - Math.floor(canvas.height / 2),
    };

    let imgdata = ctx.createImageData(canvas.width, canvas.height);

    this.iterateOverWorld(
      function(x, y) {
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
      }.bind(this)
    );

    ctx.putImageData(imgdata, 0, 0);

    return canvas.toBuffer('image/png');
  }
};
