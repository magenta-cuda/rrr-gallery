// Gallery Item Template

var GalleryItem = ( data ) => {
    let className        = '';
    let dataGalleryIndex = '';
    if (typeof data.gallery_index !== "undefined") {
        className        = 'bbg_xiv-gallery_icon'
        dataGalleryIndex = data.gallery_index
    }
    return (
        <div className="bbg_xiv-flex_item col-sm-6 col-md-4 col-lg-3">
            <figure className="img-rounded bbg_xiv-gallery_item">
                <figcaption>{bbg_xiv.getTitle(data)}</figcaption>
                <a href={data.link} target="_blank" className={className} dataGalleryIndex={dataGalleryIndex}>
                    <img src={bbg_xiv.getSrc(data,'viewport',true)} srcSet={bbg_xiv.getSrcset(data)}
                        alt={bbg_xiv.getAlt(data)} title={bbg_xiv.getTitle(data)} dataBbg_xivImageId={data.id} />
                </a>
            </figure>
        </div>
    )
}
