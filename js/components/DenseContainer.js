// Dense Container Template

class DenseContainer extends React.Component {
    constructor(props) {
        super(props)
        this.container        = null
        this.handleCloseClick = this.handleCloseClick.bind(this)
    }
    static getDerivedStateFromError(error) {
        console.log('DenseContainer:', error)
        return {}
    }
    handleCloseClick = function(e) {
        this.props.setView('Gallery')
    }
    render() {
        const {images: collection, mode = 'title'} = this.props
        if ( typeof collection === 'string' ) {
            return <h1>{collection}</h1>
        }
        const jsxTitles = []
        const jsxImages = []
        collection.forEach(function(model, index) {
             jsxTitles.push(<DenseTitle data={model.attributes} index={index} mode={mode} key={model.attributes.id} />);
             jsxImages.push(<DenseImage data={model.attributes} index={index} key={model.attributes.id} />);
        })
        return (
            <div id={collection.id} className="bbg_xiv-dense_container" data-bbg_xiv-gallery-id={collection.id}
                    ref={node => {this.container = node}}>
                <button type="button" id="bbg_xiv-highlight_color"></button>
                <button type="button" id="bbg_xiv-normal_color"></button>
                {/* Changes to mode radio button state is handled directly by my JavaScript handler,
                  * i.e., this is not a change to React's state - it is in state Domain 2 */}
                <div className="bbg_xiv-dense_button_box">
                    <input type="radio" name="bbg_xiv-dense_li_mode" className="bbg_xiv-dense_li_mode" value="title"
                            defaultChecked={mode === "title"} />&nbsp;Title&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="radio" name="bbg_xiv-dense_li_mode" className="bbg_xiv-dense_li_mode" value="caption"
                            defaultChecked={mode === "caption"}  />&nbsp;Caption&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="radio" name="bbg_xiv-dense_li_mode" className="bbg_xiv-dense_li_mode" value="alt"
                            defaultChecked={mode === "alt"}  />&nbsp;Alt
                </div>
                <div className="bbg_xiv-dense_right_btns">
                    <button type="button" className="bbg_xiv-dense_info_btn btn" title="get help">
                        <span className="glyphicon glyphicon-question-sign"></span>
                    </button>
                    <button type="button" className="bbg_xiv-dense_close_btn btn btn-default" title="close"
                            onClick={this.handleCloseClick}>
                        <span className="glyphicon glyphicon-remove"></span>
                    </button>
                </div>
                <div className="bbg_xiv-dense_titles">
                    <ul className="list-unstyled">
                        {jsxTitles}
                    </ul>
                </div>
                <div className="bbg_xiv-dense_images">
                    <div className="bbg_xiv-dense_flex_images">
                        {jsxImages}
                    </div>
                </div>
                {/* Full Browser Viewport View of an Image */}
                <div className="mc-rrr-react-overlay-root" />
{/*
                <div className="bbg_xiv-dense_outer">
                </div>
                <div className="bbg_xiv-dense_inner">
                    <button className="bbg_xiv-dense_close"><span className="glyphicon glyphicon-remove"></span></button>
                    <h1 className="bbg_xiv-dense_title"></h1>
                    <img className="img-rounded bbg_xiv-img_overlay" sizes={bbg_xiv.getSizes(null,'viewport',false)} />
                    <h1 className="bbg_xiv-dense_caption"></h1>
                </div>
*/}
            </div>
        )
    }
    componentDidMount() {
        console.log('DenseContainer::componentDidMount():this.container=', this.container)
        window.bbg_xiv.postRenderDense(this.container)
    }
    componentDidCatch(error, info) {
        console.log('DenseContainer:', error, info)
    }
}
