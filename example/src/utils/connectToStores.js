import React from 'react';
import copyStatics from 'copy-statics';

export default function connectToStores(flux, spec) {
  const stateGetters = Object.keys(spec).map(key => ({store: flux.getStore(key), getter: spec[key]}));

  function collectState(props) {
    return stateGetters.reduce((state, {store, getter}) => {
      return Object.assign(state, getter(store, props));
    }, {});
  }

  return copyStatics(
    Component => class ConnectedComponent extends React.Component {
      constructor(props) {
        super(props);

        this.state = collectState(props);
        this.unmounted = false;

        this.listener = () => {
          if (this.unmounted) return;
          this.setState(collectState(this.props));
        };
      }

      componentWillMount() {
        this.unmounted = false;
        stateGetters.forEach(({store}) => store.on('change', this.listener));
      }

      componentWillUnmount() {
        this.unmounted = true;
        stateGetters.forEach(({store}) => store.removeListener('change', this.listener));
      }

      render() {
        return <Component {...this.state} {...this.props} />;
      }
    }
  );
}
