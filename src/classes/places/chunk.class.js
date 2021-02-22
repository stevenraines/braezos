import Level from './level.class';

const Chunk = class Chunk {
  constructor(config) {
    this.config = config;
    this.cellSize = config.cellSize || 20;
    this.cellWidth = config.terrain.width / config.cellSize;
    this.cellHeight = config.terrain.height / config.cellSize;
    this.cellDepth = config.depth || 100;
    this.seed = config.terrain.seed;
  }
  getLevel(levelIndex) {
    return new Level(levelIndex, this);
  }
};

export default Chunk;
