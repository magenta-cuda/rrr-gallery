import React    from 'react'
import NavBar   from '../containers/NavBar.js'
import Gallery  from '../containers/Gallery.js'
import DevTools from '../containers/DevTools.js'

export default props => {
    console.log('components/Frame:props=', props)
    return (
        <div id="mc-rrr-jsx-frame" className={"mc-rrr-jsx-frame bbg_xiv-bootstrap"
                                                  + (props.home       ? " bbg_xiv-home_gallery"       : "")
                                                  + (props.captions   ? " bbg_xiv-caption_visible"    : "")
                                                  + (props.fullScreen ? " bbg_xiv-fullscreen_gallery" : "")}>
            <NavBar id={props.id} galleries={window.bbg_xiv.menu_galleries} />
            <Gallery id={"gallery-" + props.id} />
            <DevTools />
        </div>
    )
}

