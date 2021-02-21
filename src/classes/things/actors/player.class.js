import Actor from '../actor.class';

export default class extends Actor {
  constructor(config) {
    super(config, 'player');
    this.loadState();
  }
}
