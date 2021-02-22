import Base from './base.class';
import { EventBus } from '../eventbus.js';
import _ from 'lodash';
import MOVE_VECTORS from '../enums/moveVectors';

const Input = class Input extends Base {
  constructor() {
    super();
    EventBus.$on('keyevent', this.handleKeyEvent);
  }

  async handleKeyEvent(message) {
    let event = message.event;
    let status = {
      renderLevel: false,
    };

    if (
      event.srcElement.tagName != 'TEXTAREA' &&
      event.srcElement.tagName != 'INPUT'
    ) {
      status = _.merge(status, await Input.handlePlayerMove(event));
    }

    if (status.renderLevel) EventBus.$emit('RenderLevel');
  }

  static async handlePlayerMove(event) {
    let vector = MOVE_VECTORS.NONE;
    switch (event.code) {
      case 'ArrowUp':
        vector = MOVE_VECTORS.N;
        break;
      case 'ArrowDown':
        vector = MOVE_VECTORS.S;
        break;
      case 'ArrowRight':
        vector = MOVE_VECTORS.E;
        break;
      case 'ArrowLeft':
        vector = MOVE_VECTORS.W;
        break;
    }

    await window.GameEngine.Player.move(vector);
    return {
      renderLevel: !(vector == MOVE_VECTORS.NONE),
    };
  }
};
export default Input;
