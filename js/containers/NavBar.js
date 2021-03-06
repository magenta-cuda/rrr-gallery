import { connect } from 'react-redux'
import NavBar from '../components/NavBar.js'
import {getImagesByGallerySpecs, getImagesBySearchParms, loadGalleryImages, setView, setGallery, toggleFullScreen,
        toggleCaptions, setQuery, setConfiguration, setShowConfiguration} from '../actions/index.js'

const mapStateToProps = (state, ownProps) => {
    const images        = state.galleries.images && state.galleries.images[`gallery-${ownProps.id}`]
                              ? state.galleries.images[`gallery-${ownProps.id}`] : null
    const configuration = state.configuration
    console.log('(NavBarContainer)mapStateToProps():images=', images)
    return {
        id:               ownProps.id,
        galleries:        ownProps.galleries,
        view:             images && images.view              ? images.view              : "View",   // TODO: may be translated
        gallery:          images && images.gallery           ? images.gallery           : "Home",   // TODO: may be translated
        captions:         images && images.captions          ? images.captions          : false,
        fullScreen:       images && images.fullScreen        ? images.fullScreen        : false,
        status:           images && images.status            ? images.status            : "",
        currentPage:      images && images.state.currentPage ? images.state.currentPage : 0,
        totalPages:       images && images.state.totalPages  ? images.state.totalPages  : 0,
        query:            images && images.query             ? images.query             : "",
        search:           images && images.state.data.search ? images.state.data.search : "",
        maxSearchResults: configuration.bbg_xiv_max_search_results
    }
}
const mapDispatchToProps = dispatch => ({
    setView: (id, view)                   => dispatch(setView(id, view)),
    setGallery: (id, gallery)             => dispatch(setGallery(id, gallery)),
    toggleFullScreen: id                  => dispatch(toggleFullScreen(id)),
    toggleCaptions: id                    => dispatch(toggleCaptions(id)),
    setQuery: (id, query)                 => dispatch(setQuery(id, query)),
    getImagesByGallerySpecs: (id, specs)  => dispatch(getImagesByGallerySpecs(id, specs)),
    getImagesBySearchParms: (id, parms)   => dispatch(getImagesBySearchParms(id, parms)),
    loadGalleryImages: (id, images, home) => dispatch(loadGalleryImages(id, images, home)),
    showConfigure: ()                     => dispatch(setShowConfiguration(true))
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)



