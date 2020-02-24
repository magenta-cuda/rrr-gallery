import {connect} from 'react-redux'
import Configure from '../components/Configure.js'
import {setConfiguration} from '../actions/index.js'

const mapDispatchToProps = dispatch => ({
    setConfiguration: configuration => dispatch(setConfiguration(configuration))
})

export default connect(null, mapDispatchToProps)(Configure)

