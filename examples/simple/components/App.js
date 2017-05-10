import React, { createClass } from 'react';
import { Textfit } from 'react-textfit';

export default createClass({

    displayName: 'App',

    getInitialState() {
        return {
            text: 'Edit this text!',
            mode: 'multi',
            forceSingleModeWidth: true,
            perfectFit: true
        };
    },

    handleChangeText(e) {
        const text = e.target.value;
        this.setState({ text });
    },

    handleChangeMode(e) {
        const mode = e.target.value;
        this.setState({ mode });
    },

    handleChangeForceWidth(e) {
        const forceSingleModeWidth = e.target.checked;
        this.setState({ forceSingleModeWidth });
    },

    handleChangePerfectFit(e) {
        const perfectFit = e.target.checked;
        this.setState({ perfectFit });
    },

    render() {
        return (
          <div>
              <Textfit className="textfit">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
              </Textfit>
          </div>
        );
    }
});
