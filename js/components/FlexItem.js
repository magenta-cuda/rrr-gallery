// Flex Item Template

import React from 'react'

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
        window.bbg_xiv.showOverlay(e, false, this.img, this.props.data)
    }
    handleInfoMouseEnter = function(e) {
        e.preventDefault()
        // TODO: this.img may not be necessary as it probably is only used to get this.props.data
        window.bbg_xiv.showOverlay(e, true, this.img, this.props.data)
    }
    render() {
        const collectionId   = this.props.collectionId
        const index          = this.props.index
        const data           = this.props.data
        const hover          = this.props.hover
        const width          = this.props.width
        const setHover       = this.props.setHover
        let className        = ''
        let dataGalleryIndex = ''
        if (typeof data.gallery_index !== 'undefined') {
            className        = 'bbg_xiv-gallery_icon'
            dataGalleryIndex = data.gallery_index
        }
        console.log('hover[', index, '] = ', hover)
        return (
            <div className="bbg_xiv-flex_item" style={{width: width, height: width}}>
                <figure>
                    <figcaption className="mc-rrr-caption">{bbg_xiv.getTitle(data)}</figcaption>
                    <a href={data.link} target="_blank" className={className} data-gallery-index={dataGalleryIndex}>
                        <img src={bbg_xiv.getSrc(data,'viewport',true)} srcSet={bbg_xiv.getSrcset(data)}
                                sizes={bbg_xiv.getSizes(data,'viewport',true)}
                                alt={bbg_xiv.getAlt(data)} title={bbg_xiv.getTitle(data)} data-bbg_xiv-image-id={data.id}
                                ref={node => {this.img = node}} />
                    </a>
                </figure>
                <a href={data.link} target="_blank" className={className} data-gallery-index={dataGalleryIndex}>
                    <div className="bbg_xiv-dense_full_btn" title={bbg_xiv.getCaption(data)}
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
