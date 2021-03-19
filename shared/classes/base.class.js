// base class for all entities in the system. Contains ONLY system related info

const { v4: uuidv4 } = require('uuid');

const Base = class Base {
  constructor(config, storeName) {
    this.className = this.constructor
      .toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];

    console.log('Base Config', config);
    this.updateTime = new Date().toISOString();
    this._storeName = storeName;
    this.config = config ? config : { id: null };
    this.id = this.config.id ? this.config.id : uuidv4();
    this.name = this.config.name ? this.config.name : this.id;
  }

  get engine() {
    return window.GameEngine;
  }

  get storeName() {
    return this._storeName ? this._storeName : this.className.toLowerCase();
  }

  get store() {
    return window.GameEngine.$store;
  }

  get state() {
    return window.GameEngine.$store.state;
  }

  get controllers() {
    return window.GameEngine.$data.controllers;
  }

  serialize() {
    return this.getKeyData(this);
  }
  deserialize(data) {
    this.load(data);
  }

  static load(data) {
    for (const [key, value] of Object.entries(data)) {
      if (!key.startsWith('__')) this[key] = value;
    }
  }

  loadState() {
    if (!this.storeName)
      return this.engine.log(`${this.className} is not a persistant class.`);

    this.engine.log(this.state[this.storeName]);
    if (!this.state[this.storeName].singleton) {
      this.engine.log('This is a collection class');
      return false;
    }

    const state = this.state[this.storeName];

    this.getKeyData(state, this);
  }

  save() {
    this.saveState();
  }

  saveState() {
    if (!this.storeName)
      return this.engine.log(`${this.className} is not a persistant class.`);
    if (!this.state[this.storeName].singleton) {
      this.engine.log('This is a collection class');
      return false;
    }
    this.updateTime = new Date().toISOString();
    this.store.commit(`${this.storeName}/saveState`, this.getKeyData(this));
  }

  getKeyData(obj, data) {
    if (!data) data = {};
    for (const [key, value] of Object.entries(obj)) {
      if (!key.startsWith('__')) data[key] = value;
    }
    return data;
  }

  static get className() {
    var classname = this.toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];

    return classname;
  }
};

module.exports = Base;
