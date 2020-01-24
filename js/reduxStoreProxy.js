// This module monkey patches the Redux store object methods for debugging.

import {LOAD_GALLERY_IMAGES, LOAD_SEARCH_IMAGES, HANDLE_LOAD_FAILED, SET_VIEW, SET_GALLERY, SET_STATUS, STATUS_LOADING,
        STATUS_LOADED, SET_CONTAINER_WIDTH, SET_CONFIGURATION, TOGGLE_FULL_SCREEN, TOGGLE_CAPTIONS, SET_QUERY}
        from './actions/index.js'
import {REST} from './middleware/rest.js'

const proxy = {
    dispatch: (...args) => {
        // Filter on Redux action type. N.B. REST is not an action type.
        const filter = mcRrr.debugDispatchFilter
        const debug  = typeof filter === "boolean" ? filter : (filter.includes(args[0].type) || filter.includes(REST) && args[REST])
        if (debug) {
            console.trace("proxy.dispatch():args=", args)
        }
        return proxy.reduxDispatch.apply(null, args)
    },
    // Find out what is listening to Redux state tree changes.
    subscribe: (...args) => {
        console.trace("proxy.subscribe():args=", args)
        const newArgs = [...args]
        // Bind the proxy listener to the real listener.
        newArgs[0] = proxy.proxyListener.bind(null, args[0])
        console.trace("proxy.subscribe():newArgs=", newArgs)
        return proxy.reduxSubscribe.apply(null, newArgs)
    },
    // A wrapper for the Redux state tree change listener - must be bound to the real listener.
    proxyListener(listener, ...args) {
        console.trace("proxy.proxyListener:listener=", listener, "args=", args)
        return listener.apply(args)
    }
}

export default store => {
    proxy.reduxDispatch  = store.dispatch
    store.dispatch       = proxy.dispatch
    proxy.reduxSubscribe = store.subscribe
    store.subscribe      = proxy.subscribe
    console.log("reduxStoreProxy.js:store=", store)
    return proxy
}
