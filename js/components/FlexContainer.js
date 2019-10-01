// Flex Container

import React from 'react'
import FlexItem from '../components/FlexItem.js'

export default class FlexContainer extends React.Component {
    constructor(props) {
        super(props)
        this.container    = null
        this.handleResize = this.handleResize.bind(this)
    }
    handleResize() {
        const width = jQuery(this.container).width()
        if (width !== this.props.containerWidth) {
            this.props.setContainerWidth(this.props.images.id, width)
        }
    }
/*
    resize() {
        // set tile width and height in pixels so that tiles cover the div exactly and completely
        const minWidth           = this.props.configuration.bbg_xiv_flex_min_width
        const minWidthForCaption = this.props.configuration.bbg_xiv_flex_min_width_for_caption
        const $container         = jQuery(this.container)
        const containerWidth     = this.props.containerWidth
        const pxWidth            = Math.floor( containerWidth / Math.floor( containerWidth / minWidth ) ) - 1;
        window.setTimeout(function() {
            $container.find('div.bbg_xiv-flex_item').css({width:pxWidth, height:pxWidth});
            if (pxWidth < minWidthForCaption) {
                $container.find("div.bbg_xiv-flex_item figcaption").hide();
            }
        }, 100)
    }
 */
    render() {
        console.log('FlexContainer.render():this.props=', this.props)
        const collection         = this.props.images
        const containerWidth     = this.props.containerWidth
        const minWidth           = this.props.configuration.bbg_xiv_flex_min_width
        const minWidthForCaption = this.props.configuration.bbg_xiv_flex_min_width_for_caption
        const width              = Math.floor( containerWidth / Math.floor( containerWidth / minWidth ) ) - 1;
        const captionHide        = !this.props.captions || width < minWidthForCaption
        if ( typeof collection === 'string' ) {
            return <h1>{collection}</h1>
        }
        let jsx
        if (containerWidth) {
            jsx = []
            collection.forEach(function(model) {
                 jsx.push(<FlexItem data={model.attributes} width={width} captionHide={captionHide} key={model.attributes.id} />)
            })
            console.log( 'FlexContainer():jsx=', jsx )
        } else {
            jsx = '<h1>Loading...</h1>'
        }
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
        this.handleResize()
        // this.resize()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.handleResize()
        // this.resize()
    }
}

