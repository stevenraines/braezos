const D3Node = require("d3-node");
const fs = require("fs");
const _ = require("lodash");
const MapGenerator = require("./MapGenerator");
let Braezos = {
  d3n: null,
  svg: null,

  init: function(params) {
    this.d3n = new D3Node(); // initializes D3 with container element
    this.svg = this.d3n.createSVG(params.height, params.width); // create SVG w/ 'g' tag and width/height
  },
  generateMap: function(params) {
    MapGenerator.generateMap(this.svg, params);
    return this.d3n.svgString(); // output: <svg width=10 height=20 xmlns="http://www.w3.org/2000/svg"><g></g></svg>
  },
  saveMap: async function(outputURL, svg) {
    fs.writeFileSync(outputURL, svg);
  },
  makeMapSVG: async function(params) {
    this.init(params);
    return this.generateMap(params);
  },
};

module.exports = Braezos;
