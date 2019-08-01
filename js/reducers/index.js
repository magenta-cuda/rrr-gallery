import {LOAD_GALLERY_IMAGES, LOAD_SEARCH_IMAGES, HANDLE_LOAD_FAILED, SET_VIEW} from '../actions/index.js'

export default (state = {}, action) => {
    switch (action.type) {
    case LOAD_GALLERY_IMAGES:
    case LOAD_SEARCH_IMAGES:{
        action.images.id = action.id
        const images     = {...state.images, [action.id]: action.images}
        if ( action.type === LOAD_GALLERY_IMAGES ) {
            console.log('reducers:LOAD_GALLERY_IMAGES:action=', action)
            return {...state, images: images}
        }
        console.log('reducers:LOAD_SEARCH_IMAGES:action=', action)
        // TODO: search also has multi page state
        images[action.id].query = action.parms.query
        console.log('reducers:LOAD_SEARCH_IMAGES:images=', images)
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
