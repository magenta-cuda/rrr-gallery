// This module monkey patches the Redux store object methods for debugging.

import {LOAD_GALLERY_IMAGES, LOAD_SEARCH_IMAGES, HANDLE_LOAD_FAILED, SET_VIEW, SET_GALLERY, SET_STATUS, STATUS_LOADING,
        STATUS_LOADED, SET_CONTAINER_WIDTH, SET_CONFIGURATION, TOGGLE_FULL_SCREEN, TOGGLE_CAPTIONS, SET_QUERY}
        from './actions/index.js'
import {REST} from './middleware/rest.js'

const proxy = {
    dispatch: (...args) => {
        // Filter on Redux action type
        if (true || [REST, LOAD_GALLERY_IMAGES, LOAD_SEARCH_IMAGES].includes(args[0].type)) {
            console.log("proxy.dispatch():args=", args)
            console.trace()
        }
        return proxy.reduxDispatch.apply(null, args)
    }
}

export default store => {
    proxy.reduxDispatch = store.dispatch
    store.dispatch      = proxy.dispatch
    console.log("reduxStoreProxy.js:store=", store)
    return proxy
}
