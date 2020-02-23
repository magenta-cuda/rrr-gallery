// Overlay

// N.B. Overlay uses the Backbone.js template 'script#bbg_xiv-template_justified_alt_overlay' from bbg_xiv-gallery_templates_wp_rest.php

// Overlay is not part of main React Redux tree.
// Overlay is independently rendered with its own DOM root.

// TODO: remove React = - don't need this when we use webpack
const React = window.mcRrr.React

class Overlay extends React.Component {
    constructor(props) {
        console.log('Overlay::constructor():props=', props)
        super(props)
        this.state                   = {alt: null, data: null}
        this.$outer                  = null
        this.$inner                  = null
        this.$altInner               = null
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
        this.handleMouseOut          = this.handleMouseOut .bind(this)
        this.handleMouseMove         = this.handleMouseMove.bind(this)
        this.handleClick             = this.handleClick    .bind(this)
        // TODO: below is a just a quick hack to make the new showOverlay accessible from the old showOverlay call - replace this
        window.bbg_xiv.showOverlay   = this.showOverlay.bind(this)
    }
    static getDerivedStateFromError(error) {
        console.log('Overlay:', error)
        return {}
    }
    componentDidMount() {
        if(typeof Overlay.titleColor === 'undefined') {
            // save the initial values of title color and shadow as these will be changed
            Overlay.titleColor  = jQuery(this.title).css('color')
            Overlay.titleShadow = jQuery(this.title).css('text-shadow')
        }
    }
    showOverlay(e, alt = null, img = null, data = null) {
        console.log('Overlay::showOverlay():this.props=', this.props)
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
        if (alt && this.overlayLocked) {
            this.$altInner.addClass('bbg_xiv-locked')
        }
        if ( alt && false ) { // TODO:
            // instantiate the alternate overlay
            $altInner.find( 'span.bbg_xiv-item_value a' ).click( function( e ) {
                // click on a elements should be ignored if the overlay is not locked, propagation will then lock the overlay as expected
                if ( ! jQuery( this ).parents( 'div.bbg_xiv-dense_alt_inner' ).hasClass( 'bbg_xiv-locked' ) ) {
                    e.preventDefault();
                }
            } );
        }
        this.setState({alt: alt, data: data})
        if (bbg_xiv.guiInterface === 'touch') {
            // force hover effects on touchscreen
            fullTitle.css({   color: bbg_xiv.titleColor, textShadow: bbg_xiv.titleShadow});
            fullCaption.css({ color: bbg_xiv.titleColor, textShadow: bbg_xiv.titleShadow});
        }
        window.setTimeout(() => {
            (alt ? this.$altInner : this.$inner).css('opacity', '1.0')
            this.$outer.css('opacity', '0.93')
        }, 100)
        // this.$caption.css( { display: 'block', opacity: '0.7' } );   // $caption is not in the overlay but in the view
        e.preventDefault();
        e.stopPropagation();
    }  // function showOverlay( e ) {
    hideOverlay(e) {
        // TODO: hideOverlay() still needs reactification
        if (!this.overlayShowing) {
            // ignore events when overlay is transitioning to hide
            return
        }
        if (e.type !== 'click' && this.overlayLocked) {
            return
        }
        // This is either a click event on a locked overlay or a large mouse move event on an unlocked alt overlay
        this.overlayShowing = this.overlayLocked = false
        this.mouseX         = this.mouseY        = NaN
        this.$altInner.removeClass('bbg_xiv-locked');   // ; is necessary here otherwise it is f()(e) instead of f();(e)
        // fade out and hide overlay
        (this.alt ? this.$altInner : this.$inner).css('opacity', '0.0')
        this.$outer.css('opacity', '0.0')
        // workaround for a bug? in Chrome where navbar is not visible after an overlay is closed
        var $navbar = jQuery( 'div.bbg_xiv-gallery nav.bbg_xiv-gallery_navbar' ).css( 'opacity', '0.99' )
        window.setTimeout(() => {
            this.setState({alt: null, data: null})
            $navbar.css( 'opacity', '1.0' );
        }, !this.alt ? 2000 : 500 )
        // $caption.css( { display: 'block', opacity: '0.7' } );   // $caption is not in the overlay but in the view
    }   //   function hideOverlay( e ) {
    handleMouseOver() {
        if (bbg_xiv.guiInterface === 'mouse') {
            jQuery(this.title  ).css({color: Overlay.titleColor, textShadow: Overlay.titleShadow})
            jQuery(this.caption).css({color: Overlay.titleColor, textShadow: Overlay.titleShadow})
        }
    }
    handleMouseOut() {
        if (bbg_xiv.guiInterface === 'mouse') {
            jQuery(this.title  ).css({color: 'transparent', textShadow: 'none'})
            jQuery(this.caption).css({color: 'transparent', textShadow: 'none'})
        }
    }
    handleMouseMove(e) {
        if (Math.abs(e.screenX - this.mouseX) < 10 && Math.abs(e.screenY - this.mouseY) < 10) {
            // ignore a small mouse movement
            return;
        }
        this.hideOverlay(e)
    }
    handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        switch (e.currentTarget) {
        case this.$outer.get(0):
        case this.$altInner.get(0):
            if (!this.overlayLocked) {
                // An unlocked overlay must be the alt overlay.
                // When the alt overlay is showing from a hover use the first click in the inner to lock the alt overlay.
                this.overlayLocked = true
                this.$altInner.addClass('bbg_xiv-locked')
            } else {
                this.hideOverlay(e)
            }
            break
        case this.$inner.get(0):
            this.hideOverlay(e)
            break
        }
    }
    render() {
        const alt     = this.state.alt
        const data    = this.state.data
        const srcSet  = !alt && data && data.bbg_srcset ? bbg_xiv.getSrcset(data)                  : ''
        const sizes   = !alt && data && data.bbg_srcset ? bbg_xiv.getSizes(null,'viewport', false) : ''
        console.log('Overlay::render():this.props=', this.props)
        console.log('Overlay::render():alt=', alt, 'data=', data)
        let   altHtml = {__html: ''}
        if (alt) {
            this.altOverlayView.model = {attributes: data}
            altHtml                   = {__html: this.altOverlayView.render(true)}
        }
        return (
            <div style={{display: data === null ? 'none' : 'block'}}>
                {/* Full Browser Viewport View of an Image */}
                <div className="bbg_xiv-dense_outer" style={{display: data ? 'block' : 'none'}}
                        onMouseMove={this.handleMouseMove} onClick={this.handleClick} ref={node => {this.$outer = jQuery(node)}} />
                <div className="bbg_xiv-dense_inner" style={{display: data && !alt ? 'block' : 'none'}}
                        onClick={this.handleClick} ref={node => {this.$inner = jQuery(node)}}>
                    <button className="bbg_xiv-dense_close"><span className="glyphicon glyphicon-remove"></span></button>
                    <h1 className="bbg_xiv-dense_title" ref={node => {this.title = node}}>
                        {!alt && data ? bbg_xiv.getTitle(data) : ''}
                    </h1>
                    <img className="img-rounded bbg_xiv-img_overlay"
                            src={data && !alt ? bbg_xiv.getSrc(data,"viewport", false) : ''} srcSet={srcSet} sizes={sizes}
                            onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} />
                    <h1 className="bbg_xiv-dense_caption" ref={node => {this.caption = node}}>
                        {!alt && data ? bbg_xiv.getCaption(data) : ''}
                    </h1>
                </div>
                <div className="bbg_xiv-dense_alt_inner" style={{display: data && alt ? 'block' : 'none'}}
                        onMouseMove={this.handleMouseMove} onClick={this.handleClick} ref={node => {this.$altInner = jQuery(node)}}>
                    <span className="bbg_xiv-click_to_lock_comment">
                        {bbg_xiv_lang['Click anywhere to lock the display of this popup.']}
                    </span>
                    <span>&nbsp;</span>
                    <button className="bbg_xiv-dense_close"><span className="glyphicon glyphicon-remove"></span></button>
                    <div className="bbg_xiv-dense_alt_items" dangerouslySetInnerHTML={altHtml} />
                </div>
            </div>
        )
    }
    componentDidCatch(error, info) {
        console.log('Overlay:', error, info)
    }
}
