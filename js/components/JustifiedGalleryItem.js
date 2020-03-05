// Justified Gallery Item Template

import React from 'react'

export default class JustifiedGalleryItem extends React.Component {
    constructor(props) {
        super(props)
        this.img                  = null
        this.caption              = null
        this.handleImageClick     = this.handleImageClick.bind(this)
        this.handleInfoMouseEnter = this.handleInfoMouseEnter.bind(this)
        this.state                = {}
    }
    static getDerivedStateFromError(error) {
        console.log('JustifiedGalleryItem:', error)
        return {}
    }
    handleImageClick = function(e) {
        e.preventDefault()
        // TODO: this.img may not be necessary as it probably is only used to get this.props.data
        window.bbg_xiv.showOverlay(e, false, this.img, this.props.data)
    }
    handleInfoMouseEnter = function(e) {
        e.preventDefault()
        // TODO: this.img may not be necessary as it probably is only used to get this.props.data
        window.bbg_xiv.showOverlay(e, true,  this.img, this.props.data)
    }
    render() {
        const {collectionId, index, data, captions, initialized = false, setHover} = this.props
        return (
            /*
            TODO: The following onMouseEnter() and onMouseLeave() prevents Justified Gallery's initialization from completing sucessfully. Why?
            TODO: It also triggers componentDidUpdate() on its siblings. Why?
            */
            <div className="bbg_xiv-justified_item"
                    onMouseEnter={() => {initialized && setHover(collectionId, index, true)}}
                    onMouseLeave={() => {initialized && setHover(collectionId, index, false)}}
                >
                <a href={data.link} target="_blank">
                    <img src={data.bbg_medium_src[0]} alt={bbg_xiv.getAlt(data)} title={bbg_xiv.getCaption(data)}
                            data-bbg_xiv-image-id={data.id} ref={node => {this.img = node}} />
                </a>
                <div className={`caption caption-${index}`} style={captions ? {display: "block", opacity: 0.7} : {display: "none", opacity: 0.0}}
                        ref={node => {this.caption = node}}>
                    <a href={data.link} target="_blank">{bbg_xiv.getTitle(data)}</a>
                    <button className="bbg_xiv-dense_full_btn bbg_xiv-dense_from_justified btn" onClick={this.handleImageClick}>
                        <span className="glyphicon glyphicon-fullscreen"></span>
                    </button>
                    <button className="bbg_xiv-dense_alt_btn bbg_xiv-dense_from_justified btn">
                        <span className="glyphicon glyphicon-info-sign" onMouseOver={this.handleInfoMouseEnter}></span>
                    </button>
                </div>
            </div>
        )
    }
    componentDidMount() {
        console.log("JustifiedGalleryItem.componentDidMount():this.caption.className=", this.caption.className)
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("JustifiedGalleryItem.componentDidUpdate():this.caption.className=", this.caption.className)
        const prevPropsJson = JSON.stringify(prevProps)
        const thisPropsJson = JSON.stringify(this.props)
        if (prevPropsJson !== thisPropsJson) {
            console.log("prevPropsJson !== thisPropsJson")
            console.log("JustifiedGalleryItem.componentDidUpdate:prevProps=", prevProps)
            console.log("JustifiedGalleryItem.componentDidUpdate:this.props=", this.props)
        }
        const prevStateJson = JSON.stringify(prevState)
        const thisStateJson = JSON.stringify(this.state)
        if (prevStateJson !== thisStateJson) {
            console.log("prevStateJson !== thisStateJson")
            console.log("JustifiedGalleryItem.componentDidUpdate:prevState=", prevState)
            console.log("JustifiedGalleryItem.componentDidUpdate:this.state=", this.state)
        }
    }
    componentDidCatch(error, info) {
        console.log('JustifiedGalleryItem:', error, info)
    }
}

console.log('JustifiedGalleryItem.js:loaded.');
