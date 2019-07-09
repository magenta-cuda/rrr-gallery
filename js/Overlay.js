// Overlay

// Overlay is not part of main React Redux tree.
// Overlay is independently rendered with its own DOM root.

// TODO: remove React = - don't need this when we use webpack
const React = window.mcRrr.React

class Overlay extends React.Component {
    constructor(props) {
        super(props)
        this.state                   = {alt: null, data: null}
        this.outer                   = null
        this.inner                   = null
        this.altInner                = null
        this.title                   = null
        this.caption                 = null
        this.altOverlayView          = new bbg_xiv.ImageView();
        this.altOverlayView.template = _.template(jQuery( 'script#bbg_xiv-template_justified_alt_overlay' ).html(),
                                                   null, bbg_xiv.templateOptions)
        this.mouseX                  = NaN
        this.mouseY                  = NaN
        this.overlayShowing          = false
        this.overlayLocked           = false
        this.handleMouseOver         = this.handleMouseOver.bind(this)
        this.handleMouseOut          = this.handleMouseOut.bind(this)
        // TODO: below is a just a quick hack to make the new showOverlay accessible from the old showOverlay call - replace this
        window.bbg_xiv.showOverlay   = this.showOverlay.bind(this)
    }
    static getDerivedStateFromError(error) {
        console.log('JustifiedGalleryItem:', error)
        return {}
    }
    connect(container) {
        // TODO: connect() still needs reactification
        const $container = jQuery(container)
        // gallery or dense view shows a full browser viewport view of an image when its fullscreen glyph is clicked
        this.$fullImg        = $inner.find('img')
        // this.$caption        = null;   // $caption is not in the overlay but in the view
        $inner.add($altInner).click(this.hideOverlay)
        $outer.add($altInner).mousemove(this.hideOverlay)
        // when overlay is showing from hover use a click in the outer to lock the overlay
        outer.click( function( e ) {
            if ( !overlayLocked ) {
                // The overlay must be the alt overlay.
                overlayLocked = true;
                $altInner.addClass( 'bbg_xiv-locked' );
            } else {
                hideOverlay.call( this, e );
            }
        } );
        if( typeof bbg_xiv.titleColor === 'undefined' ) {
            // save the initial values of title color and shadow as these will be changed
            bbg_xiv.titleColor  = fullTitle.css( 'color' );
            bbg_xiv.titleShadow = fullTitle.css( 'text-shadow' );
        }
    }   // connect(container) {
    showOverlay(e, alt = null, img = null, data = null) {
        console.log('Overlay::showOverlay():alt=', alt, 'img=', img, 'data=', data)
        if ( parseFloat( jQuery(e.target).closest( 'div.caption' ).css( 'opacity' ) ) < 0.1 ) {
            // click was on an invisible button so ignore it
            return;
        }
        this.overlayShowing = true;
        this.overlayLocked  = e.type === 'click';
        this.mouseX         = e.screenX;
        this.mouseY         = e.screenY;
        // this.$caption       = $button.parent( 'div.caption' );   // $caption is not in the overlay but in the view
        if ( alt && overlayLocked ) {
            jQuery(this.altInner).addClass( 'bbg_xiv-locked' );
        }
        if ( alt ) {
            // instantiate the alternate overlay
            altOverlayView.model = { attributes: data };
            $altInner.find( 'div.bbg_xiv-dense_alt_items' ).html( altOverlayView.render( true ) );
            $altInner.find( 'span.bbg_xiv-item_value a' ).click( function( e ) {
                // click on a elements should be ignored if the overlay is not locked, propagation will then lock the overlay as expected
                if ( ! jQuery( this ).parents( 'div.bbg_xiv-dense_alt_inner' ).hasClass( 'bbg_xiv-locked' ) ) {
                    e.preventDefault();
                }
            } );
        }
        this.setState({alt: alt, data: data})
        if ( bbg_xiv.guiInterface === 'touch' ) {
            // force hover effects on touchscreen
            fullTitle.css({   color: bbg_xiv.titleColor, textShadow: bbg_xiv.titleShadow});
            fullCaption.css({ color: bbg_xiv.titleColor, textShadow: bbg_xiv.titleShadow});
        }
        window.setTimeout(() => {
            (!alt ? jQuery(this.inner) : jQuery(this.altInner )).css( 'opacity', '1.0' )
            jQuery(this.outer).css("opacity","0.93");
        }, 100)
        // this.$caption.css( { display: 'block', opacity: '0.7' } );   // $caption is not in the overlay but in the view
        e.preventDefault();
        e.stopPropagation();
    }  // function showOverlay( e ) {
    hideOverlay( e ) {
        // TODO: hideOverlay() still needs reactification
        if ( ! overlayShowing ) {
            // ignore events when overlay is transitioning to hide
            return;
        }
        if ( e.type !== 'click' ) {
            if ( overlayLocked ) {
                return;
            }
            if ( Math.abs( e.screenX - mouseX ) < 10 && Math.abs( e.screenY - mouseY ) < 10 ) {
                // ignore a small mouse movement
                return;
            }
        } else {
            if ( ! overlayLocked ) {
                // An unlocked overlay must be the alt overlay.
                // When the alt overlay is showing from a hover use the first click in the inner to lock the alt overlay.
                overlayLocked = true;
                $altInner.addClass( 'bbg_xiv-locked' );
                return;
            }
        }
        // This is either a click event on a locked overlay or a large mouse move event on an unlocked alt overlay
        var $inner = jQuery( this );
        if ( $inner.hasClass( 'bbg_xiv-dense_outer' ) ) {
            // $inner really is outer so ...
            $inner = $altInner;
        }   
        overlayShowing = overlayLocked = false;
        $altInner.removeClass( 'bbg_xiv-locked' );
        mouseX = mouseY = NaN;
        // fade out and hide overlay
        $inner.css("opacity","0.0");
        outer.css("opacity","0.0");
        // workaround for a bug? in Chrome where navbar is not visible after an overlay is closed
        var $navbar = jQuery( 'div.bbg_xiv-gallery nav.bbg_xiv-gallery_navbar' ).css( 'opacity', '0.99' );
        window.setTimeout(function(){
            $inner.hide();
            outer.hide();
            $navbar.css( 'opacity', '1.0' );
        }, $inner !== $altInner ? 2000 : 500 );
        // $caption.css( { display: 'block', opacity: '0.7' } );   // $caption is not in the overlay but in the view
    }   //   function hideOverlay( e ) {
    handleMouseOver() {
        if (bbg_xiv.guiInterface === 'mouse') {
            jQuery(this.title)  .css({color: bbg_xiv.titleColor, textShadow: bbg_xiv.titleShadow})
            jQuery(this.caption).css({color: bbg_xiv.titleColor, textShadow: bbg_xiv.titleShadow})
        }
    }
    handleMouseOut() {
        if (bbg_xiv.guiInterface === 'mouse') {
            jQuery(this.title)  .css({color: 'transparent', textShadow: 'none'})
            jQuery(this.caption).css({color: 'transparent', textShadow: 'none'})
        }
    }
    render() {
        const alt    = this.state.alt
        const data   = this.state.data
        const srcSet = !alt && data && data.bbg_srcset ? bbg_xiv.getSrcset(data)                  : ''
        const sizes  = !alt && data && data.bbg_srcset ? bbg_xiv.getSizes(null,'viewport', false) : ''
        return (
            <div style={{display: data === null ? 'none' : 'block'}}>
                {/* Full Browser Viewport View of an Image */}
                <div className="bbg_xiv-dense_outer">
                </div>
                <div className="bbg_xiv-dense_inner" style={{display: alt ? 'none' : 'block'}} ref={node => {this.inner = node}}>
                    <button className="bbg_xiv-dense_close"><span className="glyphicon glyphicon-remove"></span></button>
                    <h1 className="bbg_xiv-dense_title" ref={node => {this.title = node}}>
                        {!alt && data ? bbg_xiv.getTitle(data) : ''}
                    </h1>
                    <img className="img-rounded bbg_xiv-img_overlay" src={!alt && data ? bbg_xiv.getSrc(data,"viewport", false) : ''}
                            srcSet={srcSet} sizes={sizes} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} />
                    <h1 className="bbg_xiv-dense_caption" ref={node => {this.caption = node}}>
                        {!alt && data ? bbg_xiv.getCaption(data) : ''}
                    </h1>
                </div>
                <div className="bbg_xiv-dense_alt_inner"  style={{display: alt ? 'block' : 'none'}} ref={node => {this.altInner = node}}>
                    <span className="bbg_xiv-click_to_lock_comment">{bbg_xiv_lang['Click anywhere to lock the display of this popup.']}</span>
                    <span>&nbsp;</span>
                    <button className="bbg_xiv-dense_close"><span className="glyphicon glyphicon-remove"></span></button>
                    <div className="bbg_xiv-dense_alt_items"></div>
                </div>
            </div>
        )
    }
    componentDidCatch(error, info) {
        console.log('Overlay:', error, info)
    }
}
