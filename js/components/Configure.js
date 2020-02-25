// Configure does not use the Redux store. It is an experiment to try React 16.8's State hooks.
// Configure is independently rendered with its own DOM root.

import React, {useState, useEffect} from 'react'

export default props => {
    // Use React 16.8's State hook
    const [initialized,        setInitialized       ] = useState(false                                            )
    const [show,               setShow              ] = useState(false                                            )
    const [carouselDelay,      setCarouselDelay     ] = useState(bbg_xiv.bbg_xiv_carousel_interval                )
    const [minImageWidth,      setMinImageWidth     ] = useState(bbg_xiv.bbg_xiv_flex_min_width                   )
    const [miroRowHeight,      setMiroRowHeight     ] = useState(bbg_xiv.bbg_xiv_miro_row_height                  )
    const [maxSearchResults,   setMaxSearchResults  ] = useState(bbg_xiv.bbg_xiv_max_search_results               )
    const [columnsInDenseView, setColumnsInDenseView] = useState(bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns)
    const [defaultView,        setDefaultView       ] = useState(bbg_xiv.bbg_xiv_default_view                     )
    const [bandwidth,          setBandwidth         ] = useState(bbg_xiv.bbg_xiv_bandwidth                        )
    const [interface_,         setInterface         ] = useState(bbg_xiv.bbg_xiv_interface                        )
    if (!initialized) {
        const configuration = {
            bbg_xiv_carousel_interval:                 bbg_xiv.bbg_xiv_carousel_interval,
            bbg_xiv_flex_min_width:                    bbg_xiv.bbg_xiv_flex_min_width,
            bbg_xiv_miro_row_height:                   bbg_xiv.bbg_xiv_miro_row_height,
            bbg_xiv_max_search_results:                bbg_xiv.bbg_xiv_max_search_results,
            bbg_xiv_flex_number_of_dense_view_columns: bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns,
            bbg_xiv_bandwidth:                         bbg_xiv.bbg_xiv_bandwidth,
            bbg_xiv_interface:                         bbg_xiv.bbg_xiv_interface
        }
        props.setConfiguration(configuration)
        setInitialized(true)
    }
    mcRrr.setConfigureShow = setShow
    console.log('carouselDelay=',      carouselDelay     )
    console.log('minImageWidth-',      minImageWidth     )
    console.log('miroRowHeight=',      miroRowHeight     )
    console.log('maxSearchResults=',   maxSearchResults  )
    console.log('columnsInDenseView=', columnsInDenseView)
    console.log('defaultView=',        defaultView       )
    console.log('bandwidth=',          bandwidth         )
    console.log('interface_=',         interface_        )
    useEffect(() => {
        // Save configuration in a cookie
        const cookie = {
            bbg_xiv_carousel_interval:                 carouselDelay,
            bbg_xiv_flex_min_width:                    minImageWidth,
            bbg_xiv_miro_row_height:                   miroRowHeight,
            bbg_xiv_max_search_results:                maxSearchResults,
            bbg_xiv_flex_number_of_dense_view_columns: columnsInDenseView,
            bbg_xiv_default_view:                      defaultView,         // TODO: bbg_xiv.usingServerDefaultView?
            bbg_xiv_bandwidth:                         bandwidth,
            bbg_xiv_interface:                         interface_
        }
        props.setConfiguration(cookie)
        bbg_xiv.setCookie("bbg_xiv", JSON.stringify(cookie), 30)
        bbg_xiv.getOptionsFromCookie()
        // TODO: bbg_xiv.calcBreakpoints()?
    })
    return (
        <React.Fragment>
            <div className="bbg_xiv-configure_outer" style={{display: show ? 'block' : 'none'}}>
            </div>
            <div className="bbg_xiv-configure_inner" style={{display: show ? 'block' : 'none'}}>
                <button className="bbg_xiv-configure_close" onClick={() => {console.log('setShow(false)'); setShow(false)}}>
                    <span className="glyphicon glyphicon-remove"></span>
                </button>
                <form className="form-horizontal">
                    <div className="form-group">
                        <h3 className="col-sm-offset-1 col-sm-5">BB Gallery Options</h3>
                        <div className="col-sm-5">
                            {/* Save and Cancel buttons are not needed as changes are immediately saved.
                            <button type="button" className="btn btn-primary bbg_xiv-options_btn bbg_xiv-save_options">
                                {bbg_xiv_lang_2["Save"]}
                            </button>
                            <button type="button" className="btn btn-default bbg_xiv-options_btn bbg_xiv-cancel_options">
                                {bbg_xiv_lang_2["Cancel"]}
                            </button>
                            */}
                            <button type="button" className="btn btn-info bbg_xiv-options_btn bbg_xiv-help_options">
                                {bbg_xiv_lang_2["Help"]}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bbg_xiv-carousel_delay" className="control-label col-sm-9 col-md-offset-2 col-md-6">
                            {bbg_xiv_lang_2["Carousel Time Interval in ms"]}
                        </label>
                        <div className="col-sm-3 col-md-2">
                            <input type="number" className="form-control" id="bbg_xiv-carousel_delay" min="1000" step="100"
                                    value={carouselDelay} onChange={(e) => {setCarouselDelay(Number(e.target.value))}} />
                                    {/* TODO: onChange() is triggered for every character but onBlur() does not work in React */}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bbg_xiv-min_image_width" className="control-label col-sm-9 col-md-offset-2 col-md-6">
                            {bbg_xiv_lang_2["Minimum Width for Gallery Images in px"]}
                        </label>
                        <div className="col-sm-3 col-md-2">
                            <input type="number" className="form-control" id="bbg_xiv-min_image_width" min="32" max="1024"
                                    value={minImageWidth} onChange={(e) => {setMinImageWidth(Number(e.target.value))}} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bbg_xiv-miro_row_height" className="control-label col-sm-9 col-md-offset-2 col-md-6">
                            {bbg_xiv_lang_2["Preferred Row Height for Justified Images in px"]}
                        </label>
                        <div className="col-sm-3 col-md-2">
                            <input type="number" className="form-control" id="bbg_xiv-miro_row_height" min="32" max="1024"
                                    value={miroRowHeight} onChange={(e) => {setMiroRowHeight(Number(e.target.value))}} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bbg_xiv-max_search_results" className="control-label col-sm-9 col-md-offset-2 col-md-6">
                            {bbg_xiv_lang_2["Maximum Number of Images Returned by Search"]}</label>
                        <div className="col-sm-3 col-md-2">
                            <input type="number" className="form-control" id="bbg_xiv-max_search_results" min="1"
                                    max="{$bbg_xiv_data['bbg_xiv_max_search_results']}" value={maxSearchResults}
                                    onChange={(e) => {setMaxSearchResults(Number(e.target.value))}} />
                        </div>
                    </div>
                    <div className="form-group bbg_xiv-mouse_only_option">
                        <label htmlFor="bbg_xiv-columns_in_dense_view" className="control-label col-sm-9 col-md-offset-2 col-md-6">
                            {bbg_xiv_lang_2["Number of Columns in the Dense View"]}
                        </label>
                        <div className="col-sm-3 col-md-2">
                            <input type="number" className="form-control" id="bbg_xiv-columns_in_dense_view" min="2" max="32"
                                    value={columnsInDenseView} onChange={(e) => {setColumnsInDenseView(Number(e.target.value))}} />
                        </div>
                    </div>
                    {/* TODO: checkboxes for radio buttons */}
                    <div className="form-group">
                        <label htmlFor="bbg_xiv-default_view_gallery" className="control-label col-sm-3 col-md-offset-2 col-md-2">
                            {bbg_xiv_lang_2["Initial View"]}
                        </label>
                        <div className="col-sm-9 col-md-6">
                            <span className="bbg_xiv-radio_input">
                                <input type="radio" className="form-control" name="bbg_xiv-default_view" value="Gallery"
                                        id="bbg_xiv-default_view_gallery" checked={defaultView === 'Gallery'}
                                        onChange={e => {if (e.target.checked) {setDefaultView(e.target.value)}}} />
                                <span className="bbg_xiv-radio_text">{bbg_xiv_lang_2["Gallery"]}</span>
                            </span>
                            <span className="bbg_xiv-radio_input">
                                <input type="radio" className="form-control" name="bbg_xiv-default_view" value="Justified"
                                        id="bbg_xiv-default_view_justified" checked={defaultView === 'Justified'}
                                        onChange={e => {if (e.target.checked) {setDefaultView(e.target.value)}}} />
                                <span className="bbg_xiv-radio_text">{bbg_xiv_lang_2["Justified"]}</span>
                            </span>
                            <span className="bbg_xiv-radio_input">
                                <input type="radio" className="form-control" name="bbg_xiv-default_view" value="Carousel"
                                        id="bbg_xiv-default_view_carousel" checked={defaultView === 'Carousel'}
                                        onChange={e => {if (e.target.checked) {setDefaultView(e.target.value)}}} />
                                <span className="bbg_xiv-radio_text">{bbg_xiv_lang_2["Carousel"]}</span>
                            </span>
                            <span className="bbg_xiv-radio_input">
                                <input type="radio" className="form-control" name="bbg_xiv-default_view" value="Tabs"
                                        id="bbg_xiv-default_view_tabs" checked={defaultView === 'Tabs'}
                                        onChange={e => {if (e.target.checked) {setDefaultView(e.target.value)}}} />
                                <span className="bbg_xiv-radio_text">{bbg_xiv_lang_2["Tabs"]}</span>
                            </span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bbg_xiv-bandwidth_auto" className="control-label col-sm-3 col-md-offset-2 col-md-2">
                            {bbg_xiv_lang_2["Bandwidth"]}
                        </label>
                        <div className="col-sm-9 col-md-6">
                            <span className="bbg_xiv-radio_input">
                                <input type="radio" className="form-control" name="bbg_xiv-bandwidth" value="auto"
                                        id="bbg_xiv-bandwidth_auto" checked={bandwidth === 'auto'}
                                        onChange={e => {if (e.target.checked) {setBandwidth(e.target.value)}}} />
                                <span className="bbg_xiv-radio_text">{bbg_xiv_lang_2["Auto"]}</span>
                            </span>
                            <span className="bbg_xiv-radio_input">
                                <input type="radio" className="form-control" name="bbg_xiv-bandwidth" value="normal"
                                        id="bbg_xiv-bandwidth_normal" checked={bandwidth === 'normal'}
                                        onChange={e => {if (e.target.checked) {setBandwidth(e.target.value)}}} />
                                <span className="bbg_xiv-radio_text">{bbg_xiv_lang_2["High"]}</span>
                            </span>
                            <span className="bbg_xiv-radio_input">
                                <input type="radio" className="form-control" name="bbg_xiv-bandwidth" value="low"
                                        id="bbg_xiv-bandwidth_low" checked={bandwidth === 'low'}
                                        onChange={e => {if (e.target.checked) {setBandwidth(e.target.value)}}} />
                                <span className="bbg_xiv-radio_text">{bbg_xiv_lang_2["Medium"]}</span>
                            </span>
                            <span className="bbg_xiv-radio_input">
                                <input type="radio" className="form-control" name="bbg_xiv-bandwidth" value="very low"
                                        id="bbg_xiv-bandwidth_very_low" checked={bandwidth === 'very low'}
                                        onChange={e => {if (e.target.checked) {setBandwidth(e.target.value)}}} />
                                <span className="bbg_xiv-radio_text">{bbg_xiv_lang_2["Low"]}</span>
                            </span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bbg_xiv-interface_auto" className="control-label col-sm-3 col-md-offset-2 col-md-2">
                            {bbg_xiv_lang_2["Interface"]}
                        </label>
                        <div className="col-sm-9 col-md-6">
                            <span className="bbg_xiv-radio_input">
                                <input type="radio" className="form-control" name="bbg_xiv-interface" value="auto"
                                        id="bbg_xiv-interface_auto" checked={interface_ === 'auto'}
                                        onChange={e => {if (e.target.checked) {setInterface(e.target.value)}}} />
                                <span className="bbg_xiv-radio_text">{bbg_xiv_lang_2["Auto"]}</span>
                            </span>
                            <span className="bbg_xiv-radio_input">
                                <input type="radio" className="form-control" name="bbg_xiv-interface" value="mouse"
                                        id="bbg_xiv-interface_mouse" checked={interface_ === 'mouse'}
                                        onChange={e => {if (e.target.checked) {setInterface(e.target.value)}}} />
                                <span className="bbg_xiv-radio_text">{bbg_xiv_lang_2["Mouse"]}</span>
                            </span>
                            <span className="bbg_xiv-radio_input">
                                <input type="radio" className="form-control" name="bbg_xiv-interface" value="touch"
                                        id="bbg_xiv-interface_touch" checked={interface_ === 'touch'}
                                        onChange={e => {if (e.target.checked) {setInterface(e.target.value)}}} />
                                <span className="bbg_xiv-radio_text">{bbg_xiv_lang_2["Touch"]}</span>
                            </span>
                            <span className="bbg_xiv-radio_input bbg_xiv-null">
                                <input type="radio" className="form-control" name="bbg_xiv-interface" value="null"
                                        id="bbg_xiv-interface_null" disabled />
                                <span className="bbg_xiv-radio_text"></span>
                            </span>
                        </div>
                    </div>
                    <br />
                </form>
            </div>
        </React.Fragment>
    )
}
