// TODO: Cannot make this into a module as that changes the load order.

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

/*
 * This is a Reactified and Reduxed version of BB Gallery.
 * 
 * This is a hybrid solution. Basically I have divided the state of the application into two domains:
 *
 *    1. The vector of images in the gallery and the view selection
 *    2. The class and style attributes of DOM elements
 *
 * Changes to the state in domain 1 are handled by React/Redux. Changes to the state in domain 2 are
 * handled directly by JavaScript.
 * 
 * React Redux primarily handles changes to the image data. Changes to how the images are rendered,
 * e.g. whether captions are visible or not are handled directly by JavaScript code manipulating CSS.
 * I think this is more efficient than keeping CSS state in the store since changes to that CSS state
 * would need to be propagated to the props of React element, then the React elements would need to
 * rerendered from the changed props and then the DOM elements would need to be rerendered from the
 * changed React elements. Directly manipulating the CSS skips all these intermediate steps. Of 
 * course the major disadvantage is the logic isn't as structured but I think it will be reasonably
 * understandable. The other reason is the original BB Gallery was written that way and I am too lazy
 * to rewrite all that code. (Actually, I am in the process of porting the code to completely drive
 *  everything from the Redux store.)
 */

/* MUCH OF THE CODE IN THIS FILE IS NOW DEAD CODE */

console.log('bbg_xiv-gallery.js:loading...');
(function(){
    var bbg_xiv=window.bbg_xiv=window.bbg_xiv||{};
    // URLs
    bbg_xiv.docUrl         = "http://docs.magentacuda.com/";
    bbg_xiv.helpOptionsUrl = "http://docs.magentacuda.com/#options";
    // Strings
    bbg_xiv.galleryOfGalleriesTitle=bbg_xiv_lang.galleryOfGalleriesTitle;
    // use WordPress templating syntax; see .../wp-includes/js/wp-util.js
    bbg_xiv.templateOptions={
        evaluate:    /<#([\s\S]+?)#>/g,
        interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
        escape:      /\{\{([^\}]+?)\}\}(?!\})/g,
        variable:    'data'
    };
    
    bbg_xiv.galleries = {};   // state info for alternate galleries
    
    bbg_xiv.ImageView = Backbone.View.extend( {
        render:function(srcOnly){
            var html=this.template(this.model.attributes);
            if(srcOnly){
                return html;
            }
            this.$el.html(html);
            return this;
        }    
    });
    
    bbg_xiv.postRenderFlexContainer = container => {
        const $flexContainer = jQuery(container)
        if (bbg_xiv.guiInterface === 'touch') {
            $flexContainer.find("div.bbg_xiv-flex_item div.bbg_xiv-dense_full_btn").addClass("bbg_xiv-touch");
        }
/*
        TODO: flags needs to passed as prop on Gallery
        if(!Modernizr.objectfit||flags.indexOf("contain")!==-1){
            // IE and Edge do not support objectfit so we set a class to differentiate between landscape and portrait mode which will let our CSS rules simulate object-fit:cover
            container.find("div.bbg_xiv-flex_item img").load(function(){
                if(this.naturalWidth<this.naturalHeight){
                    jQuery(this).addClass("bbg_xiv-portrait");
                }
            });
        }
 */
        if (bbg_xiv.guiInterface === 'touch') {
            $flexContainer.find("div.bbg_xiv-flex_item a").click(function(e) {
                if (!$galleryContainer.hasClass( 'bbg_xiv-caption_visible')) {
                    const $caption = jQuery(this.parentNode).find("figure figcaption")
                    if (!$caption.data("visible")) {
                        $flexContainer.find("div.bbg_xiv-flex_item figure figcaption").data("visible", false)
                        $caption.data("visible", true)
                        e.preventDefault()
                    }
                }
            });
        }
        mcRrr.createOverlay($flexContainer.find('div.mc-rrr-react-overlay-root').get(0))
    }   // bbg_xiv.postRenderFlexContainer = container => {

    bbg_xiv.postRenderDense = (container, numberOfColumns) => {
        const jqGallery = jQuery(container)
        jqGallery.find("div.bbg_xiv-dense_images div.bbg_xiv-dense_flex_images div.bbg_xiv-dense_flex_item")
            .css("width", 100/numberOfColumns+"%");
        var normal=jQuery("div.bbg_xiv-dense_container button#bbg_xiv-normal_color").css("background-color");
        var highlight=jQuery("div.bbg_xiv-dense_container button#bbg_xiv-highlight_color").css("background-color");
        jqGallery.find("div.bbg_xiv-dense_titles ul li").hover(
            function() {
                // highlight matching image
                jQuery(this).css({"background-color":highlight});
                var img=jQuery("div#"+this.id.replace("title","image")).css({"border-color":highlight});
                // scroll images view if matching image is hidden
                var top=img.position().top;
                var height=img.height();
                var bottom=top+height;
                var div = img.parents( 'div.bbg_xiv-dense_images' );
                var scrollTop=div.scrollTop();
                var scrollHeight=div.height();
                if(top<0){
                    div.scrollTop(scrollTop+top-scrollHeight/2-height/2);
                }else if(bottom>scrollHeight){
                    div.scrollTop(scrollTop+(bottom-scrollHeight)+scrollHeight/2-height/2);
                }
            },
            function() {
                jQuery(this).css({"background-color":normal});
                jQuery("div#"+this.id.replace("title","image")).css({"border-color":normal});
            }
        );
        jqGallery.find("div.bbg_xiv-dense_flex_item").hover(
            function() {
                jQuery(this).css({"border-color":highlight});
                // highlight matching title
                var li=jQuery("li#"+this.id.replace("image","title")).css({"background-color":highlight});
                // scroll titles view if matching title is hidden
                var top=li.position().top;
                var height=li.height();
                var bottom=top+height;
                var div = li.parents( 'div.bbg_xiv-dense_titles' );
                var scrollTop=div.scrollTop();
                var scrollHeight=div.height();
                if(top<0){
                    div.scrollTop(scrollTop+top-scrollHeight/2-height/2);
                }else if(bottom>scrollHeight){
                    div.scrollTop(scrollTop+(bottom-scrollHeight)+scrollHeight/2-height/2);
                }
            },
            function() {
                jQuery(this).css({"border-color":normal});
                jQuery("li#"+this.id.replace("image","title")).css({"background-color":normal});
            }
        );
        jqGallery.find( 'input.bbg_xiv-dense_li_mode' ).change(function() {
            // show titles or captions depending on the radio buttons 
            if(this.checked){
                var div=jQuery("div.bbg_xiv-dense_container div.bbg_xiv-dense_titles");
                if(this.value==="title"){
                    div.find("span.bbg_xiv-dense_li_caption").hide();
                    div.find("span.bbg_xiv-dense_li_title").show();
                    div.find("span.bbg_xiv-dense_li_alt").hide();
                }else if(this.value==="caption"){
                    div.find("span.bbg_xiv-dense_li_title").hide();
                    div.find("span.bbg_xiv-dense_li_caption").show();
                    div.find("span.bbg_xiv-dense_li_alt").hide();
                }else if(this.value==="alt"){
                    div.find("span.bbg_xiv-dense_li_title").hide();
                    div.find("span.bbg_xiv-dense_li_caption").hide();
                    div.find("span.bbg_xiv-dense_li_alt").show();
                }
            }
        });
        jqGallery.find( 'button.bbg_xiv-dense_info_btn' ).click( function( e ) {
            window.open( bbg_xiv.docUrl + '#view-dense', '_blank' );
            e.preventDefault();      
        } );
        mcRrr.createOverlay(jQuery(container).find('div.mc-rrr-react-overlay-root').get(0))
    }   // bbg_xiv.postRenderDense = (container, numberOfColumns) => {

    bbg_xiv.postRenderJustified = (container, rowHeight) => {
        const justifiedContainer = jQuery(container);
        const $justifiedGallery  = justifiedContainer.find( 'div.bbg_xiv-justified_gallery' );
        $justifiedGallery.justifiedGallery({margins: 5, rowHeight: rowHeight, lastRow: 'nojustify', refreshSensitivity: 0, refreshTime: 250})
            .on( 'jg.complete jg.resize', function() {
            // Why are there negative margins on the img - anyway remove them
            $justifiedGallery.find( 'img' ).css( 'margin', '0' );
        });
        if ( bbg_xiv.guiInterface === 'touch' ) {
            justifiedContainer.addClass( 'bbg_xiv-touch' );
            $justifiedGallery.find( 'div.bbg_xiv-justified_item > a' ).click(function( e ) {
                e.preventDefault();
            });
            justifiedContainer.addClass( window.matchMedia( '(max-aspect-ratio:1/1)' ).matches ? 'bbg_xiv-portrait' : 'bbg_xiv-landscape' );
        }
        // if CC has been set to visible then override Justified Gallery's hover handlers
        $justifiedGallery.find("div.bbg_xiv-justified_item").each(function() {
            const img     = this.querySelector("img")
            const caption = this.querySelector("div.caption");
            [img, caption].forEach(function(item) {
                // These handlers undoes the actions of Justified Gallery's hover handlers.
                item.addEventListener("mouseover", function(e) {
                    if ($justifiedGallery.hasClass( 'bbg_xiv-caption_visible')) {
                      caption.style.display = "block"
                      caption.style.opacity = "0.7"
                      e.stopImmediatePropagation()
                    }
                })
                item.addEventListener("mouseout", function(e) {
                    if ($justifiedGallery.hasClass("bbg_xiv-caption_visible")) {
                        caption.style.display = "block"
                        caption.style.opacity = "0.7"
                        e.stopImmediatePropagation()
                    }
                })
            })
            jQuery(img).closest("a").click(function(e) {
                e.preventDefault()
            })
            jQuery(caption).find("a").click(function(e) {
              var $caption = jQuery(this).closest("div.caption")
              if ( parseFloat($caption.css("opacity")) < 0.1) {
                  e.preventDefault()
              }
            })
        })
        mcRrr.createOverlay(jQuery(container).find('div.mc-rrr-react-overlay-root').get(0))
    }   // bbg_xiv.postRenderJustified = (container, rowHeight) => {

    bbg_xiv.postRenderTabs = container => {
        const jqGallery = jQuery(container)
        bbg_xiv.prettifyTabs(jqGallery,true);
        jqGallery.find( 'nav.navbar ul.nav li a' ).click(function() {
            if(!Modernizr.objectfit){
                // Microsoft Edge does not support CSS object-fit so do the object fit with JavaScript code
                jQuery(this.href.substr(this.href.lastIndexOf("#"))+" img").each(function(){
                    var img=this;
                    var i=0;
                    var j=0;
                    var r0;
                    window.setTimeout(function f(){
                        var w=img.naturalWidth;
                        var h=img.naturalHeight;
                        var parent=jQuery(img.parentNode.parentNode.parentNode);
                        var W=parent.width();
                        var H=0.7*jQuery(window).height();
                        if(!w||!h||!W||!H||W<64||H<64){
                            if(i++<16){
                                window.setTimeout(f,250);
                            }
                            return;
                        }
                        var r=Math.max(w/W,h/H);
                        if(r<0.125||r>8){
                            return;
                        }
                        if(typeof r0!=='undefined'&&r===r0){
                            return;
                        }
                        w=Math.floor(w/r);
                        h=Math.floor(h/r);
                        jQuery(img).css({width:w+"px",height:h+"px"});
                        r0=r;
                        if(j++<16){
                            window.setTimeout(f,250);
                        }
                    },250);
                });
            }
            window.setTimeout(function() {
                // the timeout is necessary to give browser time to render the image before the scrolling is done
                var $window    = jQuery( window );
                var $gallery   = jqGallery.closest( 'div.bbg_xiv-gallery' );
                var fullscreen = $gallery.hasClass( 'bbg_xiv-fullscreen_gallery' );
                var $content   = jqGallery.find( 'div.tab-content' );
                if( window.matchMedia( '(max-aspect-ratio:1/1)' ).matches ) {
                    // portrait mode
                    if ( fullscreen ) {
                        $gallery.scrollTop( $gallery.scrollTop() + $content.position().top  - $window.height() / 3 - 20 );
                    } else {
                        $window.scrollTop( $content.offset().top - $window.height() / 3 - 20 );
                    }
                } else {
                    // landscape mode
                    if ( fullscreen ) {
                        $gallery.scrollTop( $gallery.scrollTop() + $content.position().top - 90 );
                    } else {
                        var $body            = jQuery( 'body' );
                        var $adminBar        = jQuery( 'div#wpadminbar' );
                        // If WordPress admin bar is showing on frontend page adjust for it.
                        var adminBarHeight   = $body.hasClass( 'admin-bar' ) && $adminBar.css( 'position' ) == 'fixed' ? $adminBar.outerHeight() : 0;
                        var bodyBeforeHeight = 0;
                        if ( $body.hasClass( 'bbg_xiv-twentysixteen_with_border' ) ) {
                            // Adjust for the black border in the WordPress TwentySixteen theme.
                            var bodyBeforeStyle = window.getComputedStyle( $body[0], ':before' );
                            bodyBeforeHeight    = bodyBeforeStyle && bodyBeforeStyle.position === 'fixed' ? parseInt( bodyBeforeStyle.height, 10 ) : 0;
                        }
                        var offset              = $window.height() >= 480 ? 80 : 40;
                        $window.scrollTop( $content.offset().top - offset - adminBarHeight - bodyBeforeHeight );
                    }
                }
            }, 500 );
        });
        // intercept clicks when images belong to gallery of galleries
        if(jqGallery.hasClass("bbg_xiv-gallery_icons_mode")){
            jqGallery.find("div.bbg_xiv-template_tabs_container div.tab-content figure.tab-pane a").click(function(e){
                var galleries=jqGallery.parent().find("nav.bbg_xiv-gallery_navbar ul.nav li.dropdown ul.bbg_xiv-view_menu li.bbg_xiv-alt_gallery");
                // only intercept clicks on the home gallery
                if(galleries.filter(".bbg_xiv-alt_gallery_home").hasClass("active")){
                    galleries.find("a[data-view='gallery_"+this.dataset.galleryIndex+"']").click();
                    e.preventDefault();
                }
            });
        }
        // make the "Tabs" brand clickable for mobile devices and send click to the toggle button
        jqGallery.find("a.bbg_xiv-tabs_brand").click(function(e){
            var toggle=jQuery(this).siblings("button.navbar-toggle");
            if(toggle.css("display")!=="none"){
                toggle.click();
            }
            e.preventDefault();
        });
        if ( bbg_xiv.guiInterface === 'touch' ) {
            // For mobile devices if a scrollbar is needed then initially expand the tab navbar as the collapsed tab navbar is not user friendly on mobile devices
            jQuery( 'div.bbg_xiv-gallery nav.bbg_xiv-gallery_navbar' ).find( 'span.glyphicon-collapse-down' ).each(function(){
                var jqThis=jQuery(this);
                if(jqThis.css("display")!=="none"){
                    jqThis.click();
                }
            });
        }
    }   // bbg_xiv.postRenderTabs = container => {
    bbg_xiv.postRenderCarousel = (container, carouselId, images, setIndex) => {
        const jqGallery = jQuery(container)
        // TODO: flags
        // if(flags.indexOf("embedded-carousel")!==-1){
        if (true) {
            jqGallery.addClass("bbg_xiv-embedded_carousel")
        }
        mcRrr.createOverlay(jqGallery.find('div.mc-rrr-react-overlay-root').get(0), `mcrrr-overlay-${carouselId}`, "carousel")
        // pause() can be called from a button's event handler to pause the carousel, the argument is the button
        function pause( button ) {
            var $carousel = jQuery( button ).parents( 'div.carousel' );
            $carousel.carousel( 'pause' );
            $carousel.find( 'a.bbg_xiv-carousel_play span.glyphicon' ).removeClass( 'glyphicon-pause' ).addClass( 'glyphicon-play' ).parent().attr( 'title', bbg_xiv_lang['Play'] );
        }
        // Wireup the handlers - this must be done here as the elements in the carousel view are dynamically created
        // Carousel pause handler
        jqGallery.find( 'a.bbg_xiv-carousel_play' ).click( function( e ) {
            var $this     = jQuery( this );
            var $carousel = $this.parents( 'div.carousel' );
            var $span     = $this.find( 'span.glyphicon' );
            if ( $span.hasClass( 'glyphicon-pause' ) ) {
                pause( this );
            } else {
                $span.removeClass( 'glyphicon-play' ).addClass( 'glyphicon-pause' ).parent().attr( 'title', bbg_xiv_lang['Pause'] );
                $carousel.carousel( 'next' );
                $carousel.carousel( 'cycle' );
            }
            e.preventDefault();
        });
        jqGallery.find( 'a.bbg_xiv-carousel_left, a.bbg_xiv-carousel_right' ).click(function() {
            pause(this);
        });
        // Carousel rewind handler
        jqGallery.find("a.bbg_xiv-carousel_first span.glyphicon,a.bbg_xiv-carousel_last span.glyphicon").click(function(e){
            pause( this );
            var carousel=jQuery(this).parents("div.carousel");
            if(jQuery(this.parentNode).hasClass("bbg_xiv-carousel_first")){
                carousel.carousel(0);
            }else{
                carousel.carousel(images.length - 1 )
            }
            e.preventDefault();
        });
        // Carousel Image Info Handler
        jqGallery.find('a.bbg_xiv-carousel_info').click(function(e) {
            pause(this)
            // The React Carousel component click handler handles the actual display of the overlay.
            // click is from carousel info button so active image is
            // const img  = jqGallery.find('div.carousel-inner figure.item.active img')[0]
            // const data = images.get(img.dataset.bbg_xivImageId).attributes
            // Show alt overlay
            // window.bbg_xiv.showOverlay(e, true, img, data)
        })
        jqGallery.find( 'a.bbg_xiv-carousel_help span.glyphicon' ).click( function( e ) {
            window.open( bbg_xiv.docUrl + '#view-carousel', '_blank' );
            e.preventDefault();
        } );
        jqGallery.find("a.bbg_xiv-carousel_close").click(function(e){
            // restore "Gallery View"
            jqGallery.removeClass("bbg_xiv-embedded_carousel");
            // This handler handles only CSS changes; state changes are handled by the React click handler
            // bbg_xiv.resetGallery(jQuery(this).parents("div.bbg_xiv-gallery"),"Carousel");
            jQuery( 'html' ).css( 'overflow-y', '' );
            //e.preventDefault();
        });
        var input=jqGallery.find("div.bbg_xiv-jquery_mobile input[type='range']");
        input.slider();
        var prevChangeTime;
        var slideChange=false;   // change event triggered by a carousel slid event
        // update Bootstrap carousel slide when jQuery mobile slider changes
        // jQuery Mobile should change the "type" from "range" to "number" but does not so force it.
        // TODO: Find out why jQuery Mobile is not doing this here - maybe I am doing something wrong.
        input.attr( 'type', 'number' ).val( '1' ).change(function() {
            if(slideChange){
                // ignore change events triggered by a carousel slid event
                return;
            }
            prevChangeTime=Date.now();
            var carousel=jQuery(this).parents("div.carousel");
            pause(input);
            // Since change events will occur much too rapidly wait until they quiesce
            window.setTimeout(function(){
                if(Date.now()-prevChangeTime>=500){
                    var i=input.val();
                    if(jQuery.isNumeric(i)){
                        i = parseInt( i, 10 ) - 1;
                        if(i>=0&&i<images.length){
                            carousel.carousel(i);
                            pause(input);
                        }
                    }
                }
            },500);
        }).keypress(function(e){
            if(e.which===13){
                jQuery(this).blur();
                e.preventDefault();
            }
        }).focus(function() {
            pause(this);
        }).on( 'slidestart', function() {
            pause(this);
        });
        // update jQuery Mobile slider when Bootstrap carousel changes slide
        jqGallery.on("slide.bs.carousel slid.bs.carousel",function(e){
            slideChange=true;
            // update input element and trigger change event to force update of slider position
            const index = parseInt( e.relatedTarget.dataset.index, 10 )
            setIndex(index)
            jQuery(this).find('div.bbg_xiv-jquery_mobile input[type="number"]').val(index + 1).change();
            slideChange=false;
        });
        // TODO: flags
        // if ( flags.indexOf( 'embedded-carousel' ) !== -1 ) {
        if (true) {
            window.setTimeout( function() {
                // the timeout is necessary to give browser time to render the image before the scrolling is done
                var $gallery     = jqGallery.closest( 'div.bbg_xiv-gallery' );
                var $divCarousel = jqGallery;
                if ( $gallery.hasClass( 'bbg_xiv-fullscreen_gallery' ) ) {
                    // full screen
                    if ( window.matchMedia( '(max-aspect-ratio:1/1)' ).matches ) {
                        // portrait mode
                    } else {
                        // landscape mode
                        $gallery.scrollTop( $gallery[0].scrollHeight - $gallery.height() - 50 + 0.05 * $divCarousel.height() );
                    }
                } else {
                    // not full screen
                    if(window.matchMedia("(max-aspect-ratio:1/1)").matches){
                        // portrait mode
                        jQuery(window).scrollTop( $divCarousel.offset().top - jQuery(window).height()/6 );
                    }else{
                        // landscape mode
                        // If WordPress admin bar is showing on frontend page adjust for it.
                        var $body            = jQuery( 'body' );
                        var $adminBar        = jQuery( 'div#wpadminbar' );
                        var adminBarHeight   = $body.hasClass( 'admin-bar' ) && $adminBar.css( 'position' ) == 'fixed' ? $adminBar.outerHeight() : 0;
                        var bodyBeforeHeight = 0;
                        if ( $body.hasClass( 'bbg_xiv-twentysixteen_with_border' ) ) {
                            // Adjust for the black border in the WordPress TwentySixteen theme.
                            var bodyBeforeStyle = window.getComputedStyle( $body[0], ':before' );
                            bodyBeforeHeight    = bodyBeforeStyle && bodyBeforeStyle.position === 'fixed' ? parseInt( bodyBeforeStyle.height, 10 ) : 0;
                        }
                        jQuery( window ).scrollTop( $divCarousel.offset().top - $divCarousel.outerHeight() / 18 - adminBarHeight - bodyBeforeHeight );
                    }
                }
            }, 500 );
        }
        jQuery("#"+carouselId).carousel({interval:bbg_xiv.bbg_xiv_carousel_interval,pause:false});
    }   // bbg_xiv.postRenderCarousel = container => {
/*
    bbg_xiv.renderGallery=function(gallery,view,flags){
        if(!flags){
            flags=[];
        }
        // extract flags from data attribute flags
        if(gallery.dataset.flags){
            flags=flags.concat(gallery.dataset.flags.split(","));
        }

        var jqGallery=jQuery(gallery);
        // remember the initial statically loaded gallery so we can efficiently return to it
        bbg_xiv.galleries[gallery.id]=bbg_xiv.galleries[gallery.id]||{images:{"gallery_home":images},view:"gallery_home"};
        var menuItems=jQuery(gallery.parentNode).find("nav.bbg_xiv-gallery_navbar ul.nav ul.bbg_xiv-view_menu li").show();
        if ( bbg_xiv.guiInterface !== 'mouse' || jQuery( window ).width() < bbg_xiv.bbg_xiv_flex_min_width_for_dense_view ) {
            // for touch and small screen devices hide the dense menu item
            menuItems.filter( '.bbg_xiv-large_viewport_only' ).hide();
        }
        if (bbg_xiv.galleries[gallery.id]) {
            // displaying a gallery so hide search results heading
            jQuery("div#"+gallery.id+"-heading").hide();
            var galleryOfGalleries=typeof bbg_xiv.images[gallery.id].models[0].attributes.gallery_index!=="undefined";
            var divAltGalleryHeading=jQuery("div#"+gallery.id+"-alt_gallery_heading");
            if(galleryOfGalleries){
                // show heads up for gallery of galleries
                divAltGalleryHeading.find("span.bbg_xiv-alt_gallery_heading").text(bbg_xiv.galleryOfGalleriesTitle);
                // click handler for gallery icon images
                jqGallery.find("a.bbg_xiv-gallery_icon").click(function(e){
                    jqGallery.parent().find( 'nav.bbg_xiv-gallery_navbar ul.nav li.dropdown ul.bbg_xiv-view_menu li.bbg_xiv-alt_gallery > a[data-view="gallery_' +
                        this.dataset.galleryIndex+'"]').click();
                    e.preventDefault();
                });
                // hide inappropriate menu items for gallery of galleries
                menuItems.filter(".bbg_xiv-hide_for_gallery_icons").hide();
            }
            if(bbg_xiv.galleries[gallery.id].view!=="gallery_home"||galleryOfGalleries){
                // and show title of alternate galleries or heads up for gallery of galleries; except hide title for home gallery; 
                divAltGalleryHeading.show();
            }
        }
    };
 */
    // tabs are used twice - to show a list of gallery titles and a list of image titles. prettifyTabs() implements the common functionality for both
    bbg_xiv.prettifyTabs=function(jqGallery,initial){
        // Adjust the tab view according to its environment
        var navbar=jqGallery.find("nav.navbar");
        // In portrait mode show the tabs navbar uncollapsed
        var toggle=navbar.find("button.navbar-toggle");
        if(toggle.css("display")!=="none"){
            toggle.click();
        }
        // Hide the expand glyph and scrollbar if not needed.
        navbar.find("div.navbar-collapse ul.nav").each(function(){
            if(jQuery(this).height()-8<=jQuery(this.parentNode).height()){
                jQuery(this).parents("nav.navbar").find("span.glyphicon").hide();
                jQuery(this.parentNode).addClass("bbg_xiv-hide_scroll");
            }
        });
        if(initial){
            // Wireup the handlers - this must be done here as the elements in the tab view are dynamically created
            // Clicking the expand glpyh shows all the tabs.
            jqGallery.find( 'span.glyphicon-collapse-down, span.glyphicon-collapse-up' ).click(function() {
                var jqThis=jQuery(this);
                var navbar=jQuery(this.parentNode).find("div.navbar-collapse");
                if(jqThis.hasClass("glyphicon-collapse-down")){
                    jqThis.removeClass("glyphicon-collapse-down").addClass("glyphicon-collapse-up");
                    navbar.removeClass("bbg_xiv-closed").addClass("bbg_xiv-open");
                }else{
                    jqThis.removeClass("glyphicon-collapse-up").addClass("glyphicon-collapse-down");
                    navbar.removeClass("bbg_xiv-open").addClass("bbg_xiv-closed");
                }
            });
        }
    };

    // the fullSize parameter is the size of the non-iconic view of the image and should either "viewport" or "container"
    // the icon parameter is a boolean indicating that the src is for a thumbnail

    // getSrc() sets the src attribute of <img> HTML elements which will be ignored on modern browsers that support the srcset attribute
    // i.e. the source selection logic of getSrc() will only be used on older browsers

    bbg_xiv.getSrc = function( data, fullSize,icon ) {
        switch ( bbg_xiv.bandwidth ) {
        case "normal":
            return data.source_url;
        case "low":
            if(icon){
                return data.bbg_thumbnail_src[0];
            }else{
                if(fullSize==="viewport"){
                    return data.bbg_large_src[0];
                }else{
                    return data.bbg_medium_large_src[0];
                }
            }
            break;
        case "very low":
            if(icon){
                return data.bbg_thumbnail_src[0];
            }else{
                if(fullSize==="viewport"){
                    return data.bbg_medium_large_src[0];
                }else{
                    return data.bbg_medium_src[0];
                }
            }
        }
    };

    bbg_xiv.getSrcset=function(data){
        if(bbg_xiv.bbg_xiv_bandwidth!=='auto'){
            // really should removeAttribute but this should work
            return "";
        }
        return data.bbg_srcset;
    };

    bbg_xiv.getTitle=function(data){
        return data.title.rendered.trim();
    };

    bbg_xiv.getCaption = function( data, noAlt ) {
        var caption = jQuery(data.caption.rendered).text();
        if ( ! caption && ! noAlt ) {
            caption = bbg_xiv.getAlt( data, true );
        }
        return caption.trim();
    };

    bbg_xiv.getAlt = function( data, noCaption ) {
        var alt = data.alt_text;
        if (! alt && ! noCaption ) {
            alt = bbg_xiv.getCaption( data, true );
        }
        return alt.trim();
    };

    bbg_xiv.getPostContent = function( data ) {
        var postContent = data.bbg_post_content;
        if( postContent ) {
            return postContent;
        }
        return bbg_xiv.getCaption( data );
    };
    
    bbg_xiv.getSizes=function(data,fullSize,icon){
        if(bbg_xiv.bbg_xiv_bandwidth!=='auto'){
            // really should removeAttribute but this should work
            return "";
        }
        if(!data){
            if(fullSize==="viewport"&&!icon){
                return "100vw";
            }
            return "50vw";
        }         
        if(!data.bbg_srcset){
            // really should removeAttribute but this should work
            return "";
        } else if ( icon ) {
            return '10vw';
        }else if(fullSize==="viewport"){
            return "90vw";
        }else if(fullSize==="container"){
            // return data.bbg_xiv_container_width+"px";
            return '100%';
        }else{
            return "50vw";
        }
    };

    try{
        window.localStorage.setItem("test","test");
        window.localStorage.removeItem("test");
        bbg_xiv.localStorageAvailable=true;
    }catch(e){
        bbg_xiv.localStorageAvailable=false;
    }
    
    bbg_xiv.setCookie=function(name,value,expires){
        if(bbg_xiv.localStorageAvailable){
            localStorage.setItem(name,value);
        }else{
            var d=new Date();
            d.setTime(d.getTime()+(expires*24*60*60*1000));
            document.cookie=name+"="+value+"; expires="+d.toUTCString()+"; path=/";
        }
    };

    bbg_xiv.getCookie=function(name){
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
    };

    bbg_xiv.calcBreakpoints=function(){
        var minFlexWidth=window.bbg_xiv.bbg_xiv_flex_min_width;
        bbg_xiv.breakpoints=[
            {width:2*minFlexWidth,cssClass:"100"},
            {width:3*minFlexWidth,cssClass:"50"},
            {width:4*minFlexWidth,cssClass:"33_3333"},
            {width:5*minFlexWidth,cssClass:"25"},
            {width:6*minFlexWidth,cssClass:"20"},
            {width:7*minFlexWidth,cssClass:"16_6666"},
            {width:8*minFlexWidth,cssClass:"14_2857"},
            {width:9*minFlexWidth,cssClass:"12_5"},
            {width:10*minFlexWidth,cssClass:"11_1111"},
            {width:11*minFlexWidth,cssClass:"10"},
            {width:12*minFlexWidth,cssClass:"9_0909"},
            { width: 1000000, cssClass: '8_3333' }
        ];
    };


    bbg_xiv.getOptionsFromCookie=function(){
        // override options with cookie values if they exists
        var cookie=bbg_xiv.getCookie("bbg_xiv");
        if(cookie){
            var options=JSON.parse(cookie);
            var carousel_interval=options.bbg_xiv_carousel_interval;
            if(jQuery.isNumeric(carousel_interval)&&carousel_interval>=1000){
                bbg_xiv.bbg_xiv_carousel_interval=carousel_interval;
            }
            var flex_min_width=options.bbg_xiv_flex_min_width;
            if(jQuery.isNumeric(flex_min_width)&&flex_min_width>=32&&flex_min_width<=1024){
                bbg_xiv.bbg_xiv_flex_min_width=flex_min_width;
            }
            var miro_row_height = options.bbg_xiv_miro_row_height;
            if ( jQuery.isNumeric( miro_row_height ) && miro_row_height >= 32 && miro_row_height <= 512 ) {
                bbg_xiv.bbg_xiv_miro_row_height = miro_row_height;
            }
            var max_search_results=options.bbg_xiv_max_search_results;
            if(jQuery.isNumeric(max_search_results)&&max_search_results>=1&&max_search_results<1048576){
                bbg_xiv.bbg_xiv_max_search_results=max_search_results;
            }
            var flex_number_of_dense_view_columns=options.bbg_xiv_flex_number_of_dense_view_columns;
            if(jQuery.isNumeric(flex_number_of_dense_view_columns)&&flex_number_of_dense_view_columns>=2&&flex_number_of_dense_view_columns<=32){
                bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns=flex_number_of_dense_view_columns;
            }
            if(typeof options.bbg_xiv_default_view==="string"){
                bbg_xiv.bbg_xiv_default_view=options.bbg_xiv_default_view;
                bbg_xiv.usingServerDefaultView=false;
            }else{
                bbg_xiv.usingServerDefaultView=true;
            }
            if(typeof options.bbg_xiv_bandwidth==="string"){
                bbg_xiv.bbg_xiv_bandwidth=options.bbg_xiv_bandwidth;
            }
            if(typeof options.bbg_xiv_interface==="string"){
                bbg_xiv.bbg_xiv_interface=options.bbg_xiv_interface;
            }
        }else{
            bbg_xiv.usingServerDefaultView=true;
            bbg_xiv.bbg_xiv_bandwidth="auto";
            bbg_xiv.bbg_xiv_interface="auto";
        }
        var userAgent=navigator.userAgent;
        if(userAgent.indexOf("Firefox")!==-1){
            bbg_xiv.browser="Firefox";
        }else{
            bbg_xiv.browser="";
        }
        // compute bandwidth if bandwidth is set to auto - currently since this is not done reliably the user should set the bandwidth option manually
        if(bbg_xiv.bbg_xiv_bandwidth==="auto"){
            if(Modernizr.lowbandwidth){
                // this uses navigator.connection which is only supported by Android
                bbg_xiv.bandwidth="very low";
            }else if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)){
                // determining bandwidth by device type is not reliable!
                bbg_xiv.bandwidth="very low";
            }else{
                bbg_xiv.bandwidth="low";
            }
        }else{
            bbg_xiv.bandwidth=bbg_xiv.bbg_xiv_bandwidth;
        }
        // compute interface if interface is auto
        if(bbg_xiv.bbg_xiv_interface==="auto"){
            if(Modernizr.touchevents){
                bbg_xiv.guiInterface = 'touch';
            }else{
                bbg_xiv.guiInterface = 'mouse';
            }
        }else{
            bbg_xiv.guiInterface = bbg_xiv.bbg_xiv_interface;
        }
        // WP REST API requires that per_page be between 1 and 100 inclusive
        bbg_xiv.wpRestApiMaxPerPage=100;
    };

    bbg_xiv.getOptionsFromCookie();

    bbg_xiv.calcBreakpoints();
    
    jQuery(window).resize(function(){
        var breakpoints=bbg_xiv.breakpoints;
        jQuery("div.bbg_xiv-flex_container,div.bbg_xiv-gallery_container").each(function(){
            var jqThis=jQuery(this);
            var width=jqThis.width();
            var pxWidth;
            var minFlexWidthForCaption=window.bbg_xiv.bbg_xiv_flex_min_width_for_caption;
            if(jqThis.parents("div.bbg_xiv-gallery_envelope").hasClass("bbg_xiv-tiles_container")
                || jqThis.hasClass("bbg_xiv-tiles_container") ) {
                // This case handle in FlexContainer.js
            }else{
                // find the smallest percentage width that satisfies the minimum image width
                breakpoints.forEach(function(breakpoint){
                  jqThis.removeClass("bbg_xiv-flex_width_"+breakpoint.cssClass);
                });
                for(var i=0;i<breakpoints.length;i++){
                    if(width<breakpoints[i].width){
                        var cssClass=breakpoints[i].cssClass;
                        jqThis.addClass("bbg_xiv-flex_width_"+cssClass);
                        pxWidth = parseFloat( cssClass.replace( '_', '.' ) ) / 100.0 * width;
                        if(pxWidth<minFlexWidthForCaption){
                            jqThis.addClass("bbg_xiv-flex_no_caption");
                        }else{
                            jqThis.removeClass("bbg_xiv-flex_no_caption");
                        }
                        break;
                    }
                }
            }
        });
        if ( bbg_xiv.guiInterface === 'mouse' && jQuery( window ).width() >= bbg_xiv.bbg_xiv_flex_min_width_for_dense_view ) {
            jQuery(".bbg_xiv-configure_inner .bbg_xiv-mouse_only_option").show();
        }else{
            jQuery(".bbg_xiv-configure_inner .bbg_xiv-mouse_only_option").hide();
        }  
        jQuery("div.bbg_xiv-gallery_envelope").each(function(){
            var menuItems=jQuery(this.parentNode).find("nav.bbg_xiv-gallery_navbar ul.nav ul.bbg_xiv-view_menu li").show();
            if ( bbg_xiv.guiInterface !== 'mouse' || jQuery( window ).width() < bbg_xiv.bbg_xiv_flex_min_width_for_dense_view ) {
                // for touch and small screen devices hide the dense menu item
                menuItems.filter(".bbg_xiv-large_viewport_only").hide();
            }
            // TODO: Gallery of galleries is now broken fix it
/*
            if(typeof bbg_xiv.images[this.id].models[0].attributes.gallery_index!=="undefined"){
                // for a gallery of gallery icons hide the carousel and the dense menu items
                menuItems.filter(".bbg_xiv-hide_for_gallery_icons").hide();
            }
 */
        });
    });

    bbg_xiv.getDefaultView=function(gallery,galleryOfGalleries){
        var defaultView;
        if(galleryOfGalleries||(galleryOfGalleries===null&&gallery.hasClass("bbg_xiv-gallery_icons_mode"))){
            // for gallery of galleries always use the gallery view
            defaultView = 'Gallery';
        }else{
            // use class to set default view if it exists otherwise use the global value
            defaultView = bbg_xiv.bbg_xiv_default_view ? bbg_xiv.bbg_xiv_default_view : 'Gallery';
            if(bbg_xiv.usingServerDefaultView){
                if(gallery.hasClass("bbg_xiv-default_view_gallery")){
                    defaultView="Gallery";
                }else if(gallery.hasClass("bbg_xiv-default_view_justified")){
                    defaultView="Justified";
                }else if(gallery.hasClass("bbg_xiv-default_view_carousel")){
                    defaultView="Carousel";
                }else if(gallery.hasClass("bbg_xiv-default_view_tabs")){
                    defaultView="Tabs";
                // TODO: below for testing only, emove dense case as default view should not be dense
                }else if(gallery.hasClass("bbg_xiv-default_view_Dense")){
                    defaultView="Dense";
                }
            }
            gallery.parents("div.bbg_xiv-bootstrap.bbg_xiv-gallery").find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view ul.bbg_xiv-view_menu li.bbg_xiv-view")
                .removeClass("active").filter(".bbg_xiv-view_"+defaultView.toLowerCase()).addClass("active");
        }
        return defaultView;
    };

    bbg_xiv.handleHelpClick = function(e) {
        var view = jQuery( this ).closest( 'div.navbar-collapse' )
            .find( 'ul.navbar-nav li.bbg_xiv-select_view ul.bbg_xiv-view_menu li.bbg_xiv-view.active a' ).data( 'view' );
        window.open( bbg_xiv.docUrl + '#view-' + view.toLowerCase(), '_blank' );
        this.blur();
        e.preventDefault();
    }

    bbg_xiv.handleSearchClick = function(e) {
        var searchBtn=jQuery(this);
        searchBtn.prop("disabled",true);
        var divGallery=searchBtn.parents("div.bbg_xiv-gallery").find("div.bbg_xiv-gallery_envelope")[0];
        // setup headings
        jQuery("div#"+divGallery.id+"-alt_gallery_heading").hide();
        searchBtn.closest( 'div.bbg_xiv-gallery' ).removeClass( 'bbg_xiv-home_gallery' );
    }

    jQuery(document).ready(function(){
        const configuration = {
            bbg_xiv_carousel_interval:                 bbg_xiv.bbg_xiv_carousel_interval,
            bbg_xiv_flex_min_width:                    bbg_xiv.bbg_xiv_flex_min_width,
            bbg_xiv_miro_row_height:                   bbg_xiv.bbg_xiv_miro_row_height,
            bbg_xiv_max_search_results:                bbg_xiv.bbg_xiv_max_search_results,
            bbg_xiv_flex_number_of_dense_view_columns: bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns,
            bbg_xiv_flex_min_width_for_caption:        bbg_xiv.bbg_xiv_flex_min_width_for_caption,
            bbg_xiv_bandwidth:                         bbg_xiv.bbg_xiv_bandwidth,
            bbg_xiv_interface:                         bbg_xiv.bbg_xiv_interface,
            show:                                      false
        }
        console.log('configuration=', configuration)
        mcRrr.createStore(configuration)
        wp.api.loadPromise.done(() => {
            const id        = '10001'
            const galleryId = "gallery-" + id
            const images    = new wp.api.collections.Media()
            images.reset(JSON.parse(bbg_xiv[galleryId + "-data"]))
            images.view  = "Gallery"
            mcRrr.loadGalleryImages(galleryId, images, true)
            mcRrr.createReactTree(id, document.getElementById('mc-rrr-react-root-gallery-' + id))
        })
/*
        jQuery("div.bbg_xiv-gallery_envelope").each(function(){
            var gallery=this;
            // var defaultView=bbg_xiv.getDefaultView(jQuery(gallery),null);
            // prettify Galleries tabs
            bbg_xiv.prettifyTabs(jQuery(gallery.parentNode).find("div.bbg_xiv-container"),true);
            // If the schema is not in sessionStorage it will be loaded asynchronously so must use wp.api.loadPromise.done()
        });

        // wireup Galleries tabs 
        jQuery("div.bbg_xiv-gallery_tabs_container nav.navbar ul.nav-tabs li a[data-view^='gallery_']").click(function(e){
            jQuery(this).parents("div.bbg_xiv-bootstrap.bbg_xiv-gallery")
                .find("nav.bbg_xiv-gallery_navbar ul.nav li.dropdown ul.bbg_xiv-view_menu li > a[data-view='"+this.dataset.view+"']").click();
            e.preventDefault();
        });
 */
        // make the "Images" brand clickable for mobile devices and send click to the toggle button
        jQuery("a.bbg_xiv-images_brand,a.bbg_xiv-tabs_brand").click(function(e){
            var toggle=jQuery(this).siblings("button.navbar-toggle");
            if(toggle.css("display")!=="none"){
                toggle.click();
            }
            e.preventDefault();
        });
        // wireup mobile only events
        jQuery(window).on("swipe",function(e){
            var carousel=jQuery("div.bbg_xiv-gallery_envelope div.carousel");
            if(carousel.length){
                // ignore swipes near carousel slider
                if(e.pageY>jQuery("div.carousel-indicators").offset().top-50){
                    return;
                }
                if(e.swipestop.coords[0]>e.swipestart.coords[0]){
                    carousel.find("a.left.carousel-control").click();
                }else{
                    carousel.find("a.right.carousel-control").click();
                }
                return;
            }
            // hide/show title and caption of overlay on swipe
            var inner=jQuery("div.bbg_xiv-dense_inner");
            inner.find( '.bbg_xiv-dense_title, .bbg_xiv-dense_caption' ).each(function() {
                var $this = jQuery( this );
                var color = $this.css( 'color' );
                if ( color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)' ) {   // TODO: find safer test for transparent
                    $this.css({ color: 'transparent',      textShadow: 'none'             });
                }else{
                    $this.css({ color: bbg_xiv.titleColor, textShadow: bbg_xiv.titleShadow});
                }
            });
        });
        jQuery( window ).on( 'orientationchange', function() {
            var $body = jQuery( 'body' );
            if ( $body.hasClass( 'admin-bar' ) && jQuery( 'div#wpadminbar' ).css( 'position' ) == 'fixed' ) {
                $body.addClass( 'bbg_xiv-fixed_admin_bar' );
            } else {
                $body.removeClass( 'bbg_xiv-fixed_admin_bar' );
            }
            jQuery("div.bbg_xiv-gallery").each(function(){
                bbg_xiv.resetGallery(jQuery(this));
            });
        });

        // If TwentySixteen theme has border then add class to body element to indicate this.
        var $body            = jQuery( 'body' );
        var bodyBeforeStyle  = window.getComputedStyle( $body[0], ':before' );
        if ( bodyBeforeStyle && bodyBeforeStyle.position === 'fixed' && bodyBeforeStyle.zIndex > 0 ) {
            var height = parseInt( bodyBeforeStyle.height, 10 );
            if ( height > 8 && height < 64 ) {
                $body.addClass( 'bbg_xiv-twentysixteen_with_border' );
            }
        }
        if ( $body.hasClass( 'admin-bar' ) && jQuery( 'div#wpadminbar' ).css( 'position' ) == 'fixed' ) {
            $body.addClass( 'bbg_xiv-fixed_admin_bar' );
        }
    });   // jQuery(document).ready(function(){

    //cookie test code
    //window.alert("bbg_xiv_test="+bbg_xiv.getCookie("bbg_xiv_test"));
    //bbg_xiv.setCookie("bbg_xiv_test",window.prompt("bbg_xiv_test","null"));
}());
console.log('bbg_xiv-gallery.js:loaded.');
