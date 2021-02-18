module.exports = {
  terrain: {
    seed: 0.10440970585212783,
    npts: 100, //75, //16384,
    height: 1000,
    width: 1000,
    terrainIterations: 5,
    peakCount: 4,
    ncities: 0, //15,
    nterrs: 0, //5,
  },
  renderer: {
    fontsizes: {
      region: 40,
      city: 25,
      town: 20,
    },
  },
  moveSize: 20,
  cellSize: 20,
  renderGrid: true,

  extent: {
    width: 1,
    height: 1,
  },

  mapName: 'map',
};
