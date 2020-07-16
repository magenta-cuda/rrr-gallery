// Since configuration is per user it needs to be persisted on the client side in the browser local storage (or a cookie
// if browser local storage is not available). There are two copies of the configuration data. The raw data is stored in
// the browser local storage. The raw data is rationalized by rationalizeConfiguration() before storing in the Redux
// store. The Configure component is a view of the raw data. The rationalized data in the Redux store is what the
// application actually uses. The configuration data in the Redux store has an additional field named show. The show
// field controls the visibility of the Configure component.

import {SET_CONFIGURATION} from '../actions/index.js'
import common from '../common.js'

export default store => next => action => {
    function rationalizeConfiguration(configuration, defaultConfiguration) {
        let rationalizedConfiguration = defaultConfiguration
        var carousel_interval=configuration.bbg_xiv_carousel_interval;
        if(jQuery.isNumeric(carousel_interval)&&carousel_interval>=1000){
            rationalizedConfiguration.bbg_xiv_carousel_interval=carousel_interval;
        }
        var flex_min_width=configuration.bbg_xiv_flex_min_width;
        if(jQuery.isNumeric(flex_min_width)&&flex_min_width>=32&&flex_min_width<=1024){
            rationalizedConfiguration.bbg_xiv_flex_min_width=flex_min_width;
        }
        var miro_row_height = configuration.bbg_xiv_miro_row_height;
        if ( jQuery.isNumeric( miro_row_height ) && miro_row_height >= 32 && miro_row_height <= 512 ) {
            rationalizedConfiguration.bbg_xiv_miro_row_height = miro_row_height;
        }
        var max_search_results=configuration.bbg_xiv_max_search_results;
        if(jQuery.isNumeric(max_search_results)&&max_search_results>=1&&max_search_results<1048576){
            rationalizedConfiguration.bbg_xiv_max_search_results=max_search_results;
        }
        var flex_number_of_dense_view_columns=configuration.bbg_xiv_flex_number_of_dense_view_columns;
        if(jQuery.isNumeric(flex_number_of_dense_view_columns)&&flex_number_of_dense_view_columns>=2&&flex_number_of_dense_view_columns<=32){
            rationalizedConfiguration.bbg_xiv_flex_number_of_dense_view_columns=flex_number_of_dense_view_columns;
        }
        if(typeof configuration.bbg_xiv_default_view==="string"){
            rationalizedConfiguration.bbg_xiv_default_view=configuration.bbg_xiv_default_view;
            rationalizedConfiguration.usingServerDefaultView=false;
        }else{
            rationalizedConfiguration.usingServerDefaultView=true;
        }
        if(typeof configuration.bbg_xiv_bandwidth==="string"){
            rationalizedConfiguration.bbg_xiv_bandwidth=configuration.bbg_xiv_bandwidth;
        }
        if(typeof configuration.bbg_xiv_interface==="string"){
            rationalizedConfiguration.bbg_xiv_interface=configuration.bbg_xiv_interface;
        }
        var userAgent=navigator.userAgent;
        if(userAgent.indexOf("Firefox")!==-1){
            rationalizedConfiguration.browser="Firefox";
        }else{
            rationalizedConfiguration.browser="";
        }
        // compute bandwidth if bandwidth is set to auto - currently since this is not done reliably the user should set the bandwidth option manually
        if (rationalizedConfiguration.bbg_xiv_bandwidth==="auto") {
            if (Modernizr.lowbandwidth) {
                // this uses navigator.connection which is only supported by Android
                rationalizedConfiguration.bbg_xiv_bandwidth = "very low";
            } else if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
                // determining bandwidth by device type is not reliable!
                rationalizedConfiguration.bbg_xiv_bandwidth = "very low";
            } else {
                rationalizedConfiguration.bbg_xiv_bandwidth = "low";
            }
        }
        // compute interface if interface is auto
        if(rationalizedConfiguration.bbg_xiv_interface==="auto"){
            if(Modernizr.touchevents){
                rationalizedConfiguration.guiInterface = 'touch';
            }else{
                rationalizedConfiguration.guiInterface = 'mouse';
            }
        }
        // WP REST API requires that per_page be between 1 and 100 inclusive
        rationalizedConfiguration.wpRestApiMaxPerPage=100;
        return rationalizedConfiguration
    }
    if (action.type === SET_CONFIGURATION) {
        let defaultConfiguration = common.getDefaultConfiguration()
        let cookie               = common.getCookie("bbg_xiv")
        let configuration        = cookie ? JSON.parse(cookie) : defaultConfiguration
        // show now handled by action SET_SHOW_CONFIGURATION
        // let show                 = action.configuration.show
        // delete action.configuration.show
        configuration            = Object.assign(configuration, action.configuration)
        // store updated raw configuration data in browser local storage
        common.setCookie("bbg_xiv", JSON.stringify(configuration), 30)
        // rationalize raw configuration data before storing in Redux store
        action.configuration     = rationalizeConfiguration(configuration, defaultConfiguration)
        // if (typeof show !== 'undefined') {
        //     action.configuration.show = show
        // }
        // Since, the code in bbg_xiv_gallery.js still uses window.bbg_xiv for configuration data propagate
        // action.configuration to window.bbg_xiv.
        // TODO: When window.bbg_xiv becomes obsolete remove this.
        Object.assign(window.bbg_xiv, action.configuration)
    }
    return next(action)
}
