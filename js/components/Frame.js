import React from 'react';
import Gallery from '../containers/Gallery.js'
import DevTools from '../containers/DevTools.js'

export default props => {
    console.log('components/Frame:props=', props)
    return (
        <div id="mc-rrr-jsx-frame" className={"mc-rrr-jsx-frame bbg_xiv-bootstrap"
                                                  + (props.home       ? " bbg_xiv-home_gallery"       : "")
                                                  + (props.fullScreen ? " bbg_xiv-fullscreen_gallery" : "")}>
            <window.bbg_xiv.NavBarContainer id={props.id} galleries={window.bbg_xiv.menu_galleries} />
            <Gallery id={"gallery-" + props.id} />
            <DevTools />
        </div>
    )
}

