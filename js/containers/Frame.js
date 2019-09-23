import {connect} from 'react-redux'
import Frame     from '../components/Frame.js'

const mapStateToProps = (state, ownProps) => {
    const imagesId = 'gallery-' + ownProps.id
    const images   = state.galleries.images && state.galleries.images[imagesId] ? state.galleries.images[imagesId] : undefined
    console.log( 'containers/Frame:images=', images )
    return {
        home:       images && images.home       ? true : false,
        fullScreen: images && images.fullScreen ? true : false
    }
}

export default connect(mapStateToProps)(Frame)
