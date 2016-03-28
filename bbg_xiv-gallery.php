<?php

/*
Plugin Name: BB Gallery
Plugin URI: https://bbfgallery.wordpress.com/
Description: Gallery using Backbone.js, Bootstrap 3 and CSS3 Flexbox
Version: 1.5.3.1
Author: Magenta Cuda
Author URI: https://profiles.wordpress.org/magenta-cuda/
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
# It uses user definable Backbone.js templates styled with a Twitter Bootstrap stylesheets.
# The user definable templates are in the file ".../js/bbg_xiv-gallery_templates.php".

class BBG_XIV_Gallery {

    public static $nonce_action = 'bbg_xiv-search';
  
    # excerpted from the WordPress function gallery_shortcode() of .../wp-includes/media.php

    public static function bb_gallery_shortcode( $attr ) {
        if ( is_array( $attr ) && array_key_exists( 'mode', $attr ) && $attr[ 'mode' ] === 'wordpress' ) {
            return gallery_shortcode( $attr );
        }
        
        require_once(  dirname( __FILE__ ) . '/bbg_xiv-gallery_templates.php' );

        $post = get_post();

        static $instance = 10000;    # not 0 to create a different space from the WordPress "gallery" shortcode
        $instance++;
        
        static $bbg_xiv_data = [
            'version' => '1.0'
        ];
        $bbg_xiv_data[ 'ajaxurl' ]                                   = admin_url( 'admin-ajax.php' );
        $bbg_xiv_data[ 'bbg_xiv_flex_min_width' ]                    = get_option( 'bbg_xiv_flex_min_width', 128 );
        $bbg_xiv_data[ 'bbg_xiv_flex_min_width_for_caption' ]        = get_option( 'bbg_xiv_flex_min_width_for_caption', 96 );
        $bbg_xiv_data[ 'bbg_xiv_max_search_results' ]                = get_option( 'bbg_xiv_max_search_results', 250 );
        $bbg_xiv_data[ 'bbg_xiv_flex_min_width_for_dense_view' ]     = get_option( 'bbg_xiv_flex_min_width_for_dense_view', 1280 );
        $bbg_xiv_data[ 'bbg_xiv_flex_number_of_dense_view_columns' ] = get_option( 'bbg_xiv_flex_number_of_dense_view_columns', 10 );
        $bbg_xiv_data[ 'bbg_xiv_carousel_interval' ]                 = get_option( 'bbg_xiv_carousel_interval', 2500 );
        $bbg_xiv_data[ 'bbg_xiv_disable_flexbox' ]                   = get_option( 'bbg_xiv_disable_flexbox', FALSE );

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
          'orderby'    => 'menu_order ID',
          'id'         => $post ? $post->ID : 0,
          'size'       => 'thumbnail',
          'include'    => '',
          'exclude'    => '',
          'link'       => ''
        ), $attr, 'gallery' );

        $id = intval( $atts['id'] );

        if ( ! empty( $atts['include'] ) ) {
          $_attachments = get_posts( array( 'include' => $atts['include'], 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $atts['order'], 'orderby' => $atts['orderby'] ) );

          $attachments = array();
          foreach ( $_attachments as $key => $val ) {
            $attachments[$val->ID] = $_attachments[$key];
          }
        } elseif ( ! empty( $atts['exclude'] ) ) {
          $attachments = get_children( array( 'post_parent' => $id, 'exclude' => $atts['exclude'], 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $atts['order'], 'orderby' => $atts['orderby'] ) );
        } else {
          $attachments = get_children( array( 'post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $atts['order'], 'orderby' => $atts['orderby'] ) );
        }

        if ( empty( $attachments ) ) {
          return '';
        }

        if ( is_feed() ) {
          $output = "\n";
          foreach ( $attachments as $att_id => $attachment ) {
            $output .= wp_get_attachment_link( $att_id, $atts['size'], true ) . "\n";
          }
          return $output;
        }

        $float = is_rtl() ? 'right' : 'left';

        $selector = "gallery-{$instance}";

        $size_class = sanitize_html_class( $atts['size'] );
        
        # The "Table View" is primarily intended for developers and should be disabled for production environmemts.
        $table_nav_item = '';
        if ( get_option( 'bbg_xiv_table' ) ) {
            $table_nav_item = <<<EOD
                        <li><a href="#">Table</a></li>
EOD;
        }
        $translations = [
            'Images:'                                     => __( 'Images:',                                     'bb_gallery' ),
            'View'                                        => __( 'View',                                        'bb_gallery' ),
            'Gallery'                                     => __( 'Gallery',                                     'bb_gallery' ),
            'Carousel'                                    => __( 'Carousel',                                    'bb_gallery' ),
            'Tabs'                                        => __( 'Tabs',                                        'bb_gallery' ),
            'Dense'                                       => __( 'Dense',                                       'bb_gallery' ),
            'Search Images on Site'                       => __( 'Search Images on Site',                       'bb_gallery' ),
            'Options'                                     => __( 'Options',                                     'bb_gallery' ),
            'Carousel Time Interval in ms'                => __( 'Carousel Time Interval in ms',                'bb_gallery' ),
            'Minimum Width for Gallery Images in px'      => __( 'Minimum Width for Gallery Images in px',      'bb_gallery' ),
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
        ob_start( );
        wp_nonce_field( self::$nonce_action );
        $nonce_field = ob_get_clean( );
        $output = <<<EOD
<div class="bbg_xiv-bootstrap bbg_xiv-gallery">
    <nav role="navigation" class="navbar navbar-inverse bbg_xiv-gallery_navbar">
        <div class="navbar-header">
            <button type="button" data-target="#$selector-navbarCollapse" data-toggle="collapse" class="navbar-toggle">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a href="#" class="navbar-brand bbg_xiv-images_brand">{$translations['Images:']}</a>
        </div>
        <div id="$selector-navbarCollapse" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="dropdown bbg_xiv-select_view">
                    <a data-toggle="dropdown" class="dropdown-toggle bbg_xiv-selected_view" href="#"><span>$translations[View]</span> <b class="caret"></b></a>
                    <ul role="menu" class="dropdown-menu bbg_xiv-view_menu">
                        <li class="active"><a href="#">$translations[Gallery]</a></li>
                        <li><a href="#">$translations[Carousel]</a></li>
                        <li><a href="#">$translations[Tabs]</a></li>
                        <li class="bbg_xiv-large_viewport_only"><a href="#">$translations[Dense]</a></li>
                        <!-- TODO: Add entry for new views here. -->
                        $table_nav_item
                    </ul>
                </li>
            </ul>
            <form role="search" class="navbar-form navbar-left bbg_xiv-search_form">
                <div class="form-group">
                    <input type="text" placeholder="{$translations['Search Images on Site']}" class="form-control">
                </div>
                <button type="submit" class="btn btn-default"><span class="glyphicon glyphicon-search"></span></button>
                $nonce_field
            </form>
            <button type="button" class="btn btn-info bbg_xiv-configure" title="configure bandwidth, carousel interval, ...">$translations[Options]</button>
        </div>
    </nav>
    <div id="$selector-heading" class="bbg_xiv-search_header">
        <span class="bbg_xiv-search_heading_first"></span><br>
        <button class="btn btn-primary btn-sm bbg_xiv-search_scroll_left" disabled><span class="glyphicon glyphicon-chevron-left"></span></button>
        <span class="bbg_xiv-search_heading_second"></span>
        <button class="btn btn-primary btn-sm bbg_xiv-search_scroll_right"><span class="glyphicon glyphicon-chevron-right"></span></button>
    </div>
    <div id="$selector" class="gallery galleryid-{$id} gallery-size-{$size_class} bbg_xiv-gallery_envelope">
        <div class="ui-loader"><span class="ui-icon-loading"></span></div>
   </div>
    <div class="bbg_xiv-configure_outer">
    </div>
    <div class="bbg_xiv-configure_inner">
      <button class="bbg_xiv-configure_close"><span class="glyphicon glyphicon-remove"></span></button>
      <h1>BB Gallery Options</h1>
      <form class="form-horizontal">
        <div class="form-group">
          <label for="bbg_xiv-carousel_delay" class="control-label col-sm-9 col-md-offset-2 col-md-6">{$translations['Carousel Time Interval in ms']}</label>
          <div class="col-sm-3 col-md-2">
            <input type="number" class="form-control" id="bbg_xiv-carousel_delay" min="1000" step="100">
          </div>
        </div>
        <div class="form-group">
          <label for="bbg_xiv-min_image_width" class="control-label col-sm-9 col-md-offset-2 col-md-6">{$translations['Minimum Width for Gallery Images in px']}</label>
          <div class="col-sm-3 col-md-2">
            <input type="number" class="form-control" id="bbg_xiv-min_image_width" min="32" max="1024">
          </div>
        </div>
        <div class="form-group">
          <label for="bbg_xiv-max_search_results" class="control-label col-sm-9 col-md-offset-2 col-md-6">{$translations['Maximum Number of Images Returned by Search']}</label>
          <div class="col-sm-3 col-md-2">
            <input type="number" class="form-control" id="bbg_xiv-max_search_results" min="1" max="{$bbg_xiv_data['bbg_xiv_max_search_results']}">
          </div>
        </div>
        <div class="form-group bbg_xiv-mouse_only_option">
          <label for="bbg_xiv-columns_in_dense_view" class="control-label col-sm-9 col-md-offset-2 col-md-6">{$translations['Number of Columns in the Dense View']}</label>
          <div class="col-sm-3 col-md-2">
            <input type="number" class="form-control" id="bbg_xiv-columns_in_dense_view" min="2" max="32">
          </div>
        </div>
        <div class="form-group">
          <label for="bbg_xiv-bandwidth" class="control-label col-sm-3 col-md-offset-2 col-md-2">$translations[Bandwidth]</label>
          <div class="col-sm-9 col-md-6">
            <span class="bbg_xiv-radio_input">
                <input type="radio" class="form-control" name="bbg_xiv-bandwidth" value="auto" id="bbg_xiv-bandwidth_auto" checked>
                <span class="bbg_xiv-radio_text">$translations[Auto]</span>
            </span>
            <span class="bbg_xiv-radio_input">
                <input type="radio" class="form-control" name="bbg_xiv-bandwidth" value="normal" id="bbg_xiv-bandwidth_normal">
                <span class="bbg_xiv-radio_text">$translations[High]</span>
            </span>
            <span class="bbg_xiv-radio_input">
                <input type="radio" class="form-control" name="bbg_xiv-bandwidth" value="low" id="bbg_xiv-bandwidth_low">
                <span class="bbg_xiv-radio_text">$translations[Medium]</span>
            </span>
            <span class="bbg_xiv-radio_input">
                <input type="radio" class="form-control" name="bbg_xiv-bandwidth" value="very low" id="bbg_xiv-bandwidth_very_low">
                <span class="bbg_xiv-radio_text">$translations[Low]</span>
            </span>
          </div>
        </div>
        <div class="form-group">
          <label for="bbg_xiv-interface" class="control-label col-sm-3 col-md-offset-2 col-md-2">$translations[Interface]</label>
          <div class="col-sm-9 col-md-6">
            <span class="bbg_xiv-radio_input">
                <input type="radio" class="form-control" name="bbg_xiv-interface" value="auto" id="bbg_xiv-interface_auto" checked>
                <span class="bbg_xiv-radio_text">$translations[Auto]</span>
            </span>
            <span class="bbg_xiv-radio_input">
                <input type="radio" class="form-control" name="bbg_xiv-interface" value="mouse" id="bbg_xiv-interface_mouse">
                <span class="bbg_xiv-radio_text">$translations[Mouse]</span>
            </span>
            <span class="bbg_xiv-radio_input">
                <input type="radio" class="form-control" name="bbg_xiv-interface" value="touch" id="bbg_xiv-interface_touch">
                <span class="bbg_xiv-radio_text">$translations[Touch]</span>
            </span>
            <span class="bbg_xiv-radio_input">
                <input type="radio" class="form-control" name="bbg_xiv-interface" value="null" id="bbg_xiv-interface_null" disabled>
                <span class="bbg_xiv-radio_text"></span>
            </span>
          </div>
        </div>
        <br>
        <div class="form-group">
          <div class="col-sm-offset-4 col-sm-8">
            <button type="button" class="btn btn-primary bbg_xiv-options_btn bbg_xiv-save_options">$translations[Save]</button>
            <button type="button" class="btn btn-default bbg_xiv-options_btn bbg_xiv-cancel_options">$translations[Cancel]</button>
            <button type="button" class="btn btn-info bbg_xiv-options_btn bbg_xiv-help_options">$translations[Help]</button>
          </div>
        </div>
      </form>
    </div>
</div>
EOD;
        self::bbg_xiv_do_attachments( $attachments );
        $bbg_xiv_data[ "$selector-data" ] = json_encode( array_values( $attachments ) );
        wp_localize_script( 'bbg_xiv-gallery', 'bbg_xiv', $bbg_xiv_data );
        return $output;
    }

    public static function bbg_xiv_do_attachments( $attachments ) {
        foreach ( $attachments as $id => &$attachment ) {
            $attachment->url = wp_get_attachment_url( $id );
            $meta = wp_get_attachment_metadata( $id );
            $attachment->width  = $meta[ 'width'  ];
            $attachment->height = $meta[ 'height' ];
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
            $attachment->post_content = apply_filters( 'the_content', $attachment->post_content );
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

    public static function init( ) {

        add_action( 'wp_loaded', function( ) {
            add_shortcode( 'bb_gallery', __CLASS__ . '::bb_gallery_shortcode' );
            if ( get_option( 'bbg_xiv_shortcode', 1 ) ) {
                remove_shortcode( 'gallery' );
                add_shortcode( 'gallery', __CLASS__ . '::bb_gallery_shortcode' );
            }
        } );

        add_action( 'wp_enqueue_scripts', function( ) {
            wp_enqueue_style( 'bootstrap',               plugins_url( '/css/bootstrap.css' ,               __FILE__ ) );
            wp_enqueue_style( 'jquery-mobile-structure', plugins_url( '/css/jquery-mobile-structure.css' , __FILE__ ) );
            wp_enqueue_style( 'jquery-mobile-theme',     plugins_url( '/css/jquery-mobile-theme.css' ,     __FILE__ ) );
            wp_enqueue_style( 'bbg_xiv-gallery',         plugins_url( '/css/bbg_xiv-gallery.css' ,         __FILE__ ), [ 'bootstrap' ] );
            $width = ( 100 / (integer) get_option( 'bbg_xiv_flex_number_of_dense_view_columns', 10 ) ) . '%';
            wp_add_inline_style( 'bbg_xiv-gallery', <<<EOD
        div.bbg_xiv-bootstrap div.bbg_xiv-dense_container div.bbg_xiv-dense_images div.bbg_xiv-dense_flex_images div.bbg_xiv-dense_flex_item{
          width:$width;
        }
EOD
            );
            wp_enqueue_script( 'backbone' );
            wp_enqueue_script( 'modernizr',       plugins_url( '/js/modernizr.js' ,       __FILE__ ) );
            wp_enqueue_script( 'jquery-mobile',   plugins_url( '/js/jquery-mobile.js' ,   __FILE__ ), [ 'jquery' ] );
            wp_enqueue_script( 'bootstrap',       plugins_url( '/js/bootstrap.js' ,       __FILE__ ), [ 'jquery' ],    FALSE, TRUE );
            wp_enqueue_script( 'bbg_xiv-gallery', plugins_url( '/js/bbg_xiv-gallery.js' , __FILE__ ), [ 'bootstrap' ], FALSE, TRUE );
        } );
 
        add_action( 'admin_init', function( ) {
            add_settings_section( 'bbg_xiv_setting_section', __( 'BB Gallery', 'bb_gallery' ), function( ) {
                echo '<p>' . __( 'BB Gallery is a plug-compatible replacement for the built-in WordPress gallery shortcode.', 'bb_gallery' ) . '</p>';
            }, 'media' );
            add_settings_field( 'bbg_xiv_shortcode', __( 'Enable BB Gallery', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_shortcode" id="bbg_xiv_shortcode" type="checkbox" value="1" class="code" '
                    . checked( get_option( 'bbg_xiv_shortcode', 1 ), 1, FALSE ) . ' /> ' . __( 'This will replace the built-in WordPress gallery shortcode.', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_table', __( 'Enable Table View', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_table" id="bbg_xiv_table" type="checkbox" value="1" class="code" '
                    . checked( get_option( 'bbg_xiv_table' ), 1, FALSE ) . ' /> ' . __( 'The "Table View" is primarily intended for developers.', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_flex_min_width', __( 'Gallery Minimum Image Width', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_flex_min_width" id="bbg_xiv_flex_min_width" type="number" value="' . get_option( 'bbg_xiv_flex_min_width', 128 )
                    . '" class="small-text" /> ' . __( 'The minimum image width in the "Gallery View" if the CSS3 Flexbox is used.', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_flex_min_width_for_caption', __( 'Gallery Minimum Image Width for Caption', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_flex_min_width_for_caption" id="bbg_xiv_flex_min_width_for_caption" type="number" value="'
                    . get_option( 'bbg_xiv_flex_min_width_for_caption', 96 )
                    . '" class="small-text" /> ' . __( 'The minimum image width in the "Gallery View" required to show the caption.', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_carousel_interval', __( 'Carousel Interval', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_carousel_interval" id="bbg_xiv_carousel_interval" type="number" value="'
                    . get_option( 'bbg_xiv_carousel_interval', 2500 )
                    . '" class="small-text" /> ' . __( 'The time delay between two slides.', 'bb_gallery' );
            }, 'media',	'bbg_xiv_setting_section' );
            add_settings_field( 'bbg_xiv_max_search_results', __( 'Maximum Number of Images Returned by Search', 'bb_gallery' ), function( ) {
                echo '<input name="bbg_xiv_max_search_results" id="bbg_xiv_max_search_results" type="number" value="' . get_option( 'bbg_xiv_max_search_results', 128 )
                    . '" class="small-text" /> ' . __( 'The browser user can lower this limit.', 'bb_gallery' );
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
            register_setting( 'media', 'bbg_xiv_shortcode' );
            register_setting( 'media', 'bbg_xiv_table' );
            register_setting( 'media', 'bbg_xiv_flex_min_width' );
            register_setting( 'media', 'bbg_xiv_flex_min_width_for_caption' );
            register_setting( 'media', 'bbg_xiv_carousel_interval' );
            register_setting( 'media', 'bbg_xiv_max_search_results' );
            register_setting( 'media', 'bbg_xiv_flex_number_of_dense_view_columns' );
            register_setting( 'media', 'bbg_xiv_flex_min_width_for_dense_view' );
        } );
 
        add_action( 'plugins_loaded', function( ) {
            load_plugin_textdomain( 'bb_gallery', false, plugin_basename( dirname( __FILE__ ) ) . '/languages' );
        } );

        if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
            # AJAX search handlers
            add_action( 'wp_ajax_nopriv_bbg_xiv_search_media', function( ) {
                global $wpdb;
                check_ajax_referer( BBG_XIV_Gallery::$nonce_action );
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
                $attachments = [ ];
                foreach ( get_posts( [ 'include' => implode( ',', $results ), 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image' ] ) as $key => $val ) {
                    $attachments[ $val->ID ] = $val;
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
