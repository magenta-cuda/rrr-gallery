import {LOAD_GALLERY_IMAGES, LOAD_SEARCH_IMAGES, HANDLE_LOAD_FAILED, SET_VIEW, SET_GALLERY, SET_STATUS, STATUS_LOADING,
        STATUS_LOADED, SET_CONTAINER_WIDTH, SET_CONFIGURATION, TOGGLE_FULL_SCREEN, TOGGLE_CAPTIONS, SET_QUERY}
        from '../actions/index.js'
import { combineReducers } from 'redux'

const galleries = (state = {}, action) => {
    switch (action.type) {
    case LOAD_GALLERY_IMAGES:
    case LOAD_SEARCH_IMAGES:{
        action.images.id             = action.id
        // action.images.view           = state.images[action.id] ? state.images[action.id].view           : "Gallery"
        // TODO: The above doesn't work for Justified - doesn't initialize correctly, why?
        action.images.view           = "Gallery"
        action.images.gallery        = state.images[action.id] ? state.images[action.id].gallery        : undefined
        action.images.containerWidth = state.images[action.id] ? state.images[action.id].containerWidth : undefined
        action.images.fullScreen     = false
        action.images.captions       = true
        action.images.status         = STATUS_LOADED
        const images                 = {...state.images, [action.id]: action.images}
        if (action.type === LOAD_GALLERY_IMAGES) {
            images[action.id].home = action.home
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
    case SET_GALLERY: {
        const images              = {...state.images}
        // Cannot clone images using the spread operator since it is also necessary to preserve the prototype chain.
        images[action.id]         = Object.assign(new wp.api.collections.Media(), images[action.id])
        images[action.id].gallery = action.gallery
        return {...state, images: images}
    }
    case SET_STATUS: {
        const images             = {...state.images}
        // Cannot clone images using the spread operator since it is also necessary to preserve the prototype chain.
        images[action.id]        = Object.assign(new wp.api.collections.Media(), images[action.id])
        images[action.id].status = action.status
        return {...state, images: images}
    }
    case SET_CONTAINER_WIDTH: {
        const images                     = {...state.images}
        // Cannot clone images using the spread operator since it is also necessary to preserve the prototype chain.
        images[action.id]                = Object.assign(new wp.api.collections.Media(), images[action.id])
        images[action.id].containerWidth = action.width
        return {...state, images: images}
    }
    case TOGGLE_FULL_SCREEN: {
        const images                     = {...state.images}
        // Cannot clone images using the spread operator since it is also necessary to preserve the prototype chain.
        images[action.id]                = Object.assign(new wp.api.collections.Media(), images[action.id])
        images[action.id].fullScreen     = images[action.id].fullScreen ? false : true
        images[action.id].containerWidth = undefined
        return {...state, images: images}
    }
    case TOGGLE_CAPTIONS: {
        const images                     = {...state.images}
        // Cannot clone images using the spread operator since it is also necessary to preserve the prototype chain.
        images[action.id]                = Object.assign(new wp.api.collections.Media(), images[action.id])
        images[action.id].captions       = images[action.id].captions ? false : true
        return {...state, images: images}
    }
    case SET_QUERY: {
        const images            = {...state.images}
        // Cannot clone images using the spread operator since it is also necessary to preserve the prototype chain.
        images[action.id]       = Object.assign(new wp.api.collections.Media(), images[action.id])
        images[action.id].query = action.query
        return {...state, images: images}
    }
    default:
        return state
    }
}

const configuration = (state = {}, action) => {
    switch (action.type) {
    case SET_CONFIGURATION: {
        return {...state, ...action.configuration}
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
