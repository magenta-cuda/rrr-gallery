// Justified Gallery Container Template

import React from 'react'
import JustifiedGalleryItem from '../components/JustifiedGalleryItem.js'

export default class JustifiedGalleryContainer extends React.Component {
    constructor(props) {
        super(props)
        this.container   = null
        this.rowHeight   = props.configuration.bbg_xiv_miro_row_height
        this.configuring = props.configuration.show
    }
    static getDerivedStateFromError(error) {
        console.log('JustifiedGalleryContainer:', error)
        return {}
    }
    render() {
        const collection = this.props.images
        const captions   = this.props.captions
        this.rowHeight   = this.props.configuration.bbg_xiv_miro_row_height
        this.configuring = this.props.configuration.show
        if (this.configuring) {
            return (
                <div>Configuring...</div>
            )
        }
        if (typeof collection === 'string') {
            return <h1>{collection}</h1>
        }
        const jsx = [];
        collection.forEach(function(model) {
             jsx.push(<JustifiedGalleryItem data={model.attributes} caption={captions} key={model.attributes.id} />);
        })
        console.log( 'JustifiedGalleryContainer():jsx=', jsx );
        return (
            <div className="bbg_xiv-container bbg_xiv-justified_container" data-bbg_xiv-gallery-id={collection.id}
                    ref={node => {this.container = node}}>
                <div className="bbg_xiv-justified_gallery">
                    {jsx}
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
                <div className="bbg_xiv-dense_alt_inner">
                    <span className="bbg_xiv-click_to_lock_comment">{bbg_xiv_lang['Click anywhere to lock the display of this popup.']}</span>
                    <span>&nbsp;</span>
                    <button className="bbg_xiv-dense_close"><span className="glyphicon glyphicon-remove"></span></button>
                    <div className="bbg_xiv-dense_alt_items"></div>
                </div>
*/}
            </div>
        )
    }
    componentDidMount() {
        if (!this.configuring) {
            console.log('componentDidMount():this.container=', this.container)
            window.bbg_xiv.postRenderJustified(this.container, this.rowHeight)
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if (!this.configuring) {
            console.log('componentDidUpdate():this.container=', this.container)
            window.bbg_xiv.postRenderJustified(this.container, this.rowHeight)
        }
    }
    componentDidCatch(error, info) {
        console.log('JustifiedGalleryContainer:', error, info)
    }
}
