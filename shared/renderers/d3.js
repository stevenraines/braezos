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
  renderMap: async function(player) {
    let mapSvg = d3
      .create('svg')
      .attr('id', 'map')
      .attr('height', this.height)
      .attr('width', this.width);

    // render the map cells. for overland this is voronoi. for interiors, grids.
    this.renderCells(mapSvg, this.mapData, player.location);
    this.renderPlayer(mapSvg, player);

    // set the pan of the map to focus on the place
    this.scrollToPlace(mapSvg, player.position);
    return this.serializeSVG(mapSvg.node());
  },
  serializeSVG: function(d3Node) {
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(d3Node);
    return source;
  },
  scrollToPlace: function(svg, position, zoom) {
    //get coordinates of place.
    if (!zoom) zoom = 1;

    let width = this.width * zoom;
    let height = this.height * zoom;
    let startX = 0;
    let startY = 0;

    startX = position[0] - width / 2;
    startY = position[1] - height / 2;

    svg.attr('viewBox', `${startX} ${startY} ${width} ${height}`);
  },
  renderPlayer(svg, playerData) {
    console.log(playerData);
    svg
      .append('circle')
      .attr('id', 'player')
      .style('stroke', 'gray')
      .style('fill', 'black')
      .attr('r', 10)
      .attr('cx', playerData.position[0])
      .attr('cy', playerData.position[1]);
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
