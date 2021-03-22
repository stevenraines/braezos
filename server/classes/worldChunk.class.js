const WorldPosition = require('./worldPosition.class');

module.exports = class WorldChunk {
  constructor(world, chunkX, chunkY, chunkD) {
    this.world = world;
    this.x = chunkX;
    this.y = chunkY;
    this.d = chunkD;
  }

  get worldPositions() {
    let positions = [];
    for (let yIndex = 0; yIndex < this.world.chunkSize; yIndex++) {
      for (let xIndex = 0; xIndex < this.world.chunkSize; xIndex++) {
        let positionData = this.world.getPositionData(
          xIndex + this.x * this.world.chunkSize,
          yIndex + this.y * this.world.chunkSize,
          this.d
        );

        positions.push(new WorldPosition(this.world, positionData));
      }
    }
    return positions;
  }
};
