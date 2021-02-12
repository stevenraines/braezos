const d3 = require('d3');

const D3Renderer = {
  mapData: null,
  height: null,
  width: null,
  init: function(mapData, height, width) {
    this.mapData = mapData;
    this.height = height;
    this.width = width;
  },
  renderMap: async function(place) {
    let mapSvg = d3
      .create('svg')
      .attr('id', 'map')
      .attr('height', this.height)
      .attr('width', this.width);

    // render the map cells. for overland this is voronoi. for interiors, grids.
    this.renderCells(mapSvg, this.mapData, place);

    // set the pan of the map to focus on the place
    this.scrollToPlace(mapSvg, place);
    return this.serializeSVG(mapSvg.node());
  },
  serializeSVG: function(d3Node) {
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(d3Node);
    return source;
  },
  scrollToPlace: function(svg, place, zoom) {
    //get coordinates of place.
    if (!zoom) zoom = 1;

    let width = this.width * zoom;
    let height = this.height * zoom;
    let startX = 0;
    let startY = 0;

    startX = place.point[0] - width / 2;
    startY = place.point[1] - height / 2;

    svg.attr('viewBox', `${startX} ${startY} ${width} ${height}`);
  },
  renderCells: function(svg, mapData, place) {
    let cells = mapData.cells;
    for (var cell in cells) {
      let fillColor = cells[cell].terrainType.color;

      if (place.id == cells[cell].id) fillColor = 'orange';
      let strokeColor = '#333333';

      svg
        .append('g')
        .selectAll('path')
        .data([cells[cell]])
        .enter()
        .append('path')
        .attr('id', function(d) {
          return d.elementId;
        })
        .attr('onclick', function(d) {
          return `postMessage(event,{ source: '${svg.attr(
            'id'
          )}', event: 'click', terrainType: "${d.terrainType.name}", id: ${d.id.toString()},  elementId: this.id }, '*')`;
        })
        .attr('d', d => {
          let path = `M ${d.polygons.join(' L ')} Z`.replace(',', ' ');
          return path;
        })

        .attr('fill', fillColor)
        .attr('stroke', strokeColor);
    }
  },
};

module.exports = D3Renderer;