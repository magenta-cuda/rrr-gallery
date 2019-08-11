<?php

/*
Plugin Name: RRR Gallery
Plugin URI: http://docs.magentacuda.com/
Description: Gallery using REST, React, Redux, Backbone, Bootstrap and CSS3 Flexbox
Version: 2.0
Author: Magenta Cuda
Author URI: http://magentacuda.com/
License: GPL2
*/

/*
    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Copyright 2015  Magenta Cuda
*/

# This is a plug compatible replacement for the built-in WordPress gallery shortcode.
# This was forked from BB Gallery - https://github.com/magenta-cuda/bb-gallery.
# It replaces the user definable Backbone.js templates with React components.
# The React components use the same Twitter Bootstrap stylesheets.

class BBG_XIV_Gallery {

    public  static $nonce_action             = 'bbg_xiv-search';
    private static $gallery_menu_items_count = 5;
    private static $translations             = NULL;
    private static $bbg_xiv_data             = NULL;
    private static $bbg_xiv_lang             = NULL;
  
    # excerpted from the WordPress function gallery_shortcode() of .../wp-includes/media.php

    public static function bb_gallery_shortcode( $attr, $content = '' ) {
        # error_log( 'bb_gallery_shortcode():called' );
        if (  is_feed( ) || ( is_array( $attr ) && !empty( $attr[ 'mode' ] ) && $attr[ 'mode' ] === 'wordpress' ) ) {
            # invoke the standard WordPress gallery shortcode function
            unset( $attr[ 'mode' ] );
            return gallery_shortcode( $attr );
        }

        if ( is_array( $attr ) && !empty( $attr[ 'mode' ] ) && $attr[ 'mode' ] === 'get_first' ) {
            # in this mode only the first image is returned for use as a representative image for a gallery
            unset( $attr[ 'mode' ] );
            $get_first = TRUE;
            ob_start( );
            #TODO: set underlying SQL LIMIT to 1
        }

        foreach( [ 'thumbnail', 'medium', 'medium_large', 'large', 'full' ] as $size ) {
            $label = "{$size}_width";
            $width = intval( get_option( "{$size}_size_w" ) );
            if ( !$width && $size === 'medium_large' ) {
                $width = 768;
            }
            $width = intval( 1.125 * $width );
            if ( $size === 'thumbnail' ) {
                $$label = $width;
            } else {
                $$label = $prev_width + 1;
            }
            $prev_width = $width;
        }

        ob_start( );
        require(  dirname( __FILE__ ) . '/bbg_xiv-gallery_templates_wp_rest.php' );
        $templates = ob_get_clean( );

        $post = get_post();

        static $instance = 10000;    # not 0 to create a different space from the WordPress "gallery" shortcode
        $instance++;
        
        $default_flags = [ ];
        switch ( get_option( 'bbg_xiv_use_tiles', 'Cover' ) ) {
        case 'Cover':
            $default_flags[ ] = 'tiles';
            break;
        case 'Contain':
            $default_flags[ ] = 'tiles';
            $default_flags[ ] = 'contain';
            break;
        case 'Fill':
            $default_flags[ ] = 'tiles';
            $default_flags[ ] = 'fill';
            break;
        }
        if ( get_option( 'bbg_xiv_use_embedded_carousel', TRUE ) ) {
            $default_flags[ ] = 'embedded-carousel';
        }

        if ( is_array( $attr) ) {
            if ( !empty( $attr[ 'mode' ] ) && $attr[ 'mode' ] === "galleries" ) {
                # this is a proprietary mode to display altgallery entries as a gallery of representative images
                $gallery_icons_mode = TRUE;
            }
            if ( !empty( $attr[ 'view' ] ) ) {
                # this sets the initial view of a gallery - gallery, carousel or tabs
                $default_view = $attr[ 'view' ];
            }
            if ( !empty( $attr[ 'flags' ] ) ) {
                # flag to set embedded carousel mode
                $flags = $attr[ 'flags' ];
            }
        }

        # merge the default flags and the flags from the shortcode
        if ( empty( $flags ) ) {
            $flags = $default_flags;
        } else {
            $flags = explode( ',', $flags );
            $flags = array_merge( $default_flags, $flags );
            $flags = array_unique( $flags );
        }
        # handle cancel flags
        foreach( [ 'embedded-carousel', 'tiles', 'contain', 'fill' ] as $flag ) {
            if ( ( $i = array_search( 'no-' . $flag, $flags ) ) !== FALSE ) {
                unset( $flags[ $i ] );
                if ( ( $j = array_search( $flag, $flags ) ) !== FALSE ) {
                    unset( $flags[ $j ] );
                }
            }
        }
        $flags = implode( ',', $flags );

        $galleries = [ ];
        if ( $content ) {
            # Unfortunately (and also I think incorrectly) the 'the_content' filter wptexturize() from formatting.php will process the parameters of shortcodes
            # prettifying the quote marks. So, we need to undo this mutilation and restore the original content.
            # Opinion: WordPress seems to love regex but regex is simply inadequate for parsing HTML!
            $content = preg_replace( '/&#8216;|&#8217;|&#8220;|&#8221;|&#8242;|&#8243;/', '"', $content );
            if ( preg_match_all( '#\[altgallery\s+title="([^"]+)"\s+([^\]]+)\]#m', $content, $matches, PREG_SET_ORDER ) ) {
                foreach ( $matches as $match ) {
                    $gallery = $galleries[ ] = (object) [ 'title' => $match[ 1 ], 'specifiers' => $match[ 2 ] ];
                    if ( !empty( $gallery_icons_mode ) ) {
                        $gallery->specifiers = preg_replace_callback( [ '/(^|\s+)(image)="(\d+)"/', '/(^|\s+)(caption)="([^"]*)"/' ],
                            function( $matches ) use ( $gallery ) {
                                $gallery->$matches[ 2 ] = $matches[ 3 ];
                                return '';
                            }, $gallery->specifiers );
                        if ( empty( $gallery->image ) ) {
                            # no image specified so use the first image of the gallery
                            $gallery_attr = [ 'mode' => 'get_first' ];
                            preg_replace_callback( '/(\w+)=("|\')(.*?)\2/', function( $matches ) use ( &$gallery_attr ) {
                                $gallery_attr[ $matches[ 1 ] ] = $matches[ 3 ];
                            }, $gallery->specifiers );
                            $attachment = self::bb_gallery_shortcode( $gallery_attr );
                            $gallery->image = $attachment[ 'id' ];
                        }
                        if ( empty( $gallery->caption ) ) {
                            $gallery->caption = $gallery->title;
                        }
                    }
                }
            }
            if ( !empty( $gallery_icons_mode ) ) {
                // construct a 'ids' parameter with ids of gallery icons
                $attr[ 'ids' ] = implode( ',', array_map( function( $gallery ) {
                    return $gallery->image;
                }, $galleries ) );
            }
        }

        if ( ! empty( $attr['ids'] ) ) {
          // 'ids' is explicitly ordered, unless you specify otherwise.
          if ( empty( $attr['orderby'] ) ) {
            $attr['orderby'] = 'post__in';
          }
          $attr['include'] = $attr['ids'];
        }

        /**
         * Filter the default gallery shortcode output.
         *
         * If the filtered output isn't empty, it will be used instead of generating
         * the default gallery template.
         *
         * @since 2.5.0
         * @since 4.2.0 The `$instance` parameter was added.
         *
         * @see gallery_shortcode()
         *
         * @param string $output   The gallery output. Default empty.
         * @param array  $attr     Attributes of the gallery shortcode.
         * @param int    $instance Unique numeric ID of this gallery shortcode instance.
         */

        $output = apply_filters( 'post_gallery', '', $attr, $instance );
        if ( $output != '' ) {
          return $output;
        }

        $atts = shortcode_atts( array(
          'order'      => 'ASC',
          'orderby'    => 'menu_order',
          'id'         => $post ? $post->ID : 0,
          'size'       => 'thumbnail',
          'include'    => '',
          'exclude'    => '',
          'link'       => '',
          'bb_tags'    => ''
        ), $attr, 'gallery' );

        $id = intval( $atts['id'] );

        $selector = "gallery-{$instance}";

        # map gallery shortcode parameters to WP REST API parameters
        $orderby_map = [
            'menu_order' => 'menu_order',
            'title'      => 'title',
            'post_date'  => 'date',
            'rand'       => 'rand',
            'ID'         => 'id',
            'post__in'   => 'include'
        ];
        $order_map = [
            'ASC'  => 'asc',
            'DESC' => 'desc'
        ];
        # Initialize the Backbone.js collection using data from the WP REST API for the WP REST API model
        $attributes = [
            'author'         => [ ],
            'author_exclude' => [ ],
            'menu_order'     => '', 
            'offset'         => '',
            'order'          => $order_map[ $atts[ 'order' ] ],
            'orderby'        => $orderby_map[ $atts[ 'orderby' ] ],
            'page'           => 1,
            'include'        => [ ],
            'exclude'        => [ ],
            'per_page'       => 10,
            'slug'           => '',
            'parent'         => '',
            'parent_exclude' => '',
            'status'         => 'any',
            'search'         => ''
        ];
        if ( ! empty( $atts['bb_tags'] ) ) {
            // Translate the terms of the proprietary 'bb_tags' attribute to ids
            $bb_tags = array_map( 'trim', explode( ',', $atts['bb_tags'] ) );
            $attributes[ 'bb-tags'  ] = get_terms( [ 'taxonomy' => 'bb_tags', 'slug' => $bb_tags, 'name' => $bb_tags, 'fields' => 'ids', 'hide_empty' => FALSE ] );
        } else if ( ! empty( $atts[ 'include' ] ) ) {
            $attributes[ 'include'  ] = explode( ',', $atts[ 'include' ] );
            $attributes[ 'per_page' ] = count( $attributes[ 'include' ] );
        } elseif ( !empty( $atts[ 'exclude' ] ) ) {
            $attributes[ 'parent'   ] = [ $id ];
            $attributes[ 'exclude'  ] = explode( ',', $atts[ 'exclude' ] );
            $attributes[ 'per_page' ] = 1024;
        } else {
            $attributes[ 'parent'   ] = [ $id ];
            $attributes[ 'per_page' ] = 1024;
        }
        if ( !empty( $get_first ) ) {
            $attributes[ 'per_page' ] = 1;
        }
        $request = new WP_REST_Request( 'GET', '/wp/v2/media' );
        $request->set_query_params( $attributes );
        # TODO: $request may need to set some of the params below
        #$request->set_body_params( wp_unslash( $_POST ) );
        #$request->set_file_params( $_FILES );
        #$request->set_headers( $this->get_headers( wp_unslash( $_SERVER ) ) );
        #$request->set_body( $this->get_raw_data() );
        #$request->set_url_params( $args );
        #$request->set_attributes( $handler );
        #$request->set_default_params( $defaults );
        self::add_additional_rest_fields( );
        $controller = new WP_REST_Attachments_Controller( "attachment" );
        # error_log( 'bb_gallery_shortcode():$request=' . print_r( $request, true ) );
        // $attachments = $controller->get_items( $request )->data;
        $attachments = $controller->get_items( $request );
        # error_log( 'bb_gallery_shortcode():$attachments=' . print_r( $attachments, true ) );
        $attachments = $attachments->data;
        if ( !empty( $get_first ) ) {
            ob_end_clean( );
            return reset( $attachments );
        }
        if ( !empty( $gallery_icons_mode ) ) {
            # replace title and caption for image with title and caption for gallery and also remember the gallery index
            foreach ( $galleries as $i => $gallery ) {
                if ( empty( $attachments[ $i ] ) ) {
                    # this is an error probably caused by a duplicate image id
                    continue;
                }
                $attachment =& $attachments[ $i ];
                if ( (integer) $gallery->image === (integer) $attachment[ 'id' ] ) {
                    # if this is not true then there probably is a duplicate image id
                    $attachment[ 'gallery_index' ]       = $i;
                    $attachment[ 'title' ][ 'rendered' ] = $gallery->title;
                    $attachment[ 'caption' ]             = $gallery->caption;
                    $attachment[ 'description' ]         = '';
                }
            }
        }

        $bbg_xiv_data                     = self::$bbg_xiv_data;
        $bbg_xiv_data[ "$selector-data" ] = json_encode( $attachments );
 
        $float = is_rtl() ? 'right' : 'left';

        $size_class = sanitize_html_class( $atts['size'] );
        
        # The "Table View" is primarily intended for developers and should be disabled for production environmemts.
        $table_nav_item = '';
        if ( get_option( 'bbg_xiv_table' ) ) {
            $table_nav_item = <<<EOD
                        <li><a href="#">Table</a></li>
EOD;
        }

        if ( !$galleries ) {
            for ( $i = 1; $i <= self::$gallery_menu_items_count; $i++ ) {
                $option = get_option( "bbg_xiv_gallery_menu_$i", '' );
                if ( preg_match( '/^"([^"]+)":(.+)$/', $option, $matches ) === 1 ) {
                    $galleries[ ] = (object) [ 'title' => $matches[ 1 ], 'specifiers' => $matches[ 2 ] ];
                }
            }
        }
        $bbg_xiv_data['menu_galleries'] = json_encode( $galleries );

        wp_localize_script( 'bbg_xiv-gallery', 'bbg_xiv', $bbg_xiv_data );
        wp_localize_script( 'bbg_xiv-gallery', 'bbg_xiv_lang', self::$bbg_xiv_lang );

        ob_start( );
        wp_nonce_field( self::$nonce_action );
        $nonce_field  = ob_get_clean( );
        $translations = self::$translations;
        $output       = $templates;
        $output      .= <<<EOD
<div class="bbg_xiv-bootstrap bbg_xiv-gallery">
<!-- start of navbar JSX -->
<!-- \$translations should not be a prop since it is static so we need to initialize with some runtime
     JavaScript static and avoid the in-browser Babel transformer by precompiling instead -->
<script type="text/babel">
    window.bbg_xiv = window.bbg_xiv || {};
    window.bbg_xiv.NavBar = props => {
        function handleViewClick(e) {
            e.preventDefault()
            setView(selector, e.target.dataset.view)
        }
        function handleGalleryClick(e) {
            e.preventDefault()
            const specifiers = e.target.dataset.specifiers;
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
        function handleSearchClick(e) {
            bbg_xiv.handleSearchClick.call(e.currentTarget, e, getImagesBySearchParms)
        }
        function handlePageClick(e, direction) {
            let searchLimit = parseInt( bbg_xiv.bbg_xiv_max_search_results, 10 )
            if (searchLimit > bbg_xiv.wpRestApiMaxPerPage) {
                searchLimit = bbg_xiv.wpRestApiMaxPerPage
            }
            const parms = {
                query:         images.state.data.search,
                page:          images.state.currentPage + (direction === 'next' ? 1 : -1),
                searchLimit:   searchLimit
            }
            getImagesBySearchParms(selector, parms)
        }
        const {id, images, view, setView, getImagesByGallerySpecs, getImagesBySearchParms} = props
        const selector  = 'gallery-' + id
        let   galleries = ''
        if ( typeof props.galleries !== 'undefined' ) {
            galleries = [
                <li className="divider"></li>,
                <li className="dropdown-header">{$translations['GALLERIES']}</li>,
                <li className="bbg_xiv-alt_gallery bbg_xiv-alt_gallery_home active">
                    <a data-view="gallery_home" data-specifiers='' href="#">{$translations['Home']}</a>
                </li>
            ]
            galleries = galleries.concat(JSON.parse(props.galleries).map((gallery, i) => (
                <li className="bbg_xiv-alt_gallery">
                    <a data-view={"gallery_" + i} data-specifiers={gallery.specifiers} href="#" onClick={handleGalleryClick}>
                        {gallery.title}
                    </a>
                </li>
            )))
        }
        let dropdownText= "{$translations['View']}"
        switch (view) {
            case 'Gallery':
                dropdownText = "{$translations['Gallery']}"
                break;
            case 'Carousel':
                dropdownText = "{$translations['Carousel']}"
                break;
            case 'Justified':
                dropdownText = "{$translations['Justified']}"
                break;
            case 'Tabs':
                dropdownText = "{$translations['Tabs']}"
                break;
            case 'Dense':
                dropdownText = "{$translations['Dense']}"
                break;
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
                        <a href="#" className="navbar-brand bbg_xiv-images_brand">{$translations['GALLERY MENU']}</a>
                    </div>
                    <div id={selector + "-navbarCollapse"} className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            <li className="dropdown bbg_xiv-select_view">
                                <a data-toggle="dropdown" className="dropdown-toggle bbg_xiv-selected_view" href="#">
                                    <span>{dropdownText}</span> <b className="caret"></b>
                                </a>
                                <ul role="menu" className="dropdown-menu bbg_xiv-view_menu">
                                    <li className="dropdown-header">{$translations['VIEWS']}</li>
                                    <li className={"bbg_xiv-view bbg_xiv-view_gallery"
                                            + (view === "Gallery" ? " active" : "")}>
                                        <a data-view="Gallery" href="#" onClick={handleViewClick}>{$translations['Gallery']}</a>
                                    </li>
                                    <li className={"bbg_xiv-view bbg_xiv-view_carousel bbg_xiv-hide_for_gallery_icons"
                                            + (view === "Carousel" ? " active" : "")}>
                                        <a data-view="Carousel" href="#" onClick={handleViewClick}>{$translations['Carousel']}</a>
                                    </li>
                                    <li className={"bbg_xiv-view bbg_xiv-view_justified bbg_xiv-hide_for_gallery_icons"
                                            + (view === "Justified" ? " active" : "")}>
                                        <a data-view="Justified" href="#" onClick={handleViewClick}>{$translations['Justified']}</a>
                                    </li>
                                    <li className={"bbg_xiv-view bbg_xiv-view_tabs"
                                            + (view === "Tabs" ? " active" : "")}>
                                        <a data-view="Tabs" href="#" onClick={handleViewClick}>{$translations['Tabs']}</a>
                                    </li>
                                    <li className={"bbg_xiv-view bbg_xiv-hide_for_gallery_icons bbg_xiv-large_viewport_only"
                                            + (view === "Dense" ? " active" : "")}>
                                        <a data-view="Dense" href="#" onClick={handleViewClick}>{$translations['Dense']}</a>
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
                                    <input type="text" placeholder="{$translations['Search Images on Site']}"
                                            className="form-control" />
                                    <span className="input-group-btn">
                                        <button type="submit" className="btn btn-default bbg_xiv-search" title="start search"
                                                onClick={handleSearchClick}>
                                            <span className="glyphicon glyphicon-search"></span>
                                        </button>
                                    </span>
                                </div>
                            </div>
                            $nonce_field
                        </form>
                        <button type="button" className="btn btn-info bbg_xiv-help" title="{$translations['get help']}"
                                onClick={e => {bbg_xiv.handleHelpClick.call(e.currentTarget, e)}}>
                            <span className="glyphicon glyphicon-question-sign"></span>
                            <span className="bbg_xiv-navbar_button_text">{$translations['Help']}</span>
                        </button>
                        <button type="button" className="btn btn-info bbg_xiv-configure"
                                title="{$translations['configure bandwidth, carousel interval, ...']}"
                                onClick={e => {mcRrr.setConfigureShow(true)}}>
                            <span className="glyphicon glyphicon-cog"></span>
                            <span className="bbg_xiv-navbar_button_text">{$translations['Options']}</span>
                        </button>
                        <button type="button" className="btn btn-info bbg_xiv-home"
                                title="{$translations['return to home gallery']}">
                            <span className="glyphicon glyphicon-home"></span>
                            <span className="bbg_xiv-navbar_button_text">{$translations['Home']}</span>
                        </button>
                        <button type="button" className="btn btn-info bbg_xiv-fullscreen"
                                title="{$translations['toggle fullscreen']}">
                            <span className="glyphicon glyphicon-fullscreen"></span>
                            <span className="bbg_xiv-navbar_button_text">{$translations['Fullscreen']}</span>
                        </button>
                        <button type="button" className="btn btn-info bbg_xiv-titles"
                                title="{$translations['show/hide image titles']}"
                                onClick={e => {bbg_xiv.handleTitlesClick.call(e.currentTarget, e)}}>
                            <span className="glyphicon glyphicon-subtitles"></span>
                            <span className="bbg_xiv-navbar_button_text">{$translations['Titles']}</span>
                        </button>
                    </div>
                </nav>
                {images && images.query ?
                    // Search Headings
                    // TODO: \$ -> $ - needed for now since this in a PHP file.
                    <div id={`\${selector}-heading`} className="bbg_xiv-search_header" style={{display: images.query ? 'block' : 'none'}}>
                        {/* TODO: \$ -> $ - needed for now since this in a PHP file. */}
                        {/* TODO: Replace images.query with images.state.data.search - so property images.query is unnecessary */}
                        <span className="bbg_xiv-search_heading_first">
                            {`\${bbg_xiv_lang["Search Results for"]} "\${images.query}"`}
                        </span><br />
                        <button className="btn btn-primary btn-sm bbg_xiv-search_scroll_left"
                                disabled={images.state.currentPage === 1}
                                onClick={e => {handlePageClick(e, 'prev')}}>
                            <span className="glyphicon glyphicon-chevron-left"></span>
                        </button>
                        <span className="bbg_xiv-search_heading_second">
                            {/* TODO: \$ -> $ - needed for now since this in a PHP file. */}
                            {`\${bbg_xiv_lang.Page} \${images.state.currentPage} \${bbg_xiv_lang.of} \${images.state.totalPages}`}
                        </span>
                        <button className="btn btn-primary btn-sm bbg_xiv-search_scroll_right"
                                disabled={images.state.currentPage === images.state.totalPages}
                                onClick={e => {handlePageClick(e, 'next')}}>
                            <span className="glyphicon glyphicon-chevron-right"></span>
                        </button>
                    </div>
                : null
            }
            </React.Fragment>
        )
    }
    console.log('window.bbg_xiv.NavBar=', window.bbg_xiv.NavBar)

    const mapStateToProps = (state, ownProps) => ({
            id:        ownProps.id,
            // TODO: \$ -> $ - needed for now since this in a PHP file.
            images:    state.images && state.images[`gallery-\${ownProps.id}`] ? state.images[`gallery-\${ownProps.id}`] : null,
            galleries: ownProps.galleries, view: state.view
    })
    const mapDispatchToProps = dispatch => ({
        setView: (id, view)                  => dispatch(mcRrr.setView(id, view)),
        getImagesByGallerySpecs: (id, specs) => dispatch(mcRrr.getImagesByGallerySpecs(id, specs)),
        getImagesBySearchParms: (id, parms)  => dispatch(mcRrr.getImagesBySearchParms(id, parms))
    })
    window.bbg_xiv.NavBarContainer = mcRrr.connect(mapStateToProps, mapDispatchToProps)(window.bbg_xiv.NavBar)
</script>
<!-- end of navbar JSX -->
EOD;
        # Optionally show titles of dynamically loadable galleries as tab items
        if ( $galleries && empty( $gallery_icons_mode ) && get_option( 'bbg_xiv_use_gallery_tabs', TRUE ) ) {
            $output .= <<<EOD
    <!-- Gallery Tabs -->
    <div class="bbg_xiv-container bbg_xiv-gallery_tabs_container">
      <nav role="navigation" class="navbar navbar-default">
        <div class="navbar-header">
          <button type="button" data-target="#gallery_tabbar_collapse" data-toggle="collapse" class="navbar-toggle">
            <span class="sr-only">Toggle galleries</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a href="#" class="navbar-brand bbg_xiv-tabs_brand">{$translations['GALLERIES:']}</a>
        </div>
        <div id="gallery_tabbar_collapse" class="collapse navbar-collapse bbg_xiv-closed">
          <ul class="nav nav-tabs">
            <li class="bbg_xiv-tabs_title"><a href="#">{$translations['GALLERIES:']}</a></li>
        <li class="active"><a data-view="gallery_home" data-specifiers='' href="#">{$translations['Home']}</a></li>
EOD;
            foreach ( $galleries as $i => $gallery ) {
                $output .= <<<EOD
            <li><a data-view="gallery_$i" data-specifiers='$gallery->specifiers' href="#">$gallery->title</a></li>
EOD;
            }
            $output .= <<<EOD
          </ul>
        </div>
        <span class="glyphicon glyphicon-collapse-down"></span>
      </nav>
    </div>
EOD;
        }
        $class_gallery_icons_mode = empty( $gallery_icons_mode ) ? '' : ' bbg_xiv-gallery_icons_mode';
        $class_default_view       = empty( $default_view )       ? '' : ' bbg_xiv-default_view_' . $default_view;
        $flags                    = empty( $flags )              ? '' : $flags;
        $output .= <<<EOD
    <!-- Search or Gallery Headings -->
    <!--
    <div id="$selector-heading" class="bbg_xiv-search_header">
        <span class="bbg_xiv-search_heading_first"></span><br>
        <button class="btn btn-primary btn-sm bbg_xiv-search_scroll_left" disabled><span class="glyphicon glyphicon-chevron-left"></span></button>
        <span class="bbg_xiv-search_heading_second"></span>
        <button class="btn btn-primary btn-sm bbg_xiv-search_scroll_right"><span class="glyphicon glyphicon-chevron-right"></span></button>
    </div>
    -->
    <div id="$selector-alt_gallery_heading" class="bbg_xiv-alt_gallery_header">
        <span class="bbg_xiv-alt_gallery_heading"></span>
    </div>
    <div id="$selector"
            class="gallery galleryid-{$id} gallery-size-{$size_class} bbg_xiv-gallery_envelope{$class_gallery_icons_mode}{$class_default_view}"
            data-flags="{$flags}">
        <div id="mc-rrr-react-root-$selector" class="bbg_xiv-gallery"></div>
        <div class="ui-loader"><span class="ui-icon-loading"></span></div>
    </div>
<!-- start of configure JSX -->
<!-- \$translations should not be a prop since it is static so we need to initialize with some runtime
     JavaScript static and avoid the in-browser Babel transformer by precompiling instead -->
<script type="text/babel">
    window.bbg_xiv = window.bbg_xiv || {};
    // Configure does not use the Redux store. Configure is independently rendered with its own DOM root.
    window.bbg_xiv.Configure = props => {
        // Use React 16.8's State hook
        const [show,               setShow              ] = mcRrr.useState(false                                            )
        const [carouselDelay,      setCarouselDelay     ] = mcRrr.useState(bbg_xiv.bbg_xiv_carousel_interval                )
        const [minImageWidth,      setMinImageWidth     ] = mcRrr.useState(bbg_xiv.bbg_xiv_flex_min_width                   )
        const [miroRowHeight,      setMiroRowHeight     ] = mcRrr.useState(bbg_xiv.bbg_xiv_miro_row_height                  )
        const [maxSearchResults,   setMaxSearchResults  ] = mcRrr.useState(bbg_xiv.bbg_xiv_max_search_results               )
        const [columnsInDenseView, setColumnsInDenseView] = mcRrr.useState(bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns)
        const [defaultView,        setDefaultView       ] = mcRrr.useState(bbg_xiv.bbg_xiv_default_view                     )
        const [bandwidth,          setBandwidth         ] = mcRrr.useState(bbg_xiv.bbg_xiv_bandwidth                        )
        const [interface_,         setInterface         ] = mcRrr.useState(bbg_xiv.bbg_xiv_interface                        )
        mcRrr.setConfigureShow = setShow
        console.log('carouselDelay=',      carouselDelay     )
        console.log('minImageWidth-',      minImageWidth     )
        console.log('miroRowHeight=',      miroRowHeight     )
        console.log('maxSearchResults=',   maxSearchResults  )
        console.log('columnsInDenseView=', columnsInDenseView)
        console.log('defaultView=',        defaultView       )
        console.log('bandwidth=',          bandwidth         )
        console.log('interface_=',         interface_        )
        return (
            <React.Fragment>
                <div className="bbg_xiv-configure_outer" style={{display: show ? 'block' : 'none'}}>
                </div>
                <div className="bbg_xiv-configure_inner" style={{display: show ? 'block' : 'none'}}>
                    <button className="bbg_xiv-configure_close" onClick={() => {console.log('setShow(false)'); setShow(false)}}>
                        <span className="glyphicon glyphicon-remove"></span>
                    </button>
                    <h1>BB Gallery Options</h1>
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label htmlFor="bbg_xiv-carousel_delay" className="control-label col-sm-9 col-md-offset-2 col-md-6">
                                {$translations['Carousel Time Interval in ms']}
                            </label>
                            <div className="col-sm-3 col-md-2">
                                <input type="number" className="form-control" id="bbg_xiv-carousel_delay" min="1000" step="100"
                                        value={carouselDelay} onChange={(e) => {setCarouselDelay(Number(e.target.value))}} />
                                        {/* TODO: onChange() is triggered for every character but onBlur() does not work in React */}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bbg_xiv-min_image_width" className="control-label col-sm-9 col-md-offset-2 col-md-6">
                                {$translations['Minimum Width for Gallery Images in px']}
                            </label>
                            <div className="col-sm-3 col-md-2">
                                <input type="number" className="form-control" id="bbg_xiv-min_image_width" min="32" max="1024"
                                        value={minImageWidth} onChange={(e) => {setMinImageWidth(Number(e.target.value))}} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bbg_xiv-miro_row_height" className="control-label col-sm-9 col-md-offset-2 col-md-6">
                                {$translations['Preferred Row Height for Justified Images in px']}
                            </label>
                            <div className="col-sm-3 col-md-2">
                                <input type="number" className="form-control" id="bbg_xiv-miro_row_height" min="32" max="1024"
                                        value={miroRowHeight} onChange={(e) => {setMiroRowHeight(Number(e.target.value))}} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bbg_xiv-max_search_results" className="control-label col-sm-9 col-md-offset-2 col-md-6">
                                {$translations['Maximum Number of Images Returned by Search']}</label>
                            <div className="col-sm-3 col-md-2">
                                <input type="number" className="form-control" id="bbg_xiv-max_search_results" min="1"
                                        max="{$bbg_xiv_data['bbg_xiv_max_search_results']}" value={maxSearchResults}
                                        onChange={(e) => {setMaxSearchResults(Number(e.target.value))}} />
                            </div>
                        </div>
                        <div className="form-group bbg_xiv-mouse_only_option">
                            <label htmlFor="bbg_xiv-columns_in_dense_view" className="control-label col-sm-9 col-md-offset-2 col-md-6">
                                {$translations['Number of Columns in the Dense View']}
                            </label>
                            <div className="col-sm-3 col-md-2">
                                <input type="number" className="form-control" id="bbg_xiv-columns_in_dense_view" min="2" max="32"
                                        value={columnsInDenseView} onChange={(e) => {setColumnsInDenseView(Number(e.target.value))}} />
                            </div>
                        </div>
                        {/* TODO: checkboxes for radio buttons */}
                        <div className="form-group">
                            <label htmlFor="bbg_xiv-default_view_gallery" className="control-label col-sm-3 col-md-offset-2 col-md-2">
                                {$translations['Initial View']}
                            </label>
                            <div className="col-sm-9 col-md-6">
                                <span className="bbg_xiv-radio_input">
                                    <input type="radio" className="form-control" name="bbg_xiv-default_view" value="Gallery"
                                            id="bbg_xiv-default_view_gallery" checked={defaultView === 'Gallery'}
                                            onChange={e => {if (e.target.checked) {setDefaultView(e.target.value)}}} />
                                    <span className="bbg_xiv-radio_text">$translations[Gallery]</span>
                                </span>
                                <span className="bbg_xiv-radio_input">
                                    <input type="radio" className="form-control" name="bbg_xiv-default_view" value="Justified"
                                            id="bbg_xiv-default_view_justified" checked={defaultView === 'Justified'}
                                            onChange={e => {if (e.target.checked) {setDefaultView(e.target.value)}}} />
                                    <span className="bbg_xiv-radio_text">$translations[Justified]</span>
                                </span>
                                <span className="bbg_xiv-radio_input">
                                    <input type="radio" className="form-control" name="bbg_xiv-default_view" value="Carousel"
                                            id="bbg_xiv-default_view_carousel" checked={defaultView === 'Carousel'}
                                            onChange={e => {if (e.target.checked) {setDefaultView(e.target.value)}}} />
                                    <span className="bbg_xiv-radio_text">$translations[Carousel]</span>
                                </span>
                                <span className="bbg_xiv-radio_input">
                                    <input type="radio" className="form-control" name="bbg_xiv-default_view" value="Tabs"
                                            id="bbg_xiv-default_view_tabs" checked={defaultView === 'Tabs'}
                                            onChange={e => {if (e.target.checked) {setDefaultView(e.target.value)}}} />
                                    <span className="bbg_xiv-radio_text">$translations[Tabs]</span>
                                </span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bbg_xiv-bandwidth_auto" className="control-label col-sm-3 col-md-offset-2 col-md-2">
                                $translations[Bandwidth]
                            </label>
                            <div className="col-sm-9 col-md-6">
                                <span className="bbg_xiv-radio_input">
                                    <input type="radio" className="form-control" name="bbg_xiv-bandwidth" value="auto"
                                            id="bbg_xiv-bandwidth_auto" checked={bandwidth === 'auto'}
                                            onChange={e => {if (e.target.checked) {setBandwidth(e.target.value)}}} />
                                    <span className="bbg_xiv-radio_text">$translations[Auto]</span>
                                </span>
                                <span className="bbg_xiv-radio_input">
                                    <input type="radio" className="form-control" name="bbg_xiv-bandwidth" value="normal"
                                            id="bbg_xiv-bandwidth_normal" checked={bandwidth === 'normal'}
                                            onChange={e => {if (e.target.checked) {setBandwidth(e.target.value)}}} />
                                    <span className="bbg_xiv-radio_text">$translations[High]</span>
                                </span>
                                <span className="bbg_xiv-radio_input">
                                    <input type="radio" className="form-control" name="bbg_xiv-bandwidth" value="low"
                                            id="bbg_xiv-bandwidth_low" checked={bandwidth === 'low'}
                                            onChange={e => {if (e.target.checked) {setBandwidth(e.target.value)}}} />
                                    <span className="bbg_xiv-radio_text">$translations[Medium]</span>
                                </span>
                                <span className="bbg_xiv-radio_input">
                                    <input type="radio" className="form-control" name="bbg_xiv-bandwidth" value="very low"
                                            id="bbg_xiv-bandwidth_very_low" checked={bandwidth === 'very low'}
                                            onChange={e => {if (e.target.checked) {setBandwidth(e.target.value)}}} />
                                    <span className="bbg_xiv-radio_text">$translations[Low]</span>
                                </span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bbg_xiv-interface_auto" className="control-label col-sm-3 col-md-offset-2 col-md-2">
                                $translations[Interface]
                            </label>
                            <div className="col-sm-9 col-md-6">
                                <span className="bbg_xiv-radio_input">
                                    <input type="radio" className="form-control" name="bbg_xiv-interface" value="auto"
                                            id="bbg_xiv-interface_auto" checked={interface_ === 'auto'}
                                            onChange={e => {if (e.target.checked) {setInterface(e.target.value)}}} />
                                    <span className="bbg_xiv-radio_text">$translations[Auto]</span>
                                </span>
                                <span className="bbg_xiv-radio_input">
                                    <input type="radio" className="form-control" name="bbg_xiv-interface" value="mouse"
                                            id="bbg_xiv-interface_mouse" checked={interface_ === 'mouse'}
                                            onChange={e => {if (e.target.checked) {setInterface(e.target.value)}}} />
                                    <span className="bbg_xiv-radio_text">$translations[Mouse]</span>
                                </span>
                                <span className="bbg_xiv-radio_input">
                                    <input type="radio" className="form-control" name="bbg_xiv-interface" value="touch"
                                            id="bbg_xiv-interface_touch" checked={interface_ === 'touch'}
                                            onChange={e => {if (e.target.checked) {setInterface(e.target.value)}}} />
                                    <span className="bbg_xiv-radio_text">$translations[Touch]</span>
                                </span>
                                <span className="bbg_xiv-radio_input bbg_xiv-null">
                                    <input type="radio" className="form-control" name="bbg_xiv-interface" value="null"
                                            id="bbg_xiv-interface_null" disabled />
                                    <span className="bbg_xiv-radio_text"></span>
                                </span>
                            </div>
                        </div>
                        <br />
                        <div className="form-group">
                            <div className="col-sm-offset-4 col-sm-8">
                                <button type="button" className="btn btn-primary bbg_xiv-options_btn bbg_xiv-save_options">
                                    $translations[Save]
                                </button>
                                <button type="button" className="btn btn-default bbg_xiv-options_btn bbg_xiv-cancel_options">
                                    $translations[Cancel]
                                </button>
                                <button type="button" className="btn btn-info bbg_xiv-options_btn bbg_xiv-help_options">
                                    $translations[Help]
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        )
    }   // window.bbg_xiv.Configure = props => {
</script>
<!-- end of Configure JSX -->
</div>
EOD;
        return $output;
    }
    public static function bbg_xiv_do_attachments( $attachments ) {
        global $content_width;
        foreach ( $attachments as $id => &$attachment ) {
            $attachment->id  = $attachment->ID;
            $attachment->url = wp_get_attachment_url( $id );
            $meta = wp_get_attachment_metadata( $id );
            $attachment->width  = !empty( $meta[ 'width'  ] ) ? $meta[ 'width'  ] : 0;
            $attachment->height = !empty( $meta[ 'height' ] ) ? $meta[ 'height' ] : 0;
            if ( isset( $meta[ 'sizes' ] ) ) {
                foreach ( $meta[ 'sizes' ] as $size => &$size_attrs ) {
                    $size_attrs[ 'url' ] = wp_get_attachment_image_src( $id, $size )[0];
                    unset( $size_attrs[ 'file' ] );
                }
                $attachment->sizes = $meta[ 'sizes' ];
            }
            $orientation = '';
            if ( isset( $meta['height'], $meta['width'] ) ) {
              $orientation = ( $meta['height'] > $meta['width'] ) ? 'portrait' : 'landscape';
            }
            $attachment->orientation = $orientation;
            #$attr = ( trim( $attachment->post_excerpt ) ) ? array( 'aria-describedby' => "$selector-$id" ) : '';   # What is this for?
            if ( ! empty( $atts['link'] ) && 'file' === $atts['link'] ) {
              $attachment->link = wp_get_attachment_url( $id );
            } elseif ( ! empty( $atts['link'] ) && 'none' === $atts['link'] ) {
              $attachment->link = '';
            } else {
              $attachment->link = get_attachment_link( $id );
            }
            $attachment->image_alt = get_post_meta( $id, '_wp_attachment_image_alt', TRUE );
            #$attachment->post_content = apply_filters( 'the_content', $attachment->post_content );
            # fields for compatibility with my REST API
            $srcset = wp_get_attachment_image_srcset( $id, 'large' );
            # override the theme's content_width since our overlays are in the browser's viewport not the theme's content window
            $orig_content_width = $content_width;
            $content_width = 0;
            foreach( [ 'thumbnail', 'medium', 'medium_large', 'large', 'full' ] as $size ) {
                if ( $image = wp_get_attachment_image_src( $id, $size ) ) {
                    if ( preg_match( "#\s{$image[1]}w(,|\$)#", $srcset ) === 0 ) {
                        $srcset .= ", {$image[0]} {$image[1]}w";
                    }
                }
            }
            $content_width = $orig_content_width;
            $attachment->bbg_srcset = $srcset ? $srcset : '';
            $orig_content_width = $content_width;
            $content_width = 0;
            foreach( [ 'thumbnail', 'medium', 'medium_large', 'large', 'full' ] as $size ) {
                $attachment->{'bbg_' . $size . '_src'} = wp_get_attachment_image_src( $id, $size );
            }
            $content_width = $orig_content_width;
            # if 'medium_large' does not exists wp_get_attachment_image_src() returns 'full' which doesn't make sense so ...
            if ( $attachment->bbg_medium_large_src[1] > $attachment->bbg_large_src[1] ) {
                $attachment->bbg_medium_large_src = $attachment->bbg_large_src;
            }
            # TODO: For the "Table" view you may want to unset some fields.
            unset( $attachment->post_password );
            unset( $attachment->ping_status );
            unset( $attachment->to_ping );
            unset( $attachment->pinged );
            unset( $attachment->comment_status );
            unset( $attachment->comment_count );
            unset( $attachment->menu_order );
            unset( $attachment->post_content_filtered );
            unset( $attachment->filter );
            unset( $attachment->post_date_gmt );
            unset( $attachment->post_modified_gmt );
            unset( $attachment->post_status );
            unset( $attachment->post_type );
        }
    }

    public static function add_additional_rest_fields( ) {
        register_rest_field( 'attachment', 'bbg_srcset', [
            'get_callback' => [ 'BBG_XIV_Gallery', 'get_additional_rest_field' ],
            'update_callback' => null,
            'schema' => [
                'description' => 'srcset',
                'type'        => 'string',
                'context'     => [ 'view' ],
                'arg_options' => [
                    'sanitize_callback' => [ 'BBG_XIV_Gallery', 'sanitize_additional_rest_field' ],
                ]
            ]
        ] );
        foreach( [ 'thumbnail', 'medium', 'medium_large', 'large', 'full' ] as $size ) {
            register_rest_field( 'attachment', 'bbg_' . $size . '_src', [
                'get_callback' => [ 'BBG_XIV_Gallery', 'get_additional_rest_field' ],
                'update_callback' => null,
                'schema' => [
                    'description' => 'URL of ' . $size,
                    'type'        => 'string',
                    'context'     => [ 'view' ],
                    'arg_options' => [
                        'sanitize_callback' => [ 'BBG_XIV_Gallery', 'sanitize_additional_rest_field' ],
                    ]
                ]
            ] );
        }
        register_rest_field( 'attachment', 'bbg_post_content', [
            'get_callback' => [ 'BBG_XIV_Gallery', 'get_additional_rest_field' ],
            'update_callback' => null,
            'schema' => [
                'description' => 'post_content',
                'type'        => 'string',
                'context'     => [ 'view' ],
                'arg_options' => [
                    'sanitize_callback' => [ 'BBG_XIV_Gallery', 'sanitize_additional_rest_field' ],
                ]
            ]
        ] );
    }

    public static function get_additional_rest_field( $object, $field_name, $request, $object_type ) {
        global $post, $content_width, $wpdb;
        #error_log( 'get_additional_rest_field():$object=' . print_r( $object, true ) );
        #error_log( 'get_additional_rest_field():$field_name=' . $field_name );
        #error_log( 'get_additional_rest_field():$object_type=' . print_r( $object_type, true ) );
        #error_log( 'get_additional_rest_field():$post=' . print_r( $post, true ) );
        if ( $field_name === 'bbg_srcset' ) {
            $srcset = wp_get_attachment_image_srcset( $post->ID, 'large' );
            # override the theme's content_width since our overlays are in the browser's viewport not the theme's content window
            $orig_content_width = $content_width;
            $content_width = 0;
            foreach( [ 'thumbnail', 'medium', 'medium_large', 'large', 'full' ] as $size ) {
                if ( $image = wp_get_attachment_image_src( $post->ID, $size ) ) {
                    if ( preg_match( "#\s{$image[1]}w(,|\$)#", $srcset ) === 0 ) {
                        $srcset .= ", {$image[0]} {$image[1]}w";
                    }
                }
            }
            $content_width = $orig_content_width;
            return $srcset ? $srcset : '';
        }
        # if 'medium_large' does not exists wp_get_attachment_image_src() returns 'full' which doesn't make sense so ...
        if ( $field_name === 'bbg_medium_large_src' ) {
            $orig_content_width = $content_width;
            $content_width = 0;
            $medium_large = wp_get_attachment_image_src( $post->ID, 'medium_large' );
            $large = wp_get_attachment_image_src( $post->ID, 'large' );
            $content_width = $orig_content_width;
            if ( $medium_large[1] > $large[1] ) {
                return $large;
            }
            return $medium_large;
        }
        $orig_content_width = $content_width;
        $content_width = 0;
        foreach( [ 'thumbnail', 'medium', 'large', 'full' ] as $size ) {
            if ( $field_name === 'bbg_' . $size . '_src' ) {
                $src = wp_get_attachment_image_src( $post->ID, $size );
                return $src;
            }
        }
        $content_width = $orig_content_width;
        if ( $field_name === 'bbg_post_content' ) {
            $post_content = $wpdb->get_col( "SELECT post_content FROM $wpdb->posts WHERE ID = {$post->ID}" )[ 0 ];
            return $post_content;
        }
        return '';
    }
    
    public static function init( ) {
        $bbg_xiv_data                                                =& self::$bbg_xiv_data;
        $bbg_xiv_data                                                = [];
        $bbg_xiv_data[ 'version' ]                                   = '1.0';
        $bbg_xiv_data[ 'ajaxurl' ]                                   = admin_url( 'admin-ajax.php' );
        $bbg_xiv_data[ 'bbg_xiv_flex_min_width' ]                    = get_option( 'bbg_xiv_flex_min_width', 128 );
        $bbg_xiv_data[ 'bbg_xiv_miro_row_height' ]                   = get_option( 'bbg_xiv_miro_row_height', 128 );
        $bbg_xiv_data[ 'bbg_xiv_flex_min_width_for_caption' ]        = get_option( 'bbg_xiv_flex_min_width_for_caption', 96 );
        $bbg_xiv_data[ 'bbg_xiv_max_search_results' ]                = get_option( 'bbg_xiv_max_search_results', 250 );
        $bbg_xiv_data[ 'bbg_xiv_flex_min_width_for_dense_view' ]     = get_option( 'bbg_xiv_flex_min_width_for_dense_view', 1280 );
        $bbg_xiv_data[ 'bbg_xiv_flex_number_of_dense_view_columns' ] = get_option( 'bbg_xiv_flex_number_of_dense_view_columns', 10 );
        $bbg_xiv_data[ 'bbg_xiv_carousel_interval' ]                 = get_option( 'bbg_xiv_carousel_interval', 2500 );
        $bbg_xiv_data[ 'bbg_xiv_disable_flexbox' ]                   = get_option( 'bbg_xiv_disable_flexbox', FALSE );
        $bbg_xiv_data[ 'bbg_xiv_default_view' ]                      = get_option( 'bbg_xiv_default_view', 'Gallery' );

        self::$translations = [
            'GALLERY MENU'                                => __( 'GALLERY MENU',                                'bb_gallery' ),
            'IMAGES:'                                     => __( 'IMAGES:',                                     'bb_gallery' ),
            'GALLERIES:'                                  => __( 'GALLERIES:',                                  'bb_gallery' ),
            'View'                                        => __( 'View',                                        'bb_gallery' ),
            'Initial View'                                => __( 'Initial View',                                'bb_gallery' ),
            'Gallery'                                     => __( 'Gallery',                                     'bb_gallery' ),
            'Carousel'                                    => __( 'Carousel',                                    'bb_gallery' ),
            'Justified'                                   => __( 'Justified',                                   'bb_gallery' ),
            'Tabs'                                        => __( 'Tabs',                                        'bb_gallery' ),
            'Dense'                                       => __( 'Dense',                                       'bb_gallery' ),
            'VIEWS'                                       => __( 'VIEWS',                                       'bb_gallery' ),
            'GALLERIES'                                   => __( 'GALLERIES',                                   'bb_gallery' ),
            'Home'                                        => __( 'Home',                                        'bb_gallery' ),
            'Fullscreen'                                  => __( 'Fullscreen',                                  'bb_gallery' ),
            'Titles'                                      => __( 'Titles',                                      'bb_gallery' ),
            'Search Images on Site'                       => __( 'Search Images on Site',                       'bb_gallery' ),
            'Options'                                     => __( 'Options',                                     'bb_gallery' ),
            'Help'                                        => __( 'Help',                                        'bb_gallery' ),
            'get help'                                    => __( 'get help',                                    'bb_gallery' ),
            'configure bandwidth, carousel interval, ...' => __( 'configure bandwidth, carousel interval, ...', 'bb_gallery' ),
            'return to home gallery'                      => __( 'return to home gallery',                      'bb_gallery' ),
            'toggle fullscreen'                           => __( 'toggle fullscreen',                           'bb_gallery' ),
            'show/hide image titles'                      => __( 'show/hide image titles',                      'bb_gallery' ),
            'Carousel Time Interval in ms'                => __( 'Carousel Time Interval in ms',                'bb_gallery' ),
            'Minimum Width for Gallery Images in px'      => __( 'Minimum Width for Gallery Images in px',      'bb_gallery' ),
            'Preferred Row Height for Justified Images in px' => __( 'Preferred Row Height for Justified Images in px', 'bb_gallery' ),
            'Maximum Number of Images Returned by Search' => __( 'Maximum Number of Images Returned by Search', 'bb_gallery' ),
            'Number of Columns in the Dense View'         => __( 'Number of Columns in the Dense View',         'bb_gallery' ),
            'Bandwidth'                                   => __( 'Bandwidth',                                   'bb_gallery' ),
            'Auto'                                        => __( 'Auto',                                        'bb_gallery' ),
            'High'                                        => __( 'High',                                        'bb_gallery' ),
            'Medium'                                      => __( 'Medium',                                      'bb_gallery' ),
            'Low'                                         => __( 'Low',                                         'bb_gallery' ),
            'Interface'                                   => __( 'Interface',                                   'bb_gallery' ),
            'Mouse'                                       => __( 'Mouse',                                       'bb_gallery' ),
            'Touch'                                       => __( 'Touch',                                       'bb_gallery' ),
            'Save'                                        => __( 'Save',                                        'bb_gallery' ),
            'Cancel'                                      => __( 'Cancel',                                      'bb_gallery' ),
            'Help'                                        => __( 'Help',                                        'bb_gallery' )
        ];

        # translations for JavaScript side
        $bbg_xiv_lang                                                =& self::$bbg_xiv_lang;
        $bbg_xiv_lang[ 'expand gallery to full-screen' ]             = __( 'expand gallery to full-screen',   'bb_gallery' );
        $bbg_xiv_lang[ 'shrink gallery from full-screen' ]           = __( 'shrink gallery from full-screen', 'bb_gallery' );
        $bbg_xiv_lang[ 'show captions' ]                             = __( 'show captions',                   'bb_gallery' );
        $bbg_xiv_lang[ 'hide captions' ]                             = __( 'hide captions',                   'bb_gallery' );
        $bbg_xiv_lang[ 'show titles' ]                               = __( 'show titles',                     'bb_gallery' );
        $bbg_xiv_lang[ 'hide titles' ]                               = __( 'hide titles',                     'bb_gallery' );
        $bbg_xiv_lang[ 'Show Image Info' ]                           = __( 'Show Image Info',    'bb_gallery' );
        $bbg_xiv_lang[ 'Previous' ]                                  = __( 'Previous',           'bb_gallery' );
        $bbg_xiv_lang[ 'Go To First' ]                               = __( 'Go To First',        'bb_gallery' );
        $bbg_xiv_lang[ 'Pause' ]                                     = __( 'Pause',              'bb_gallery' );
        $bbg_xiv_lang[ 'Play' ]                                      = __( 'Play',               'bb_gallery' );
        $bbg_xiv_lang[ 'Close' ]                                     = __( 'Close',              'bb_gallery' );
        $bbg_xiv_lang[ 'Next' ]                                      = __( 'Next',               'bb_gallery' );
        $bbg_xiv_lang[ 'Go To Last' ]                                = __( 'Go To Last',         'bb_gallery' );
        $bbg_xiv_lang[ 'Get Help' ]                                  = __( 'Get Help',           'bb_gallery' );
        $bbg_xiv_lang[ 'Nothing Found' ]                             = __( 'Nothing Found',      'bb_gallery' );
        $bbg_xiv_lang[ 'Search Results for' ]                        = __( 'Search Results for', 'bb_gallery' );
        $bbg_xiv_lang[ 'Page' ]                                      = __( 'Page',               'bb_gallery' );
        $bbg_xiv_lang[ 'of' ]                                        = __( 'of',                 'bb_gallery' );
        $bbg_xiv_lang[ 'Images' ]                                    = __( 'Images',             'bb_gallery' );
        $bbg_xiv_lang[ 'to' ]                                        = __( 'to',                 'bb_gallery' );
        $bbg_xiv_lang[ 'galleryOfGalleriesTitle' ]                   = __(
            'Each image below represents a gallery. Please click on an image to load its gallery.',
                                                                                                 'bb_gallery' );
        $bbg_xiv_lang[ 'Click anywhere to lock the display of this popup.' ]
                                                                     = __(
            'Click anywhere to lock the display of this popup.',                                 'bb_gallery' );

        add_action( 'admin_enqueue_scripts', function( $hook ) {
            if ( $hook === 'options-media.php' ) {
                wp_enqueue_script( "bbg_xiv-admin", plugins_url( 'js/bbg_xiv-admin.js', __FILE__ ) );
            }
        } );

        add_action( 'plugins_loaded', function( ) {
            if ( !load_plugin_textdomain( 'bb_gallery', false, plugin_basename( dirname( __FILE__ ) ) . '/languages' ) ) {
                #error_log( 'load_plugin_textdomain() failed' );
            }
        } );

        add_action( 'wp_loaded', function( ) {
            add_shortcode( 'bb_gallery', __CLASS__ . '::bb_gallery_shortcode' );
            if ( get_option( 'bbg_xiv_shortcode', 1 ) ) {
                remove_shortcode( 'gallery' );
                add_shortcode( 'gallery', __CLASS__ . '::bb_gallery_shortcode' );
            }
        } );

        add_action( 'init', function( ) {
            register_taxonomy( 'bb_tags', 'attachment', [
                'label'                 => __( 'BB Tags' ),
                'show_ui'               => TRUE,
                'show_admin_column'     => TRUE,
                'update_count_callback' => '_update_post_term_count',
                'query_var'             => TRUE,
                'rewrite'               => [ 'slug' => 'bb_tags' ],
                'hierarchical'          => FALSE,
                'show_in_rest'          => TRUE,
                'rest_base'             => 'bb-tags',
                'rest_controller_class' => 'WP_REST_Terms_Controller'
            ] );

            # add_filter( 'rest_pre_dispatch', function( $null, $server, $request ) {
            #     error_log( 'FILTER::rest_pre_dispatch():$request=' . print_r( $request, true ) );
            #     return NULL;
            # }, 10, 3 );
            add_filter( 'rest_attachment_query', function( $args, $request ) {
                if ( !empty( $args[ 's' ] ) ) {
                    $terms = get_terms( [ 'taxonomy' => 'bb_tags', 'slug' => $args[ 's' ], 'name' => $args[ 's' ], 'fields' => 'ids', 'hide_empty' => FALSE ] );
                    if ( $terms ) {
                        # taxonomy has a higher priority than search 
                        unset( $args[ 's' ] );
                        $args['tax_query'][] = [
                                                   'taxonomy'         => 'bb_tags',
                                                   'field'            => 'term_id',
                                                   'terms'            => $terms,
                                                   'include_children' => FALSE,
                                               ];
                   }
                }
                return $args;
            }, 10, 2 );
        } );

        add_action( 'rest_api_init', [ 'BBG_XIV_Gallery', 'add_additional_rest_fields' ] );

        add_action( 'wp_enqueue_scripts', function( ) {
            $post = get_post( );
            if ( $post && !preg_match( '/\[gallery(\s|\])|\[bb_gallery(\s|\])/', $post->post_content ) ) {
                # only emit bb_gallery's styles and scripts if the post content has the bb_gallery shortcode
                return;
            }
            wp_enqueue_style( 'bootstrap',               plugins_url( 'css/bootstrap.css',               __FILE__ ) );
            wp_enqueue_style( 'jquery-mobile-structure', plugins_url( 'css/jquery-mobile-structure.css', __FILE__ ) );
            wp_enqueue_style( 'jquery-mobile-theme',     plugins_url( 'css/jquery-mobile-theme.css',     __FILE__ ) );
            wp_enqueue_style( 'justified-gallery',       plugins_url( 'css/justifiedGallery.css',        __FILE__ ) );
            wp_enqueue_style( 'bbg_xiv-gallery',         plugins_url( 'css/bbg_xiv-gallery.css',         __FILE__ ), [ 'bootstrap' ] );
            $width = ( 100 / (integer) get_option( 'bbg_xiv_flex_number_of_dense_view_columns', 10 ) ) . '%';
            wp_add_inline_style( 'bbg_xiv-gallery', <<<EOD
div.bbg_xiv-bootstrap div.bbg_xiv-dense_container div.bbg_xiv-dense_images div.bbg_xiv-dense_flex_images div.bbg_xiv-dense_flex_item{
    width:$width;
}
EOD
            );
            $min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
            wp_enqueue_script( 'backbone' );
            wp_enqueue_script( 'modernizr',         plugins_url( 'js/modernizr.js',               __FILE__ ) );
            wp_enqueue_script( 'justified-gallery', plugins_url( 'js/jquery.justifiedGallery.js', __FILE__ ), [ 'jquery' ] );
            wp_enqueue_script( 'jquery-mobile',     plugins_url( "js/jquery-mobile{$min}.js",     __FILE__ ), [ 'jquery' ] );
            $deps = [ 'modernizr' ];
            if ( !get_option( 'bbg_xiv_do_not_load_bootstrap', FALSE ) ) {
                wp_enqueue_script( 'bootstrap',     plugins_url( "js/bootstrap{$min}.js",         __FILE__ ), [ 'jquery' ], FALSE, TRUE );
                $deps[ ] = 'bootstrap';
            }
            $deps[ ] = 'jquery-mobile';
            $deps[ ] = 'justified-gallery';
            $deps[ ] = 'wp-api';
            wp_enqueue_script( 'bbg_xiv-gallery',   plugins_url( "js/bbg_xiv-gallery-extra.js",   __FILE__ ), $deps,        FALSE, TRUE );
            // wp_enqueue_script( 'react',             'https://unpkg.com/react@16/umd/react.development.js'         );
            // wp_enqueue_script( 'react-dom',         'https://unpkg.com/react-dom@16/umd/react-dom.development.js' );
        } );

        add_action( 'wp_head', function( ) {
            $post = get_post( );
            if ( $post && !preg_match( '/\[gallery(\s|\])|\[bb_gallery(\s|\])/', $post->post_content ) ) {
                # only emit bb_gallery's styles and scripts if the post content has the bb_gallery shortcode
                return;
            }
            # error_log( 'ACTION::wp_head():called' );
?>
<script src="<?php echo plugins_url( "js/vendors~main.bundle.js",                  __FILE__ ); ?>" type="text/javascript"></script>
<script src="<?php echo plugins_url( "js/bundle.js",                               __FILE__ ); ?>" type="text/javascript"></script>
<!--
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"                                    type="text/javascript"></script>
-->
<script src="<?php echo plugins_url( "js/babel.js",                                __FILE__ ); ?>" type="text/javascript"></script>
<script type="text/babel">
    // Test Harness for Babel JavaScript code
</script>
<!-- TODO: 'js/components/*.js' will eventually be in 'js/bundle.js' but not true for now. -->
<script src="<?php echo plugins_url( "js/components/JustifiedGalleryItem.js",      __FILE__ ); ?>" type="text/babel"></script>
<script src="<?php echo plugins_url( "js/components/JustifiedGalleryContainer.js", __FILE__ ); ?>" type="text/babel"></script>
<script src="<?php echo plugins_url( "js/components/DenseTitle.js",                __FILE__ ); ?>" type="text/babel"></script>
<script src="<?php echo plugins_url( "js/components/DenseImage.js",                __FILE__ ); ?>" type="text/babel"></script>
<script src="<?php echo plugins_url( "js/components/DenseContainer.js",            __FILE__ ); ?>" type="text/babel"></script>
<script src="<?php echo plugins_url( "js/components/TabsContainer.js",             __FILE__ ); ?>" type="text/babel"></script>
<script src="<?php echo plugins_url( "js/components/CarouselContainer.js",         __FILE__ ); ?>" type="text/babel"></script>
<script src="<?php echo plugins_url( "js/components/CarouselItem.js",              __FILE__ ); ?>" type="text/babel"></script>
<script src="<?php echo plugins_url( "js/Overlay.js",                              __FILE__ ); ?>" type="text/babel"></script>
<script src="<?php echo plugins_url( "js/bbg_xiv-gallery.js",                      __FILE__ ); ?>" type="text/babel"></script>
<?php
        } );
        add_action( 'admin_init', function( ) {
            add_settings_section( 'bbg_xiv_setting_section', 'BB Gallery', function( ) {
                echo '<p id="bbg_xiv-conf_section"><a href="http://docs.magentacuda.com/" target="_blank">BB Gallery</a>'
                    . __( ' is a plug-compatible replacement for the built-in WordPress gallery shortcode.', 'bb_gallery' );
                if ( get_option( 'bbg_xiv_version', '' ) === '' ) {
                    echo ' ' . __( 'These initial values for the following options should work reasonably well.', 'bb_gallery' )
                        . ' ' . __( 'You can change them later when you are more familiar with this product.', 'bb_gallery' );
                }
                echo '</p>';
            }, 'media' );
            add_settings_field( 'bbg_xiv_version', __( 'Version', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_version" id="bbg_xiv_version" type="hidden" value="1.8.2.4.5" /> 1.8.2.4.5';
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_shortcode', __( 'Enable BB Gallery', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_shortcode" id="bbg_xiv_shortcode" type="checkbox" value="1" class="code" '
                    . checked( get_option( 'bbg_xiv_shortcode', 1 ), 1, FALSE ) . ' /> ' . __( 'This will replace the built-in WordPress gallery shortcode.', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_flex_min_width', __( 'Gallery Minimum Image Width', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_flex_min_width" id="bbg_xiv_flex_min_width" type="number" value="' . get_option( 'bbg_xiv_flex_min_width', 128 )
                    . '" class="small-text" /> ' . __( 'The minimum image width in the "Gallery View" if the CSS3 Flexbox is used.', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_miro_row_height', __( 'Justified Preferred Row Height', 'bb_gallery' ), function() {
                echo '<input name="bbg_xiv_miro_row_height" id="bbg_xiv_miro_row_height" type="number" value="' . get_option( 'bbg_xiv_miro_row_height', 128 )
                    . '" class="small-text" /> ' . __( 'The preferred row height in the "Justified View".', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_flex_min_width_for_caption', __( 'Gallery Minimum Image Width for Caption', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_flex_min_width_for_caption" id="bbg_xiv_flex_min_width_for_caption" type="number" value="'
                    . get_option( 'bbg_xiv_flex_min_width_for_caption', 96 )
                    . '" class="small-text" /> ' . __( 'The minimum image width in the "Gallery View" required to show the caption.', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_carousel_interval', __( 'Carousel Interval', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_carousel_interval" id="bbg_xiv_carousel_interval" type="number" value="'
                    . get_option( 'bbg_xiv_carousel_interval', 2500 )
                    . '" class="small-text" /> ' . __( 'The time delay between two slides in milliseconds.', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_max_search_results', __( 'Maximum Number of Images Returned by Search', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_max_search_results" id="bbg_xiv_max_search_results" type="number" value="' . get_option( 'bbg_xiv_max_search_results', 100 )
                    . '" class="small-text" min="1" max="100" /> '
                    . __( 'The browser user can lower this limit. (For the WP REST API this limit must be <= 100.)', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_flex_number_of_dense_view_columns', __( 'Columns in Dense View', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_flex_number_of_dense_view_columns" id="bbg_xiv_flex_number_of_dense_view_columns" type="number" value="'
                    . get_option( 'bbg_xiv_flex_number_of_dense_view_columns', 10 )
                    . '" class="small-text" /> ' . __( 'The number of columns in the "Dense View".', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_flex_min_width_for_dense_view', __( 'Minimum With for Dense View', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_flex_min_width_for_dense_view" id="bbg_xiv_flex_min_width_for_dense_view" type="number" value="'
                    . get_option( 'bbg_xiv_flex_min_width_for_dense_view', 1280 )
                    . '" class="small-text" /> ' . __( 'The minimum browser viewport width required to show the "Dense View".', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_default_view', __( 'Default View', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_default_view" id="bbg_xiv_default_view_gallery"  type="radio" value="Gallery" '
                    . ( get_option( 'bbg_xiv_default_view', 'Gallery' ) === 'Gallery'  ? 'checked />' : '/>' )
                    . '<span class="bbg_xiv-radio_text">Gallery&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                echo '<input name="bbg_xiv_default_view" id="bbg_xiv_default_view_justified" type="radio" value="Justified" '
                    . ( get_option( 'bbg_xiv_default_view', 'Gallery' ) === 'Justified' ? 'checked />' : '/>' )
                    . '<span class="bbg_xiv-radio_text">Justified&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                echo '<input name="bbg_xiv_default_view" id="bbg_xiv_default_view_carousel" type="radio" value="Carousel" '
                    . ( get_option( 'bbg_xiv_default_view', 'Gallery' ) === 'Carousel' ? 'checked />' : '/>' )
                    . '<span class="bbg_xiv-radio_text">Carousel&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                echo '<input name="bbg_xiv_default_view" id="bbg_xiv_default_view_tabs"     type="radio" value="Tabs" '
                    . ( get_option( 'bbg_xiv_default_view', 'Gallery' ) === 'Tabs'     ? 'checked />' : '/>' )
                    . '<span class="bbg_xiv-radio_text">Tabs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><p>';
                echo __( 'This is the initial view of the gallery. The browser user can override this setting. See also the ', 'bb_gallery' )
                    . '<a href="http://docs.magentacuda.com/#parameters" target="_blank">view ' . __( ' shortcode option.', 'bb_gallery' ) . '</a></p>';
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_use_tiles', __( 'Use Tiles', 'bb_gallery' ), function( ) {
                $use_tiles = get_option( 'bbg_xiv_use_tiles', 'Cover' );
                echo '<input name="bbg_xiv_use_tiles" id="bbg_xiv_use_tiles_disabled" type="radio" value="Disabled" ' . ( $use_tiles === 'Disabled' ? 'checked />' : '/>' )
                    . '<span class="bbg_xiv-radio_text">Disabled&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                echo '<input name="bbg_xiv_use_tiles" id="bbg_xiv_use_tiles_cover"    type="radio" value="Cover" '    . ( $use_tiles === 'Cover'    ? 'checked />' : '/>' )
                    . '<span class="bbg_xiv-radio_text">Cover&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                echo '<input name="bbg_xiv_use_tiles" id="bbg_xiv_use_tiles_contain"  type="radio" value="Contain" '  . ( $use_tiles === 'Contain'  ? 'checked />' : '/>' )
                    . '<span class="bbg_xiv-radio_text">Contain&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                echo '<input name="bbg_xiv_use_tiles" id="bbg_xiv_use_tiles_fill"  type="radio" value="Fill" '        . ( $use_tiles === 'Fill'     ? 'checked />' : '/>' )
                    . '<span class="bbg_xiv-radio_text">Fill&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><p>';
                echo '<a href="http://docs.magentacuda.com/#gallery" target="_blank">' . __( 'The gallery uses butt joined square image tiles.', 'bb_gallery' ) . '</a> '
                    . __( 'See also the ', 'bb_gallery' )
                    . '<a href="http://docs.magentacuda.com/#parameters" target="_blank">flags ' . __( ' shortcode option.', 'bb_gallery' ) . '</a></p>';
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_use_gallery_tabs', __( 'Use Gallery Tabs', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_use_gallery_tabs" id="bbg_xiv_use_gallery_tabs" type="checkbox" value="1" class="code" '
                    . checked( get_option( 'bbg_xiv_use_gallery_tabs', TRUE ), 1, FALSE ) . ' /> '
                    . '<a href="http://docs.magentacuda.com/#alt_galleries" target="_blank">' . __( 'Show the alternate galleries as tabs.', 'bb_gallery' ) . '</a>'
                    . __( ' See also the ', 'bb_gallery' )
                    . '<a href="http://docs.magentacuda.com/#parameters" target="_blank">mode ' . __( ' shortcode option.', 'bb_gallery' ) . '</a>';
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_do_not_load_bootstrap', __( 'Do not load Bootstrap', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_do_not_load_bootstrap" id="bbg_xiv_do_not_load_bootstrap" type="checkbox" value="1" class="code" '
                    . checked( get_option( 'bbg_xiv_do_not_load_bootstrap', FALSE ), 1, FALSE ) . ' /> '
                    . '<a href="http://docs.magentacuda.com/#problems" target="_blank">'
                    . __( 'Enable if your theme or another plugin also loads bootstrap', 'bb_gallery' ) . '</a>.';
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_table', __( 'Enable Table View', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_table" id="bbg_xiv_table" type="checkbox" value="1" class="code" '
                    . checked( get_option( 'bbg_xiv_table' ), 1, FALSE ) . ' /> ' . __( 'The "Table View" is primarily intended for developers.', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            register_setting( 'media', 'bbg_xiv_version' );
            register_setting( 'media', 'bbg_xiv_shortcode' );
            register_setting( 'media', 'bbg_xiv_flex_min_width' );
            register_setting( 'media', 'bbg_xiv_miro_row_height' );
            register_setting( 'media', 'bbg_xiv_flex_min_width_for_caption' );
            register_setting( 'media', 'bbg_xiv_carousel_interval' );
            register_setting( 'media', 'bbg_xiv_max_search_results' );
            register_setting( 'media', 'bbg_xiv_flex_number_of_dense_view_columns' );
            register_setting( 'media', 'bbg_xiv_flex_min_width_for_dense_view' );
            register_setting( 'media', 'bbg_xiv_default_view' );
            register_setting( 'media', 'bbg_xiv_use_tiles' );
            register_setting( 'media', 'bbg_xiv_use_gallery_tabs' );
            register_setting( 'media', 'bbg_xiv_do_not_load_bootstrap' );
            register_setting( 'media', 'bbg_xiv_table' );

            add_settings_section( 'bbg_xiv_menu_section', 'BB Gallery Menu Settings', function( ) {
                echo '<p>' . __( 'You can specify a list of galleries to be dynamically loaded into the same page using ', 'bb_gallery' )
                    . '<a href="http://docs.magentacuda.com/#alt_galleries" target="_blank">' . __( 'BB Gallery\'s Menu', 'bb_gallery' ) . '.</a></p>';
            }, 'media' );
            for ( $i = 1; $i <= self::$gallery_menu_items_count; $i++ ) {
                add_settings_field( "bbg_xiv_gallery_menu_$i", __( 'Gallery Menu Item', 'bb_gallery' ) . " $i", function( ) use ( $i ) {
                    echo "<input name=\"bbg_xiv_gallery_menu_$i\" id=\"bbg_xiv_gallery_menu_$i\""
                        . ' type="text" size="40" placeholder=\'e.g., "My Gallery":ids="11,13,7,57" orderby="title"\''
                        . ' value=\'' . get_option( "bbg_xiv_gallery_menu_$i", '' ) . '\' /> '
                        . __( "gallery shortcode for gallery menu item $i - format:\"gallery name\":gallery specifiers", 'bb_gallery' );
                }, 'media',	'bbg_xiv_menu_section' );
            }
            for ( $i = 1; $i <= self::$gallery_menu_items_count; $i++ ) {
                register_setting( 'media', "bbg_xiv_gallery_menu_$i" );
            }

            add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), function( $links ) {
                return array_merge( [ '<a href="options-media.php">Settings</a>'], $links );
            } );
            add_filter( 'plugin_row_meta', function( $links, $file ) {
                if ( $file === plugin_basename( __FILE__ ) ) {
                    return array_merge( $links, [ 'docs' => '<a href="http://docs.magentacuda.com/" target="_blank">View Documentation</a>' ] );
                }
                return (array) $links;
            }, 10, 2 );
        } );

        $version = get_option( 'bbg_xiv_version', '' );
        if ( $version !== '1.7.3.1' && $version !== '1.7.3.2' && $version !== '1.7.3.3' && $version !== '1.7.3.4' && $version !== '1.8' && $version !== '1.8.1'
            && $version !== '1.8.1.1' && $version !== '1.8.2' && $version !== '1.8.2.1' && $version !== '1.8.2.2' && $version !== '1.8.2.4.5' ) {
            add_action( 'admin_notices', function( ) {
                global $hook_suffix;
                if ( $hook_suffix === 'options-media.php' ) {
                    $post_script = 'Go to <a href="#bbg_xiv-conf_section">section BB Gallery</a>.';
                } else {
                    $post_script = 'Visit <a href="' . admin_url( 'options-media.php' ) . '">Settings > Media</a> to accept or override these defaults.';
                }
?>
<div class="notice notice-info is-dismissible"><p>
BB gallery: The default gallery view now uses square tiles. To restore the gallery view to using the CSS Flexbox set the &quot;Use Tiles&quot; option to &quot;disabled&quot;.
The default carousel view now is embedded. To restore the carousel view to the full viewport disable the &quot;Use Embedded Carousels&quot; option.
<?php echo $post_script; ?>
</p></div>
<?php
            } );
        }

        add_action( 'plugins_loaded', function( ) {
            if ( get_option( 'bbg_xiv_wp_rest' ) && class_exists( 'WP_REST_Attachments_Controller' ) && !get_option( 'permalink_structure' ) ) {
                add_action( 'admin_notices', function( ) {
                    global $hook_suffix;
?>
<div class="notice notice-error is-dismissible"><p>
The WP REST API requires pretty permalinks.
<?php if ( $hook_suffix !== 'options-permalink.php' ) { ?>
Please visit <a href="<?php echo admin_url( 'options-permalink.php' ); ?>" target="_blank">Dashboard > Settings > Permalinks</a> to fix this.
<?php } ?>
</p></div>
<?php
                } );
            }
        } );

        if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
            # AJAX search handlers
            add_action( 'wp_ajax_nopriv_bbg_xiv_search_media', function( ) {
                global $wpdb;
                check_ajax_referer( BBG_XIV_Gallery::$nonce_action );
                $attachments = [ ];
                if ( array_key_exists( 'query', $_POST ) ) {
                    // This is an AJAX search request.
                    $pattern = '%' . $_POST[ 'query' ] . '%';
                    $offset = (integer) $_POST[ 'offset' ];
                    $count = (integer) $_POST[ 'limit' ];
                    $results = $wpdb->get_col( $wpdb->prepare( <<<EOD
SELECT ID FROM $wpdb->posts
    WHERE post_status = 'inherit' AND post_type = 'attachment' AND post_mime_type LIKE 'image/%%' AND ( post_title LIKE %s OR post_excerpt LIKE %s OR post_content LIKE %s )
    LIMIT %d, %d
EOD
                      , $pattern, $pattern, $pattern, $offset, $count ) );
                    if ( !$results ) {
                        wp_die( );
                    }
                    foreach ( get_posts( [ 'include' => implode( ',', $results ), 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image' ] ) as $key => $val ) {
                        $attachments[ $val->ID ] = $val;
                    }
                } else {
                    // This is an AJAX gallery request.
                    $attr = $_POST;
                    if ( ! empty( $attr[ 'ids' ] ) ) {
                        // 'ids' is explicitly ordered, unless you specify otherwise.
                        if ( empty( $attr[ 'orderby' ] ) ) {
                            $attr[ 'orderby' ] = 'post__in';
                        }
                        $attr[ 'include' ] = $attr[ 'ids' ];
                    }
                    $atts = shortcode_atts( [
                      'order'      => 'ASC',
                      'orderby'    => 'menu_order',
                      'id'         => 0,
                      'size'       => 'thumbnail',
                      'include'    => '',
                      'exclude'    => '',
                      'link'       => '',
                      'bb_tags'    => ''
                    ], $attr, 'gallery' );
                    $id = intval( $atts['id'] );
                    if ( ! empty( $atts[ 'bb_tags' ] ) ) {
                        $bb_tags = explode( ',', $atts[ 'bb_tags' ] );
                        $tax_query = [ ];
                        // search by both slug and name
                        $tax_query[ 'relation' ] = 'OR'; 
                        $tax_query[ ] = [ 'taxonomy' => 'bb_tags', 'field' => 'slug', 'terms' => $bb_tags ];
                        $tax_query[ ] = [ 'taxonomy' => 'bb_tags', 'field' => 'name', 'terms' => $bb_tags ];
                        $_attachments = get_posts( [
                            'post_status'    => 'inherit',
                            'post_type'      => 'attachment',
                            'post_mime_type' => 'image',
                            'order'          => $atts[ 'order' ],
                            'orderby'        => $atts[ 'orderby' ],
                            'tax_query'      => $tax_query,
                            'posts_per_page' => -1
                        ] );

                        $attachments = [ ];
                        foreach ( $_attachments as $key => $val ) {
                            $attachments[ $val->ID ] = $_attachments[$key];
                        }
                    } else if ( ! empty( $atts[ 'include' ] ) ) {
                        $_attachments = get_posts( [
                            'include'        => $atts[ 'include' ],
                            'post_status'    => 'inherit',
                            'post_type'      => 'attachment',
                            'post_mime_type' => 'image',
                            'order'          => $atts[ 'order' ],
                            'orderby'        => $atts[ 'orderby' ]
                        ] );

                        $attachments = [ ];
                        foreach ( $_attachments as $key => $val ) {
                            $attachments[ $val->ID ] = $_attachments[$key];
                        }
                    } elseif ( ! empty( $atts['exclude'] ) ) {
                        $attachments = get_children( [
                            'post_parent'    => $id,
                            'exclude'        => $atts[ 'exclude' ],
                            'post_status'    => 'inherit',
                            'post_type'      => 'attachment',
                            'post_mime_type' => 'image',
                            'order'          => $atts[ 'order' ],
                            'orderby'        => $atts[ 'orderby' ]
                        ] );
                    } else {
                        $attachments = get_children( [
                            'post_parent'    => $id,
                            'post_status'    => 'inherit',
                            'post_type'      => 'attachment',
                            'post_mime_type' => 'image',
                            'order'          => $atts[ 'order' ],
                            'orderby'        => $atts[ 'orderby' ]
                        ] );
                    }
                    if ( empty( $attachments ) ) {
                        wp_die( );
                    }
                }
                BBG_XIV_Gallery::bbg_xiv_do_attachments( $attachments );
                echo json_encode( array_values( $attachments ) );
                wp_die( );
            } );
            add_action( 'wp_ajax_bbg_xiv_search_media', function( ) {
                do_action( 'wp_ajax_nopriv_bbg_xiv_search_media' );
            } );
            add_action( 'wp_ajax_nopriv_bbg_xiv_search_media_count', function( ) {
                global $wpdb;
                check_ajax_referer( BBG_XIV_Gallery::$nonce_action );
                $pattern = '%' . $_POST[ 'query' ] . '%';
                $count = $wpdb->get_var( $wpdb->prepare( <<<EOD
SELECT COUNT(*) FROM $wpdb->posts
    WHERE post_status = 'inherit' AND post_type = 'attachment' AND post_mime_type LIKE 'image/%%' AND ( post_title LIKE %s OR post_excerpt LIKE %s OR post_content LIKE %s )
EOD
                    , $pattern, $pattern, $pattern ) );
                echo $count;
                wp_die( );
            } );
            add_action( 'wp_ajax_bbg_xiv_search_media_count', function( ) {
                do_action( 'wp_ajax_nopriv_bbg_xiv_search_media_count' );
            } );
        }
    }
}

BBG_XIV_Gallery::init( );

?>
