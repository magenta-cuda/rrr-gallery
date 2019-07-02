//Justified Gallery Container Template

const JustifiedGalleryContainer = props => {
    // TODO: remove React = - don't need this when we use webpack
    const React = window.mcRrr.React
    let collection = props.images
    if ( typeof collection === 'string' ) {
        return <h1>{collection}</h1>
    }
    let jsx = [];
    collection.forEach(function(model) {
         jsx.push(<JustifiedGalleryItem data={model.attributes} />);        
    })
    console.log( 'FlexContainer():jsx=', jsx );
    return (
        <div className="bbg_xiv-container bbg_xiv-justified_container" data-bbg_xiv-gallery-id={collection.id}>
            <div className="bbg_xiv-justified_gallery">
                {jsx}
            </div>
            // Full Browser Viewport View of an Image
            <div className="bbg_xiv-dense_outer">
            </div>
            <div className="bbg_xiv-dense_inner">
                <button className="bbg_xiv-dense_close"><span className="glyphicon glyphicon-remove"></span></button>
                <h1 className="bbg_xiv-dense_title"></h1>
                <img className="img-rounded bbg_xiv-img_overlay" sizes={bbg_xiv.getSizes(null,'viewport',false)} />
                <h1 className="bbg_xiv-dense_caption"></h1>
            </div>
            <div className="bbg_xiv-dense_alt_inner">
                <span className="bbg_xiv-click_to_lock_comment">{bbg_xiv_lang['Click anywhere to lock the display of this popup.']}</span>
                <span>&nbsp;</span>
                <button className="bbg_xiv-dense_close"><span className="glyphicon glyphicon-remove"></span></button>
                <div className="bbg_xiv-dense_alt_items"></div>
            </div>
        </div>
    )
}
