import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom'
import Measure from 'react-measure';
import cloneNode from './utils/cloneNode';

// import createResizeDetector from 'element-resize-detector';
import { merge, debounce, throttle } from 'lodash';

// const resizeDetector = createResizeDetector();

const maxAttempts = 1000;

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
    transition: '200ms ease-in',
    height: '100%',
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
    this._setDOMNode();
  }

  _setDOMNode = () => {
    this._node = ReactDOM.findDOMNode(this);
  };

  get fits() {
    const { fontSize, settings } = this.state;
    const { min, max } = settings.fontSize;

    const overflowing = isOverflowing(this._node);

    if (overflowing && fontSize <= max) {
      return false;
    }

    return fontSize <= min || fontSize >= max;
  }

  render() {
    let fontSize = this.state.fontSize;
    const { style, children } = this.props;
    // const fontSizeWithUnit = `${fontSize}${this.props.fontSize.unit}`;

    return (
      <Measure>
        {(dimensions) => {
          if (this._node) {
            const {clone } = cloneNode(this._node, {
              display: 'block',
              width: this._node.clientWidth,
              height: this._node.clientHeight,
            });

            clone.style.transition = 'none';

            let floor = 1;
            let ceiling = 1000;
            let newFontSize = parseInt(clone.style.fontSize, 10);

            for (let i = 0; i < maxAttempts; i++) {
              if (ceiling - floor < 1) break;

              if (isOverflowing(clone)) {
                ceiling = newFontSize;
              } else {
                floor = newFontSize;
              }

              newFontSize = (floor + ceiling) / 2;
              clone.style.fontSize = `${newFontSize}px`;

              forceRedraw(clone);

              fontSize = newFontSize;
            }
          }

          return (
            <div
              style={{
                ...style,
                fontSize,
              }}
            >
              {children}
            </div>
          );
        }}
      </Measure>
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
