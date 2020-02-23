// window.mcRrr is needed for now because we cannot import in the inline scripts of bbg_xiv-gallery.php
// window.mcRrr has references to the things that the inline scripts cannot import

import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import {connect} from 'react-redux'
import thunk from 'redux-thunk'
// TODO: BELOW FOR DEBUGGING ONLY
// import { createLogger } from 'redux-logger'
// TODO: ABOVE FOR DEBUGGING ONLY
import { Provider } from 'react-redux'
import reducer from './reducers/index.js'
import rest from './middleware/rest.js'
import Frame from './containers/Frame.js'
import Configure from './Configure.js'
import Overlay from './Overlay.js'
// TODO: BELOW FOR DEBUGGING ONLY
// import DevTools from './containers/DevTools.js'
// TODO: ABOVE FOR DEBUGGING ONLY
import {setConfiguration} from './actions/index.js'

var searchParams = new URLSearchParams(window.location.search)
var debug        = searchParams.has("mc_debug")

const store = createStore(reducer, {galleries: {images: {}}, configuration: {}},
// TODO: BELOW FOR DEBUGGING ONLY
                          // compose(applyMiddleware(thunk, start, rest, postRest, end, createLogger()), DevTools.instrument()))
// TODO: ABOVE FOR DEBUGGING ONLY
                          applyMiddleware(thunk, rest))

// TODO: need store in global scope for now to do testing; remove for production.

window.mcRrr = {
    debug:                    debug,
    store:                    store,
    React:                    React,
    ReactDOM:                 ReactDOM,
    connect:                  connect,
    Provider:                 Provider,
    Frame:                    Frame,
    Configure:                Configure,
    Overlay:                  Overlay,
    setConfiguration:         setConfiguration
}
