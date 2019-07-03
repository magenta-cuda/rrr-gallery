// Justified Gallery Item Template

const JustifiedGalleryItem = props => {
    // TODO: remove React = - don't need this when we use webpack
    const React = window.mcRrr.React
    let data = props.data
    return (
        <div className="bbg_xiv-justified_item">
            <a href={data.link} target="_blank">
                <img src={data.bbg_medium_src[0]} alt={bbg_xiv.getAlt(data)} title={bbg_xiv.getCaption(data)} data-bbg_xiv-image-id={data.id} />
            </a>	
            <div className="caption">
                <a href={data.link} target="_blank">{bbg_xiv.getTitle(data)}</a>
                <button className="bbg_xiv-dense_full_btn bbg_xiv-dense_from_justified btn"><span className="glyphicon glyphicon-fullscreen"></span></button>
                <button className="bbg_xiv-dense_alt_btn bbg_xiv-dense_from_justified btn"><span className="glyphicon glyphicon-info-sign"></span></button>
            </div>
        </div>
    )
}

console.log('JustifiedGalleryItem.js:loaded.');
