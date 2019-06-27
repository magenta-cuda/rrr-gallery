var GalleryItem = ( data ) => {
    return (
        <div className="bbg_xiv-flex_item col-sm-6 col-md-4 col-lg-3">
            <figure className="img-rounded bbg_xiv-gallery_item">
                <figcaption>{bbg_xiv.getTitle(data)}</figcaption>
                { typeof data.gallery_index !== "undefined"
                ?
                    <a href={data.link} target="_blank" className="bbg_xiv-gallery_icon" dataGalleryIndex={data.gallery_index}>
                        <img src={bbg_xiv.getSrc(data,'viewport',true)} srcset={bbg_xiv.getSrcset(data)} sizes={bbg_xiv.getSizes(data,'viewport',true)}
                            alt={bbg_xiv.getAlt(data)} title={bbg_xiv.getTitle(data)} dataBbg_xivImageId={data.id} />
                    </a>
                :
                    <a href={data.link} target="_blank">
                        <img src={bbg_xiv.getSrc(data,'viewport',true)} srcset={bbg_xiv.getSrcset(data)} sizes={bbg_xiv.getSizes(data,'viewport',true)}
                            alt={bbg_xiv.getAlt(data)} title={bbg_xiv.getTitle(data)} dataBbg_xivImageId={data.id} />
                    </a>
                }
            </figure>
        </div>
    )
}
