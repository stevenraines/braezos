// base class for all entities in the system. Contains ONLY system related info

import { v4 as uuidv4 } from 'uuid';

const Base = class Base {
  constructor(config, storeName) {
    this.className = this.constructor
      .toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];

    this.updateTime = new Date().toISOString();
    this._storeName = storeName ? storeName : this.className.toLowerCase();

    this.config = config ? config : { id: null };

    this.id = uuidv4();
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
      data[key] = value;
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

export default Base;
