import {LOAD_GALLERY_IMAGES, LOAD_SEARCH_IMAGES, HANDLE_LOAD_FAILED} from '../actions/index.js'

export default (state = {}, action) => {
    switch (action.type) {
    case LOAD_GALLERY_IMAGES:{
        console.log('reducers:LOAD_GALLERY_IMAGES:action=', action)
        // debugger
        let images = state.images
        images = {...images, [action.id]: action.images}
        return {...state, images: images}
    }
    case LOAD_SEARCH_IMAGES:{
        console.log('reducers:LOAD_SEARCH_IMAGES:action=', action)
        // debugger
        window.bbg_xiv.images[action.id] = action.images
        // TODO:  For now also directly call the modified original renderer on a different root,
        //        so we can compare against the rendition of React Redux.
        window.bbg_xiv.handleSearchResponse(!!action.images.length, action.parms)
        let images = state.images
        images = {...images, [action.id]: action.images}
        return {...state, images: images}
    }
    case HANDLE_LOAD_FAILED:
    default:
        return state
    }
}
