// Flex Container

import React from 'react'
import FlexItem from '../components/FlexItem.js'

export default class FlexContainer extends React.Component {
    constructor(props) {
        super(props)
        this.container = null
    }
    render() {
        const collection = this.props.images
        if ( typeof collection === 'string' ) {
            return <h1>{collection}</h1>
        }
        const jsx = []
        collection.forEach(function(model) {
             jsx.push(<FlexItem data={model.attributes} key={model.attributes.id} />)
        })
        console.log( 'FlexContainer():jsx=', jsx )
        return (
            <div className="bbg_xiv-container bbg_xiv-flex_container bbg_xiv-tiles_container mc-rrr-jsx-container"
                data-bbg_xiv-gallery-id={collection.id} ref={node => {this.container = node}}>
                {jsx}
                <div className="bbg_xiv-flex_footer"></div>
                {/* Full Browser Viewport View of an Image */}
                <div className="mc-rrr-react-overlay-root" />
{/*
                <div className="bbg_xiv-dense_outer">
                </div>
                <div className="bbg_xiv-dense_inner">
                  <button className="bbg_xiv-dense_close"><span className="glyphicon glyphicon-remove"></span></button>
                  <h1 className="bbg_xiv-dense_title"></h1>
                  <img className="img-rounded bbg_xiv-img_overlay" sizes={bbg_xiv.getSizes(null,'viewport',false)} />
                  <h1 className="bbg_xiv-dense_caption"></h1>
                </div>
                <div className="bbg_xiv-dense_alt_inner">
                    <span className="bbg_xiv-click_to_lock_comment">{bbg_xiv_lang['Click anywhere to lock the display of this popup.']}</span>
                    <span>&nbsp;</span>
                    <button className="bbg_xiv-dense_close"><span className="glyphicon glyphicon-remove"></span></button>
                    <div className="bbg_xiv-dense_alt_items"></div>
                </div>
*/}
            </div>
        )
    }
    componentDidMount() {
        window.bbg_xiv.postRenderFlexContainer(this.container)
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.setTimeout(function() {
            jQuery(window).resize()
        }, 100)
    }
}

