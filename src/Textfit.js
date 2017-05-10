import React, { PropTypes } from 'react';
// import createResizeDetector from 'element-resize-detector';
import { merge, debounce, throttle } from 'lodash';

// const resizeDetector = createResizeDetector({
//   strategy: 'scroll',
// });

// necessary because react's default props won't do "deep" merges
const defaultProps = {
  fontSize: {
    min: 1,
    max: 20,
    unit: 'vw',
  },
  style: {
    display: 'block',
    transition: 'all 100ms ease-in',
  }
};

class Textfit extends React.Component {
  constructor(props) {
    super(merge(defaultProps, props));

    this.state = {
      fontSize: this.props.fontSize.max,
      loaded: false,
    };

    this.resize = throttle(this.resize, 50);
  }

  get containerWidth() {
    try {
      return this.ref.parentElement.clientWidth;
    } catch (e) {
      return 0;
    }
  }

  get containerHeight() {
    try {
      return this.ref.parentElement.clientHeight;
    } catch (e) {
      return 0;
    }
  }

  getFontSize(el) {
    return parseInt(el.style.fontSize, 10);
  }

  fontSizeIsValid(fontSize) {
    const { min, max } = this.props.fontSize;

    return fontSize <= max && fontSize >= min;
  }

  resize = () => {
    // TODO: this is the function that breaks when used in combination with transitions
    // most likely because we're manipulating refed elements directly :O
    // doing it the "react" way should fix it

    // const { loaded } = this.state;
    //
    // if (!loaded) return;
    //
    // const el = this.ref;
    //
    // let floor = this.props.fontSize.min;
    //
    // let ceiling = this.props.fontSize.max;
    // let delta = ceiling - floor;
    // let fontSize = floor;
    //
    // const minDelta = 1;
    //
    // // scale up font-size to fill space
    // while (this.isOverflowing(el) || delta > minDelta) {
    //   delta = ceiling - floor;
    //
    //   const newFontSize = floor + (delta / 2);
    //
    //   el.style.fontSize = `${newFontSize}${this.props.fontSize.unit}`;
    //
    //   fontSize = newFontSize;
    //
    //   if (this.isOverflowing(el)) {
    //     ceiling = newFontSize;
    //   } else {
    //     floor = newFontSize;
    //   }
    //
    //   this.setState({
    //     fontSize
    //   });
    // }
    //
    // this.setState({ fontSize });
  };

  isOverflowing = (element) => {
    const el = element || this.ref;

    if (!el) return true;

    // check self
    const overflowX = el.scrollWidth > el.clientWidth;
    const overflowY = el.scrollHeight > el.clientHeight;

    if (overflowX || overflowY) return true;

    // check parent
    const parentOverflowX = el.parentElement.scrollWidth > el.parentElement.clientWidth;
    const parentOverflowY = el.parentElement.scrollHeight > el.parentElement.clientHeight;

    return parentOverflowX || parentOverflowY;
  };

  bindRef = (ref) => {
    this.ref = ref;

    const onChange = debounce(() => {
      console.log('changed');
    }, 300);

    // resizeDetector.listenTo(this.ref, onChange);

    this.setState({ loaded: true }, this.resize);
  };

  render() {
    const { loaded, fontSize } = this.state;
    const { style, children } = this.props;
    const fontSizeWithUnit = `${fontSize}${this.props.fontSize.unit}`;
    // console.log(fontSizeWithUnit);

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
    )
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
