import React from 'react';
import { Textfit } from 'react-textfit';

const App = (props) => (
    <div>
        <div className="headline">
            <Textfit className="textfit">
                <h1 style={{ whiteSpace: 'nowrap', margin: 0 }}>TextFit!</h1>
            </Textfit>
        </div>

        <div className="column-50 left">
            <Textfit>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
                voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
                occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est
                et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio
                cumque nihil impedit quo minus id quod maxime.
            </Textfit>
        </div>

        <div className="column-50 right quote">
            <Textfit>
                “Lorem ipsum dolor sit amet, consetetur sadipscing elitr.”
            </Textfit>
        </div>
    </div>
);

export default App;
