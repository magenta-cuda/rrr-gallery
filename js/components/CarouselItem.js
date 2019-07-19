// Carousel Item

const CarouselItem = (props) => {
    const {index, data} = props
    return (
        <figure className={`item bbg_xiv-item${index === 0 ? " active" : ""}`} data-index={index}>
            <a href="{{{ data.link }}}" target="_blank">
                <img src={bbg_xiv.getSrc(data,'container',false)} srcSet={bbg_xiv.getSrcset(data)}
                        sizes={bbg_xiv.getSizes(data,'container',false)} data-bbg_xiv-image-id={data.id} />
            </a>
            <figcaption>{bbg_xiv.getTitle(data) + "<br>" + bbg_xiv.getCaption(data)}</figcaption>
        </figure>
    )
}
