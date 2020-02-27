import {connect} from 'react-redux'
import Configure from '../components/Configure.js'
import {setConfiguration} from '../actions/index.js'

const mapStateToProps = state => {
    const configuration = state.configuration
    return {
        carouselDelay:      configuration.bbg_xiv_carousel_interval,
        minImagewidth:      configuration.bbg_xiv_flex_min_width,
        miroRowHeight:      configuration.bbg_xiv_miro_row_height,
        maxSearchResults:   configuration.bbg_xiv_max_search_results,
        columnsInDenseView: configuration.bbg_xiv_flex_number_of_dense_view_columns,
        defaultView:        configuration.bbg_xiv_default_view,   // TODO: bbg_xiv.usingServerDefaultView?
        bandwidth:          configuration.bbg_xiv_bandwidth,
        interface:          configuration.bbg_xiv_interface,
        show:               configuration.show
    }
}

const mapDispatchToProps = dispatch => ({
    setConfiguration: configuration => dispatch(setConfiguration(configuration))
})

export default connect(mapStateToProps, mapDispatchToProps)(Configure)

