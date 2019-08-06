import React from 'react'
import {STATUS_LOADING} from '../actions/index.js'
import FlexContainer from '../components/FlexContainer.js'

export default ({images, setView}) => {
    if (images.status === STATUS_LOADING) {
        return <div className="ui-loader"><span className="ui-icon-loading"></span></div>
    }
    let Container = FlexContainer
    console.log('Gallery:images=', images)
    switch (images.view) {
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
    return <Container images={images} setView={setView}></Container>
}
