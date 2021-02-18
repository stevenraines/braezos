const Point = class {
  constructor(coordinates) {
    this.x = 0; // world-length position (X axis)
    this.y = 0; // world-height position (Y axis)
    this.d = 0; // surface level (o is overworld, larger is lower)

    if (Array.isArray(coordinates)) {
      this.x = coordinates[0];
      this.y = coordinates[1];
      this.d = coordinates.length == 3 ? coordinates[2] : 0;
      return;
    }

    if (Array.isArray(coordinates)) {
      this.x = coordinates.x;
      this.y = coordinates.y;
      this.d = coordinates.d;
      return;
    }
  }
  asArray() {
    return [this.x, this.y, this.d];
  }
  asObject() {
    return { x: this.x, y: this.y, d: this.d };
  }
};

export default Point;
