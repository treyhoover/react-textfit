import React, { PropTypes } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import cloneNode from './utils/cloneNode';
import { merge, debounce } from 'lodash';

// usually only needs about 10 attempts per resize with these settings
const PRECISION = 1;
const MAX_ATTEMPTS = 50;

const forceRedraw = (element) => {
    const disp = element.style.display;
    element.style.display = 'none';
    const trick = element.offsetHeight;
    element.style.display = disp;
};

const isOverflowing = (el) => {
    if (!el) throw new Error('Element is required');

    const overflowX = el.scrollWidth > el.clientWidth;
    const overflowY = el.scrollHeight > el.clientHeight;

    return overflowX || overflowY;
};

// necessary because react's default props won't do "deep" merges
const defaultProps = {
    fontSize: {
        min: 1,
        max: 400,
        unit: 'px',
    },
    style: {
        display: 'block',
        overflow: 'hidden',
        transition: '200ms ease-out',
        height: '100%',
        width: '100%',
    }
};

class Textfit extends React.Component {
  constructor(props) {
      super(props);

      const settings = merge(defaultProps, props);
      const { min, max } = settings.fontSize;

      this.state = {
          settings,
          fontSize: (min + max) / 2
      };
  }

  componentDidMount() {
    const onResize = debounce(this.resize, 200);

    this.resizeObserver = new ResizeObserver(onResize);
    this.resizeObserver.observe(this._node);
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect(this._node);
    this._node = null;
  }

  get fits() {
      const { fontSize, settings } = this.state;
      const { min, max } = settings.fontSize;

      const overflowing = isOverflowing(this._node);

      if (overflowing && fontSize <= max) {
          return false;
      }

      return fontSize <= min || fontSize >= max;
  }

  resize = () => {
      let fontSize = this.state.fontSize;
      const unit = this.props.fontSize.unit;

      if (this._node) {
          const { clone, cleanUp } = cloneNode(this._node, {
              display: 'block',
              width: this._node.clientWidth,
              height: this._node.clientHeight,
          });

          let floor = 1;
          let ceiling = 1000;
          let newFontSize = parseInt(clone.style.fontSize, 10);

          for (let i = 0; i < MAX_ATTEMPTS; i++) {
              if (ceiling - floor < PRECISION) break;

              if (isOverflowing(clone)) {
                  ceiling = newFontSize;
              } else {
                  floor = newFontSize;
              }

              newFontSize = (floor + ceiling) / 2;
              clone.style.fontSize = `${newFontSize}${unit}`;

              forceRedraw(clone); // needed to recalculate on some browsers

              fontSize = newFontSize;
          }

          // remove the temporary element tree from the DOM
          cleanUp();
      }

      this.setState({ fontSize });
  };

  bindRef = (_node) => {
    this._node = _node;

    // We don't need this initial resize call since ResizeObserver
    // appears to always fire when it initializes
    // this.resize();
  };

  render() {
      const { fontSize } = this.state;
      const { style, children } = this.props;
      const unit = this.props.fontSize.unit;

      return (
      <div
        ref={this.bindRef}
        style={{
            ...style,
            fontSize: `${fontSize}${unit}`,
        }}
      >
        {children}
      </div>
    );
  }
}

Textfit.propTypes = {
    fontSize: PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
        unit: PropTypes.oneOf(['px', 'vw']),
    }),
    style: PropTypes.object,
    children: PropTypes.string.isRequired,
};

Textfit.defaultProps = {
    fontSize: defaultProps.fontSize,
    style: defaultProps.style,
    children: '',
};

Textfit.displayName = 'Textfit';

export default Textfit;
