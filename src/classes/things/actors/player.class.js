import Actor from '../actor.class';

export default class Player extends Actor {
  constructor(config) {
    super(config, 'actor');
  }

  setPosition(cell) {
    this.currentCell = cell;
    super.setPosition(cell.position);
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
