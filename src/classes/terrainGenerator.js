/* TerrainGenerator

    Generates overworld terrain using Voronoi diagrams
*/
import * as d3 from 'd3';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

//_.assign(d3, require('d3-voronoi'));
import { Delaunay } from 'd3-delaunay';
import seedrandom from 'seedrandom';
import TerrainTypes from '../enums/terrainTypes';
import MathHelper from '../helpers/math';

const TerrainGenerator = class {
  constructor(params) {
    this.params = params;
    this.rng = seedrandom();
    this.delauney = null;

    this.terrain = {
      mapCenter: { x: this.params.width / 2, y: this.params.height / 2 },
      territories: [],
      points: [],
    };
    this.voronoi = null;

    this.extant = {
      width: 1,
      height: 1,
    };
  }
  generateTerrain(seed) {
    if (seed) this.rng = seedrandom(seed);

    // generate random points based on the number of points identfied by the map,
    // then generate a Delaunay / Voronoi diagram.
    this.terrain.points = d3
      .range(this.params.npts)
      .map(() => [
        this.rng() * this.params.width,
        this.rng() * this.params.height,
      ]);
    this.generateTerritories();
    this.setStartLocation();
    return this.terrain;
  }

  generateTerritories() {
    this.generateVoronoiCells();
    for (var i = 0; i < this.params.terrainIterations; i++) {
      this.lloydRelaxCells();
    }
    this.assignPeaks();
    this.assignOcean();
    this.assignCoast();
  }

  generateVoronoiCells() {
    this.delaunay = Delaunay.from(this.terrain.points);
    this.voronoi = this.delaunay.voronoi([
      0,
      0,
      this.params.width,
      this.params.height,
    ]);

    for (
      var territoryIndex = 0;
      territoryIndex < this.terrain.points.length;
      territoryIndex++
    ) {
      let polygonList = this.voronoi.cellPolygon(territoryIndex);
      let neighbors = [...this.voronoi.neighbors(territoryIndex)];

      let uuid = uuidv4();

      let territory = {
        index: territoryIndex,
        id: territoryIndex,
        uuid: uuid,
        seed: seedrandom(uuid),
        elementId: `cell-${territoryIndex.toString().padStart(5, '0')}`,
        point: this.terrain.points[territoryIndex],
        peakDistance: 0,
        centerDistance: MathHelper.calculate2DDistance(
          MathHelper.convertArrayOfArraysOf2DPointsToArrayOfXY([
            this.terrain.points[territoryIndex],
          ])[0],
          this.terrain.mapCenter
        ),
        area: MathHelper.calcPolygonArea(
          MathHelper.convertArrayOfArraysOf2DPointsToArrayOfXY(polygonList)
        ),
        polygons: polygonList,
        neighbors: [],
        properties: {},
        elevation: 0,
      };
      territory.isEdge = this.isEdge(territory.polygons);
      for (let neighborIndex in neighbors) {
        territory.neighbors.push(neighbors[neighborIndex]);
      }

      this.terrain.territories[territoryIndex] = territory;
    }
  }

  lloydRelaxCells() {
    let newPoints = Array(this.terrain.territories.length);
    for (let territoryIndex in this.terrain.territories) {
      newPoints[territoryIndex] = MathHelper.centroid(
        this.terrain.territories[territoryIndex].polygons
      );
    }
    this.terrain.points = newPoints;
    this.generateVoronoiCells();
  }

  isEdge(polygons) {
    for (var i = 0; i < polygons.length; i++) {
      if (
        polygons[i][0] === 0 ||
        polygons[i][1] === 0 ||
        polygons[i][0] === this.params.width ||
        polygons[i][1] === this.params.height
      )
        return true;
    }
    return false;
  }

  calculateTerrainType(territory) {
    // if we are at the edge, set the TerrainType to OCEAN
    let terrainType =
      territory.isEdge && territory.terrainType != TerrainTypes.PEAK
        ? TerrainTypes.OCEAN
        : _.get(territory, 'terrainType', TerrainTypes.LAND);

    let distPercent = territory.peakDistance / (this.params.width / 2);
    let varDist = (this.rng() - 0.25) * 0.25;
    if (distPercent > 0.5 + varDist) {
      terrainType = TerrainTypes.OCEAN;
    }

    return terrainType;
  }
  assignCoast() {
    for (
      var territoryIndex = 0;
      territoryIndex < this.terrain.territories.length;
      territoryIndex++
    ) {
      let territory = this.terrain.territories[territoryIndex];
      if (territory.terrainType != TerrainTypes.OCEAN) {
        for (
          let neighborIndex = 0;
          neighborIndex < territory.neighbors.length;
          neighborIndex++
        ) {
          if (
            this.terrain.territories[territory.neighbors[neighborIndex]]
              .terrainType == TerrainTypes.OCEAN &&
            this.terrain.territories[territoryIndex].terrainType ==
              TerrainTypes.LAND
          ) {
            this.terrain.territories[territoryIndex].terrainType =
              TerrainTypes.COAST;
          }
        }
      }
    }
  }

  assignOcean() {
    for (
      var territoryIndex = 0;
      territoryIndex < this.terrain.territories.length;
      territoryIndex++
    ) {
      this.terrain.territories[
        territoryIndex
      ].terrainType = this.calculateTerrainType(
        this.terrain.territories[territoryIndex]
      );
    }
  }
  assignPeaks() {
    this.terrain.peaks = [];
    let wUnit = (this.params.width / this.params.peakCount) * 0.9;
    let hUnit = this.params.width * 0.9;

    for (var peakCount = 0; peakCount < this.params.peakCount; peakCount++) {
      let pX =
        this.rng() * wUnit + peakCount * wUnit + this.params.width * 0.05;
      let pY = this.rng() * hUnit + this.params.width * 0.05;

      this.terrain.peaks.push([Math.floor(pX), Math.floor(pY)]);
    }

    for (
      var territoryIndex = 0;
      territoryIndex < this.terrain.territories.length;
      territoryIndex++
    ) {
      this.terrain.territories[
        territoryIndex
      ].peakDistance = this.terrain.territories[territoryIndex].centerDistance;

      for (
        var peakIndex = 0;
        peakIndex < this.terrain.peaks.length;
        peakIndex++
      ) {
        let peakPosition = this.terrain.peaks[peakIndex];

        if (
          this.voronoi.contains(
            territoryIndex,
            peakPosition[0],
            peakPosition[1]
          )
        ) {
          this.terrain.territories[territoryIndex].terrainType =
            TerrainTypes.PEAK;
        }

        let distanceToPeak = MathHelper.calculate2DDistance(
          {
            x: this.terrain.territories[territoryIndex].point[0],
            y: this.terrain.territories[territoryIndex].point[1],
          },
          { x: peakPosition[0], y: peakPosition[1] }
        );

        if (
          distanceToPeak < this.terrain.territories[territoryIndex].peakDistance
        ) {
          this.terrain.territories[
            territoryIndex
          ].peakDistance = distanceToPeak;
        }
      }
    }
  }
  setStartLocation() {
    // get starting location
    let coastLocations = _.filter(this.terrain.territories, territory => {
      return territory.terrainType.name == TerrainTypes.COAST.name;
    });

    this.terrain.startingTerrainIndex =
      coastLocations[Math.floor(this.rng() * coastLocations.length)].id;
  }
};
export default TerrainGenerator;
