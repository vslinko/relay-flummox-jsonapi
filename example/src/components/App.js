import React from 'react';
import Category from './Category';
import {ql} from '../../..';
import relePreload from '../../../relePreload';
import flux from '../flux';
import connectToStores from '../utils/connectToStores';

@relePreload(flux)
@connectToStores(flux, {
  rele: (store) => ({
    requestsCount: store.getRequestsCount(),
    category: store.fulfill(App.queries.category())
  })
})
export default class App extends React.Component {
  static queries = {
    category: ql`
      category(id: ${"2"}) {
        ${Category.queries.category()}
      }
    `
  };

  render() {
    if (!this.props.category) {
      return null;
    }

    return (
      <div>
        <Category category={this.props.category} />
        {this.props.requestsCount > 0 && `Saving ${this.props.requestsCount}`}
      </div>
    );
  }
}
