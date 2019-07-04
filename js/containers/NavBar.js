// currently unused as component NavBar code is still in a inline script in bbg_xiv-gallery.php

import { connect } from 'react-redux'
import NavBar from '../components/NavBar.js'

const mapStateToProps = (state, ownProps) => {
    return {id: ownProps.id, galleries: ownProps.galleries, view: state.view}
}

export default connect(mapStateToProps)(NavBar)

