// base class for all entities in the system. Contains ONLY system related info

import { v4 as uuidv4 } from 'uuid';

const Base = class {
  constructor(config, storeName) {
    this.config = config || {};
    this.id = uuidv4();
    this.storeName = storeName;
  }

  get engine() {
    return window.GameEngine;
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
    if (!this.state[this.storeName].singleton) {
      console.log('This is a collection class');
      return false;
    }

    const state = this.state[this.storeName];

    this.getKeyData(state, this);
  }

  saveState() {
    if (!this.state[this.storeName].singleton) {
      console.log('This is a collection class');
      return false;
    }

    this.store.commit(`${this.storeName}/saveState`, this.getKeyData(this));
  }

  getKeyData(obj, data) {
    if (!data) data = {};
    for (const [key, value] of Object.entries(obj)) {
      data[key] = value;
    }
    return data;
  }
};

export default Base;
