// Justified Gallery Item Template

// TODO: remove React = - don't need this when we use webpack
const React = window.mcRrr.React

class JustifiedGalleryItem extends React.Component {
    constructor(props) {
        super(props)
        this.img                  = null
        this.handleImageClick     = this.handleImageClick.bind(this)
        this.handleInfoMouseEnter = this.handleInfoMouseEnter.bind(this)
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
        // TODO: remove React = - don't need this when we use webpack
        const React   = window.mcRrr.React
        const data    = this.props.data
        const caption = this.props.caption
        return (
            <div className="bbg_xiv-justified_item">
                <a href={data.link} target="_blank">
                    <img src={data.bbg_medium_src[0]} alt={bbg_xiv.getAlt(data)} title={bbg_xiv.getCaption(data)}
                            data-bbg_xiv-image-id={data.id} ref={node => {this.img = node}} />
                </a>
                <div className="caption" style={caption ? {display: "block", opacity: 0.7} : {display: "none", opacity: 0.0}}>
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
    componentDidCatch(error, info) {
        console.log('JustifiedGalleryItem:', error, info)
    }
}

console.log('JustifiedGalleryItem.js:loaded.');
