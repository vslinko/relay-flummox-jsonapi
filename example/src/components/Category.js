import React from 'react';
import Item from './Item';
import {ql} from '../../../lib/ql';
import flux from '../flux';
import newItem from '../utils/newItem';

export default class Category extends React.Component {
  static queries = {
    category: ql`
      Category {
        id,
        title,
        subtitle,
        items() {
          id,
          ${Item.queries.item()}
        },
        avatar : Avatar {
          url
        }
      }
    `
  };

  createItem() {
    flux.getActions('item').createItem(newItem({
      attributes: {
        title: String(Math.random())
      },
      relationships: {
        category: {
          data: {
            type: 'Category',
            id: this.props.category.id
          }
        }
      }
    }));
  }

  renderItem(item, index) {
    return (
      <div key={item.id || `unsaved${index}`}>
        {item.id || 'Saving'}
        &nbsp;
        <Item item={item} />
      </div>
    );
  }

  render() {
    const {category} = this.props;

    return (
      <div>
        <img src={category.avatar.url} />
        <h1>{category.title}</h1>
        <h2>{category.subtitle}</h2>
        <button onClick={::this.createItem}>Create New</button>
        {category.items.map(::this.renderItem)}
      </div>
    );
  }
}
