import {Actions} from 'flummox';
import fetchJsonApi from '../utils/fetchJsonApi';

export default class CategoryReleActions extends Actions {
  fetch({id}, fields, include, parent) {
    return fetchJsonApi(`/api/categories/${id}`, fields, include);
  }

  static filter({id}, parent, store, flux) {
    return store.get('Category').get(id);
  }
}
