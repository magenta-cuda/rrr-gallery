// Dense Image Template

const DenseImage = props => {
    const data  = props.data
    const index = props.index
    return (
        <div id={`bbg_xiv-dense_image_${index}`} className="bbg_xiv-dense_flex_item" title={bbg_xiv.getTitle(data)}>
            <img src={bbg_xiv.getSrc(data,'viewport',true)} srcSet={bbg_xiv.getSrcset(data)}
                    sizes={bbg_xiv.getSizes(data,'viewport',true)} alt={bbg_xiv.getAlt(data)}
                    title={bbg_xiv.getTitle(data)} data-bbg_xiv-image-id={data.id} />
            <a href={data.link} target="_blank">
                <div className="bbg_xiv-dense_full_btn">
                    <button className="bbg_xiv-dense_full_btn bbg_xiv-dense_from_image btn">
                        <span className="glyphicon glyphicon-fullscreen"></span>
                    </button>
                </div>
            </a>
        </div>
    )
}
