import React from 'react'

export default props => {
    function handleViewClick(e) {
        e.preventDefault()
        setView(selector, e.target.dataset.view)
    }
    function handleGalleryClick(e) {
        e.preventDefault()
        setGallery(selector, e.target.textContent)
        const specifiers = e.target.dataset.specifiers;
        if (specifiers === '') {
            // This is the Home gallery.
            const images = new wp.api.collections.Media()
            images.reset(JSON.parse(bbg_xiv[selector + '-data']))
            loadGalleryImages(selector, images, true)
            return
        }
        // extract individual gallery parameters
        // translation maps for gallery shortcode parameter names and values to WP REST API option names and values
        var nameMap = {
            id:      "parent",
            ids:     "include",
            bb_tags: "bb-tags"
        }
        // really should have a value map per parameter name but fortunately there are no overlaps
        var valueMap = {
            ASC:  "asc",
            DESC: "desc"
        }
        const matches    = specifiers.match(/(\w+)="([^"]+)"/g)
        const parameters = {}
        var ids          = false
        matches.forEach(function(match) {
            var specifier = match.match(/(\w+)="([^"]+)"/);
            // translate gallery shortcode parameters to WP REST API options
            parameters[nameMap[specifier[1]] ? nameMap[specifier[1]] : specifier[1]]
                = valueMap[specifier[2]] ? valueMap[specifier[2]] : specifier[2]
            if (specifier[1] === "ids") {
                ids = true;
            }
        });
        if (ids && !parameters.orderby) {
            // for ids use the explicit order in ids
            parameters.orderby = 'include'
        }
        getImagesByGallerySpecs(selector, parameters)
    }
    function handleQueryChange(e) {
        e.preventDefault()
        const query = e.target.value
        setQuery(selector, query)
    }
    // TODO: refactor handleSearchClick() and handlePageClick() into one function
    function handleSearchClick(e) {
        e.preventDefault()
        let searchLimit = parseInt( bbg_xiv.bbg_xiv_max_search_results, 10 )
        if (searchLimit > bbg_xiv.wpRestApiMaxPerPage) {
            searchLimit = bbg_xiv.wpRestApiMaxPerPage
        }
        const parms = {
            query:       query,
            page:        1,
            searchLimit: searchLimit
        }
        getImagesBySearchParms(selector, parms)
        // TODO: bbg_xiv.handleSearchClick() still has some code for hide/show of GUI elements
        bbg_xiv.handleSearchClick.call(e.currentTarget, e)
    }
    function handlePageClick(e, direction) {
        let searchLimit = parseInt( bbg_xiv.bbg_xiv_max_search_results, 10 )
        if (searchLimit > bbg_xiv.wpRestApiMaxPerPage) {
            searchLimit = bbg_xiv.wpRestApiMaxPerPage
        }
        const parms = {
            query:         search,
            page:          currentPage + (direction === 'next' ? 1 : -1),
            searchLimit:   searchLimit
        }
        getImagesBySearchParms(selector, parms)
    }
    function handleHomeButtonClick(e) {
        setGallery(selector, bbg_xiv_lang_2["Home"])
        const images = new wp.api.collections.Media()
        images.reset(JSON.parse(bbg_xiv[selector + '-data']))
        loadGalleryImages(selector, images, true)
    }
    function handleFullScreenButtonClick(e) {
        e.preventDefault()
        toggleFullScreen(selector)
    }
    function handleCaptionsButtonClick(e) {
        e.preventDefault()
        toggleCaptions(selector)
    }
    const {id, view, gallery, captions, fullScreen, status, query, search, currentPage, totalPages, setView, setGallery,
           toggleFullScreen, toggleCaptions, setQuery, getImagesByGallerySpecs, getImagesBySearchParms, loadGalleryImages}
            = props
    const selector  = 'gallery-' + id
    let   galleries = ''
    if ( typeof props.galleries !== 'undefined' ) {
        galleries = [
            <li className="divider"></li>,
            <li className="dropdown-header">{bbg_xiv_lang_2["GALLERIES"]}</li>,
            <li className={"bbg_xiv-alt_gallery bbg_xiv-alt_gallery_home"
                    + (gallery === bbg_xiv_lang_2['Home'] ? " active" : "")}>
                <a data-view="gallery_home" data-specifiers='' href="#" onClick={handleGalleryClick}>{bbg_xiv_lang_2["Home"]}</a>
            </li>
        ]
        galleries = galleries.concat(JSON.parse(props.galleries).map((aGallery, i) => (
            <li className={"bbg_xiv-alt_gallery" + (gallery === aGallery.title ? " active" : "")}>
                <a data-view={"gallery_" + i} data-specifiers={aGallery.specifiers} href="#" onClick={handleGalleryClick}>
                    {aGallery.title}
                </a>
            </li>
        )))
    }
    let dropdownText = bbg_xiv_lang_2["View"]
    switch (view) {
        case 'View':
            dropdownText = bbg_xiv_lang_2["View"]
            break
        case 'Gallery':
            dropdownText = bbg_xiv_lang_2["Gallery"]
            break
        case 'Carousel':
            dropdownText = bbg_xiv_lang_2["Carousel"]
            break
        case 'Justified':
            dropdownText = bbg_xiv_lang_2["Justified"]
            break
        case 'Tabs':
            dropdownText = bbg_xiv_lang_2["Tabs"]
            break
        case 'Dense':
            dropdownText = bbg_xiv_lang_2["Dense"]
            break
    }
    return (
        <React.Fragment>
            <nav role="navigation" className="navbar navbar-inverse bbg_xiv-gallery_navbar">
                <div className="navbar-header">
                    <button type="button" data-target={"#" + selector + "-navbarCollapse"} data-toggle="collapse"
                            className="navbar-toggle">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a href="#" className="navbar-brand bbg_xiv-images_brand">{bbg_xiv_lang_2["GALLERY MENU"]}</a>
                </div>
                <div id={selector + "-navbarCollapse"} className="collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                        <li className="dropdown bbg_xiv-select_view">
                            <a data-toggle="dropdown" className="dropdown-toggle bbg_xiv-selected_view" href="#">
                                <span>{dropdownText}</span> <b className="caret"></b>
                            </a>
                            <ul role="menu" className="dropdown-menu bbg_xiv-view_menu">
                                <li className="dropdown-header">{bbg_xiv_lang_2["VIEWS"]}</li>
                                <li className={"bbg_xiv-view bbg_xiv-view_gallery"
                                        + (view === "Gallery" ? " active" : "")}>
                                    <a data-view="Gallery" href="#" onClick={handleViewClick}>{bbg_xiv_lang_2["Gallery"]}</a>
                                </li>
                                <li className={"bbg_xiv-view bbg_xiv-view_carousel bbg_xiv-hide_for_gallery_icons"
                                        + (view === "Carousel" ? " active" : "")}>
                                    <a data-view="Carousel" href="#" onClick={handleViewClick}>{bbg_xiv_lang_2["Carousel"]}</a>
                                </li>
                                <li className={"bbg_xiv-view bbg_xiv-view_justified bbg_xiv-hide_for_gallery_icons"
                                        + (view === "Justified" ? " active" : "")}>
                                    <a data-view="Justified" href="#" onClick={handleViewClick}>{bbg_xiv_lang_2["Justified"]}</a>
                                </li>
                                <li className={"bbg_xiv-view bbg_xiv-view_tabs"
                                        + (view === "Tabs" ? " active" : "")}>
                                    <a data-view="Tabs" href="#" onClick={handleViewClick}>{bbg_xiv_lang_2["Tabs"]}</a>
                                </li>
                                <li className={"bbg_xiv-view bbg_xiv-hide_for_gallery_icons bbg_xiv-large_viewport_only"
                                        + (view === "Dense" ? " active" : "")}>
                                    <a data-view="Dense" href="#" onClick={handleViewClick}>{bbg_xiv_lang_2["Dense"]}</a>
                                </li>
                                {/* TODO: Add entry for new views here. */}
                                $table_nav_item
                                {/* output menu items for dynamically loaded galleries */}
                                {galleries}
                            </ul>
                        </li>
                    </ul>
                    <form role="search" className="navbar-form navbar-left bbg_xiv-search_form">
                        <div className="form-group">
                            <div className="input-group">
                                <input type="text" placeholder={bbg_xiv_lang_2["Search Images on Site"]}
                                        className="form-control" autoComplete="off" onChange={handleQueryChange} />
                                <span className="input-group-btn">
                                    <button type="submit" className="btn btn-default bbg_xiv-search" title="start search"
                                            disabled={status!=="loaded"} onClick={handleSearchClick}>
                                            {/* // TODO: "loaded" -> STATUS_LOADED */}
                                        <span className="glyphicon glyphicon-search"></span>
                                    </button>
                                </span>
                            </div>
                        </div>
                        $nonce_field
                    </form>
                    <button type="button" className="btn btn-info bbg_xiv-help" title={bbg_xiv_lang_2["get help"]}
                            onClick={e => {bbg_xiv.handleHelpClick.call(e.currentTarget, e)}}>
                        <span className="glyphicon glyphicon-question-sign"></span>
                        <span className="bbg_xiv-navbar_button_text">{bbg_xiv_lang_2["Help"]}</span>
                    </button>
                    <button type="button" className="btn btn-info bbg_xiv-configure"
                            title={bbg_xiv_lang_2["configure bandwidth, carousel interval, ..."]}
                            onClick={e => {mcRrr.setConfigureShow(true)}}>
                        <span className="glyphicon glyphicon-cog"></span>
                        <span className="bbg_xiv-navbar_button_text">{bbg_xiv_lang_2["Options"]}</span>
                    </button>
                    <button type="button" className="btn btn-info bbg_xiv-home"
                            title={bbg_xiv_lang_2["return to home gallery"]} onClick={handleHomeButtonClick}>
                        <span className="glyphicon glyphicon-home"></span>
                        <span className="bbg_xiv-navbar_button_text">{bbg_xiv_lang_2["Home"]}</span>
                    </button>
                    <button type="button" className="btn btn-info bbg_xiv-fullscreen"
                            title={fullScreen ? bbg_xiv_lang['shrink gallery from full-screen']
                                              : bbg_xiv_lang['expand gallery to full-screen']}
                            onClick={handleFullScreenButtonClick}>
                        <span className="glyphicon glyphicon-fullscreen"></span>
                        <span className="bbg_xiv-navbar_button_text">{bbg_xiv_lang_2["Fullscreen"]}</span>
                    </button>
                    <button type="button" className="btn btn-info bbg_xiv-titles"
                            title={captions ? bbg_xiv_lang['hide titles']
                                            : bbg_xiv_lang['show titles']}
                            onClick={handleCaptionsButtonClick}>
                        <span className="glyphicon glyphicon-subtitles"></span>
                        <span className="bbg_xiv-navbar_button_text">{bbg_xiv_lang_2["Titles"]}</span>
                    </button>
                </div>
            </nav>
            {search ?
                // Search Headings
                <div id={`${selector}-heading`} className="bbg_xiv-search_header">
                    <span className="bbg_xiv-search_heading_first">
                        {`${bbg_xiv_lang["Search Results for"]} "${search}"`}
                    </span><br />
                    <button className="btn btn-primary btn-sm bbg_xiv-search_scroll_left"
                            disabled={currentPage === 1}
                            onClick={e => {handlePageClick(e, 'prev')}}>
                        <span className="glyphicon glyphicon-chevron-left"></span>
                    </button>
                    <span className="bbg_xiv-search_heading_second">
                        {`${bbg_xiv_lang.Page} ${currentPage} ${bbg_xiv_lang.of} ${totalPages}`}
                    </span>
                    <button className="btn btn-primary btn-sm bbg_xiv-search_scroll_right"
                            disabled={currentPage === totalPages}
                            onClick={e => {handlePageClick(e, 'next')}}>
                        <span className="glyphicon glyphicon-chevron-right"></span>
                    </button>
                </div>
            : null
        }
        </React.Fragment>
    )
}
