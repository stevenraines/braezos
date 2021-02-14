const d3 = require('d3');

const D3Renderer = {
  params: null,
  mapData: null,
  height: null,
  width: null,
  zoom: 1,
  init: function(mapData, params, height, width) {
    this.mapData = mapData;
    this.params = params;
    this.height = height;
    this.width = width;
  },
  renderGrid: async function(svg, width, height, gridSize) {
    if (gridSize < 5) gridSize = 5;
    let gridColor = '#0000cc';
    let dataX = [];
    let dataY = [];
    for (var x = 0; x < width / gridSize; x++) {
      dataX.push([x * gridSize, 0, x * gridSize, height]);
    }
    for (var y = 0; y < height / gridSize; y++) {
      dataY.push([0, y * gridSize, width, y * gridSize]);
    }

    svg
      .append('g')
      .selectAll('path')
      .data(dataX)
      .enter()
      .append('path')
      .attr('stroke', gridColor)
      .attr('d', d => {
        let path = `M ${d[0]} ${d[1]} L ${d[2]} ${d[3]}`;

        return path;
      });

    svg
      .append('g')
      .selectAll('path')
      .data(dataY)
      .enter()
      .append('path')
      .attr('stroke', gridColor)
      .attr('d', d => {
        let path = `M ${d[0]} ${d[1]} L ${d[2]} ${d[3]}`;

        return path;
      });
  },
  renderMap: async function(player) {
    let mapSvg = d3
      .create('svg')
      .attr('id', 'map')
      .attr('stroke', '#000000');
    // render the map cells. for overland this is voronoi. for interiors, grids.

    this.renderTerritories(mapSvg, this.mapData, player.location);

    this.renderGrid(
      mapSvg,
      this.params.terrain.width,
      this.params.terrain.height,
      this.params.moveSize
    );

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
  scrollToPlace: function(svg, position) {
    //get coordinates of place.

    let width = this.width * this.zoom;
    let height = this.height * this.zoom;
    let startX = 0;
    let startY = 0;

    startX = position[0] - width / 2;
    startY = position[1] - height / 2;

    let viewBoxSize = `${startX} ${startY} ${width} ${height}`;

    svg.attr('viewBox', viewBoxSize);
  },
  renderPlayer(svg, playerData) {
    svg
      .append('circle')
      .attr('id', 'player')
      .style('stroke', 'gray')
      .style('fill', 'black')
      .attr('r', 10)
      .attr('cx', playerData.position[0])
      .attr('cy', playerData.position[1]);
  },
  renderTerritories: function(svg, terrain, place) {
    let territories = terrain.territories;
    for (var territoryIndex in territories) {
      let fillColor = territories[territoryIndex].terrainType.color;

      if (place.id == territories[territoryIndex].id) fillColor = 'orange';
      let strokeColor = '#333333';

      svg
        .append('g')
        .selectAll('path')
        .data([territories[territoryIndex]])
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
