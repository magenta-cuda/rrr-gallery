import React from 'react'
import {STATUS_LOADING} from '../actions/index.js'
import FlexContainer from '../components/FlexContainer.js'
import JustifiedGalleryContainer from '../components/JustifiedGalleryContainer.js'
import CarouselContainer from '../components/CarouselContainer.js'
import TabsContainer from '../components/TabsContainer.js'
import DenseContainer from '../components/DenseContainer.js'

export default class Gallery extends React.Component {
    constructor(props) {
        super(props)
    }
    static getDerivedStateFromError(error) {
        console.log('Gallery:', error)
        return {}
    }
    render() {
        const {id, images, configuration, view, containerWidth, captions, fullScreen, setView, setContainerWidth,
               showConfigure, setHover} = this.props
        if (!images || images.status === STATUS_LOADING) {
            return <div className="ui-loader"><span className="ui-icon-loading"></span></div>
        }
        let Container = FlexContainer
        console.log('Gallery:images=', images)
        switch (view) {
        case 'Gallery':
            Container = FlexContainer
            break
        case 'Carousel':
            Container = CarouselContainer
            break
        case 'Justified':
            Container = JustifiedGalleryContainer
            break
        case 'Tabs':
            Container = TabsContainer
            break
        case 'Dense':
            Container = DenseContainer
            break
        }
        return (
            <Container id={id} images={images} configuration={configuration} containerWidth={containerWidth} captions={captions}
                    setView={setView} setContainerWidth={setContainerWidth} showConfigure={showConfigure} setHover={setHover}>
            </Container>
        )
    }
    componentDidCatch(error, info) {
        console.log('Gallery:', error, info)
    }
}
