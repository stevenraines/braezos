export default class ClientBase {
  constructor(params) {
    this.deserialize(params);
  }

  deserialize(data) {
    for (const [key, value] of Object.entries(data)) {
      if (!key.startsWith('__')) this[key] = value;
    }
  }

  serialize() {
    let data = {};
    for (const [key, value] of Object.entries(this)) {
      if (!key.startsWith('__')) data[key] = value;
    }
    return data;
  }

  act(request) {
    if (this[request.action]) return this[request.action](request);
  }
}
