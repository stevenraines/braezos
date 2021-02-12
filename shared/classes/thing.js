const Thing = _.merge({}, require("../base"), {
  location: null, // will be a reference to a Place
  attributes: [],
});

module.exports = Thing;
