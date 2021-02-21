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
    const state = this.state[this.storeName];
    for (const [key, value] of Object.entries(state)) {
      this[key] = value;
    }
  }

  saveState() {
    let data = {};
    for (const [key, value] of Object.entries(this)) {
      data[key] = value;
    }
    this.store.commit(`${this.storeName}/saveState`, data);
  }
};

export default Base;
