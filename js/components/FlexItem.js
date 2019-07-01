// Flex Item Template

import React from 'react'

export default data => {
    let className        = ''
    let dataGalleryIndex = ''
    if (typeof data.gallery_index !== 'undefined') {
        className        = 'bbg_xiv-gallery_icon'
        dataGalleryIndex = data.gallery_index
    }
    return (
        <div class="bbg_xiv-flex_item">
            <figure>
                <figcaption>{bbg_xiv.getTitle(data)}</figcaption>
                <a href={data.link} target="_blank" className={className} dataGalleryIndex={dataGalleryIndex}>
                    <img src={bbg_xiv.getSrc(data,'viewport',true)} srcset={bbg_xiv.getSrcset(data)} sizes={bbg_xiv.getSizes(data,'viewport',true)}
                        alt={bbg_xiv.getAlt(data)} title={bbg_xiv.getTitle(data)} dataBbgXivImageId={data.id} />
                </a>
            </figure>
            <a href={data.link} target="_blank" className={className} dataGalleryIndex={dataGalleryIndex}>
                <div class="bbg_xiv-dense_full_btn" title={bbg_xiv.getCaption(data)}>
                    <button class="bbg_xiv-dense_alt_btn bbg_xiv-flex_from_image btn">
                        <span class="glyphicon glyphicon-info-sign"></span>
                    </button>
                    <button class="bbg_xiv-dense_full_btn bbg_xiv-flex_from_image btn">
                        <span class="glyphicon glyphicon-fullscreen"></span>
                    </button>
                </div>
            </a>
        </div>
    )
}
