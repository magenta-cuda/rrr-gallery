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
        const id          = this.props.id
        const collection  = this.props.images
        const captions    = this.props.captions
        this.rowHeight    = this.props.configuration.bbg_xiv_miro_row_height
        const bandwidth   = this.props.configuration.bbg_xiv_bandwidth
        this.configuring  = this.props.configuration.show
        const initialized = this.props.initialized
        const setHover    = this.props.setHover
        if (this.configuring) {
            return (
                <div>Configuring...</div>
            )
        }
        if (typeof collection === 'string') {
            return <h1>{collection}</h1>
        }
        const jsx = [];
        collection.map((model, index) => {
             jsx.push(<JustifiedGalleryItem collectionId={id} index={index} data={model.attributes} captions={captions}
                              bandwidth={bandwidth}
                              initialized={initialized} hover={model.get("hover")} setHover={setHover} key={model.get("id")}/>);
        })
        console.log( 'JustifiedGalleryContainer():jsx=', jsx );
        return (
            <div className="bbg_xiv-container bbg_xiv-justified_container" data-bbg_xiv-gallery-id={collection.id}
                    ref={node => {this.container = node}}>
                <div className={`bbg_xiv-justified_gallery${captions?" bbg_xiv-caption_visible":""}`}>
                    {jsx}
                </div>
                {/* Full Browser Viewport View of an Image */}
                <div className="mc-rrr-react-overlay-root" />
            </div>
        )
    }
    componentDidMount() {
        if (!this.configuring) {
            console.log('componentDidMount():this.container=', this.container)
            window.bbg_xiv.postRenderJustified(this.container, this.rowHeight)
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.configuring) {
            console.log('componentDidUpdate():this.container=', this.container)
            window.bbg_xiv.postRenderJustified(this.container, this.rowHeight)
        }
    }
    componentDidCatch(error, info) {
        console.log('JustifiedGalleryContainer:', error, info)
    }
}
