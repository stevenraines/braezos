module.exports = {
  cleanObservable: function(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
};
