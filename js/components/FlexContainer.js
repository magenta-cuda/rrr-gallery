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
        const id                 = this.props.id
        const collection         = this.props.images
        const containerWidth     = this.props.containerWidth
        const minWidth           = this.props.configuration.bbg_xiv_flex_min_width
        const minWidthForCaption = this.props.configuration.bbg_xiv_flex_min_width_for_caption
        const bandwidth          = this.props.configuration.bbg_xiv_bandwidth
        const setHover           = this.props.setHover
        const width              = Math.floor( containerWidth / Math.floor( containerWidth / minWidth ) ) - 1;
        const captionsEnabled    = width >= minWidthForCaption
        const captionsShow       = captionsEnabled ? (this.props.captions ? "mc-rrr-captions-show" : "mc-rrr-captions-hide") : "mc-rrr-captions-none"
        if ( typeof collection === 'string' ) {
            return <h1>{collection}</h1>
        }
        let jsx
        if (containerWidth) {
            jsx = []
            collection.forEach(function(model, index) {
                 jsx.push(<FlexItem collectionId={id} index={index} data={model.attributes} width={width}
                                  captionsShow={captionsShow} hover={model.get("hover")} setHover={setHover}
                                  bandwidth={bandwidth} key={model.get("id")} />)
            })
            console.log( 'FlexContainer():jsx=', jsx )
        } else {
            jsx = '<h1>Loading...</h1>'
        }
        return (
            <div className={`bbg_xiv-container bbg_xiv-flex_container bbg_xiv-tiles_container mc-rrr-jsx-container ${captionsShow}`}
                data-bbg_xiv-gallery-id={collection.id} ref={node => {this.container = node}}>
                {jsx}
                <div className="bbg_xiv-flex_footer"></div>
                {/* Full Browser Viewport View of an Image */}
                <div className="mc-rrr-react-overlay-root" />
            </div>
        )
    }
    componentDidMount() {
        window.bbg_xiv.postRenderFlexContainer(this.container)
        // TODO: When the component mounts the width of the container is not known and handleResize() forces a re-render.
        // TODO: This means the FlexContainer is rendered twice - seems very inefficient!
        this.handleResize()
        // this.resize()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.bbg_xiv.postRenderFlexContainer(this.container)
        this.handleResize()
        // this.resize()
    }
}

