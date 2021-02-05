const { pointers } = require("d3");

let MathHelper = {
  calculate2DDistance: function(point1, point2) {
    let xs = point2.x - point1.x,
      ys = point2.y - point1.y;

    xs *= xs;
    ys *= ys;
    return Math.sqrt(xs + ys);
  },
  calcPolygonArea: function(vertices) {
    var total = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
      var addX = vertices[i].x;
      var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
      var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
      var subY = vertices[i].y;

      total += addX * addY * 0.5;
      total -= subX * subY * 0.5;
    }

    return Math.abs(total);
  },
  convertArrayOfArraysOf2DPointsToArrayOfXY: function(arrPoints) {
    let xyArray = [];
    for (var i = 0; i < arrPoints.length; i++) {
      xyArray.push({ x: arrPoints[i][0], y: arrPoints[i][1] });
    }

    return xyArray;
  },
};

module.exports = MathHelper;
