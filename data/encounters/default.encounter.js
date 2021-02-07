const Location = {
  name: "default",
  events: {
    default: {
      title: "Nowhere in particular",
      text: "There is nothing special here.",
      actions: {},
    },
    visited: {
      title: "Nowhere in particular",
      text: "This place looks familiar.",
      actions: {},
    },
  },
};

Location.events.start = Location.events.default;

module.exports = Location;
