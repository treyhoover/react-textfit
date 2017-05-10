import React, { PropTypes } from 'react';
// import createResizeDetector from 'element-resize-detector';
import { merge, debounce, throttle } from 'lodash';

// const resizeDetector = createResizeDetector();

const MAX_ATTEMPTS = 1000;

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
    overflow: 'scroll',
    transition: '200ms ease-in',
  }
};

class Textfit extends React.Component {
  constructor(props) {
    super(props);

    const settings = merge(defaultProps, props);
    const { min, max } = settings.fontSize;

    // super(merge(defaultProps, props));

    this.state = {
      settings,
      fontSize: (min + max) / 2,
      loaded: false,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  componentWillReceiveProps() {
    this.resize();
  }

  resize = () => {
    // // TODO: this is the function that breaks when used in combination with transitions
    // // most likely because we're manipulating refed elements directly :O
    // // doing it the "react" way should fix it

    return new Promise((resolve, reject) => {
      const { settings } = this.state;
      const el = this.ref;

      if (el) {
        let floor = settings.fontSize.min;
        let ceiling = settings.fontSize.max;
        let fontSize = floor;

        const minDelta = 1;
        const elStyles = getComputedStyle(el, null);
        const elTransition = elStyles.transition;

        // disable transitions while finding the font-size
        el.style.transition = '';

        for (let i = 0; i < MAX_ATTEMPTS; i++) {
          const delta = ceiling - floor;
          const overflowing = isOverflowing(el);
          console.log('resizing', { floor, ceiling, fontSize, overflowing });

          const newFontSize = floor + (delta / 2);

          el.style.fontSize = `${newFontSize}${this.props.fontSize.unit}`;

          fontSize = newFontSize;

          if (isOverflowing(el)) {
            ceiling = newFontSize;
          } else {
            floor = newFontSize;
          }

          // break if we're precise enough
          if (delta <= minDelta) {
            break;
          } else {
            // this.setState({ fontSize });
          }
        }

        el.transition = elTransition;

        this.setState({ fontSize }, () => {
          resolve({ fontSize });
        });
      } else {
        reject(new Error('Can\'t resize - ref not yet loaded'));
      }
    });
  };

  bindRef = (ref) => {
    this.ref = ref;

    // const onChange = debounce(() => {
    //   console.log('changed');
    //   this.resize();
    // }, 300);

    // resizeDetector.listenTo(this.ref, onChange);

    this.resize()
      .then(() => {
        this.setState({ loaded: true });
      })
      .catch(console.error);
  };

  render() {
    const { loaded, fontSize } = this.state;
    const { style, children } = this.props;
    const fontSizeWithUnit = `${fontSize}${this.props.fontSize.unit}`;

    return (
      <div
        ref={this.bindRef}
        style={{
          ...style,
          height: '100%',
          fontSize: fontSizeWithUnit,
          display: loaded ? style.display : 'none',
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
};

Textfit.defaultProps = {
  fontSize: defaultProps.fontSize,
  style: defaultProps.style,
};

Textfit.displayName = 'Textfit';

export default Textfit;
