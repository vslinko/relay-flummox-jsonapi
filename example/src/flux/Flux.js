import {Rele} from '../../..';
import ItemActions from './ItemActions';
import ItemStore from './ItemStore';
import CategoryReleActions from './CategoryReleActions';
import ItemsReleActions from './ItemsReleActions';

export default class Flux extends Rele {
  constructor() {
    super();

    this.createReleActions('category', CategoryReleActions);
    this.createReleActions('items', ItemsReleActions);
    this.createActions('item', ItemActions, this);
    this.createStore('item', ItemStore, this);
  }
}
