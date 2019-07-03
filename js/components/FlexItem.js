// Flex Item Template

import React from 'react'

export default props => {
    let data             = props.data
    let className        = ''
    let dataGalleryIndex = ''
    if (typeof data.gallery_index !== 'undefined') {
        className        = 'bbg_xiv-gallery_icon'
        dataGalleryIndex = data.gallery_index
    }
    return (
        <div className="bbg_xiv-flex_item">
            <figure>
                <figcaption>{bbg_xiv.getTitle(data)}</figcaption>
                <a href={data.link} target="_blank" className={className} data-gallery-index={dataGalleryIndex}>
                    <img src={bbg_xiv.getSrc(data,'viewport',true)} srcSet={bbg_xiv.getSrcset(data)} sizes={bbg_xiv.getSizes(data,'viewport',true)}
                        alt={bbg_xiv.getAlt(data)} title={bbg_xiv.getTitle(data)} data-bbg_xiv-image-id={data.id} />
                </a>
            </figure>
            <a href={data.link} target="_blank" className={className} data-gallery-index={dataGalleryIndex}>
                <div className="bbg_xiv-dense_full_btn" title={bbg_xiv.getCaption(data)}>
                    <button className="bbg_xiv-dense_alt_btn bbg_xiv-flex_from_image btn">
                        <span className="glyphicon glyphicon-info-sign"></span>
                    </button>
                    <button className="bbg_xiv-dense_full_btn bbg_xiv-flex_from_image btn">
                        <span className="glyphicon glyphicon-fullscreen"></span>
                    </button>
                </div>
            </a>
        </div>
    )
}
