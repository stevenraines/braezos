const MathHelper = class {
  static calculate2DDistance(point1, point2) {
    let xs = point2.x - point1.x,
      ys = point2.y - point1.y;

    xs *= xs;
    ys *= ys;

    let dist = Math.sqrt(xs + ys);

    return dist;
  }

  static calcPolygonArea(vertices) {
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
  }

  static convertArrayOfArraysOf2DPointsToArrayOfXY(arrPoints) {
    let xyArray = [];
    for (var i = 0; i < arrPoints.length; i++) {
      xyArray.push({ x: arrPoints[i][0], y: arrPoints[i][1] });
    }

    return xyArray;
  }

  static centroid(pts) {
    var x = 0;
    var y = 0;
    for (var i = 0; i < pts.length; i++) {
      x += pts[i][0];
      y += pts[i][1];
    }
    return [x / pts.length, y / pts.length];
  }
};

export default MathHelper;
