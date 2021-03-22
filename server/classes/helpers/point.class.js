const MathHelper = require('./math');

const Point = class Point {
  constructor(coordinates) {
    this.x = 0; // world-length position (X axis)
    this.y = 0; // world-height position (Y axis)
    this.d = 0; // surface level (o is overworld, larger is lower)

    this.x = coordinates.x;
    this.y = coordinates.y;
    this.d = coordinates.d;
  }
  getWorldCoordinates(cellSize) {
    return {
      x: this.x * cellSize + cellSize / 2,
      y: this.y * cellSize + cellSize / 2,
      d: this.d,
    };
  }

  applyVector(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.d += vector.d;

    return this;
  }

  distanceFromInCells(otherPoint) {
    return MathHelper.calculate2DDistance(this, otherPoint);
  }

  distanceFromInWorldUnits(otherPoint) {
    return MathHelper.calculate2DDistance(
      this.getWorldCoordinates(this.cellSize),
      otherPoint.getWorldCoordinates(this.cellSize)
    );
  }

  asArray() {
    return [this.x, this.y, this.d];
  }
  asObject() {
    return { x: this.x, y: this.y, d: this.d };
  }
};

module.exports = Point;
