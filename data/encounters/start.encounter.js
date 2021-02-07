const _ = require("lodash");

module.exports = _.merge({}, require("./default.encounter"), {
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
