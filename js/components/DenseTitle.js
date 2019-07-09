// Dense Title Template

// TODO: remove React = - don't need this when we use webpack

const React = window.mcRrr.React

class DenseTitle extends React.Component {
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
        window.bbg_xiv.showOverlay(e, false, null, this.props.data)
    }
    render() {
        const {data, index, mode} = this.props
        return (
            <li id={`bbg_xiv-dense_title_${index}`}>
                <a href={data.link} target="_blank">
                    <span className="bbg_xiv-dense_li_title" title={bbg_xiv.getCaption(data)}
                            style={mode !== "title"   ? {display: "none"} : {display: "inline"}}>
                        {bbg_xiv.getTitle(data)}
                    </span>
                    <span className="bbg_xiv-dense_li_caption" title={bbg_xiv.getTitle(data)}
                            style={mode !== "caption" ? {display: "none"} : {display: "inline"}}>
                        {bbg_xiv.getCaption(data)}
                    </span>
                    <span className="bbg_xiv-dense_li_alt" title={bbg_xiv.getTitle(data)}
                            style={mode !== "alt"     ? {display: "none"} : {display: "inline"}}>
                        {bbg_xiv.getAlt(data)}
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
