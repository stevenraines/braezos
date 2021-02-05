const Names = {
  placeNames: [
    "Devex",
    "Albrecht",
    "Eswhile",
    "Weir",
    "Cambon",
    "Poren",
    "Excam",
    "Hefwey",
    "Myrwey",
    "Fenboggen",
    "Islea",
    "Leawood",
    "Harwarren",
    "Kilchester",
    "Arbehn",
    "Farwater",
    "Illhust",
    "Redwich",
    "Cloust",
    "Salschester",
    "Truwich",
    "Mehrshire",
    "Gnollhaven",
    "Credworth",
    "Quinciney",
    "Lormeir",
    "Bakerswich",
    "Gnost",
    "Galesward",
  ],

  getPlaceName: function (index) {
    if (index > Names.placeNames.length - 1) return index;
    return Names.placeNames[index];
  },
};

module.exports = Names;
