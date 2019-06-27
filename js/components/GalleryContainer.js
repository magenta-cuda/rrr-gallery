// Gallery Container Template

var GalleryContainer = ( collection ) => {
    var jsx = [];
    collection.forEach( function( model, index ) {
        jsx.push( GalleryItem( model.attributes ) );
        if(index%4===3){
            jsx.push( <br className="clearfix visible-lg-block" /> );
        }
        if(index%3===2){
            jsx.push( <br className="clearfix visible-md-block" /> );
        }
        if(index%2===1){
            jsx.push( <br className="clearfix visible-sm-block" /> );
        }
    } );
    console.log( 'GalleryContainer():jsx=', jsx );
    return (
        <div class="container bbg_xiv-container bbg_xiv-gallery_container mc-rrr-jsx-container">
            <div class="row">
                { jsx }
            </div>
        </div>
    )
}
