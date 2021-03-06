// Dense Container Template

import React from 'react'
import DenseTitle from '../components/DenseTitle.js'
import DenseImage from '../components/DenseImage.js'

export default class DenseContainer extends React.Component {
    constructor(props) {
        super(props)
        this.container        = null
        this.numberOfColumns  = props.configuration.bbg_xiv_flex_number_of_dense_view_columns
        this.configuring      = props.configuration.show
        this.handleCloseClick = this.handleCloseClick.bind(this)
    }
    static getDerivedStateFromError(error) {
        console.log('DenseContainer:', error)
        return {}
    }
    handleCloseClick = function(e) {
        this.props.setView(this.props.images.id, 'Gallery')
    }
    render() {
        const {images: collection, configuration, showConfigure} = this.props
        const {bbg_xiv_bandwidth: bandwidth} = configuration
        const mode = 'title'
        this.numberOfColumns = configuration.bbg_xiv_flex_number_of_dense_view_columns
        this.configuring     = configuration.show
        if (this.configuring) {
            return <h1>Configuring...</h1>
        }
        if ( typeof collection === 'string' ) {
            return <h1>{collection}</h1>
        }
        const jsxTitles = []
        const jsxImages = []
        collection.forEach(function(model, index) {
             jsxTitles.push(<DenseTitle data={model.attributes} index={index} mode={mode} bandwidth={bandwidth} key={model.attributes.id} />);
             jsxImages.push(<DenseImage data={model.attributes} index={index} bandwidth={bandwidth} key={model.attributes.id} />);
        })
        return (
            <div id={collection.id} className="bbg_xiv-dense_container" data-bbg_xiv-gallery-id={collection.id}
                    ref={node => {this.container = node}}>
                <button type="button" id="bbg_xiv-highlight_color"></button>
                <button type="button" id="bbg_xiv-normal_color"></button>
                {/* Changes to mode radio button state is handled directly by my JavaScript handler,
                  * i.e., this is not a change to React's state - it is in state Domain 2
                  * TODO: move this also to Redux store */}
                <div className="bbg_xiv-dense_button_box">
                    <input type="radio" name="bbg_xiv-dense_li_mode" className="bbg_xiv-dense_li_mode" value="title"
                            defaultChecked={mode === "title"} />&nbsp;Title&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="radio" name="bbg_xiv-dense_li_mode" className="bbg_xiv-dense_li_mode" value="caption"
                            defaultChecked={mode === "caption"}  />&nbsp;Caption&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="radio" name="bbg_xiv-dense_li_mode" className="bbg_xiv-dense_li_mode" value="alt"
                            defaultChecked={mode === "alt"}  />&nbsp;Alt
                </div>
                <div className="bbg_xiv-dense_right_btns">
                    <button type="button" className="bbg_xiv-dense_configure_btn btn"
                            title={bbg_xiv_lang_2["configure bandwidth, carousel interval, ..."]}
                            onClick={e => {showConfigure()}}>
                        <span className="glyphicon glyphicon-cog"></span>
                    </button>
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
            </div>
        )
    }
    componentDidMount() {
        if (!this.configuring) {
            console.log('DenseContainer::componentDidMount():this.container=', this.container)
            window.bbg_xiv.postRenderDense(this.container, this.numberOfColumns)
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.configuring) {
            console.log('DenseContainer::componentDidUpdate():this.container=', this.container)
            window.bbg_xiv.postRenderDense(this.container, this.numberOfColumns)
        }
    }
    componentDidCatch(error, info) {
        console.log('DenseContainer:', error, info)
    }
}
