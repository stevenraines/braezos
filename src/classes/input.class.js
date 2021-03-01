import Base from './base.class';
import { EventBus } from '../eventbus.js';

import MOVE_VECTORS from '../enums/moveVectors';

const Input = class Input extends Base {
  constructor() {
    super();
    EventBus.$on('keyevent', this.handleKeyEvent);
  }

  // setup the specific keyboard commands.
  static get keybindings() {
    return {
      ArrowUp: { fn: Input.handlePlayerMove, data: MOVE_VECTORS.N },
      w: { fn: Input.handlePlayerMove, data: MOVE_VECTORS.N },
      ArrowDown: { fn: Input.handlePlayerMove, data: MOVE_VECTORS.S },
      s: { fn: Input.handlePlayerMove, data: MOVE_VECTORS.S },
      ArrowLeft: { fn: Input.handlePlayerMove, data: MOVE_VECTORS.W },
      a: { fn: Input.handlePlayerMove, data: MOVE_VECTORS.W },
      ArrowRight: { fn: Input.handlePlayerMove, data: MOVE_VECTORS.E },
      d: { fn: Input.handlePlayerMove, data: MOVE_VECTORS.E },
      g: {
        fn: function() {
          window.GameEngine.Player.pickup();
        },
      },
    };
  }

  static validActionKey(key) {
    return Input.keybindings[key] != null;
  }

  static handleKeys(keyQueue, event) {
    if (!keyQueue || keyQueue.length == 0) return;

    console.log(event);

    for (let keyIndex = 0; keyIndex < keyQueue.length; keyIndex++) {
      let keyBinding = Input.keybindings[keyQueue[keyIndex]];
      if (!keyBinding) continue;

      keyBinding.fn(keyBinding.data);
    }
  }

  static async handlePlayerMove(vector) {
    await window.GameEngine.Player.move(vector);
    return {
      renderLevel: !(vector == MOVE_VECTORS.NONE),
    };
  }
};
export default Input;
