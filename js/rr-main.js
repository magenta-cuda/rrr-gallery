import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import reducer from './reducers'
import rest from './middleware/rest.js'
import DevTools from './containers/DevTools'

import { getImagesByGallerySpecs, getImagesBySearchParms } from './actions/index.js'

console.log( 'rr-main.js loaded' )

const store = createStore(reducer, {}, compose(applyMiddleware( thunk, rest, createLogger()), DevTools.instrument()))

// TODO: need store in global scope for now to do testing; remove for production.
// TODO: need actions in global scope for now as cannot import yet; remove for production.

window.mcRrr = {
    store:store,
    getImagesByGallerySpecs:getImagesByGallerySpecs,
    getImagesBySearchParms:getImagesBySearchParms
}


