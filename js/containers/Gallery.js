import { connect } from 'react-redux'
import Gallery from '../components/Gallery.js'

const mapStateToProps = (state, ownProps) => {
    return {images: state.images[ownProps.id] ? state.images[ownProps.id] : 'images do not exists', view: state.view}
}

export default connect(mapStateToProps)(Gallery)

