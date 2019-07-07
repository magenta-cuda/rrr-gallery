import {LOAD_GALLERY_IMAGES, LOAD_SEARCH_IMAGES, HANDLE_LOAD_FAILED, SET_VIEW} from '../actions/index.js'

export default (state = {}, action) => {
    switch (action.type) {
    case LOAD_GALLERY_IMAGES:{
        console.log('reducers:LOAD_GALLERY_IMAGES:action=', action)
        action.images.id = action.id
        let images       = state.images
        images           = {...images, [action.id]: action.images}
        return {...state, images: images}
    }
    case LOAD_SEARCH_IMAGES:{
        console.log('reducers:LOAD_SEARCH_IMAGES:action=', action)
        // window.bbg_xiv.images[action.id] = action.images
        action.images.id = action.id
        let images       = state.images
        images           = {...images, [action.id]: action.images}
        // TODO: search also has multi page state
        return {...state, images: images}
    }
    case HANDLE_LOAD_FAILED:
        return state
    case SET_VIEW:
        return {...state, view: action.view}
    default:
        return state
    }
}
