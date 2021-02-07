const _ = require("lodash");

const Location = _.merge(require("./default.location"), {
  name: "start",

  events: {
    start: {
      title: "Adventure Awaits",
      text: "You wash ashore on the strange island.",
      actions: {},
    },
    visited: {
      title: "First footprints",
      text: "This is where you first landed on the island.",
      actions: {},
    },
  },
});

console.log(Location);
module.exports = Location;
