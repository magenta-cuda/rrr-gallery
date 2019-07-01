import {LOAD_GALLERY_IMAGES, LOAD_SEARCH_IMAGES, HANDLE_LOAD_FAILED} from '../actions/index.js'

export default (state = {}, action) => {
    switch (action.type) {
    case LOAD_GALLERY_IMAGES:
        console.log('reducers:LOAD_GALLERY_IMAGES:action=', action)
        // debugger
        let images = state.images
        images = {...images, [action.id]: action.images}
        return {...state, images: images}
    case LOAD_SEARCH_IMAGES:
        console.log('reducers:LOAD_SEARCH_IMAGES:action=', action)
        debugger
        window.bbg_xiv.images[action.id] = action.images
        // TODO:  For now directly call the renderer - it should be indirectly called from a Redux container after its props changes.
        window.bbg_xiv.handleSearchResponse(!!action.images.length, action.parms)
        // TODO: state should contain window.bbg_xiv.images[] and handleSearchResponse() should be called from a render() function
        //       for a Redux container of the gallery.
        return state
    case HANDLE_LOAD_FAILED:
    default:
        return state
    }
}
