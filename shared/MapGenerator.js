/* 
Map generation strategy:

1. Generate Delauney/Voronoi diagrams for the size of the visible area
2. Relax cells
3. Set any cell touching the outer border to be water (ocean)
4. Loop through each cell, determining distance from map center.

*/

const d3 = require("d3");
const _ = require("lodash");
_.assign(d3, require("d3-voronoi"));
const PriorityQueue = require("js-priority-queue");
const Delaunay = require("d3-delaunay").Delaunay;
const seedrandom = require("seedrandom");
const Names = require("./names");
const TerrainTypes = require("./enums/terrainTypes");
const MathHelper = require("./helpers/math");
const { param } = require("../server/api");

var defaultExtent = {
  width: 1,
  height: 1,
};

const MapGenerator = {
  renderTerrainLinks: function(svg, links) {
    svg
      .append("g")
      .selectAll("circle")
      .data(links)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", (d) => {
        return d ? d[0][0] : null;
      })
      .attr("cy", (d) => {
        return d ? d[0][1] : null;
      })
      .attr("fill", "green")
      .attr("stroke", "green");
  },
  renderTerrainCells: function(svg, cells) {
    for (cell in cells) {
      let fillColor = cells[cell].terrainType.color;
      let strokeColor = "#333333";
      var i = 0;
      svg
        .append("g")
        .selectAll("path")
        .data([cells[cell]])
        .enter()
        .append("path")
        .attr("id", function(d) {
          return `cell-${d.id.toString().padStart(5, "0")}`;
        })
        .attr("onclick", function(d) {
          return `window.parent.postMessage({ event: 'click', cellIndex: ${d.id.toString()}, elementId: this.id }, '*')`;
        })
        .attr("d", (d) => {
          let path = `M ${d.polygons.join(" L ")} Z`.replace(",", " ");
          return path;
        })
        .attr("fill", fillColor)
        .attr("stroke", strokeColor);

      i++;
    }
  },
  renderTerrainLabels: function(svg, cells) {
    // console.log("RENDER LABELS");

    for (cell in cells) {
      if (cells[cell].isEdge) continue;

      svg
        .append("g")
        .selectAll("text")
        .data([cells[cell]])
        .enter()

        .append("text")
        .attr("id", (d) => {
          return `label-${d.id}`;
        })
        .attr("x", (d) => {
          return d ? d.point[0] - 8 : null;
        })
        .attr("y", (d) => {
          return d ? d.point[1] + 3 : null;
        })
        //.attr("dy", ".35em")
        .attr("font-size", ".75em")
        .text(function(d) {
          return Names.getPlaceName(d.id); // this will be the name, eventually
        });
    }
  },
  renderTerrain: function(svg, terrainData, params) {
    var width = svg.attr("width");
    svg.attr("height", params.height);
    //svg.attr("height", (width * params.extent.height) / params.extent.width);
    svg.attr("id", "map");
    svg.attr("seed", params.seed);
    svg.attr("viewBox", `0 0 ${params.width} ${params.height}`);
    svg.attr(
      "onload",
      `window.parent.postMessage({ event: 'register', elementId: this.id }, '*')`
    );
    svg.selectAll().remove();

    svg
      .append("script")
      .attr("href", "../svgscript.js")
      .attr("type", "text/javascript");

    MapGenerator.renderTerrainCells(svg, terrainData.cells);

    MapGenerator.renderTerrainLabels(svg, terrainData.cells);

    /*
    if (terrainData.points.length < 100)
     
    */
    // MapGenerator.renderTerrainLinks(svg, terrainData.edges);
  },
  /* recalculate the center of a cell based on verticies, then regenerate the cell shape.
  

  */
  lloydRelaxCells: function(terrain, params) {
    for (cell in terrain.cells) {
      terrain.cells[cell].point = MathHelper.centroid(
        terrain.cells[cell].polygons
      );
      terrain.points[cell] = terrain.cells[cell].point;
    }
    MapGenerator.generateVoronoiCells(terrain, params);
  },
  isEdge: function(polygons, params) {
    for (var i = 0; i < polygons.length; i++) {
      if (
        polygons[i][0] === 0 ||
        polygons[i][1] === 0 ||
        polygons[i][0] === params.width ||
        polygons[i][1] === params.height
      )
        return true;
    }
    return false;
  },
  calculateTerrainType: function(cell, params) {
    // if we are at the edge, set the TerrainType to OCEAN
    let terrainType =
      cell.isEdge && cell.terrainType != TerrainTypes.PEAK
        ? TerrainTypes.OCEAN
        : _.get(cell, "terrainType", TerrainTypes.LAND);
    var i = 0;
    let distPercent = cell.peakDistance / (params.width / 2);
    let varDist = (params.rng() - 0.25) * 0.25;
    if (distPercent > 0.5 + varDist) {
      terrainType = TerrainTypes.OCEAN;
    }

    return terrainType;
  },
  assignCoast: function(cells) {
    for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      let cell = cells[cellIndex];
      if (cell.terrainType != TerrainTypes.OCEAN) {
        for (
          let neighborIndex = 0;
          neighborIndex < cell.neighbors.length;
          neighborIndex++
        ) {
          if (
            cells[cell.neighbors[neighborIndex]].terrainType ==
              TerrainTypes.OCEAN &&
            cells[cellIndex].terrainType == TerrainTypes.LAND
          ) {
            cells[cellIndex].terrainType = TerrainTypes.COAST;
          }
        }
      }
    }
  },
  assignCities: function(cells) {
    for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      if (
        cells[cellIndex].terrainType == TerrainTypes.LAND &&
        cells[cellIndex].neighbors.length >= 9
      ) {
        cells[cellIndex].terrainType = TerrainTypes.CITY;
      }
    }
  },
  assignOcean: function(cells, params) {
    for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      cells[cellIndex].terrainType = MapGenerator.calculateTerrainType(
        cells[cellIndex],
        params
      );
    }
  },
  assignPeaks: function(cells, params, terrain) {
    params.peaks = [];
    let wUnit = (params.width / params.peakCount) * 0.9;
    let hUnit = params.width * 0.9;

    for (var peakCount = 0; peakCount < params.peakCount; peakCount++) {
      let pX = params.rng() * wUnit + peakCount * wUnit + params.width * 0.05;
      let pY = params.rng() * hUnit + params.width * 0.05;

      params.peaks.push([Math.floor(pX), Math.floor(pY)]);
    }

    for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      cells[cellIndex].peakDistance = cells[cellIndex].centerDistance;

      for (var peakIndex = 0; peakIndex < params.peaks.length; peakIndex++) {
        let peakPosition = params.peaks[peakIndex];

        if (
          terrain.voronoi.contains(cellIndex, peakPosition[0], peakPosition[1])
        ) {
          console.log(
            `${cellIndex}, ${peakPosition[0]}, ${peakPosition[1]} done`
          );
          cells[cellIndex].terrainType = TerrainTypes.PEAK;
        }

        let distanceToPeak = MathHelper.calculate2DDistance(
          { x: cells[cellIndex].point[0], y: cells[cellIndex].point[1] },
          { x: peakPosition[0], y: peakPosition[1] }
        );

        if (distanceToPeak < cells[cellIndex].peakDistance) {
          cells[cellIndex].peakDistance = distanceToPeak;
        }
      }
    }
  },
  generateVoronoiCells: function(terrain, params) {
    let delaunay = Delaunay.from(terrain.points);
    terrain.voronoi = delaunay.voronoi([0, 0, params.width, params.height]);

    for (var cellIndex = 0; cellIndex < terrain.points.length; cellIndex++) {
      let polygonList = terrain.voronoi.cellPolygon(cellIndex);
      let neighbors = [...terrain.voronoi.neighbors(cellIndex)];

      let cell = {
        id: cellIndex,
        point: terrain.points[cellIndex],
        peakDistance: 0,
        centerDistance: MathHelper.calculate2DDistance(
          MathHelper.convertArrayOfArraysOf2DPointsToArrayOfXY([
            terrain.points[cellIndex],
          ])[0],
          params.mapCenter
        ),
        area: MathHelper.calcPolygonArea(
          MathHelper.convertArrayOfArraysOf2DPointsToArrayOfXY(polygonList)
        ),
        polygons: polygonList,
        neighbors: [],
        properties: {},
        elevation: 0,
      };
      cell.isEdge = MapGenerator.isEdge(cell.polygons, params);
      for (neighborIndex in neighbors) {
        cell.neighbors.push(neighbors[neighborIndex]);
      }

      terrain.cells[cellIndex] = cell;
    }
  },

  /* generateTerrain
    produce the terrain for the map.

  */
  generateCells: function(terrain, params) {
    MapGenerator.generateVoronoiCells(terrain, params);
    for (var i = 0; i < params.terrainIterations; i++) {
      MapGenerator.lloydRelaxCells(terrain, params);
    }
    MapGenerator.assignPeaks(terrain.cells, params, terrain);
    MapGenerator.assignOcean(terrain.cells, params);
    MapGenerator.assignCoast(terrain.cells);
    MapGenerator.assignCities(terrain.cells);
  },
  generateTerrain: function(params) {
    // generate the map data structure
    let terrain = { params, cells: [] };

    // generate random points based on the number of points identfied by the map,
    // then generate a Delaunay / Voronoi diagram.
    terrain.points = d3
      .range(params.npts)
      .map((d) => [params.rng() * params.width, params.rng() * params.height]);

    // Relax points until territories are regular.
    MapGenerator.generateCells(terrain, params);

    /*
    var i = 0;
    for (cell in terrain.cells) {
      if (i > params.npts - 3) console.log(terrain.cells[cell]);
      i++;
    }
*/
    return terrain;
  },
  generateMap: function(svg, params) {
    params.rng = seedrandom(params.seed);

    params.mapCenter = { x: params.width / 2, y: params.height / 2 };

    let terrainData = MapGenerator.generateTerrain(params);
    //console.log(terrainData);
    MapGenerator.renderTerrain(svg, terrainData, params);
  },
};

module.exports = MapGenerator;
