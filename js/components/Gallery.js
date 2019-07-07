import React from 'react'
import FlexContainer from '../components/FlexContainer.js'

export default props => {
    console.log('Gallery.js:props=', props)
    let Container = FlexContainer
    switch (props.view) {
    case 'Gallery':
        Container = FlexContainer
        break
    case 'Carousel':
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
    return <Container images={props.images}></Container>
}
