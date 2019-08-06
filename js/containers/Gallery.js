import { connect } from 'react-redux'
import Gallery from '../components/Gallery.js'

const mapStateToProps    = (state, ownProps) => ({
    images:  state.images[ownProps.id] ? state.images[ownProps.id] : 'images do not exists'
})

const mapDispatchToProps = dispatch          => ({
    setView: view => dispatch(mcRrr.setView(view))
})

export default connect(mapStateToProps, mapDispatchToProps)(Gallery)

