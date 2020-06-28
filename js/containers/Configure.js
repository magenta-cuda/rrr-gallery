import {connect} from 'react-redux'
import Configure from '../components/Configure.js'
import {setConfiguration, setShowConfiguration} from '../actions/index.js'
import common from '../common.js'

const mapStateToProps = state => {
    // Configure is a view of the raw configuration data stored in the browser's local storage or in browser cookies.
    // I.e., it is not a view of the rationalized configuration data stored in the Redux store.
    const cookie        = common.getCookie("bbg_xiv")
    const configuration = cookie ? JSON.parse(cookie) : common.getDefaultConfiguration()
    return {
        carouselDelay:      configuration.bbg_xiv_carousel_interval,
        minImageWidth:      configuration.bbg_xiv_flex_min_width,
        miroRowHeight:      configuration.bbg_xiv_miro_row_height,
        maxSearchResults:   configuration.bbg_xiv_max_search_results,
        columnsInDenseView: configuration.bbg_xiv_flex_number_of_dense_view_columns,
        defaultView:        configuration.bbg_xiv_default_view,   // TODO: bbg_xiv.usingServerDefaultView?
        bandwidth:          configuration.bbg_xiv_bandwidth,
        interface:          configuration.bbg_xiv_interface,
        show:               state.configuration.show
    }
}

const mapDispatchToProps = dispatch => ({
    setConfiguration: configuration => dispatch(setConfiguration(configuration)),
    hideConfigure: ()               => dispatch(setShowConfiguration(false)),
    setCarouselDelay: delay         => dispatch(setConfiguration({bbg_xiv_carousel_interval:                 delay     })),
    setMinImageWidth: width         => dispatch(setConfiguration({bbg_xiv_flex_min_width:                    width     })),
    setMiroRowHeight: height        => dispatch(setConfiguration({bbg_xiv_miro_row_height:                   height    })),
    setMaxSearchResults: max        => dispatch(setConfiguration({bbg_xiv_max_search_results:                max       })),
    setColumnsInDenseView: columns  => dispatch(setConfiguration({bbg_xiv_flex_number_of_dense_view_columns: columns   })),
    setDefaultView: view            => dispatch(setConfiguration({bbg_xiv_default_view:                      view      })),
    setBandwidth: bandwidth         => dispatch(setConfiguration({bbg_xiv_bandwidth:                         bandwidth })),
    setInterface: interface_        => dispatch(setConfiguration({bbg_xiv_interface:                         interface_}))
})

export default connect(mapStateToProps, mapDispatchToProps)(Configure)

