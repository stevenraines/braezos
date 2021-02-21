import { EventBus } from '../eventbus.js';
import MOVE_VECTORS from '../enums/moveVectors';
import _ from 'lodash';

const InputController = class {
  constructor() {
    EventBus.$on('keyevent', this.handleKeyEvent);
  }

  async handleKeyEvent(message) {
    let event = message.event;
    let controllers = message.controllers;
    let status = {
      renderLevel: false,
    };

    if (
      event.srcElement.tagName != 'TEXTAREA' &&
      event.srcElement.tagName != 'INPUT'
    ) {
      // check for move commands
      status = _.merge(
        status,
        await InputController.handlePlayerMove(controllers, event)
      );
    }

    if (status.renderLevel) EventBus.$emit('RenderLevel');
  }

  static async handlePlayerMove(controllers, event) {
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

    await controllers.EnvironmentController.player.move(vector);
    return {
      renderLevel: !(vector == MOVE_VECTORS.NONE),
    };
  }
};

export default InputController;
