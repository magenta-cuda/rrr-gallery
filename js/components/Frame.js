import React from 'react';
import Gallery from '../containers/Gallery.js'
import DevTools from '../containers/DevTools.js'

export default props => (
    <div id="mc-rrr-jsx-frame" className="mc-rrr-jsx-frame">
        <Gallery id={"gallery-" + props.id} />
        <DevTools />
    </div>
)

