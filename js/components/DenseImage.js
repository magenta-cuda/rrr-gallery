// Dense Image Template

import React from 'react'
import common from '../common.js'

export default class DenseImage extends React.Component {
    constructor(props) {
        super(props)
        this.img              = null
        this.handleImageClick = this.handleImageClick.bind(this)
    }
    static getDerivedStateFromError(error) {
        console.log('DenseImage:', error)
        return {}
    }
    handleImageClick = function(e) {
        e.preventDefault()
        // TODO: this.img may not be necessary as it probably is only used to get this.props.data
        common.showOverlay(e, false, this.img, this.props.data, this.props.bandwidth)
    }
    render() {
        const {data, index, bandwidth} = this.props
        return (
            <div id={`bbg_xiv-dense_image_${index}`} className="bbg_xiv-dense_flex_item" title={common.getTitle(data)}>
                <img src={common.getSrc(data,'viewport',true, bandwidth)} srcSet={common.getSrcset(data)}
                        alt={common.getAlt(data)}
                        title={common.getTitle(data)} data-bbg_xiv-image-id={data.id} ref={node => {this.img = node}} />
                <a href={data.link} target="_blank">
                    <div className="bbg_xiv-dense_full_btn">
                        <button className="bbg_xiv-dense_full_btn bbg_xiv-dense_from_image btn" onClick={this.handleImageClick}>
                            <span className="glyphicon glyphicon-fullscreen"></span>
                        </button>
                    </div>
                </a>
            </div>
        )
    }
    componentDidCatch(error, info) {
        console.log('DenseImage:', error, info)
    }
}
