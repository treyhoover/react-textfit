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
