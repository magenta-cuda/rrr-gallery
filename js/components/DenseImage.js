// Dense Image Template

// TODO: remove React = - don't need this when we use webpack
const React = window.mcRrr.React

class DenseImage extends React.Component {
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
        window.bbg_xiv.showOverlay(e, false, this.img, this.props.data)
    }
    render() {
        const {data, index} = this.props
        return (
            <div id={`bbg_xiv-dense_image_${index}`} className="bbg_xiv-dense_flex_item" title={bbg_xiv.getTitle(data)}>
                <img src={bbg_xiv.getSrc(data,'viewport',true)} srcSet={bbg_xiv.getSrcset(data)}
                        sizes={bbg_xiv.getSizes(data,'viewport',true)} alt={bbg_xiv.getAlt(data)}
                        title={bbg_xiv.getTitle(data)} data-bbg_xiv-image-id={data.id} ref={node => {this.img = node}} />
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
