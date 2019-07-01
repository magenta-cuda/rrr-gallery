import { connect } from 'react-redux'
import Gallery from '../components/Gallery'

const mapStateToProps = (state, ownProps) => {
    return {images: state.images[ownProps.id] ? state.images[ownProps.id] : 'images do not exists'}
}

export default connect(mapStateToProps)(Gallery)

