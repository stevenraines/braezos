import Level from './level.class';

const Chunk = class {
  constructor(params) {
    this.params = params;
    this.cellSize = params.cellSize || 20;
    this.cellWidth = params.terrain.width / params.cellSize;
    this.cellHeight = params.terrain.height / params.cellSize;
    this.cellDepth = params.depth || 100;
    this.seed = params.terrain.seed;
  }
  getLevel(levelIndex) {
    return new Level(levelIndex, this);
  }
};

export default Chunk;
