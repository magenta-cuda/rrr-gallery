import { connect }                  from 'react-redux'
import Gallery                      from '../components/Gallery.js'
import {setView, loadGalleryImages} from '../actions/index.js'

const mapStateToProps    = (state, ownProps) => ({
    id:            ownProps.id,
    images:        state.galleries.images && state.galleries.images[ownProps.id] ? state.galleries.images[ownProps.id] : null,
    configuration: state.configuration
})

const mapDispatchToProps = dispatch          => ({
    setView: (id, view)             => dispatch(setView(id, view)),
    loadGalleryImages: (id, images) => dispatch(loadGalleryImages(id, images))
})

export default connect(mapStateToProps, mapDispatchToProps)(Gallery)

