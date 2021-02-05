let SVGMethods = {
  zoomFactor: 10,
  changeCellColor: function(map, message) {
    let element = map.getElementById(message.data.elementId);
    element.setAttributeNS(null, "fill", "orange");
  },
  resetSVG: function(map, message) {
    map.setAttributeNS(
      null,
      "viewBox",
      `0 0 ${map.getAttributeNS(null, "width")} ${map.getAttributeNS(
        null,
        "height"
      )}`
    );
  },
  zoomSVG: function(map, message) {
    let vB = map.getAttributeNS(null, "viewBox").split(" ");

    let amount = parseInt(message.data.amount);
    let mapHeight = map.getAttributeNS(null, "height");
    let mapWidth = map.getAttributeNS(null, "width");

    let scrollAmountH = parseInt(vB[0]) + amount * (SVGMethods.zoomFactor / 2);
    let scrollAmountV = parseInt(vB[1]) + amount * (SVGMethods.zoomFactor / 2);
    let zoomAmountH = parseInt(vB[2]) - amount * SVGMethods.zoomFactor;
    let zoomAmountV = parseInt(vB[3]) - amount * SVGMethods.zoomFactor;

    // fix left / top side of map when zooming out
    if (scrollAmountH < 0) scrollAmountH = 0;
    if (scrollAmountV < 0) scrollAmountV = 0;

    //TODO: fix right / bottom side of map when zooming out

    if (zoomAmountH <= parseInt(message.data.width))
      map.setAttributeNS(
        null,
        "viewBox",
        `${scrollAmountH} ${scrollAmountV} ${zoomAmountH} ${zoomAmountV} `
      );

    console.log(
      `${scrollAmountH} ${scrollAmountV} ${zoomAmountH} ${zoomAmountV} `
    );
  },
  panSVGV: function(map, message) {
    let vB = map.getAttributeNS(null, "viewBox").split(" ");
    let mapHeight = map.getAttributeNS(null, "height");
    let zoomV = parseInt(vB[3]) - map.getAttributeNS(null, "height") / 2;
    let moveDir = parseInt(message.data.amount) * 10;
    let newTop = parseInt(vB[1]) - moveDir;

    // prevent overscroll left

    if (newTop < 0) newTop = 0;
    if (newTop + parseInt(vB[3]) >= mapHeight)
      newTop = mapHeight - parseInt(vB[3]);

    map.setAttributeNS(
      null,
      "viewBox",
      `${vB[0]} ${newTop} ${vB[2]} ${vB[3]} `
    );
  },
  panSVGH: function(map, message) {
    let vB = map.getAttributeNS(null, "viewBox").split(" ");
    let mapWidth = map.getAttributeNS(null, "width");
    let zoomH = parseInt(vB[2]) - map.getAttributeNS(null, "width") / 2;
    let moveDir = parseInt(message.data.amount) * 10;
    let newLeft = parseInt(vB[0]) - moveDir;

    // prevent overscroll left

    if (newLeft < 0) newLeft = 0;
    if (newLeft + parseInt(vB[2]) >= mapWidth)
      newLeft = mapWidth - parseInt(vB[2]);

    map.setAttributeNS(
      null,
      "viewBox",
      `${newLeft} ${vB[1]} ${vB[2]} ${vB[3]} `
    );
  },
};

window.addEventListener(
  "message",
  (message) => {
    // register map
    let map = document.getElementById("map");

    switch (message.data.event) {
      case "resetSVG":
        SVGMethods.resetSVG(map, message);
        break;
      case "zoomSVG":
        SVGMethods.zoomSVG(map, message);
        break;
      case "panSVGV":
        SVGMethods.panSVGV(map, message);
        break;
      case "panSVGH":
        SVGMethods.panSVGH(map, message);
        break;
      case "changeCellColor":
        SVGMethods.changeCellColor(map, message);
        break;
    }
  },
  false
);
