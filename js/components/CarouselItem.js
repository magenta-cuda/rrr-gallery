// Carousel Item

import React from 'react'
import common from '../common.js'

export default props => {
    const {index, data, bandwidth} = props
    return (
        <figure className={`item bbg_xiv-item${index === 0 ? " active" : ""}`} data-index={index}>
            <a href="{{{ data.link }}}" target="_blank">
                <img src={common.getSrc(data, 'container', false, bandwidth)} srcSet={common.getSrcset(data)}
                        data-bbg_xiv-image-id={data.id} />
            </a>
            <figcaption>{[
                <span>{common.getTitle(data)}</span>,
                <br />,
                <span>{common.getCaption(data)}</span>
            ]}</figcaption>
        </figure>
    )
}
