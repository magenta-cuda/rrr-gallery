// Since configuration is per user it needs to be persisted on the client side in a cookie or in local storage

import {SET_CONFIGURATION} from '../actions/index.js'

export default store => next => action => {
    function getDefaultConfiguration() {
        // The default configuration is provided by the WordPress server via window.bbg_xiv.* variables.
        return {
            bbg_xiv_carousel_interval:                 bbg_xiv.bbg_xiv_carousel_interval,
            bbg_xiv_flex_min_width:                    bbg_xiv.bbg_xiv_flex_min_width,
            bbg_xiv_miro_row_height:                   bbg_xiv.bbg_xiv_miro_row_height,
            bbg_xiv_max_search_results:                bbg_xiv.bbg_xiv_max_search_results,
            bbg_xiv_flex_number_of_dense_view_columns: bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns,
            bbg_xiv_flex_min_width_for_caption:        bbg_xiv.bbg_xiv_flex_min_width_for_caption,
            bbg_xiv_bandwidth:                         'auto',
            bbg_xiv_interface:                         bbg_xiv.bbg_xiv_interface,
            show:                                      false
        }
    }
    function getCookie(name) {
        if(bbg_xiv.localStorageAvailable){
            return localStorage.getItem(name);
        }else{
            var cookie=document.cookie;
            cookie += ";";
            var start=cookie.indexOf(name+"=");
            if(start===-1){
                return null;
            }
            start+=name.length+1;
            var end=cookie.indexOf(";",start);
            if(end===-1){
                return null;
            }
            return cookie.substring(start,end);
        }
    }
    function setCookie(name, value, expires) {
        if(bbg_xiv.localStorageAvailable){
            localStorage.setItem(name,value);
        }else{
            var d=new Date();
            d.setTime(d.getTime()+(expires*24*60*60*1000));
            document.cookie=name+"="+value+"; expires="+d.toUTCString()+"; path=/";
        }
    }
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
        rationalizedConfiguration.show = configuration.show
        return rationalizedConfiguration
    }
    if (action.type === SET_CONFIGURATION) {
        let defaultConfiguration = getDefaultConfiguration()
        let cookie               = getCookie("bbg_xiv")
        let configuration        = cookie ? JSON.parse(cookie) : defaultConfiguration
        configuration            = Object.assign(configuration, action.configuration)
        const show               = configuration.show
        delete configuration.show
        setCookie("bbg_xiv", JSON.stringify(configuration), 30)
        configuration.show       = show
        action.configuration     = rationalizeConfiguration(configuration, defaultConfiguration)
    }
    return next(action)
}
