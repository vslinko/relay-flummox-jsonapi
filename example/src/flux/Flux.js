import ImmutableRele from '../../../ImmutableRele';
import AppActions from './AppActions';
import ItemActions from './ItemActions';
import ItemStore from './ItemStore';
import CategoryReleActions from './CategoryReleActions';
import ItemsReleActions from './ItemsReleActions';

export default class Flux extends ImmutableRele {
  constructor() {
    super();

    this.createReleActions('category', CategoryReleActions);
    this.createReleActions('items', ItemsReleActions);
    this.createActions('app', AppActions, this);
    this.createActions('item', ItemActions, this);
    this.createStore('item', ItemStore, this);
  }
}
