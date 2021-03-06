// Carousel Container Template

import React from 'react'
import common from '../common.js'
import CarouselItem from '../components/CarouselItem.js'

export default class CarouselContainer extends React.Component {
    constructor(props) {
        super(props)
        this.container        = null
        this.carouselId       = null
        this.index            = 0
        this.handleInfoClick  = this.handleInfoClick.bind(this)
        this.handleCloseClick = this.handleCloseClick.bind(this)
    }
    static getDerivedStateFromError(error) {
        console.log('CarouselContainer:', error)
        return {}
    }
    setIndex(index) {
        this.index = index
    }
    handleInfoClick = function(e) {
        common.showOverlay(e, true, null, this.props.images.at(this.index).attributes, this.props.configuration.bbg_xiv_bandwidth)
    }
    handleCloseClick = function(e) {
        this.props.setView(this.props.images.id, 'Gallery')
    }
    render() {
        const collection = this.props.images
        const bandwidth  = this.props.configuration.bbg_xiv_bandwidth
        const carouselId = `bbg_xiv-carousel_${collection.id}`
        this.carouselId  = carouselId
        const bulletsJsx = []
        const imagesJsx  = []
        collection.forEach(function(model, index) {
            bulletsJsx.push(<li data-target={`#${carouselId}`} data-slide-to={index} className={index === 0 ? "active" : ""}></li>)
            imagesJsx .push(<CarouselItem index={index} data={model.attributes} bandwidth={bandwidth} key={model.attributes.id} />)
        })
        return (
            <div id={carouselId} className="carousel slide bbg_xiv-container" data-ride="carousel"
                    data-interval={bbg_xiv.bbg_xiv_carousel_interval} data-bbg_xiv-gallery-id={collection.id}
                    ref={node => {this.container = node}}>
                {/* Indicators */}
                {/* the original Bootstrap carousel slide indicators which actually works very well in desktop browser but is a failure for mobile
                <ol className="carousel-indicators">
                    {bulletsJsx}
                </ol>
                */}
                <div className="carousel-indicators bbg_xiv-jquery_mobile">
                <form>
                  <div className="ui-field-contain">
                    <label htmlFor={`slider-${carouselId}`} className="ui-hidden-accessible"></label>
                    <input type="range" name={`slider-${carouselId}`} id={`slider-${carouselId}`} className="bbg_xiv-carousel_slider" value="1"
                            min="1" max={collection.length} step="1" data-highlight="true" onChange={() => {alert("TODO")}}/>
                  </div>
                </form>
                </div>
                {/* Wrapper for slides */}
                <div className="carousel-inner">
                    {imagesJsx}
                </div>
                {/* Left and right controls */}
                <div className="left carousel-control">
                    <a className="bbg_xiv-carousel_info carousel-control" href="#" title={bbg_xiv_lang['Show Image Info']}
                            onClick={this.handleInfoClick}>
                        <span className="glyphicon glyphicon-info-sign"></span>
                        <span className="sr-only">Info</span>
                    </a>
                    <a className="bbg_xiv-carousel_left left carousel-control" href={`#${carouselId}`} data-slide="prev"
                            title={bbg_xiv_lang['Previous']}>
                        <span className="glyphicon glyphicon-chevron-left"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="bbg_xiv-carousel_first carousel-control" href="#" title={bbg_xiv_lang['Go To First']}>
                        <span className="glyphicon glyphicon-fast-backward"></span>
                        <span className="sr-only">First</span>
                    </a>
                    <a className="bbg_xiv-carousel_play carousel-control" href="#" title={bbg_xiv_lang['Pause']}>
                        <span className="glyphicon glyphicon-pause"></span>
                        <span className="sr-only">Pause</span>
                    </a>
                </div>
                <div className="right carousel-control">
                    <a className="bbg_xiv-carousel_close carousel-control" href="#" title={bbg_xiv_lang['Close']}
                            onClick={this.handleCloseClick}>
                        <span className="glyphicon glyphicon-remove"></span>
                        <span className="sr-only">Close</span>
                    </a>
                    <a className="bbg_xiv-carousel_right right carousel-control" href={`#${carouselId}`} data-slide="next"
                            title={bbg_xiv_lang['Next']}>
                        <span className="glyphicon glyphicon-chevron-right"></span>
                        <span className="sr-only">Next</span>
                    </a>
                    <a className="bbg_xiv-carousel_last carousel-control" href="#" title={bbg_xiv_lang['Go To Last']}>
                        <span className="glyphicon glyphicon-fast-forward"></span>
                        <span className="sr-only">Last</span>
                    </a>
                    <a className="bbg_xiv-carousel_help carousel-control" target="_blank" title={bbg_xiv_lang['Get Help']}>
                        <span className="glyphicon glyphicon-question-sign"></span>
                        <span className="sr-only">Help</span>
                    </a>
                </div>
                {/* Alt (Info) View of an Image */}
                <div className="mc-rrr-react-overlay-root" />
{/*
                <div className="bbg_xiv-dense_outer">
                </div>
                <div className="bbg_xiv-dense_alt_inner">
                    <span className="bbg_xiv-click_to_lock_comment">
                        {bbg_xiv_lang['Click anywhere to lock the display of this popup.']}
                    </span>
                    <span>&nbsp;</span>
                    <button className="bbg_xiv-dense_close"><span className="glyphicon glyphicon-remove"></span></button>
                    <div className="bbg_xiv-dense_alt_items"></div>
                </div>
*/}
            </div>
        )
    }
    componentDidMount() {
        window.bbg_xiv.postRenderCarousel(this.container, this.carouselId, this.props.images, this.setIndex.bind(this))
    }
    componentDidCatch(error, info) {
        console.log('CarouselContainer:', error, info)
    }
}
