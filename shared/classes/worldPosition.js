module.exports = class WorldPosition {
  constructor(world, data) {
    this.world = world;
    this.x = data.x;
    this.y = data.y;
    this.d = data.d;
    this.elevation = data.elevation;
    this.moisture = data.moisture;
    this.biome = data.biome;
  }
};
