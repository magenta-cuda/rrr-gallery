import { connect }                                     from 'react-redux'
import Gallery                                         from '../components/Gallery.js'
import {setView, loadGalleryImages, setContainerWidth} from '../actions/index.js'

const mapStateToProps = (state, ownProps) => {
    const images = state.galleries.images && state.galleries.images[ownProps.id] ? state.galleries.images[ownProps.id] : undefined
    return {
        id:             ownProps.id,
        images:         images,
        configuration:  state.configuration,
        containerWidth: images ? images.containerWidth : undefined,
        captions:       images ? images.captions       : false,
        fullScreen:     images ? images.fullScreen     : false
    }
}

const mapDispatchToProps = dispatch          => ({
    setView: (id, view)                   => dispatch(setView(id, view)),
    loadGalleryImages: (id, images, home) => dispatch(loadGalleryImages(id, images, home)),
    setContainerWidth: (id, width)        => dispatch(setContainerWidth(id, width))
})

export default connect(mapStateToProps, mapDispatchToProps)(Gallery)

