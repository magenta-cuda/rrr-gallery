import {LOAD_GALLERY_IMAGES, LOAD_SEARCH_IMAGES, HANDLE_LOAD_FAILED, SET_VIEW, SET_STATUS, SET_CONFIGURATION} from '../actions/index.js'
import { combineReducers } from 'redux'

const galleries = (state = {}, action) => {
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
    case SET_VIEW: {
        const images           = {...state.images}
        // Cannot clone images using the spread operator since it is also necessary to preserve the prototype chain.
        images[action.id]      = Object.assign(new wp.api.collections.Media(), images[action.id])
        images[action.id].view = action.view
        return {...state, images: images}
    }
    case SET_STATUS: {
        const images             = {...state.images}
        // Cannot clone images using the spread operator since it is also necessary to preserve the prototype chain.
        images[action.id]        = Object.assign(new wp.api.collections.Media(), images[action.id])
        images[action.id].status = action.status
        return {...state, images: images}
    }
    default:
        return state
    }
}

const configuration = (state = {}, action) => {
    switch (action.type) {
    case SET_CONFIGURATION: {
        return action.configuration
    }
    default:
        return state
    }
}

const rootReducer = combineReducers({
    galleries,
    configuration
})

export default rootReducer
