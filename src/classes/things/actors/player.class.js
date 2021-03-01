import Actor from '../actor.class';

export default class Player extends Actor {
  constructor(config) {
    super(config, 'actor');
    this.keyQueue = null;
  }

  setPosition(cell) {
    this.currentCell = cell;
    super.setPosition(cell.position);
  }

  act() {
    window.GameEngine.Environment.lock();
    console.log(`player's turn`);
    /* wait for user input; do stuff when user hits a key */
    window.addEventListener('keydown', this);
  }

  handleEvent(e) {
    /* process user input */
    console.log(e);
    window.removeEventListener('keydown', this);
    window.GameEngine.Environment.unlock();
  }

  static getUsersPlayer() {
    let players = Actor.filter({ name: 'player1' }, 'actor');
    if (players.length == 1) {
      let player = new Player(players[0]);
      player.save();

      return player;
    }

    return null;
  }
}
