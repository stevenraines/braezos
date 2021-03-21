import ClientBase from './clientBass.class';
import axios from 'axios';
export default class PlayerClient extends ClientBase {
  constructor(params) {
    params.apiBase = `/api/player`;
    super(params);
  }

  async syncFromServer() {
    let query = {
      name: this.name,
      socketId: this.socketId,
    };

    if (this.id) query.id = this.id;
    let res = await axios.post(this.apiBase, query);
    this.deserialize(res.data);
    if (!this.position && this.startPosition) {
      this.position = this.startPosition;
    }
  }

  async move(vector) {
    this.position.x = parseInt(this.position.x) + vector.x;
    this.position.y = parseInt(this.position.y) + vector.y;
    this.position.d = parseInt(this.position.d) + vector.d;
    let resp = await axios.post(this.apiBase + '/act', {
      action: 'move',
      name: this.name,
      position: this.position,
    });

    return resp;
  }
}
