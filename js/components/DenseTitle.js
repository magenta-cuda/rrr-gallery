// Dense Title Template

import React from 'react'
import common from '../common.js'

export default class DenseTitle extends React.Component {
    constructor(props) {
        super(props)
        this.handleImageClick = this.handleImageClick.bind(this)
    }
    static getDerivedStateFromError(error) {
        console.log('DenseTitle:', error)
        return {}
    }
    handleImageClick = function(e) {
        e.preventDefault()
        // TODO: img = null probably works as img is only used to get this.props.data
        common.showOverlay(e, false, null, this.props.data, this.props.bandwidth)
    }
    render() {
        const {data, index, mode, bandwidth} = this.props
        return (
            <li id={`bbg_xiv-dense_title_${index}`}>
                <a href={data.link} target="_blank">
                    <span className="bbg_xiv-dense_li_title" title={common.getCaption(data)}
                            style={mode !== "title"   ? {display: "none"} : {display: "inline"}}>
                        {common.getTitle(data)}
                    </span>
                    <span className="bbg_xiv-dense_li_caption" title={common.getTitle(data)}
                            style={mode !== "caption" ? {display: "none"} : {display: "inline"}}>
                        {common.getCaption(data)}
                    </span>
                    <span className="bbg_xiv-dense_li_alt" title={common.getTitle(data)}
                            style={mode !== "alt"     ? {display: "none"} : {display: "inline"}}>
                        {common.getAlt(data)}
                    </span>
                </a>
                <button className="bbg_xiv-dense_full_btn bbg_xiv-dense_from_title btn" onClick={this.handleImageClick}>
                    <span className="glyphicon glyphicon-fullscreen"></span>
                </button>
            </li>
        )
    }
    componentDidCatch(error, info) {
        console.log('DenseTitle:', error, info)
    }
}
