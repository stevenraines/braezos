const MoveVectors = {
  NW: { x: -1, y: -1, d: 0 },
  N: { x: 0, y: -1, d: 0 },
  NE: { x: 1, y: -1, d: 0 },
  W: { x: -1, y: 0, d: 0 },
  NONE: { x: 0, y: 0, d: 0 },
  E: { x: 1, y: 0, d: 0 },
  SW: { x: -1, y: 1, d: 0 },
  S: { x: 0, y: 1, d: 0 },
  SE: { x: 1, y: 1, d: 0 },
};
module.exports = MoveVectors;
