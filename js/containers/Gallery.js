import { connect }                  from 'react-redux'
import Gallery                      from '../components/Gallery.js'
import {setView, loadGalleryImages} from '../actions/index.js'

const mapStateToProps    = (state, ownProps) => ({
    id:     ownProps.id,
    images: state.images && state.images[ownProps.id] ? state.images[ownProps.id] : null
})

const mapDispatchToProps = dispatch          => ({
    setView: (id, view)             => dispatch(setView(id, view)),
    loadGalleryImages: (id, images) => dispatch(loadGalleryImages(id, images))
})

export default connect(mapStateToProps, mapDispatchToProps)(Gallery)

