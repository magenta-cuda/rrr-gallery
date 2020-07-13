// Flex Item Template

import React from 'react'
import common from '../common.js'

export default class FlexItem extends React.Component {
    constructor(props) {
        super(props)
        this.img                  = null
        this.handleImageClick     = this.handleImageClick.bind(this)
        this.handleInfoMouseEnter = this.handleInfoMouseEnter.bind(this)
    }
    static getDerivedStateFromError(error) {
        console.log('FlexItem:', error)
        return {}
    }
    handleImageClick = function(e) {
        e.preventDefault()
        // TODO: this.img may not be necessary as it probably is only used to get this.props.data
        window.bbg_xiv.showOverlay(e, false, this.img, this.props.data, this.props.bandwidth)
    }
    handleInfoMouseEnter = function(e) {
        e.preventDefault()
        // TODO: this.img may not be necessary as it probably is only used to get this.props.data
        window.bbg_xiv.showOverlay(e, true, this.img, this.props.data, this.props.bandwidth)
    }
    render() {
        const collectionId   = this.props.collectionId
        const index          = this.props.index
        const data           = this.props.data
        const captionsShow   = this.props.captionsShow
        const hover          = this.props.hover
        const width          = this.props.width
        const setHover       = this.props.setHover
        const bandwidth      = this.props.bandwidth
        let className        = ''
        let dataGalleryIndex = ''
        if (typeof data.gallery_index !== 'undefined') {
            className        = 'bbg_xiv-gallery_icon'
            dataGalleryIndex = data.gallery_index
        }
        console.log('hover[', index, '] = ', hover)
        // Flip the display state of the caption on hover.
        // This cannot be done with the :hover CSS pseudo-class as the figure element is overlaid with the
        // div.bbg_xiv-dense_full_btn element which is higher in the Z order - i.e. the hover is not seen
        // by the figcaption element.
        let captionStyle = {}
        if (hover) {
            if (captionsShow === "mc-rrr-captions-show") {
                captionStyle.display = "none"
            } else if (captionsShow === "mc-rrr-captions-hide") {
                captionStyle.display = "block"
            }
        }
        return (
            <div className="bbg_xiv-flex_item" style={{width: width, height: width}}>
                <figure>
                    <figcaption className="mc-rrr-caption" style={captionStyle}>{common.getTitle(data)}</figcaption>
                    <a href={data.link} target="_blank" className={className} data-gallery-index={dataGalleryIndex}>
                        <img src={common.getSrc(data,'viewport', true, bandwidth)} srcSet={common.getSrcset(data, bandwidth)}
                                alt={common.getAlt(data)} title={common.getTitle(data)} data-bbg_xiv-image-id={data.id}
                                ref={node => {this.img = node}} />
                    </a>
                </figure>
                <a href={data.link} target="_blank" className={className} data-gallery-index={dataGalleryIndex}>
                    <div className="bbg_xiv-dense_full_btn" title={common.getCaption(data)}
                            onMouseEnter={() => {setHover(collectionId, index, true)}}
                            onMouseLeave={() => {setHover(collectionId, index, false)}}>
                        <button className="bbg_xiv-dense_alt_btn bbg_xiv-flex_from_image btn">
                            <span className="glyphicon glyphicon-info-sign" onMouseOver={this.handleInfoMouseEnter}></span>
                        </button>
                        <button className="bbg_xiv-dense_full_btn bbg_xiv-flex_from_image btn" onClick={this.handleImageClick}>
                            <span className="glyphicon glyphicon-fullscreen"></span>
                        </button>
                    </div>
                </a>
            </div>
        )
    }
    componentDidCatch(error, info) {
        console.log('FlexItem:', error, info)
    }
}
