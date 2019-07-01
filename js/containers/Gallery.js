import { connect } from 'react-redux'
import Gallery from '../components/Gallery'

const mapStateToProps = state => {
    return {images: state.images[state.id]}
}

export default connect(mapStateToProps)(Gallery)

