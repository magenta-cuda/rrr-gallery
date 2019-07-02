//Justified Gallery Container Template
// TODO: remove React = - don't need this when we use webpack
const React = window.mcRrr.React

class JustifiedGalleryContainer extends React.Component {
    constructor(props) {
        super(props);
        this.container = null;
    }
    render() {
        // TODO: remove React = - don't need this when we use webpack
        const React = window.mcRrr.React
        let collection = this.props.images
        if ( typeof collection === 'string' ) {
            return <h1>{collection}</h1>
        }
        let jsx = [];
        collection.forEach(function(model) {
             jsx.push(<JustifiedGalleryItem data={model.attributes} />);        
        })
        console.log( 'JustifiedGalleryContainer():jsx=', jsx );
        return (
            <div className="bbg_xiv-container bbg_xiv-justified_container" data-bbg_xiv-gallery-id={collection.id} ref={node => this.container = node}>
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
    componentDidMount() {
        console.log('componentDidMount():this.container=', this.container)
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        console.log('componentDidUpdate():this.container=', this.container)
    }
}
