import Point from '../../../shared/classes/helpers/point.class';
import Item from '../../../shared/classes/things/item.class';
import Actor from '../../../shared/classes/things/actor.class';
import { EventBus } from '../../eventbus.js';
import _ from 'lodash';

const Cell = class Cell {
  constructor(coordinates, level) {
    this.position = new Point(coordinates);
    this.cellSize = level.cellSize;
    this.territoryIndex = null;
    this.terrainType = { name: 'none', color: 'black' };
    this.worldPosition = this.$getWorldPosition();
    this.structure = null;
  }

  get data() {
    return {
      position: this.position,
      cellSize: this.cellSize,
      territoryIndex: this.territoryIndex,
      terrainType: this.terrainType,
      worldPosition: this.worldPosition,
    };
  }

  isCellTraverable(actor) {
    // determine if the rules for the given player allow traversal
    if (!actor) return false;

    if (this.terrainType.name == 'ocean') return false;

    // we hit a blocking cell
    if (_.get(this, 'structure.type.blocking', false) == true) return false;

    // we hit an actor

    if (this.actors.length > 0) {
      EventBus.$emit('Interaction', { source: actor, target: this.actors[0] });
      return false;
    }

    return true;
  }

  // returns if the cell is visible from the selected position?
  visibleFrom(position, sightDistance) {
    // is it close enough?

    let distance = this.position.distanceFromInCells(position) + 0.5;

    if (distance >= sightDistance + 1) return false; // add one so we don't include the cell the player is on.
    // is anything blocking it?

    return true;
  }

  get inventory() {
    let ownedItems = Item.filter({ position: this.position }, 'item');
    this.itemCount = ownedItems.length;
    return ownedItems;
  }

  get actors() {
    let actors = Actor.filter({ position: this.position }, 'actor');
    return actors;
  }

  $getWorldPosition() {
    //let halfCell = this.cellSize / 2;
    return {
      x: this.position.x * this.cellSize + this.cellSize,
      y: this.position.y * this.cellSize + this.cellSize,
      d: this.position.d,
    };
  }
};

export default Cell;
