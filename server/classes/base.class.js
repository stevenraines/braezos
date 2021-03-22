// base class for all entities in the system. Contains ONLY system related info

const { v4: uuidv4 } = require('uuid');

const Base = class Base {
  constructor(config, world) {
    this.className = this.constructor
      .toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];

    this.__world = world;
    this.updateTime = new Date().toISOString();

    this.config = config ? config : { id: null };
    this.id = this.config.id ? this.config.id : uuidv4();
    this.name = this.config.name ? this.config.name : this.id;
    this.storageToken = `${this.className}/${this.name}`;
  }

  get world() {
    return this.__world;
  }

  async save() {
    await this.__world.__storage.setItem(this.storageToken, this.serialize());
  }

  async load() {
    let obj = await this.__world.__storage.getItem(this.storageToken);

    if (obj) {
      this.deserialize(obj);
    } else {
      await this.save();
    }
  }

  async initialize() {
    await this.load();
  }

  serialize() {
    let data = {};
    for (const [key, value] of Object.entries(this)) {
      if (!key.startsWith('__')) data[key] = value;
    }
    return data;
  }
  deserialize(obj) {
    if (!obj) return;
    for (const [key, value] of Object.entries(obj)) {
      if (!key.startsWith('__')) this[key] = value;
    }
    return this;
  }

  static get className() {
    var classname = this.toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];

    return classname;
  }
};

module.exports = Base;
